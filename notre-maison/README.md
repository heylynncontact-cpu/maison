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

## 3. Mettre en ligne gratuitement (GitHub Pages)

Ton site est ici : **https://heylynncontact-cpu.github.io/maison/**

GitHub Pages ne sait servir que des fichiers déjà « construits » (HTML/CSS/JS), pas le
code source React tel quel — c'est pour ça que la page était vide. Un fichier
`.github/workflows/deploy.yml` est déjà inclus dans ce projet : il construit l'appli et
la publie automatiquement à chaque `git push` sur `main`.

**a. Activer GitHub Pages sur le dépôt**
1. Sur GitHub, dans le dépôt `maison` → **Settings → Pages**.
2. Section « Build and deployment » → Source : choisir **GitHub Actions** (pas « Deploy
   from a branch »).

**b. Ajouter tes clés Firebase en secrets** (elles ne doivent pas être écrites en clair
dans le dépôt public)
3. **Settings → Secrets and variables → Actions → New repository secret**.
4. Ajouter ces 6 secrets un par un (noms exacts, valeurs depuis ton fichier `.env`) :
   `VITE_FIREBASE_API_KEY`, `VITE_FIREBASE_AUTH_DOMAIN`, `VITE_FIREBASE_PROJECT_ID`,
   `VITE_FIREBASE_STORAGE_BUCKET`, `VITE_FIREBASE_MESSAGING_SENDER_ID`, `VITE_FIREBASE_APP_ID`.

**c. Déployer**
5. Pousser le projet (`git push`). Onglet **Actions** du dépôt → tu verras le
   déploiement tourner (~1-2 min). Une fois vert, ton site est à jour sur
   `https://heylynncontact-cpu.github.io/maison/`.
6. Ensuite, à chaque `git push`, le site se redéploie tout seul.

⚠️ Le fichier `vite.config.js` contient déjà `base: '/maison/'`, indispensable pour que
GitHub Pages retrouve bien les fichiers (sans ça : page blanche). Si tu renommes un jour
le dépôt, il faudra mettre ce chemin à jour.

*(Alternative : Vercel/Netlify fonctionnent aussi très bien et sont même un peu plus
simples pour ce genre de projet — dis-le-moi si tu préfères basculer dessus.)*

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
10. Pour la version en ligne : ajouter ces 6 variables en secrets GitHub (§3) — le
    déploiement se fait tout seul au push suivant.

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
