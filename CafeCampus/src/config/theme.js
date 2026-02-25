// src/config/theme.js

export const COLORS = {
  primary: '#66003e',
  primaryLight: '#8a0054',
  accent: '#ffdff2',
  accentDark: '#f5b8d8',
  white: '#FFFFFF',
  black: '#1a1a1a',
  grey: '#999999',
  greyLight: '#f5f5f5',
  greyMid: '#cccccc',

  // Statut
  disponible: '#4CAF50',
  enReparation: '#FF9800',
  horsService: '#ffc2d4',
  horsServiceText: '#c0004e',
};

export const STATUS = {
  DISPONIBLE: 'disponible',
  EN_REPARATION: 'en_reparation',
  HORS_SERVICE: 'hors_service',
};

export const STATUS_LABELS = {
  disponible: 'DISPONIBLE',
  en_reparation: 'EN RÉPARATION',
  hors_service: 'HORS SERVICE',
};

export const STATUS_COLORS = {
  disponible: COLORS.disponible,
  en_reparation: COLORS.enReparation,
  hors_service: COLORS.horsService,
};

export const STATUS_TEXT_COLORS = {
  disponible: COLORS.disponible,
  en_reparation: COLORS.enReparation,
  hors_service: COLORS.horsServiceText,
};

export const MAX_NOTES_LENGTH = 150;

// Durée du verrou en ms (1 minute — si pas de "Valider", le verrou se libère automatiquement)
export const LOCK_TIMEOUT_MS = 60000;

// Identifiant unique par appareil (généré une fois, stocké en mémoire)
import { Platform } from 'react-native';
const timestamp = Date.now().toString(36);
const random = Math.random().toString(36).substring(2, 8);
export const DEVICE_ID = `${Platform.OS}-${timestamp}-${random}`;