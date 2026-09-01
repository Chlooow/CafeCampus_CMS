// src/components/MachineCard.js

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Platform,
  Image,
} from 'react-native';
import { SvgXml } from 'react-native-svg';
import { COLORS, STATUS, STATUS_LABELS, STATUS_COLORS, MAX_NOTES_LENGTH } from '../config/theme';

// ── Images locales ───────────────────────────────────────────
// Si une vraie photo existe dans assets/, elle remplace le SVG.
// Sinon le SVG s'affiche en fallback automatiquement.
const MACHINE_PHOTOS = {
  machine_1: require('../../assets/machine1.png'),
  // machine_2: require('../../assets/machine2.png'), // décommente quand tu as la photo
};

// ── SVG fallback Machine 1 ───────────────────────────────────
const SVG_MACHINE_1 = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="18" y="28" width="84" height="72" rx="10" fill="#66003e"/>
  <rect x="26" y="36" width="68" height="56" rx="7" fill="#8a0054"/>
  <rect x="34" y="42" width="52" height="18" rx="4" fill="#ffdff2"/>
  <circle cx="44" cy="51" r="4" fill="#66003e"/>
  <circle cx="60" cy="51" r="4" fill="#66003e"/>
  <circle cx="76" cy="51" r="4" fill="#66003e"/>
  <rect x="50" y="68" width="20" height="5" rx="2" fill="#ffdff2"/>
  <rect x="57" y="73" width="6" height="8" rx="2" fill="#ffdff2"/>
  <rect x="34" y="82" width="52" height="6" rx="3" fill="#66003e" opacity="0.5"/>
  <line x1="44" y1="82" x2="44" y2="88" stroke="#ffdff2" stroke-width="1" opacity="0.4"/>
  <line x1="54" y1="82" x2="54" y2="88" stroke="#ffdff2" stroke-width="1" opacity="0.4"/>
  <line x1="64" y1="82" x2="64" y2="88" stroke="#ffdff2" stroke-width="1" opacity="0.4"/>
  <line x1="74" y1="82" x2="74" y2="88" stroke="#ffdff2" stroke-width="1" opacity="0.4"/>
  <rect x="46" y="95" width="28" height="14" rx="4" fill="#ffdff2"/>
  <path d="M74 100 Q80 100 80 107 Q80 109 74 109" stroke="#ffdff2" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M54 24 Q56 18 54 12" stroke="#f5b8d8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M60 22 Q62 16 60 10" stroke="#f5b8d8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <path d="M66 24 Q68 18 66 12" stroke="#f5b8d8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.7"/>
  <circle cx="96" cy="36" r="10" fill="#ffdff2"/>
  <text x="96" y="40" text-anchor="middle" font-size="12" font-weight="bold" fill="#66003e" font-family="sans-serif">1</text>
</svg>`;

// ── SVG fallback Machine 2 ───────────────────────────────────
const SVG_MACHINE_2 = `
<svg viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <rect x="22" y="32" width="76" height="68" rx="12" fill="#66003e"/>
  <rect x="30" y="40" width="60" height="52" rx="8" fill="#8a0054"/>
  <rect x="72" y="22" width="22" height="32" rx="6" fill="#ffdff2" opacity="0.85"/>
  <rect x="75" y="26" width="16" height="24" rx="4" fill="#c8eeff" opacity="0.6"/>
  <circle cx="52" cy="56" r="12" fill="#ffdff2"/>
  <circle cx="52" cy="56" r="8"  fill="#f5b8d8"/>
  <circle cx="52" cy="56" r="3"  fill="#66003e"/>
  <circle cx="74" cy="50" r="6" fill="#ffdff2"/>
  <path d="M74 46 L74 50" stroke="#66003e" stroke-width="2" stroke-linecap="round"/>
  <path d="M70.5 47.5 A5 5 0 1 0 77.5 47.5" stroke="#66003e" stroke-width="2" fill="none" stroke-linecap="round"/>
  <rect x="42" y="70" width="24" height="5" rx="2" fill="#ffdff2"/>
  <rect x="51" y="75" width="6" height="7" rx="2" fill="#ffdff2"/>
  <rect x="32" y="83" width="56" height="5" rx="2.5" fill="#66003e" opacity="0.5"/>
  <rect x="44" y="94" width="24" height="13" rx="4" fill="#ffdff2"/>
  <path d="M68 98 Q74 98 74 104 Q74 107 68 107" stroke="#ffdff2" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  <path d="M50 28 Q52 22 50 16" stroke="#f5b8d8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  <path d="M56 26 Q58 20 56 14" stroke="#f5b8d8" stroke-width="2" fill="none" stroke-linecap="round" opacity="0.6"/>
  <circle cx="26" cy="36" r="10" fill="#ffdff2"/>
  <text x="26" y="40" text-anchor="middle" font-size="12" font-weight="bold" fill="#66003e" font-family="sans-serif">2</text>
</svg>`;

const SVG_MAP = { machine_1: SVG_MACHINE_1, machine_2: SVG_MACHINE_2 };

// ── Illustration : photo réelle OU SVG ───────────────────────
function MachineIllustration({ machineId, machineName }) {
  const photo  = MACHINE_PHOTOS[machineId];
  const svgXml = SVG_MAP[machineId] ?? SVG_MACHINE_1;

  if (photo) {
    return (
      <Image
        source={photo}
        style={styles.illustrationImage}
        resizeMode="cover"
      />
    );
  }

  return (
    <SvgXml xml={svgXml} width={110} height={110} />
  );
}

// ── Helpers ──────────────────────────────────────────────────
function formatDate(ts) {
  if (!ts) return '—';
  const date = ts.toDate ? ts.toDate() : new Date(ts);
  return date.toLocaleString('fr-FR', {
    hour: '2-digit', minute: '2-digit',
    day: '2-digit', month: '2-digit', year: 'numeric',
    timeZone: 'Europe/Paris',
  }) + ' CET';
}

function StatusDot({ statusKey, active, onPress }) {
  const color = STATUS_COLORS[statusKey];
  const label = STATUS_LABELS[statusKey];
  return (
    <TouchableOpacity
      onPress={onPress}
      style={styles.statusOption}
      accessibilityLabel={`Statut : ${label}`}
      disabled={!onPress}
    >
      <View style={[styles.dot, { backgroundColor: color }, !active && styles.dotInactive]} />
      <Text style={[styles.statusLabel, !active && styles.statusLabelInactive]}>{label}</Text>
    </TouchableOpacity>
  );
}

// ── MachineCard ──────────────────────────────────────────────
export default function MachineCard({ machine, onEdit, onSave, onCancel, isEditing, isSaving }) {
  const [editStatus, setEditStatus] = useState(machine.status);
  const [editNotes,  setEditNotes]  = useState(machine.notes ?? '');

  useEffect(() => {
    if (!isEditing) {
      setEditStatus(machine.status);
      setEditNotes(machine.notes ?? '');
    }
  }, [machine.status, machine.notes, isEditing]);

  const handleSave   = () => onSave({ status: editStatus, notes: editNotes.trim() });
  const handleCancel = () => { setEditStatus(machine.status); setEditNotes(machine.notes ?? ''); onCancel(); };

  const currentColor = STATUS_COLORS[machine.status];

  return (
    <View style={styles.card}>

      {/* ── En-tête ── */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[styles.statusIndicator, { backgroundColor: currentColor }]} />
          <View>
            <Text style={styles.machineName}>{machine.name}</Text>
            <Text style={styles.machineLocation}>{machine.location}</Text>
          </View>
        </View>
        {!isEditing && (
          <TouchableOpacity onPress={onEdit} style={styles.editButton} accessibilityLabel="Modifier le statut">
            <Text style={styles.editIcon}>✏️</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* ── Illustration + statuts côte à côte ── */}
      <View style={styles.illustrationRow}>
        <View style={styles.illustrationWrapper}>
          <MachineIllustration machineId={machine.id} machineName={machine.name} />
        </View>

        <View style={styles.rightColumn}>
          <Text style={styles.timestamp}>Mis à jour :{'\n'}{formatDate(machine.lastUpdated)}</Text>
          <View style={styles.statusCol}>
            {Object.values(STATUS).map((s) => (
              <StatusDot
                key={s}
                statusKey={s}
                active={isEditing ? editStatus === s : machine.status === s}
                onPress={isEditing ? () => setEditStatus(s) : undefined}
              />
            ))}
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      {/* ── Notes ── */}
      <View style={styles.notesContainer}>
        <Text style={styles.notesLabel}>Notes :</Text>
        {isEditing ? (
          <>
            <TextInput
              style={styles.notesInput}
              value={editNotes}
              onChangeText={(t) => { if (t.length <= MAX_NOTES_LENGTH) setEditNotes(t); }}
              placeholder="Ex : machine réparée dans 30 min..."
              placeholderTextColor={COLORS.greyMid}
              multiline
              maxLength={MAX_NOTES_LENGTH}
              autoFocus
            />
            <Text style={[styles.charCount, editNotes.length > MAX_NOTES_LENGTH * 0.85 && styles.charCountWarn]}>
              {editNotes.length}/{MAX_NOTES_LENGTH}
            </Text>
          </>
        ) : (
          <Text style={styles.notesText}>
            {machine.notes
              ? machine.notes
              : <Text style={styles.notesEmpty}>Aucune note</Text>}
          </Text>
        )}
      </View>

      {/* ── Boutons édition ── */}
      {isEditing && (
        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.cancelButton} onPress={handleCancel} disabled={isSaving}>
            <Text style={styles.cancelButtonText}>ANNULER</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            {isSaving
              ? <ActivityIndicator color={COLORS.white} size="small" />
              : <Text style={styles.saveButtonText}>VALIDER</Text>}
          </TouchableOpacity>
        </View>
      )}

      {/* ── Verrou ── */}
      {!isEditing && machine.lockedBy && (
        <View style={styles.lockBanner}>
          <Text style={styles.lockText}>🔒 Modification en cours par un autre utilisateur…</Text>
        </View>
      )}
    </View>
  );
}

// ── Styles ───────────────────────────────────────────────────
const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.accent,
    borderRadius: 16,
    marginHorizontal: 16,
    marginBottom: 16,
    overflow: 'hidden',
    ...Platform.select({
      ios:     { shadowColor: '#000', shadowOffset: { width: 0, height: 3 }, shadowOpacity: 0.12, shadowRadius: 8 },
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
  headerLeft:      { flexDirection: 'row', alignItems: 'center', gap: 10 },
  statusIndicator: { width: 12, height: 12, borderRadius: 6, marginRight: 4 },
  machineName:     { color: COLORS.white, fontWeight: '700', fontSize: 15, fontStyle: 'italic' },
  machineLocation: { color: COLORS.accentDark, fontSize: 12, marginTop: 1 },
  editButton:      { padding: 4 },
  editIcon:        { fontSize: 18 },

  illustrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 8,
    paddingRight: 14,
    paddingTop: 10,
    paddingBottom: 4,
    backgroundColor: COLORS.accent,
  },
  illustrationWrapper: {
    width: 110,
    height: 110,
    overflow: 'hidden',
    borderRadius: 10,
  },
  illustrationImage: {
    width: '100%',
    height: '100%',
  },

  rightColumn: {
    flex: 1,
    paddingLeft: 10,
    justifyContent: 'center',
    gap: 10,
  },
  timestamp:    { fontSize: 10.5, color: COLORS.grey, lineHeight: 15, fontWeight: '600' },
  statusCol:    { gap: 6 },
  statusOption: { flexDirection: 'row', alignItems: 'center', gap: 8, paddingVertical: 2 },
  dot:          { width: 18, height: 18, borderRadius: 9 },
  dotInactive:  { opacity: 0.25 },
  statusLabel:         { fontSize: 10, fontWeight: '700', color: COLORS.black },
  statusLabelInactive: { color: COLORS.greyMid },

  divider: {
    height: 1, backgroundColor: COLORS.accentDark, marginHorizontal: 16, marginBottom: 10,
  },

  notesContainer: { marginHorizontal: 16, marginBottom: 12 },
  notesLabel:     { fontWeight: '700', fontSize: 13, color: COLORS.black, marginBottom: 4 },
  notesText:      { fontSize: 13, color: COLORS.black, lineHeight: 18 },
  notesEmpty:     { color: COLORS.grey, fontStyle: 'italic' },
  notesInput: {
    backgroundColor: COLORS.white,
    borderRadius: 8, borderWidth: 1.5, borderColor: COLORS.primary,
    padding: 10, fontSize: 13, color: COLORS.black,
    minHeight: 60, textAlignVertical: 'top',
  },
  charCount:     { textAlign: 'right', fontSize: 11, color: COLORS.grey, marginTop: 4 },
  charCountWarn: { color: COLORS.horsServiceText },

  actionRow: { flexDirection: 'row', marginHorizontal: 16, marginBottom: 14, gap: 10 },
  cancelButton: {
    flex: 1, paddingVertical: 10, borderRadius: 30,
    borderWidth: 1.5, borderColor: COLORS.primary, alignItems: 'center',
  },
  cancelButtonText: { color: COLORS.primary, fontWeight: '700', fontSize: 13 },
  saveButton: {
    flex: 1, paddingVertical: 10, borderRadius: 30,
    backgroundColor: COLORS.primary, alignItems: 'center',
  },
  saveButtonText: { color: COLORS.white, fontWeight: '700', fontSize: 13 },

  lockBanner: {
    backgroundColor: '#fff3cd', marginHorizontal: 16, marginBottom: 10, borderRadius: 8, padding: 8,
  },
  lockText: { fontSize: 11, color: '#856404', textAlign: 'center' },
});