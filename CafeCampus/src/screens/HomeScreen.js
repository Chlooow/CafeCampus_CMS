// src/screens/HomeScreen.js
//
// Page principale : liste des machines avec statut en temps réel.
// Gestion des conflits d'édition via verrous Firestore.

import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../config/theme';
import MachineCard from '../components/MachineCard';
import { useMachines } from '../hooks/useMachines';

export default function HomeScreen() {
  const { machines, loading, error, acquireLock, saveChanges, releaseLock } = useMachines();

  // ID de la machine en cours d'édition sur CET appareil
  const [editingId, setEditingId] = useState(null);
  const [savingId, setSavingId] = useState(null);

  // Appuyer sur le crayon
  const handleEdit = useCallback(async (machineId) => {
    if (editingId !== null) {
      Alert.alert(
        'Déjà en modification',
        'Veuillez valider ou annuler la modification en cours avant d\'en commencer une autre.'
      );
      return;
    }

    const locked = await acquireLock(machineId).catch((e) => {
      Alert.alert('Erreur', 'Impossible de contacter le serveur. Vérifiez votre connexion.');
      return false;
    });

    if (!locked) {
      Alert.alert(
        '🔒 Modification en cours',
        'Quelqu\'un d\'autre est en train de modifier cette machine. Réessayez dans un instant.'
      );
      return;
    }

    setEditingId(machineId);
  }, [editingId, acquireLock]);

  // Annuler l'édition
  const handleCancel = useCallback(async (machineId) => {
    await releaseLock(machineId);
    setEditingId(null);
  }, [releaseLock]);

  // Valider les modifications
  const handleSave = useCallback(async (machineId, { status, notes }) => {
    setSavingId(machineId);
    try {
      const result = await saveChanges(machineId, { status, notes });
      if (!result.success) {
        Alert.alert(
          '⚠️ Conflit détecté',
          'Le verrou a été repris par un autre appareil. Vos modifications n\'ont pas été enregistrées.'
        );
      }
    } catch (e) {
      Alert.alert('Erreur', 'La sauvegarde a échoué. Vérifiez votre connexion.');
    } finally {
      setSavingId(null);
      setEditingId(null);
    }
  }, [saveChanges]);

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={styles.loadingText}>Chargement des machines…</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.centered}>
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>{error}</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>PUIO — BAT 640</Text>
          <Text style={styles.headerSub}>{machines.length} machine{machines.length > 1 ? 's' : ''} • Temps réel</Text>
        </View>
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>
      </View>

      {/* Liste */}
      <ScrollView
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      >
        {machines.length === 0 && (
          <Text style={styles.emptyText}>Aucune machine configurée.</Text>
        )}
        {machines.map((machine) => (
          <MachineCard
            key={machine.id}
            machine={machine}
            isEditing={editingId === machine.id}
            isSaving={savingId === machine.id}
            onEdit={() => handleEdit(machine.id)}
            onSave={(data) => handleSave(machine.id, data)}
            onCancel={() => handleCancel(machine.id)}
          />
        ))}

        <Text style={styles.hint}>
          Appuyez sur ✏️ pour mettre à jour le statut d'une machine
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.greyLight,
  },
  centered: {
    flex: 1,
    backgroundColor: COLORS.greyLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: {
    marginTop: 12,
    color: COLORS.grey,
    fontSize: 14,
  },
  errorEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  errorText: {
    color: '#c0004e',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  header: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.15,
        shadowRadius: 6,
      },
      android: { elevation: 5 },
    }),
  },
  headerTitle: {
    color: COLORS.white,
    fontSize: 22,
    fontWeight: '800',
    letterSpacing: 1,
  },
  headerSub: {
    color: COLORS.accentDark,
    fontSize: 12,
    marginTop: 2,
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    gap: 5,
  },
  liveDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: '#4CAF50',
  },
  liveText: {
    color: COLORS.white,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1,
  },
  list: {
    paddingTop: 20,
    paddingBottom: 30,
  },
  emptyText: {
    textAlign: 'center',
    color: COLORS.grey,
    marginTop: 40,
    fontSize: 14,
  },
  hint: {
    textAlign: 'center',
    color: COLORS.grey,
    fontSize: 12,
    marginTop: 8,
    paddingHorizontal: 30,
    lineHeight: 18,
  },
});