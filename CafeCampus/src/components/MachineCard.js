// src/components/MachineCard.js
//
// Carte affichant une machine à café avec son statut, ses notes et le timestamp.
// En mode édition, affiche les boutons de statut + champ texte + Valider/Annuler.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { COLORS, STATUS, STATUS_LABELS, STATUS_COLORS, MAX_NOTES_LENGTH } from '../config/theme';

// Formate un Firestore Timestamp ou Date en string lisible
function formatDate(ts) {
  if (!ts) return '—';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    timeZone: 'Europe/Paris',
  }) + ' CET';
}

// Indicateur coloré de statut
function StatusDot({ statusKey, active, onPress }) {
  const color = STATUS_COLORS[statusKey];
  const label = STATUS_LABELS[statusKey];
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.statusOption}
      accessibilityLabel={`Statut : ${label}`}
    >
      <View
        style={[
          styles.dot,
          { backgroundColor: color },
          !active && styles.dotInactive,
        ]}
      />
      <Text style={[styles.statusLabel, !active && styles.statusLabelInactive]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
}

export default function MachineCard({ machine, onEdit, onSave, onCancel, isEditing, isSaving }) {
  const [editStatus, setEditStatus] = useState(machine.status);
  const [editNotes, setEditNotes] = useState(machine.notes ?? '');

  // Sync si la machine change en cours d'édition (edge case)
  useEffect(() => {
    if (!isEditing) {
      setEditStatus(machine.status);
      setEditNotes(machine.notes ?? '');
    }
  }, [machine.status, machine.notes, isEditing]);

  const handleSave = () => {
    onSave({ status: editStatus, notes: editNotes.trim() });
  };

  const handleCancel = () => {
    setEditStatus(machine.status);
    setEditNotes(machine.notes ?? '');
    onCancel();
  };

  const currentColor = STATUS_COLORS[machine.status];

  return (
    <View style={styles.card}>
      {/* En-tête */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusIndicator, { backgroundColor: currentColor }]} />
          <View>
            <Text style={styles.machineName}>{machine.name}</Text>
            <Text style={styles.machineLocation}>{machine.location}</Text>
          </View>
        </View>
        {!isEditing && (
          <TouchableOpacity
            onPress={onEdit}
            style={styles.editButton}
            accessibilityLabel="Modifier le statut"
          >
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Séparateur */}
      <View style={styles.divider} />

      {/* Timestamp */}
      <Text style={styles.timestamp}>Mis à jour : {formatDate(machine.lastUpdated)}</Text>

      {/* Statuts */}
      <View style={styles.statusRow}>
        {Object.values(STATUS).map((s) => (
          <StatusDot
            key={s}
            statusKey={s}
            active={isEditing ? editStatus === s : machine.status === s}
            onPress={isEditing ? () => setEditStatus(s) : undefined}
          />
        ))}
      </View>

      {/* Notes */}
      {isEditing ? (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes :</Text>
          <TextInput
            style={styles.notesInput}
            value={editNotes}
            onChangeText={(t) => {
              if (t.length <= MAX_NOTES_LENGTH) setEditNotes(t);
            }}
            placeholder="Ex : machine réparée dans 30 min..."
            placeholderTextColor={COLORS.greyMid}
            multiline
            maxLength={MAX_NOTES_LENGTH}
            autoFocus
          />
          <Text style={styles.charCount}>
            {editNotes.length}/{MAX_NOTES_LENGTH}
          </Text>
        </View>
      ) : (
        <View style={styles.notesContainer}>
          <Text style={styles.notesLabel}>Notes :</Text>
          <Text style={styles.notesText}>
            {machine.notes ? machine.notes : <Text style={styles.notesEmpty}>Aucune note</Text>}
          </Text>
        </View>
      )}

      {/* Boutons édition */}
      {isEditing && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={isSaving}>
            <Text style={styles.cancelButtonText}>ANNULER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            {isSaving ? (
              <ActivityIndicator color={COLORS.primary} size="small" />
            ) : (
              <Text style={styles.saveButtonText}>VALIDER</Text>
            )}
          </TouchableOpacity>
        </View>
      )}

      {/* Verrou actif par quelqu'un d'autre */}
      {!isEditing && machine.lockedBy && (
        <View style={styles.lockBanner}>
          <Text style={styles.lockText}>🔒 Modification en cours par un autre utilisateur…</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.12,
        shadowRadius: 8,
      },
      android: { elevation: 4 },
    }),
  },
  header: {
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  statusIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  machineName: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 15,
    fontStyle: 'italic',
  },
  machineLocation: {
    color: COLORS.accentDark,
    fontSize: 12,
    marginTop: 1,
  },
  editButton: {
    padding: 4,
  },
  editIcon: {
    fontSize: 18,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.accentDark,
    marginHorizontal: 16,
    marginTop: 12,
  },
  timestamp: {
    fontSize: 11,
    color: COLORS.grey,
    marginHorizontal: 16,
    marginTop: 6,
    marginBottom: 10,
  },
  statusRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 12,
    paddingBottom: 10,
  },
  statusOption: {
    alignItems: 'center',
    gap: 4,
  },
  dot: {
    width: 22,
    height: 22,
    borderRadius: 11,
  },
  dotInactive: {
    opacity: 0.3,
  },
  statusLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: COLORS.black,
  },
  statusLabelInactive: {
    color: COLORS.greyMid,
  },
  notesContainer: {
    marginHorizontal: 16,
    marginBottom: 12,
  },
  notesLabel: {
    fontWeight: '700',
    fontSize: 13,
    color: COLORS.black,
    marginBottom: 4,
  },
  notesText: {
    fontSize: 13,
    color: COLORS.black,
    lineHeight: 18,
  },
  notesEmpty: {
    color: COLORS.grey,
    fontStyle: 'italic',
  },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    padding: 10,
    fontSize: 13,
    color: COLORS.black,
    minHeight: 60,
    textAlignVertical: 'top',
  },
  charCount: {
    textAlign: 'right',
    fontSize: 11,
    color: COLORS.grey,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 14,
    gap: 10,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    borderWidth: 1.5,
    borderColor: COLORS.primary,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: COLORS.primary,
    fontWeight: '700',
    fontSize: 13,
  },
  saveButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 30,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
  },
  saveButtonText: {
    color: COLORS.white,
    fontWeight: '700',
    fontSize: 13,
  },
  lockBanner: {
    backgroundColor: '#fff3cd',
    marginHorizontal: 16,
    marginBottom: 10,
    borderRadius: 8,
    padding: 8,
  },
  lockText: {
    fontSize: 11,
    color: '#856404',
    textAlign: 'center',
  },
});