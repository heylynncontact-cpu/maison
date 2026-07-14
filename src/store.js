// Stockage de l'appli.
// - Sans config Firebase : stockage local du navigateur (1 seul appareil).
// - Avec les variables VITE_FIREBASE_* : bascule automatiquement en mode cloud
//   → données partagées + synchro temps réel entre tous les appareils (Line & William).
//
// L'interface (get / set / delete / list / subscribe) est identique dans les deux
// modes : le reste de l'appli n'a rien à changer.

import { initializeApp } from 'firebase/app'
import {
  getFirestore, doc, getDoc, setDoc, deleteDoc,
  collection, getDocs, onSnapshot,
} from 'firebase/firestore'

const cfg = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
}
const cloudReady = !!(cfg.apiKey && cfg.projectId)
const app = cloudReady ? initializeApp(cfg) : null
const db = cloudReady ? getFirestore(app) : null
const COLLECTION = 'store'

// valeur écrite en dernier par CET appareil, pour ignorer notre propre écho temps réel
const lastWritten = {}

/* ---------- mode local (localStorage) ---------- */
const local = {
  async get(key) {
    const v = localStorage.getItem(key)
    return v == null ? null : { key, value: v }
  },
  async set(key, value) {
    localStorage.setItem(key, value)
    return { key, value }
  },
  async delete(key) {
    localStorage.removeItem(key)
    return { key, deleted: true }
  },
  async list(prefix = '') {
    return { keys: Object.keys(localStorage).filter((k) => k.startsWith(prefix)) }
  },
  subscribe() { return () => {} }, // pas de temps réel en local
}

/* ---------- mode cloud (Firebase Firestore) ---------- */
const cloud = {
  async get(key) {
    const snap = await getDoc(doc(db, COLLECTION, key))
    return snap.exists() ? { key, value: snap.data().value } : null
  },
  async set(key, value) {
    lastWritten[key] = value
    await setDoc(doc(db, COLLECTION, key), { value, updatedAt: Date.now() })
    return { key, value }
  },
  async delete(key) {
    await deleteDoc(doc(db, COLLECTION, key))
    return { key, deleted: true }
  },
  async list(prefix = '') {
    const snap = await getDocs(collection(db, COLLECTION))
    return { keys: snap.docs.map((d) => d.id).filter((k) => k.startsWith(prefix)) }
  },
  subscribe(key, cb) {
    const unsub = onSnapshot(doc(db, COLLECTION, key), (snap) => {
      if (!snap.exists()) return
      const v = snap.data().value
      if (v != null && v !== lastWritten[key]) cb(v) // ignore nos propres écritures
    })
    return unsub
  },
}

export const storage = cloudReady ? cloud : local
export const isCloud = cloudReady
