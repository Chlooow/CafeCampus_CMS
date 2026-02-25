// src/hooks/useMachines.js
//
// Hook principal : écoute Firestore en temps réel et gère les verrous d'édition.
// Gestion des conflits : un seul appareil peut modifier une machine à la fois.
// Si le verrou dépasse LOCK_TIMEOUT_MS, il est considéré comme expiré et libéré.

import { useState, useEffect, useCallback } from 'react';
import {
  collection,
  onSnapshot,
  doc,
  runTransaction,
  serverTimestamp,
  Timestamp,
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { LOCK_TIMEOUT_MS, DEVICE_ID } from '../config/theme';

export function useMachines() {
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Écoute temps réel
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'machines'),
      (snapshot) => {
        const data = snapshot.docs
          .map((d) => ({ id: d.id, ...d.data() }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setMachines(data);
        setLoading(false);
      },
      (err) => {
        console.error('Firestore error:', err);
        setError('Impossible de charger les données. Vérifiez votre connexion.');
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Tenter d'acquérir le verrou sur une machine
  const acquireLock = useCallback(async (machineId) => {
    const ref = doc(db, 'machines', machineId);
    try {
      let success = false;
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) throw new Error('Machine introuvable');

        const data = snap.data();
        const now = Date.now();

        // Vérifier si un verrou actif existe (par un autre appareil)
        if (data.lockedBy && data.lockedBy !== DEVICE_ID) {
          const lockedAt = data.lockedAt?.toMillis?.() ?? 0;
          if (now - lockedAt < LOCK_TIMEOUT_MS) {
            // Verrou actif par quelqu'un d'autre
            throw new Error('LOCKED');
          }
        }

        // Acquérir le verrou
        transaction.update(ref, {
          lockedBy: DEVICE_ID,
          lockedAt: serverTimestamp(),
        });
        success = true;
      });
      return success;
    } catch (e) {
      if (e.message === 'LOCKED') return false;
      throw e;
    }
  }, []);

  // Sauvegarder les modifications et libérer le verrou
  const saveChanges = useCallback(async (machineId, { status, notes }) => {
    const ref = doc(db, 'machines', machineId);
    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) throw new Error('Machine introuvable');

        const data = snap.data();

        // Vérifier que c'est bien nous qui avons le verrou
        if (data.lockedBy && data.lockedBy !== DEVICE_ID) {
          const lockedAt = data.lockedAt?.toMillis?.() ?? 0;
          if (Date.now() - lockedAt < LOCK_TIMEOUT_MS) {
            throw new Error('LOCK_STOLEN');
          }
        }

        transaction.update(ref, {
          status,
          notes,
          lastUpdated: serverTimestamp(),
          lockedBy: null,
          lockedAt: null,
        });
      });
      return { success: true };
    } catch (e) {
      if (e.message === 'LOCK_STOLEN') {
        return { success: false, reason: 'LOCK_STOLEN' };
      }
      throw e;
    }
  }, []);

  // Libérer le verrou sans sauvegarder (annulation)
  const releaseLock = useCallback(async (machineId) => {
    const ref = doc(db, 'machines', machineId);
    try {
      await runTransaction(db, async (transaction) => {
        const snap = await transaction.get(ref);
        if (!snap.exists()) return;
        const data = snap.data();
        if (data.lockedBy === DEVICE_ID) {
          transaction.update(ref, { lockedBy: null, lockedAt: null });
        }
      });
    } catch (e) {
      console.warn('releaseLock error:', e);
    }
  }, []);

  return { machines, loading, error, acquireLock, saveChanges, releaseLock };
}