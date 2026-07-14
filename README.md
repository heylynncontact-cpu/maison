# 🏡 Notre maison — Goarem Goz

Appli web pour gérer la rénovation, le financement et l'administratif de notre maison
(Plougastel-Daoulas). Profils **Line** & **William** protégés par un code, suivi par pièce,
structure par corps de métier, prêt, dépenses, courses, moodboard, etc.

React + Vite + Tailwind. **Stockage local par défaut, ou partagé multi-appareils via Firebase.**

---

## 1. Lancer l'appli sur ton ordinateur

1. Installer **Node.js** (18+) : https://nodejs.org (bouton « LTS »).
2. Dans un terminal, dans ce dossier :

```bash
npm install      # une seule fois
npm run dev      # démarre l'appli (http://localhost:5173)
```

Version optimisée à mettre en ligne : `npm run build` (génère le dossier `dist`).

---

## 2. Mettre sur GitHub

Créer un dépôt vide sur https://github.com (ex. `notre-maison`), puis :

```bash
git init
git add .
git commit -m "Notre maison — v2"
git branch -M main
git remote add origin https://github.com/TON-COMPTE/notre-maison.git
git push -u origin main
```

---

## 3. Mettre en ligne gratuitement (Vercel)

1. Compte sur https://vercel.com (connexion avec GitHub).
2. « Add New… » → « Project » → choisir le dépôt.
3. Vite est détecté (build `npm run build`, sortie `dist`). « Deploy ».
4. ⚠️ Si tu utilises Firebase (§5), ajoute tes 6 variables dans
   **Project Settings → Environment Variables** puis redéploie.

Tu obtiens une adresse `https://…vercel.app`. Sur iPhone : Partager →
« Sur l'écran d'accueil » pour l'avoir comme une appli.

---

## 4. Codes d'accès (PIN)

Dans `src/App.jsx`, tout en haut :

```js
const PINS = { Line: "060616", William: "010999" };
```

⚠️ Verrou familial léger (le code est dans l'appli), pas une sécurité forte.

---

## 5. ⭐ Stockage partagé entre appareils (Firebase)

Par défaut, l'appli enregistre en local (un seul appareil). Pour que **Line et William
partagent les mêmes données, synchronisées en temps réel** entre téléphone et ordi,
on branche **Firebase Firestore** (gratuit). Tu n'as rien à coder : suis ces étapes.

**a. Créer le projet**
1. Aller sur https://console.firebase.google.com → « Ajouter un projet ».
2. Lui donner un nom (ex. `notre-maison`), continuer (Google Analytics : pas nécessaire,
   tu peux le désactiver).

**b. Créer la base Firestore**
3. Menu de gauche → **Build → Firestore Database** → « Créer une base de données ».
4. Choisir une région Europe (ex. `eur3`), démarrer en **mode production**.

**c. Appliquer les règles d'accès**
5. Onglet **Règles** de Firestore → remplacer tout le contenu par celui du fichier
   `firestore.rules` (fourni dans ce projet) → **Publier**.
   (Ça ouvre uniquement la collection `store` utilisée par l'appli.)

**d. Créer une appli web + récupérer la config**
6. Page d'accueil du projet (icône ⚙️ → Paramètres du projet) → en bas, « Vos applications »
   → icône **</>** (Web) → donner un nom → « Enregistrer l'application ».
7. Firebase affiche un bloc `firebaseConfig = { apiKey: "...", ... }`. Garde cette page ouverte.

**e. Brancher l'appli**
8. À la racine du projet, dupliquer `.env.example` en **`.env`**, et reporter les valeurs :

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

9. `npm install` puis `npm run dev`. C'est tout : l'appli bascule automatiquement
   en mode cloud dès que ces variables sont présentes.
10. Pour la version en ligne : ajouter ces 6 variables dans Vercel (§3) et redéployer.

**Comment ça marche** : tout est enregistré dans Firestore ; à l'ouverture chaque
appareil charge la dernière version, et une modif faite sur un appareil apparaît sur
l'autre en temps réel (écoute live du document).

**À savoir (honnêtement)** :
- La config Firebase ci-dessus n'est pas un secret à proprement parler (elle finit dans
  le site), mais les **règles Firestore** fournies ouvrent la collection `store` à
  quiconque connaît l'adresse du site. Acceptable pour un usage privé familial ; on peut
  ajouter une vraie authentification (Firebase Auth) plus tard si tu veux verrouiller ça.
- Si Line et William modifient **exactement au même moment**, c'est la dernière
  écriture qui gagne. En usage normal, aucun souci.
- Le forfait gratuit de Firebase (Spark) est largement suffisant pour cet usage.
- Les images du moodboard sont compressées ; elles comptent dans le volume stocké.

### Réinitialiser les données
- En local : console du navigateur → `localStorage.removeItem('maison_goarem_goz_v2')`
- En cloud : Firebase Console → Firestore Database → collection `store` → supprimer le
  document `maison_goarem_goz_v2`.

---

## 6. Structure du projet

```
notre-maison/
├─ index.html
├─ package.json
├─ vite.config.js  tailwind.config.js  postcss.config.js
├─ firestore.rules     # à publier dans Firebase pour le mode partagé
├─ .env.example         # à copier en .env avec ta config Firebase
└─ src/
   ├─ main.jsx         # point d'entrée
   ├─ App.jsx          # toute l'appli
   ├─ store.js         # stockage : local OU Firebase (bascule automatique)
   └─ index.css        # Tailwind
```
