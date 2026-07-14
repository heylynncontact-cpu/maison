import React, { useState, useEffect, useMemo, useRef } from "react";
import {
  Home, LayoutGrid, Wrench, Wallet, FileText, ShieldCheck, ListChecks,
  ShoppingCart, Sparkles, Link2, Plus, Trash2, CheckCircle2, Circle,
  AlertTriangle, ChevronRight, ChevronLeft, CalendarDays, Zap, Droplets,
  Snowflake, Users, ImagePlus, Bell, Receipt, Palette, Euro, Package,
  DoorOpen, Flame,
} from "lucide-react";
import { storage } from "./store.js";

/* ---------- palette (moodboard : sauge + crème + terre cuite) ---------- */
const C = {
  bg: "#F2F4EC", card: "#FFFFFF", sage: "#8FA57B", sageDark: "#5E7550",
  sageLight: "#E6EDDD", clay: "#C57B5B", clayLight: "#F1E1D7", clayDark: "#9A4A2E",
  ink: "#2E3A2A", muted: "#7C866F", line: "#E2E7D8", amberBg: "#F5EFD9", amberFg: "#8A6D1E",
};
const uid = () => Math.random().toString(36).slice(2, 9);
const eur = (n) => (Number(n) || 0).toLocaleString("fr-FR") + " €";
const users = {
  Line: { color: "#8FA57B", initial: "L" },
  William: { color: "#C57B5B", initial: "W" },
};
const PINS = { Line: "060616", William: "010999" };

/* corps de métier (ids stables) */
const cPlomb = uid(), cIso = uid(), cElec = uid();

const seed = {
  currentUser: null,
  meta: {
    nom: "Goarem Goz", adresse: "4 Hameau de Goarem Goz, 29470 Plougastel-Daoulas",
    ref: "290041054", annee: 1980, surfaceHab: 97.45, terrain: 442, sousSol: 56.6,
    dpe: "E", ges: "D", chauffage: "Individuel bois + gaz", expo: "Sud-Ouest",
    prixVendeur: 165000, honoraires: 7400, fraisNotaire: 13300, totalAllIn: 185700,
    deadline: "2026-07-24",
  },
  corrections: [
    { id: uid(), label: "État civil : Line & William sont pacsés (l'offre indique « célibataires non liés par un PACS »)", done: false },
    { id: uid(), label: "Réclamer le DDT complet à l'agence (dont détail des anomalies électriques)", done: false },
    { id: uid(), label: "Clarifier l'assainissement : lave-linge en puisard, pas au tout-à-l'égout", done: false },
  ],
  pret: {
    plafond: 225000, ecoPtzMax: 50000,
    courtier: "Pierre-Yves Salaun — Minitaux (ORIAS 25008177)",
    division: { prix: 185700, ecoPtz: 0, travauxHorsPtz: 0 },
    lenders: [
      { id: uid(), nom: "Crédit Agricole", type: "En direct (cliente existante)", statut: "À contacter", taux: "", montant: "", note: "À EXCLURE de la prospection Minitaux — Line négocie en direct" },
      { id: uid(), nom: "Minitaux (courtier)", type: "Courtier", statut: "Attestation reçue", taux: "", montant: "225000", note: "Demander la liste des banques ciblées, hors CA" },
    ],
  },
  assurances: [
    { id: uid(), type: "Assurance emprunteur", compagnie: "", statut: "À souscrire", cout: "", echeance: "", note: "Exigée pour le prêt" },
    { id: uid(), type: "Assurance habitation (MRH)", compagnie: "", statut: "À souscrire", cout: "", echeance: "", note: "Avant remise des clés" },
    { id: uid(), type: "Dommages-ouvrage", compagnie: "", statut: "À étudier", cout: "", echeance: "", note: "Avant les gros travaux" },
  ],
  documents: [
    { id: uid(), nom: "Offre d'achat ferme (09/07/2026)", categorie: "Achat", statut: "Reçu" },
    { id: uid(), nom: "Attestation de faisabilité — Minitaux", categorie: "Financement", statut: "Reçu" },
    { id: uid(), nom: "Note de synthèse des diagnostics", categorie: "Diagnostics", statut: "Reçu" },
    { id: uid(), nom: "Rapport amiante complet", categorie: "Diagnostics", statut: "Reçu" },
    { id: uid(), nom: "Dossier Diagnostic Technique (DDT) complet", categorie: "Diagnostics", statut: "Manquant" },
    { id: uid(), nom: "Courrier Eau du Ponant (assainissement)", categorie: "Assainissement", statut: "Reçu" },
  ],
  diagnostics: [
    { id: uid(), type: "DPE", conclusion: "Classe E (énergie) / D (climat).", gravite: "moyen" },
    { id: uid(), type: "Amiante", conclusion: "Confirmé : ardoises composites de toiture. Dalles SdB étage écartées par le rapport détaillé (à confirmer).", gravite: "moyen" },
    { id: uid(), type: "Électricité", conclusion: "Installation > 15 ans : anomalies présentes. Détail via le DDT complet.", gravite: "haut" },
    { id: uid(), type: "Assainissement", conclusion: "Collectif, mais lave-linge en puisard : non-conformité. Mise aux normes ~avril 2027 sinon redevance doublée.", gravite: "haut" },
    { id: uid(), type: "État parasitaire", conclusion: "Moisissure et salpêtre dans le garage.", gravite: "moyen" },
    { id: uid(), type: "Gaz", conclusion: "Aucune anomalie (norme 2022).", gravite: "ok" },
    { id: uid(), type: "Plomb", conclusion: "Hors champ (1980).", gravite: "ok" },
    { id: uid(), type: "Risques", conclusion: "Zone sismique 2 (faible). Aucun PPRN/PPRM/PPRT.", gravite: "ok" },
  ],
  structure: [
    { id: cPlomb, nom: "Plomberie" },
    { id: cIso, nom: "Isolation" },
    { id: cElec, nom: "Électricité" },
    { id: uid(), nom: "Huisserie" },
    { id: uid(), nom: "Chauffage" },
  ],
  pieces: [
    { id: uid(), nom: "Entrée", niveau: "1er niveau", surface: 6.45, revetement: "Carrelage, placards", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: 11 },
    { id: uid(), nom: "Cuisine", niveau: "1er niveau", surface: 10, revetement: "Carrelage", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: 20 },
    { id: uid(), nom: "Séjour", niveau: "1er niveau", surface: 28, revetement: "Carrelage", etat: "À évaluer", budget: 0, avancement: 0, note: "Pièce de vie (insert)", lastModified: 21 },
    { id: uid(), nom: "WC", niveau: "1er niveau", surface: 1.3, revetement: "Carrelage, lave-mains", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: 5 },
    { id: uid(), nom: "Salle d'eau", niveau: "1er niveau", surface: 6.35, revetement: "Carrelage, simple vitrage bois", etat: "À évaluer", budget: 0, avancement: 0, note: "Simple vitrage à revoir", lastModified: 9 },
    { id: uid(), nom: "Palier", niveau: "2e niveau", surface: 3.35, revetement: "Stratifié", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: 4 },
    { id: uid(), nom: "Chambre 1", niveau: "2e niveau", surface: 12.55, revetement: "Stratifié, placards", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: 8 },
    { id: uid(), nom: "Chambre 2", niveau: "2e niveau", surface: 15.4, revetement: "Stratifié, placards", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: 7 },
    { id: uid(), nom: "Chambre 3", niveau: "2e niveau", surface: 9.75, revetement: "Stratifié", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: 6 },
    { id: uid(), nom: "Salle de bain", niveau: "2e niveau", surface: 4.3, revetement: "Carrelage, WC, vélux bois", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: 10 },
    { id: uid(), nom: "Sous-sol", niveau: "Sous-sol", surface: 56.6, revetement: "Béton", etat: "À évaluer", budget: 0, avancement: 0, note: "Sous-sol complet", lastModified: 3 },
    { id: uid(), nom: "Garages (x2)", niveau: "Extérieur", surface: 0, revetement: "—", etat: "Point de vigilance", budget: 0, avancement: 0, note: "Moisissure / salpêtre repérés", lastModified: 15 },
  ],
  devis: [
    { id: uid(), poste: "Mise aux normes électriques", artisan: "", pieceId: "", corpsId: cElec, montant: 0, statut: "À demander", note: "Suite anomalies diagnostic" },
    { id: uid(), poste: "Isolation / menuiseries (éco-PTZ)", artisan: "", pieceId: "", corpsId: cIso, montant: 0, statut: "À demander", note: "DPE E" },
    { id: uid(), poste: "Mise aux normes assainissement", artisan: "", pieceId: "", corpsId: cPlomb, montant: 0, statut: "À demander", note: "Échéance ~avril 2027" },
  ],
  todos: [
    { id: uid(), titre: "Corriger l'état civil (pacsés) avant le compromis", priorite: "haute", assignee: "Line", statut: "À faire", echeance: "2026-07-24", pieceId: "", corpsId: "" },
    { id: uid(), titre: "Réclamer le DDT complet à l'agence", priorite: "haute", assignee: "Line", statut: "À faire", echeance: "", pieceId: "", corpsId: "" },
    { id: uid(), titre: "Message à Pierre-Yves (financement, éco-PTZ, exclure CA)", priorite: "haute", assignee: "Line", statut: "À faire", echeance: "", pieceId: "", corpsId: "" },
    { id: uid(), titre: "Contacter le Crédit Agricole en direct", priorite: "moyenne", assignee: "Line", statut: "À faire", echeance: "", pieceId: "", corpsId: "" },
    { id: uid(), titre: "Planifier la mise aux normes assainissement", priorite: "moyenne", assignee: "Les deux", statut: "À faire", echeance: "2027-04-01", pieceId: "", corpsId: cPlomb },
    { id: uid(), titre: "Demander des devis électricité", priorite: "moyenne", assignee: "William", statut: "À faire", echeance: "", pieceId: "", corpsId: cElec },
  ],
  courses: [
    { id: uid(), article: "Déshumidificateur (garage)", categorie: "Équipement", qte: "1", ou: "", prix: 0, achete: false, pieceId: "" },
  ],
  moodboard: [
    { id: uid(), pieceId: "", titre: "Cuisine vert sauge", couleur: "#8FA57B", image: "", lien: "", note: "Ambiance principale : sauge, bois chaud, terre cuite." },
  ],
  depenses: [],
  liens: [
    { id: uid(), titre: "Géorisques", url: "https://www.georisques.gouv.fr", categorie: "Diagnostics" },
    { id: uid(), titre: "Eau du Ponant", url: "https://www.eauduponant.fr", categorie: "Assainissement" },
    { id: uid(), titre: "Éco-PTZ / MaPrimeRénov'", url: "https://www.service-public.fr", categorie: "Financement" },
  ],
};

const STORAGE_KEY = "maison_goarem_goz_v2";

/* ---------- UI atoms ---------- */
const Badge = ({ children, bg, fg }) => (
  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium" style={{ backgroundColor: bg, color: fg }}>{children}</span>
);
const statutColor = (s) => {
  const t = (s || "").toLowerCase();
  if (/(reçu|fait|accepté|souscrit|terminé|ok|payé)/.test(t)) return { bg: C.sageLight, fg: C.sageDark };
  if (/(manquant|refus|retard|à faire|à souscrire|à contacter|à demander|à étudier)/.test(t)) return { bg: C.clayLight, fg: C.clayDark };
  return { bg: "#EFEDE2", fg: C.muted };
};
const Card = ({ children, className = "", style = {}, onClick }) => (
  <div onClick={onClick} className={"rounded-2xl border p-4 " + (onClick ? "cursor-pointer active:scale-[0.99] transition " : "") + className}
    style={{ backgroundColor: C.card, borderColor: C.line, boxShadow: "0 1px 2px rgba(46,58,42,0.04)", ...style }}>{children}</div>
);
const Field = (props) => (
  <input {...props} className={"w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none " + (props.className || "")}
    style={{ borderColor: C.line, backgroundColor: "#FCFCF8", color: C.ink, ...(props.style || {}) }} />
);
const Bare = (props) => (
  <input {...props} className={"w-full text-sm outline-none bg-transparent " + (props.className || "")} style={{ color: C.ink, ...(props.style || {}) }} />
);
const AddBtn = ({ onClick, label }) => (
  <button onClick={onClick} className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-sm font-medium text-white active:scale-95 transition" style={{ backgroundColor: C.sageDark }}>
    <Plus size={15} /> {label}
  </button>
);
const Progress = ({ v }) => (
  <div className="h-2 w-full rounded-full overflow-hidden" style={{ backgroundColor: C.sageLight }}>
    <div className="h-full rounded-full transition-all" style={{ width: Math.min(100, Math.max(0, v)) + "%", backgroundColor: C.sage }} />
  </div>
);
const Head = ({ title, sub, back, action }) => (
  <div className="flex items-start justify-between gap-3 mb-4">
    <div className="flex items-center gap-2">
      {back && <button onClick={back} className="rounded-lg p-1.5 -ml-1" style={{ backgroundColor: C.sageLight }}><ChevronLeft size={18} style={{ color: C.sageDark }} /></button>}
      <div>
        <h2 className="text-xl font-semibold leading-tight" style={{ color: C.ink }}>{title}</h2>
        {sub && <p className="text-xs" style={{ color: C.muted }}>{sub}</p>}
      </div>
    </div>
    {action}
  </div>
);
const corpsIcon = (nom) => /plomb/i.test(nom) ? Droplets : /iso/i.test(nom) ? Snowflake : /élec|elec/i.test(nom) ? Zap : /huiss|menuis|fen|porte/i.test(nom) ? DoorOpen : /chauff|thermi|radiat/i.test(nom) ? Flame : Wrench;

/* image resize -> small base64 */
const fileToSmallDataURL = (file, cb) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new window.Image();
    img.onload = () => {
      const max = 520; let { width: w, height: h } = img;
      if (w > h && w > max) { h = (h * max) / w; w = max; } else if (h > max) { w = (w * max) / h; h = max; }
      const cv = document.createElement("canvas"); cv.width = w; cv.height = h;
      cv.getContext("2d").drawImage(img, 0, 0, w, h);
      cb(cv.toDataURL("image/jpeg", 0.72));
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
};

export default function App() {
  const [data, setData] = useState(seed);
  const [loaded, setLoaded] = useState(false);
  const [screen, setScreen] = useState("dashboard");
  const [pieceId, setPieceId] = useState(null);
  const [pieceTab, setPieceTab] = useState("taches");
  const [corpsId, setCorpsId] = useState(null);
  const [pinUser, setPinUser] = useState(null);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(false);
  const fileRef = useRef(null);
  const fileTarget = useRef(null);
  const lastSyncRef = useRef("");

  useEffect(() => {
    let on = true;
    (async () => {
      try {
        if (storage) {
          const r = await storage.get(STORAGE_KEY);
          if (on && r && r.value) {
            const loadedData = JSON.parse(r.value);
            const merged = { ...seed, ...loadedData, meta: { ...seed.meta, ...(loadedData.meta || {}) }, pret: { ...seed.pret, ...(loadedData.pret || {}) } };
            const names = (merged.structure || []).map((s) => s.nom.toLowerCase());
            ["Huisserie", "Chauffage"].forEach((n) => { if (!names.includes(n.toLowerCase())) merged.structure.push({ id: uid(), nom: n }); });
            lastSyncRef.current = JSON.stringify(merged);
            setData(merged);
          } else if (storage) { lastSyncRef.current = JSON.stringify(seed); await storage.set(STORAGE_KEY, JSON.stringify(seed)); }
        }
      } catch (e) { try { if (storage) await storage.set(STORAGE_KEY, JSON.stringify(seed)); } catch (_) {} }
      finally { if (on) setLoaded(true); }
    })();
    return () => { on = false; };
  }, []);
  /* enregistrement (débounce) — évite de réécrire la même valeur en boucle */
  useEffect(() => {
    if (!loaded) return;
    const s = JSON.stringify(data);
    if (s === lastSyncRef.current) return;
    const t = setTimeout(() => {
      lastSyncRef.current = s;
      (async () => { try { if (storage) await storage.set(STORAGE_KEY, s); } catch (e) {} })();
    }, 500);
    return () => clearTimeout(t);
  }, [data, loaded]);
  /* synchro temps réel entre appareils (actif seulement en mode cloud) */
  useEffect(() => {
    if (!loaded || !storage || !storage.subscribe) return;
    const unsub = storage.subscribe(STORAGE_KEY, (value) => {
      lastSyncRef.current = value;
      try { setData(JSON.parse(value)); } catch (e) {}
    });
    return unsub;
  }, [loaded]);

  /* update helpers */
  const patch = (key, id, p) => setData((d) => ({ ...d, [key]: d[key].map((i) => i.id === id ? { ...i, ...p } : i) }));
  const add = (key, item) => setData((d) => ({ ...d, [key]: [...d[key], { id: uid(), ...item }] }));
  const del = (key, id) => setData((d) => ({ ...d, [key]: d[key].filter((i) => i.id !== id) }));
  const touch = (pid) => { if (pid) setData((d) => ({ ...d, pieces: d.pieces.map((p) => p.id === pid ? { ...p, lastModified: Date.now() } : p) })); };
  const patchPiece = (id, p) => setData((d) => ({ ...d, pieces: d.pieces.map((x) => x.id === id ? { ...x, ...p, lastModified: Date.now() } : x) }));
  const patchPret = (p) => setData((d) => ({ ...d, pret: { ...d.pret, ...p } }));
  /* courses <-> dépenses */
  const toggleCourse = (c) => {
    const now = !c.achete;
    setData((d) => {
      const depenses = now
        ? [...d.depenses, { id: uid(), libelle: c.article || "Article", montant: Number(c.prix) || 0, date: new Date().toISOString().slice(0, 10), pieceId: c.pieceId || "", categorie: "Courses", sourceCourseId: c.id }]
        : d.depenses.filter((x) => x.sourceCourseId !== c.id);
      return { ...d, depenses, courses: d.courses.map((x) => x.id === c.id ? { ...x, achete: now } : x) };
    });
  };
  const delCourse = (id) => setData((d) => ({ ...d, courses: d.courses.filter((x) => x.id !== id), depenses: d.depenses.filter((x) => x.sourceCourseId !== id) }));
  const setCourse = (c, p) => setData((d) => ({
    ...d,
    courses: d.courses.map((x) => x.id === c.id ? { ...x, ...p } : x),
    depenses: c.achete && p.prix !== undefined ? d.depenses.map((x) => x.sourceCourseId === c.id ? { ...x, montant: Number(p.prix) || 0 } : x)
      : c.achete && p.article !== undefined ? d.depenses.map((x) => x.sourceCourseId === c.id ? { ...x, libelle: p.article } : x) : d.depenses,
  }));

  const me = data.currentUser;
  const piece = data.pieces.find((p) => p.id === pieceId);
  const corps = data.structure.find((c) => c.id === corpsId);

  /* computed */
  const budgetTravaux = useMemo(() => data.pieces.reduce((s, p) => s + (+p.budget || 0), 0), [data.pieces]);
  const depense = useMemo(() => data.depenses.reduce((s, x) => s + (+x.montant || 0), 0), [data.depenses]);
  const loanTotal = data.pret.division.prix + data.pret.division.ecoPtz + data.pret.division.travauxHorsPtz;
  const marge = data.pret.plafond - loanTotal;
  const daysLeft = Math.ceil((new Date(data.meta.deadline) - new Date()) / 86400000);
  const urgences = useMemo(() => {
    const list = [];
    data.corrections.filter((c) => !c.done).forEach((c) => list.push({ id: c.id, txt: c.label, kind: "correction" }));
    data.todos.filter((t) => t.priorite === "haute" && t.statut !== "Fait").forEach((t) => list.push({ id: t.id, txt: t.titre, who: t.assignee, kind: "todo" }));
    return list;
  }, [data]);
  const aVenir = useMemo(() => data.todos.filter((t) => t.statut !== "Fait" && t.echeance).sort((a, b) => a.echeance.localeCompare(b.echeance)), [data.todos]);
  const recentes = useMemo(() => [...data.pieces].sort((a, b) => (b.lastModified || 0) - (a.lastModified || 0)).slice(0, 4), [data.pieces]);

  const openPiece = (id) => { setPieceId(id); setPieceTab("taches"); setScreen("piece"); };
  const openCorps = (id) => { setCorpsId(id); setScreen("corps"); };
  const pickImage = (cb) => { fileTarget.current = cb; fileRef.current && fileRef.current.click(); };
  const onFile = (e) => { const f = e.target.files[0]; if (f && fileTarget.current) fileToSmallDataURL(f, (d) => fileTarget.current(d)); e.target.value = ""; };

  const pressDigit = (n) => {
    if (pinInput.length >= 6) return;
    const next = pinInput + String(n);
    setPinInput(next); setPinError(false);
    if (next.length === 6) {
      if (next === PINS[pinUser]) { setData((d) => ({ ...d, currentUser: pinUser })); setPinUser(null); setPinInput(""); }
      else { setPinError(true); setTimeout(() => setPinInput(""), 500); }
    }
  };

  /* ---------- USER PICKER + CODE ---------- */
  if (!me) {
    if (!pinUser) return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: C.bg, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <div className="rounded-2xl p-3 mb-4" style={{ backgroundColor: C.sage }}><Home size={26} color="#fff" /></div>
        <h1 className="text-2xl font-semibold" style={{ color: C.ink }}>Notre maison</h1>
        <p className="text-sm mb-8" style={{ color: C.muted }}>{data.meta.nom} · qui es-tu ?</p>
        <div className="flex gap-4">
          {Object.keys(users).map((u) => (
            <button key={u} onClick={() => { setPinUser(u); setPinInput(""); setPinError(false); }}
              className="flex flex-col items-center gap-3 rounded-2xl border p-6 w-32 active:scale-95 transition" style={{ backgroundColor: C.card, borderColor: C.line }}>
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold text-white" style={{ backgroundColor: users[u].color }}>{users[u].initial}</div>
              <span className="font-medium" style={{ color: C.ink }}>{u}</span>
            </button>
          ))}
        </div>
      </div>
    );
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6" style={{ backgroundColor: C.bg, fontFamily: "ui-sans-serif, system-ui, sans-serif" }}>
        <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-semibold text-white mb-3" style={{ backgroundColor: users[pinUser].color }}>{users[pinUser].initial}</div>
        <h1 className="text-xl font-semibold" style={{ color: C.ink }}>Bonjour {pinUser}</h1>
        <p className="text-sm mb-6" style={{ color: pinError ? C.clayDark : C.muted }}>{pinError ? "Code incorrect, réessaie" : "Entre ton code"}</p>
        <div className="flex gap-3 mb-8">
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="w-3.5 h-3.5 rounded-full transition" style={{ backgroundColor: pinError ? C.clay : i < pinInput.length ? C.sageDark : C.line }} />
          ))}
        </div>
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
            <button key={n} onClick={() => pressDigit(n)} className="w-16 h-16 rounded-full text-xl font-medium active:scale-90 transition" style={{ backgroundColor: C.card, color: C.ink, border: "1px solid " + C.line }}>{n}</button>
          ))}
          <button onClick={() => { setPinUser(null); setPinInput(""); }} className="w-16 h-16 rounded-full text-xs active:scale-90 transition" style={{ color: C.muted }}>Retour</button>
          <button onClick={() => pressDigit(0)} className="w-16 h-16 rounded-full text-xl font-medium active:scale-90 transition" style={{ backgroundColor: C.card, color: C.ink, border: "1px solid " + C.line }}>0</button>
          <button onClick={() => setPinInput(pinInput.slice(0, -1))} className="w-16 h-16 rounded-full flex items-center justify-center active:scale-90 transition" style={{ color: C.muted }}><ChevronLeft size={22} /></button>
        </div>
      </div>
    );
  }

  /* ---------- SCREENS ---------- */
  const stat = (label, value, accent, onClick) => (
    <Card className="flex-1 min-w-0" onClick={onClick}>
      <p className="text-xs font-medium" style={{ color: C.muted }}>{label}</p>
      <p className="text-lg font-semibold mt-0.5 truncate" style={{ color: accent || C.ink }}>{value}</p>
    </Card>
  );

  const dashboard = () => (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-sm" style={{ color: C.muted }}>Bonjour</p>
          <h2 className="text-2xl font-semibold" style={{ color: C.ink }}>{me} 👋</h2>
        </div>
        <button onClick={() => setData((d) => ({ ...d, currentUser: null }))} className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold" style={{ backgroundColor: users[me].color }}>{users[me].initial}</button>
      </div>

      <div className="flex flex-wrap gap-2.5 mb-4">
        {stat("Budget travaux", eur(budgetTravaux), C.clay, () => setScreen("depenses"))}
        {stat("Dépensé", eur(depense), C.sageDark, () => setScreen("depenses"))}
      </div>

      <div className="grid md:grid-cols-2 gap-4 mb-4">
        <Card>
          <div className="flex items-center gap-2 mb-3"><CalendarDays size={16} style={{ color: C.sageDark }} /><p className="font-semibold text-sm" style={{ color: C.ink }}>Tâches à venir</p></div>
          {aVenir.length === 0 ? <p className="text-sm" style={{ color: C.muted }}>Rien de daté. 🌿</p> : aVenir.slice(0, 5).map((t) => (
            <div key={t.id} className="flex items-center gap-2 text-sm py-1">
              <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: t.priorite === "haute" ? C.clay : C.sage }} />
              <span style={{ color: C.ink }}>{t.titre}</span><span className="ml-auto text-xs" style={{ color: C.muted }}>{t.echeance}</span>
            </div>
          ))}
        </Card>
        <Card>
          <div className="flex items-center gap-2 mb-3"><LayoutGrid size={16} style={{ color: C.sageDark }} /><p className="font-semibold text-sm" style={{ color: C.ink }}>Pièces récemment modifiées</p></div>
          {recentes.map((p) => (
            <div key={p.id} onClick={() => openPiece(p.id)} className="flex items-center gap-2 text-sm py-1.5 cursor-pointer">
              <span style={{ color: C.ink }}>{p.nom}</span>
              <span className="ml-auto text-xs" style={{ color: C.muted }}>{p.avancement}%</span>
              <ChevronRight size={14} style={{ color: C.muted }} />
            </div>
          ))}
        </Card>
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Accès rapide</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2.5">
        {[["Structure", Wrench, () => setScreen("structure")], ["Dépenses", Receipt, () => setScreen("depenses")], ["Courses", ShoppingCart, () => setScreen("courses")], ["Toutes les tâches", ListChecks, () => setScreen("taches")], ["Assurances", ShieldCheck, () => setScreen("papiers")], ["Liens utiles", Link2, () => setScreen("liens")]].map(([l, Ic, fn]) => (
          <Card key={l} onClick={fn} className="flex items-center gap-2">
            <div className="rounded-lg p-1.5" style={{ backgroundColor: C.sageLight }}><Ic size={15} style={{ color: C.sageDark }} /></div>
            <span className="text-sm font-medium" style={{ color: C.ink }}>{l}</span>
          </Card>
        ))}
      </div>
    </div>
  );

  const listePieces = () => {
    const niveaux = [...new Set(data.pieces.map((p) => p.niveau))];
    return (
      <div>
        <Head title="Liste des pièces" sub={data.meta.surfaceHab + " m² · " + data.pieces.length + " espaces"}
          action={<AddBtn label="Pièce" onClick={() => { const id = uid(); setData((d) => ({ ...d, pieces: [...d.pieces, { id, nom: "Nouvelle pièce", niveau: "1er niveau", surface: 0, revetement: "", etat: "À évaluer", budget: 0, avancement: 0, note: "", lastModified: Date.now() }] })); openPiece(id); }} />} />
        {niveaux.map((niv) => (
          <div key={niv} className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>{niv}</p>
            <div className="grid md:grid-cols-2 gap-2.5">
              {data.pieces.filter((p) => p.niveau === niv).map((p) => {
                const nT = data.todos.filter((t) => t.pieceId === p.id).length;
                const nD = data.devis.filter((d) => d.pieceId === p.id).length;
                return (
                  <Card key={p.id} onClick={() => openPiece(p.id)}>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold" style={{ color: C.ink }}>{p.nom}</span>
                      {p.surface > 0 && <span className="text-xs" style={{ color: C.muted }}>{p.surface} m²</span>}
                      <ChevronRight size={16} className="ml-auto" style={{ color: C.muted }} />
                    </div>
                    <p className="text-xs mt-1 mb-2" style={{ color: C.muted }}>{p.revetement}</p>
                    <Progress v={p.avancement} />
                    <div className="flex gap-3 mt-2 text-xs" style={{ color: C.muted }}>
                      <span>{p.avancement}%</span><span>{nT} tâche{nT > 1 ? "s" : ""}</span><span>{nD} devis</span>{+p.budget > 0 && <span>{eur(p.budget)}</span>}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const pieceDetail = () => {
    if (!piece) return null;
    const tabs = [["taches", "Tâches", ListChecks], ["devis", "Devis", Receipt], ["mood", "Moodboard", Sparkles], ["courses", "Courses", ShoppingCart], ["infos", "Infos", LayoutGrid]];
    const myTodos = data.todos.filter((t) => t.pieceId === piece.id);
    const myDevis = data.devis.filter((d) => d.pieceId === piece.id);
    const myMood = data.moodboard.filter((m) => m.pieceId === piece.id);
    const myCourses = data.courses.filter((c) => c.pieceId === piece.id);
    return (
      <div>
        <Head title={piece.nom} sub={piece.niveau + (piece.surface > 0 ? " · " + piece.surface + " m²" : "")} back={() => setScreen("pieces")} />
        <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
          {tabs.map(([id, l, Ic]) => (
            <button key={id} onClick={() => setPieceTab(id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm whitespace-nowrap"
              style={pieceTab === id ? { backgroundColor: C.sageDark, color: "#fff" } : { backgroundColor: C.card, color: C.muted, border: "1px solid " + C.line }}>
              <Ic size={14} /> {l}
            </button>
          ))}
        </div>

        {pieceTab === "taches" && (
          <div className="space-y-2">
            <AddBtn label="Tâche" onClick={() => { add("todos", { titre: "Nouvelle tâche", priorite: "moyenne", assignee: me, statut: "À faire", echeance: "", pieceId: piece.id, corpsId: "" }); touch(piece.id); }} />
            {myTodos.map((t) => taskRow(t))}
            {myTodos.length === 0 && <p className="text-sm mt-2" style={{ color: C.muted }}>Aucune tâche pour cette pièce.</p>}
          </div>
        )}
        {pieceTab === "devis" && (
          <div className="space-y-2">
            <AddBtn label="Devis" onClick={() => { add("devis", { poste: "Nouveau devis", artisan: "", pieceId: piece.id, corpsId: "", montant: 0, statut: "À demander", note: "" }); touch(piece.id); }} />
            {myDevis.map((d) => devisRow(d))}
            {myDevis.length === 0 && <p className="text-sm mt-2" style={{ color: C.muted }}>Aucun devis pour cette pièce.</p>}
          </div>
        )}
        {pieceTab === "mood" && (
          <div>
            <AddBtn label="Inspiration" onClick={() => { add("moodboard", { pieceId: piece.id, titre: "Nouvelle inspi", couleur: "#8FA57B", image: "", lien: "", note: "" }); touch(piece.id); }} />
            <div className="grid sm:grid-cols-2 gap-3 mt-3">{myMood.map((m) => moodCard(m))}</div>
          </div>
        )}
        {pieceTab === "courses" && (
          <div className="space-y-2">
            <AddBtn label="Article" onClick={() => { add("courses", { article: "Nouvel article", categorie: "Matériaux", qte: "", ou: "", prix: 0, achete: false, pieceId: piece.id }); touch(piece.id); }} />
            {myCourses.map((c) => courseRow(c))}
            {myCourses.length === 0 && <p className="text-sm mt-2" style={{ color: C.muted }}>Rien à acheter pour cette pièce.</p>}
          </div>
        )}
        {pieceTab === "infos" && (
          <Card>
            <label className="text-xs" style={{ color: C.muted }}>Nom</label>
            <Field value={piece.nom} onChange={(e) => patchPiece(piece.id, { nom: e.target.value })} className="mb-2" />
            <div className="grid grid-cols-2 gap-2 mb-2">
              <div><label className="text-xs" style={{ color: C.muted }}>Surface m²</label><Field type="number" value={piece.surface} onChange={(e) => patchPiece(piece.id, { surface: e.target.value })} /></div>
              <div><label className="text-xs" style={{ color: C.muted }}>Budget €</label><Field type="number" value={piece.budget} onChange={(e) => patchPiece(piece.id, { budget: e.target.value })} /></div>
            </div>
            <label className="text-xs" style={{ color: C.muted }}>Revêtement / état</label>
            <Field value={piece.revetement} onChange={(e) => patchPiece(piece.id, { revetement: e.target.value })} className="mb-2" />
            <Field value={piece.etat} onChange={(e) => patchPiece(piece.id, { etat: e.target.value })} className="mb-2" placeholder="État" />
            <label className="text-xs" style={{ color: C.muted }}>Avancement {piece.avancement}%</label>
            <input type="range" min="0" max="100" value={piece.avancement} onChange={(e) => patchPiece(piece.id, { avancement: +e.target.value })} className="w-full" style={{ accentColor: C.sage }} />
            <textarea value={piece.note} onChange={(e) => patchPiece(piece.id, { note: e.target.value })} placeholder="Notes…" rows={2} className="w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none resize-none mt-2" style={{ borderColor: C.line, backgroundColor: "#FCFCF8", color: C.ink }} />
            <button onClick={() => { if (confirm("Supprimer cette pièce ?")) { del("pieces", piece.id); setScreen("pieces"); } }} className="mt-3 text-sm flex items-center gap-1.5" style={{ color: C.clayDark }}><Trash2 size={15} /> Supprimer la pièce</button>
          </Card>
        )}
      </div>
    );
  };

  /* reusable rows */
  const prioColor = (p) => p === "haute" ? { bg: C.clayLight, fg: C.clayDark } : p === "moyenne" ? { bg: C.amberBg, fg: C.amberFg } : { bg: C.sageLight, fg: C.sageDark };
  const taskRow = (t) => {
    const done = t.statut === "Fait"; const pc = prioColor(t.priorite);
    return (
      <Card key={t.id} className="flex items-center gap-2.5">
        <button onClick={() => patch("todos", t.id, { statut: done ? "À faire" : "Fait" })}>{done ? <CheckCircle2 size={19} style={{ color: C.sage }} /> : <Circle size={19} style={{ color: C.line }} />}</button>
        <div className="flex-1 min-w-0">
          <Bare value={t.titre} onChange={(e) => patch("todos", t.id, { titre: e.target.value })} className="font-medium" style={{ textDecoration: done ? "line-through" : "none", color: done ? C.muted : C.ink }} />
          <div className="flex items-center gap-1.5 mt-1 flex-wrap">
            <select value={t.priorite} onChange={(e) => patch("todos", t.id, { priorite: e.target.value })} className="text-xs rounded-full px-2 py-0.5 border-0" style={{ backgroundColor: pc.bg, color: pc.fg }}>
              <option value="haute">haute</option><option value="moyenne">moyenne</option><option value="basse">basse</option>
            </select>
            <select value={t.assignee} onChange={(e) => patch("todos", t.id, { assignee: e.target.value })} className="text-xs rounded-full px-2 py-0.5" style={{ backgroundColor: "#EEF0E6", color: C.ink }}>
              <option>Line</option><option>William</option><option>Les deux</option>
            </select>
            <input type="date" value={t.echeance} onChange={(e) => patch("todos", t.id, { echeance: e.target.value })} className="text-xs rounded-lg border px-1.5 py-0.5" style={{ borderColor: C.line, color: C.muted }} />
          </div>
        </div>
        <button onClick={() => del("todos", t.id)}><Trash2 size={16} style={{ color: C.muted }} /></button>
      </Card>
    );
  };
  const devisRow = (d) => {
    const c = statutColor(d.statut);
    return (
      <Card key={d.id}>
        <div className="flex items-center gap-2 mb-2"><Bare value={d.poste} onChange={(e) => patch("devis", d.id, { poste: e.target.value })} className="font-semibold" /><button onClick={() => del("devis", d.id)}><Trash2 size={16} style={{ color: C.muted }} /></button></div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 items-center">
          <Field placeholder="Artisan" value={d.artisan} onChange={(e) => patch("devis", d.id, { artisan: e.target.value })} />
          <select value={d.corpsId} onChange={(e) => patch("devis", d.id, { corpsId: e.target.value })} className="rounded-lg border px-2 py-1.5 text-sm" style={{ borderColor: C.line, backgroundColor: "#FCFCF8", color: C.ink }}>
            <option value="">— Corps —</option>{data.structure.map((s) => <option key={s.id} value={s.id}>{s.nom}</option>)}
          </select>
          <Field type="number" placeholder="Montant €" value={d.montant} onChange={(e) => patch("devis", d.id, { montant: e.target.value })} />
          <select value={d.statut} onChange={(e) => patch("devis", d.id, { statut: e.target.value })} className="rounded-lg border px-2 py-1.5 text-sm" style={{ borderColor: C.line, backgroundColor: c.bg, color: c.fg }}>
            {["À demander", "Demandé", "Reçu", "Accepté", "Refusé"].map((s) => <option key={s}>{s}</option>)}
          </select>
        </div>
      </Card>
    );
  };
  const courseRow = (c) => (
    <Card key={c.id}>
      <div className="flex items-center gap-2.5">
        <button onClick={() => toggleCourse(c)} title="Valider → ajoute aux dépenses">{c.achete ? <CheckCircle2 size={19} style={{ color: C.sage }} /> : <Circle size={19} style={{ color: C.line }} />}</button>
        <div className="flex-1 min-w-0">
          <Bare value={c.article} onChange={(e) => setCourse(c, { article: e.target.value })} placeholder="Nom" className="font-medium" style={{ textDecoration: c.achete ? "line-through" : "none", color: c.achete ? C.muted : C.ink }} />
          {c.achete && <span className="text-xs" style={{ color: C.sageDark }}>→ ajouté aux dépenses</span>}
        </div>
        <button onClick={() => delCourse(c.id)}><Trash2 size={16} style={{ color: C.muted }} /></button>
      </div>
      <div className="flex items-center gap-2 mt-2 pl-8">
        <label className="text-xs" style={{ color: C.muted }}>Qté</label>
        <Field value={c.qte} onChange={(e) => setCourse(c, { qte: e.target.value })} className="w-16" />
        <label className="text-xs ml-2" style={{ color: C.muted }}>Prix €</label>
        <Field type="number" value={c.prix} onChange={(e) => setCourse(c, { prix: e.target.value })} className="w-24" />
      </div>
    </Card>
  );
  const moodCard = (m) => (
    <Card key={m.id} className="overflow-hidden p-0">
      {m.image ? <img src={m.image} alt="" className="w-full h-28 object-cover" /> : <div className="h-20" style={{ backgroundColor: m.couleur }} />}
      <div className="p-3">
        <div className="flex items-center gap-2 mb-2">
          <input type="color" value={m.couleur} onChange={(e) => patch("moodboard", m.id, { couleur: e.target.value })} className="w-6 h-6 rounded cursor-pointer border-0 bg-transparent" />
          <Bare value={m.titre} onChange={(e) => patch("moodboard", m.id, { titre: e.target.value })} className="font-semibold" />
          <button onClick={() => del("moodboard", m.id)}><Trash2 size={16} style={{ color: C.muted }} /></button>
        </div>
        <div className="flex gap-2 mb-2">
          <button onClick={() => pickImage((d) => patch("moodboard", m.id, { image: d }))} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: C.sageLight, color: C.sageDark }}><ImagePlus size={13} /> Image</button>
          {m.image && <button onClick={() => patch("moodboard", m.id, { image: "" })} className="text-xs px-2 py-1 rounded-lg" style={{ backgroundColor: "#EEF0E6", color: C.muted }}>Retirer</button>}
        </div>
        <textarea value={m.note} onChange={(e) => patch("moodboard", m.id, { note: e.target.value })} placeholder="Note…" rows={2} className="w-full rounded-lg border px-2.5 py-1.5 text-sm outline-none resize-none" style={{ borderColor: C.line, backgroundColor: "#FCFCF8", color: C.ink }} />
      </div>
    </Card>
  );

  const structureScreen = () => (
    <div>
      <Head title="Structure" sub="Par corps de métier — devis & tâches transversaux"
        action={<AddBtn label="Corps" onClick={() => add("structure", { nom: "Nouveau corps" })} />} />
      <div className="grid md:grid-cols-2 gap-2.5">
        {data.structure.map((s) => {
          const Ic = corpsIcon(s.nom);
          const nD = data.devis.filter((d) => d.corpsId === s.id).length;
          const nT = data.todos.filter((t) => t.corpsId === s.id).length;
          const cost = data.devis.filter((d) => d.corpsId === s.id).reduce((a, d) => a + (+d.montant || 0), 0);
          return (
            <Card key={s.id} onClick={() => openCorps(s.id)}>
              <div className="flex items-center gap-2.5">
                <div className="rounded-xl p-2" style={{ backgroundColor: C.sageLight }}><Ic size={18} style={{ color: C.sageDark }} /></div>
                <span className="font-semibold" style={{ color: C.ink }}>{s.nom}</span>
                <ChevronRight size={16} className="ml-auto" style={{ color: C.muted }} />
              </div>
              <div className="flex gap-3 mt-2 text-xs" style={{ color: C.muted }}><span>{nD} devis</span><span>{nT} tâches</span>{cost > 0 && <span>{eur(cost)}</span>}</div>
            </Card>
          );
        })}
      </div>
    </div>
  );

  const corpsDetail = () => {
    if (!corps) return null;
    const myDevis = data.devis.filter((d) => d.corpsId === corps.id);
    const myTodos = data.todos.filter((t) => t.corpsId === corps.id);
    const Ic = corpsIcon(corps.nom);
    return (
      <div>
        <Head title={corps.nom} back={() => setScreen("structure")}
          action={<button onClick={() => { if (confirm("Supprimer ce corps de métier ?")) { del("structure", corps.id); setScreen("structure"); } }}><Trash2 size={18} style={{ color: C.muted }} /></button>} />
        <div className="flex items-center gap-2 mb-4"><div className="rounded-xl p-2" style={{ backgroundColor: C.sageLight }}><Ic size={18} style={{ color: C.sageDark }} /></div>
          <Field value={corps.nom} onChange={(e) => patch("structure", corps.id, { nom: e.target.value })} className="font-semibold" /></div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Devis</p>
        <div className="space-y-2 mb-3"><AddBtn label="Devis" onClick={() => add("devis", { poste: "Nouveau devis", artisan: "", pieceId: "", corpsId: corps.id, montant: 0, statut: "À demander", note: "" })} />{myDevis.map((d) => devisRow(d))}</div>
        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Tâches</p>
        <div className="space-y-2"><AddBtn label="Tâche" onClick={() => add("todos", { titre: "Nouvelle tâche", priorite: "moyenne", assignee: me, statut: "À faire", echeance: "", pieceId: "", corpsId: corps.id })} />{myTodos.map((t) => taskRow(t))}</div>
      </div>
    );
  };

  const pretScreen = () => {
    const dv = data.pret.division;
    const seg = [["Prix (achat)", dv.prix, C.sage], ["Éco-PTZ", dv.ecoPtz, C.clay], ["Travaux hors PTZ", dv.travauxHorsPtz, C.amberFg]];
    return (
      <div>
        <Head title="Prêt & financement" sub={data.pret.courtier} />
        <div className="flex flex-wrap gap-2.5 mb-4">
          {stat("Plafond attestation", eur(data.pret.plafond))}
          {stat("Prêt total réparti", eur(loanTotal), C.clay)}
          {stat("Marge", eur(marge), marge < 0 ? "#B23A2E" : C.sageDark)}
        </div>
        <Card className="mb-4" style={{ backgroundColor: C.sageLight, borderColor: "#CBDBB9" }}>
          <p className="text-sm" style={{ color: C.sageDark }}><strong>Zone B1 :</strong> pas de PTZ classique sur l'ancien, mais <strong>éco-PTZ ≤ 50 000 €</strong> pour les travaux d'énergie. Crédit Agricole négocié <strong>en direct</strong>, exclu de Minitaux.</p>
        </Card>

        <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Division du prêt</p>
        <Card className="mb-4">
          <div className="flex h-4 rounded-full overflow-hidden mb-3">
            {seg.map(([l, v, col]) => loanTotal > 0 && v > 0 && <div key={l} style={{ width: (v / loanTotal) * 100 + "%", backgroundColor: col }} />)}
          </div>
          {[["Prix (achat)", "prix", "≤ prix du bien"], ["Éco-PTZ", "ecoPtz", "≤ 50 000 € · travaux énergie"], ["Travaux hors PTZ", "travauxHorsPtz", "autres travaux"]].map(([l, k, hint]) => (
            <div key={k} className="flex items-center gap-3 py-1.5">
              <div className="flex-1"><p className="text-sm font-medium" style={{ color: C.ink }}>{l}</p><p className="text-xs" style={{ color: C.muted }}>{hint}</p></div>
              <Field type="number" value={dv[k]} onChange={(e) => patchPret({ division: { ...dv, [k]: +e.target.value } })} className="w-32" />
            </div>
          ))}
          {dv.ecoPtz > data.pret.ecoPtzMax && <p className="text-xs mt-1" style={{ color: C.clayDark }}>⚠ L'éco-PTZ dépasse le plafond de 50 000 €.</p>}
        </Card>

        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Banques & infos</p>
          <AddBtn label="Banque" onClick={() => patchPret({ lenders: [...data.pret.lenders, { id: uid(), nom: "Nouvelle banque", type: "", statut: "À contacter", taux: "", montant: "", note: "" }] })} />
        </div>
        <div className="space-y-2">
          {data.pret.lenders.map((l) => {
            const c = statutColor(l.statut);
            return (
              <Card key={l.id}>
                <div className="flex items-center gap-2 mb-2">
                  <Bare value={l.nom} onChange={(e) => patchPret({ lenders: data.pret.lenders.map((x) => x.id === l.id ? { ...x, nom: e.target.value } : x) })} className="font-semibold" />
                  <Badge bg={c.bg} fg={c.fg}>{l.statut}</Badge>
                  <button onClick={() => patchPret({ lenders: data.pret.lenders.filter((x) => x.id !== l.id) })}><Trash2 size={16} style={{ color: C.muted }} /></button>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {[["Type", "type"], ["Statut", "statut"], ["Taux %", "taux"], ["Montant €", "montant"]].map(([ph, k]) => (
                    <Field key={k} placeholder={ph} value={l[k]} onChange={(e) => patchPret({ lenders: data.pret.lenders.map((x) => x.id === l.id ? { ...x, [k]: e.target.value } : x) })} />
                  ))}
                </div>
                <Field placeholder="Note" value={l.note} onChange={(e) => patchPret({ lenders: data.pret.lenders.map((x) => x.id === l.id ? { ...x, note: e.target.value } : x) })} className="mt-2" />
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  const papiersScreen = () => (
    <div>
      <Head title="Administratif" sub="Papiers, diagnostics & assurances" />
      <Card onClick={() => setScreen("achat")} className="flex items-center gap-2.5 mb-4">
        <div className="rounded-lg p-1.5" style={{ backgroundColor: C.sageLight }}><FileText size={16} style={{ color: C.sageDark }} /></div>
        <span className="text-sm font-medium" style={{ color: C.ink }}>Achat & compromis</span>
        <ChevronRight size={16} className="ml-auto" style={{ color: C.muted }} />
      </Card>
      <div className="flex items-center justify-between mb-2"><p className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Papiers</p>
        <AddBtn label="Document" onClick={() => add("documents", { nom: "Nouveau document", categorie: "Autre", statut: "Manquant" })} /></div>
      <div className="space-y-2 mb-5">
        {data.documents.map((doc) => { const c = statutColor(doc.statut); return (
          <Card key={doc.id} className="flex items-center gap-3">
            <FileText size={18} style={{ color: C.sageDark }} className="shrink-0" />
            <div className="flex-1 min-w-0"><Bare value={doc.nom} onChange={(e) => patch("documents", doc.id, { nom: e.target.value })} className="font-medium" /><p className="text-xs" style={{ color: C.muted }}>{doc.categorie}</p></div>
            <button onClick={() => patch("documents", doc.id, { statut: doc.statut === "Reçu" ? "Manquant" : "Reçu" })}><Badge bg={c.bg} fg={c.fg}>{doc.statut}</Badge></button>
            <button onClick={() => del("documents", doc.id)}><Trash2 size={16} style={{ color: C.muted }} /></button>
          </Card>
        ); })}
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Diagnostics</p>
      <div className="grid md:grid-cols-2 gap-2.5 mb-5">
        {data.diagnostics.map((dg) => { const g = dg.gravite === "haut" ? { bg: C.clayLight, fg: C.clayDark } : dg.gravite === "ok" ? { bg: C.sageLight, fg: C.sageDark } : { bg: C.amberBg, fg: C.amberFg }; return (
          <Card key={dg.id}><div className="flex items-center gap-2 mb-1"><span className="font-semibold text-sm" style={{ color: C.ink }}>{dg.type}</span><Badge bg={g.bg} fg={g.fg}>{dg.gravite === "ok" ? "conforme" : dg.gravite === "haut" ? "à traiter" : "vigilance"}</Badge></div><p className="text-sm" style={{ color: C.muted }}>{dg.conclusion}</p></Card>
        ); })}
      </div>

      <div className="flex items-center justify-between mb-2"><p className="text-xs font-semibold uppercase tracking-wide" style={{ color: C.muted }}>Assurances</p>
        <AddBtn label="Assurance" onClick={() => add("assurances", { type: "Nouvelle assurance", compagnie: "", statut: "À souscrire", cout: "", echeance: "", note: "" })} /></div>
      <div className="space-y-2">
        {data.assurances.map((a) => { const c = statutColor(a.statut); return (
          <Card key={a.id}>
            <div className="flex items-center gap-2 mb-2"><ShieldCheck size={18} style={{ color: C.sageDark }} className="shrink-0" /><Bare value={a.type} onChange={(e) => patch("assurances", a.id, { type: e.target.value })} className="font-semibold" /><Badge bg={c.bg} fg={c.fg}>{a.statut}</Badge><button onClick={() => del("assurances", a.id)}><Trash2 size={16} style={{ color: C.muted }} /></button></div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              <Field placeholder="Compagnie" value={a.compagnie} onChange={(e) => patch("assurances", a.id, { compagnie: e.target.value })} />
              <Field placeholder="Statut" value={a.statut} onChange={(e) => patch("assurances", a.id, { statut: e.target.value })} />
              <Field placeholder="Coût/an" value={a.cout} onChange={(e) => patch("assurances", a.id, { cout: e.target.value })} />
              <Field type="date" value={a.echeance} onChange={(e) => patch("assurances", a.id, { echeance: e.target.value })} />
            </div>
            <Field placeholder="Note" value={a.note} onChange={(e) => patch("assurances", a.id, { note: e.target.value })} className="mt-2" />
          </Card>
        ); })}
      </div>
    </div>
  );

  const depensesScreen = () => (
    <div>
      <Head title="Dépenses faites" sub={"Réel : " + eur(depense) + " · budget prévu : " + eur(budgetTravaux)} back={() => setScreen("dashboard")}
        action={<AddBtn label="Dépense" onClick={() => add("depenses", { libelle: "Nouvelle dépense", montant: 0, date: new Date().toISOString().slice(0, 10), pieceId: "", categorie: "Travaux" })} />} />
      <Card className="mb-4"><p className="text-sm mb-1" style={{ color: C.muted }}>Budget prévu vs dépensé</p><Progress v={budgetTravaux > 0 ? (depense / budgetTravaux) * 100 : 0} /><p className="text-xs mt-1" style={{ color: C.muted }}>{eur(depense)} sur {eur(budgetTravaux)}</p></Card>
      <div className="space-y-2">
        {data.depenses.length === 0 && <Card><p className="text-sm" style={{ color: C.muted }}>Aucune dépense enregistrée. Ajoute-en une pour suivre le réel. 🌿</p></Card>}
        {data.depenses.map((x) => (
          <Card key={x.id}>
            <div className="flex items-center gap-2 mb-2">
              <Bare value={x.libelle} onChange={(e) => patch("depenses", x.id, { libelle: e.target.value })} className="font-medium flex-1 min-w-0" />
              <Field type="number" value={x.montant} onChange={(e) => patch("depenses", x.id, { montant: e.target.value })} className="w-28 shrink-0" />
              <button onClick={() => del("depenses", x.id)} className="shrink-0"><Trash2 size={16} style={{ color: C.muted }} /></button>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <select value={x.pieceId} onChange={(e) => patch("depenses", x.id, { pieceId: e.target.value })} className="text-xs rounded-lg border px-1.5 py-1" style={{ borderColor: C.line, color: C.muted, backgroundColor: "#FCFCF8" }}><option value="">— Pièce —</option>{data.pieces.map((p) => <option key={p.id} value={p.id}>{p.nom}</option>)}</select>
              <input type="date" value={x.date} onChange={(e) => patch("depenses", x.id, { date: e.target.value })} className="text-xs rounded-lg border px-1.5 py-1" style={{ borderColor: C.line, color: C.muted, backgroundColor: "#FCFCF8" }} />
              {x.sourceCourseId && <Badge bg={C.sageLight} fg={C.sageDark}>depuis courses</Badge>}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const coursesScreen = () => {
    const byPiece = (pid) => data.courses.filter((c) => c.pieceId === pid);
    const globales = data.courses.filter((c) => !c.pieceId);
    const piecesAvec = data.pieces.filter((p) => byPiece(p.id).length > 0);
    return (
      <div>
        <Head title="Liste de courses" sub="Fusion des listes de chaque pièce + générales" back={() => setScreen("dashboard")}
          action={<AddBtn label="Article" onClick={() => add("courses", { article: "Nouvel article", categorie: "Matériaux", qte: "", ou: "", prix: 0, achete: false, pieceId: "" })} />} />
        {globales.length > 0 && <><p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>Général</p><div className="space-y-2 mb-4">{globales.map((c) => courseRow(c))}</div></>}
        {piecesAvec.map((p) => (
          <div key={p.id} className="mb-4"><p className="text-xs font-semibold uppercase tracking-wide mb-2" style={{ color: C.muted }}>{p.nom}</p><div className="space-y-2">{byPiece(p.id).map((c) => courseRow(c))}</div></div>
        ))}
        {data.courses.length === 0 && <Card><p className="text-sm" style={{ color: C.muted }}>Liste vide. Ajoute des articles ici ou depuis chaque pièce. 🌿</p></Card>}
      </div>
    );
  };

  const tachesScreen = () => {
    const sorted = [...data.todos].sort((a, b) => ({ haute: 0, moyenne: 1, basse: 2 }[a.priorite] - { haute: 0, moyenne: 1, basse: 2 }[b.priorite]));
    return (
      <div>
        <Head title="Toutes les tâches" sub="Priorité + attribution Line / William" back={() => setScreen("dashboard")}
          action={<AddBtn label="Tâche" onClick={() => add("todos", { titre: "Nouvelle tâche", priorite: "moyenne", assignee: me, statut: "À faire", echeance: "", pieceId: "", corpsId: "" })} />} />
        <div className="space-y-2">{sorted.map((t) => taskRow(t))}</div>
      </div>
    );
  };

  const moodboardScreen = () => (
    <div>
      <Head title="Moodboard" sub="Toutes les inspirations" back={() => setScreen("dashboard")}
        action={<AddBtn label="Inspi" onClick={() => add("moodboard", { pieceId: "", titre: "Nouvelle inspi", couleur: "#8FA57B", image: "", lien: "", note: "" })} />} />
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">{data.moodboard.map((m) => moodCard(m))}</div>
    </div>
  );

  const liensScreen = () => (
    <div>
      <Head title="Liens utiles" back={() => setScreen("dashboard")} action={<AddBtn label="Lien" onClick={() => add("liens", { titre: "Nouveau lien", url: "https://", categorie: "Autre" })} />} />
      <div className="space-y-2">
        {data.liens.map((l) => (
          <Card key={l.id} className="flex items-center gap-2.5">
            <Link2 size={17} style={{ color: C.sageDark }} className="shrink-0" />
            <div className="flex-1 min-w-0"><Bare value={l.titre} onChange={(e) => patch("liens", l.id, { titre: e.target.value })} className="font-medium" /><Bare value={l.url} onChange={(e) => patch("liens", l.id, { url: e.target.value })} className="text-xs" style={{ color: C.sage }} /></div>
            <a href={l.url} target="_blank" rel="noreferrer"><ChevronRight size={18} style={{ color: C.muted }} /></a>
            <button onClick={() => del("liens", l.id)}><Trash2 size={16} style={{ color: C.muted }} /></button>
          </Card>
        ))}
      </div>
    </div>
  );

  const achatScreen = () => (
    <div>
      <Head title="Achat & compromis" sub={"Réf. " + data.meta.ref + " · échéance " + data.meta.deadline} back={() => setScreen("papiers")} />
      <Card className="mb-4">
        {[["Prix vendeur", data.meta.prixVendeur], ["Honoraires d'agence (4,5 %)", data.meta.honoraires], ["Frais de notaire (est.)", data.meta.fraisNotaire]].map(([l, v]) => (
          <div key={l} className="flex justify-between py-1.5 text-sm border-b" style={{ borderColor: C.line }}><span style={{ color: C.muted }}>{l}</span><span className="font-medium" style={{ color: C.ink }}>{eur(v)}</span></div>
        ))}
        <div className="flex justify-between pt-2.5 text-sm font-semibold" style={{ color: C.sageDark }}><span>Tout frais compris</span><span>{eur(data.meta.totalAllIn)}</span></div>
      </Card>
      <Card style={{ backgroundColor: C.clayLight, borderColor: "#E7C6B6" }}>
        <div className="flex items-center gap-2 mb-3"><AlertTriangle size={16} style={{ color: C.clayDark }} /><p className="font-semibold text-sm" style={{ color: C.clayDark }}>Corrections avant signature</p></div>
        <div className="space-y-2">
          {data.corrections.map((c) => (
            <div key={c.id} className="flex items-start gap-2 text-sm">
              <button onClick={() => patch("corrections", c.id, { done: !c.done })} className="mt-0.5">{c.done ? <CheckCircle2 size={18} style={{ color: C.sageDark }} /> : <Circle size={18} style={{ color: "#C89A86" }} />}</button>
              <span style={{ color: "#7A3A24", textDecoration: c.done ? "line-through" : "none" }}>{c.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  const screens = {
    dashboard, pieces: listePieces, piece: pieceDetail, structure: structureScreen, corps: corpsDetail,
    pret: pretScreen, papiers: papiersScreen, depenses: depensesScreen, courses: coursesScreen,
    taches: tachesScreen, moodboard: moodboardScreen, liens: liensScreen, achat: achatScreen,
  };

  const NAV = [["dashboard", "Accueil", Home], ["pieces", "Pièces", LayoutGrid], ["structure", "Structure", Wrench], ["pret", "Prêt", Wallet], ["papiers", "Papiers", FileText]];
  const activeTab = ["piece"].includes(screen) ? "pieces" : ["corps"].includes(screen) ? "structure" : screen;

  return (
    <div className="min-h-screen w-full" style={{ backgroundColor: C.bg, color: C.ink, fontFamily: "ui-sans-serif, system-ui, -apple-system, 'Segoe UI', sans-serif" }}>
      <input ref={fileRef} type="file" accept="image/*" onChange={onFile} className="hidden" />
      <main className="max-w-2xl mx-auto w-full px-4 pt-5 pb-28">{(screens[screen] || dashboard)()}</main>

      {/* bottom nav */}
      <nav className="fixed bottom-0 inset-x-0 z-30 border-t" style={{ backgroundColor: C.card, borderColor: C.line }}>
        <div className="max-w-2xl mx-auto flex">
          {NAV.map(([id, label, Ic]) => {
            const on = activeTab === id;
            return (
              <button key={id} onClick={() => { setScreen(id); }} className="flex-1 flex flex-col items-center gap-0.5 py-2.5">
                <Ic size={20} style={{ color: on ? C.sageDark : C.muted }} />
                <span className="text-xs" style={{ color: on ? C.sageDark : C.muted, fontWeight: on ? 600 : 400 }}>{label}</span>
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
