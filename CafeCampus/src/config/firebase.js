// src/config/firebase.js

import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA7nlox-jHFH0dD1z9IgKeE7kt7x9EP7-0",
  authDomain: "cafecampus-9a9d0.firebaseapp.com",
  projectId: "cafecampus-9a9d0",
  storageBucket: "cafecampus-9a9d0.firebasestorage.app",
  messagingSenderId: "724066095591",
  appId: "1:724066095591:web:0cf4fd5abd0ad2e00c2d42"
};

//Empêche la double initialisation (IMPORTANT)
const app = getApps().length === 0
  ? initializeApp(firebaseConfig)
  : getApp();

export const db = getFirestore(app);