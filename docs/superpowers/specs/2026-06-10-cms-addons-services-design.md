# Design — Add-ons & Services éditables par le propriétaire (CMS)

Date : 2026-06-10
Statut : validé (direction approuvée par l'utilisateur)

## 1. Contexte & objectif

Le site PhotoRoots est vendu à un client (le « propriétaire »). L'objectif est que
le propriétaire puisse gérer **seul**, via le dashboard admin (« Power CMS v3.0 »),
deux contenus aujourd'hui figés dans le code :

1. **Les options à louer (add-ons)** — éléments additionnels facturés en plus d'une
   formule (livre d'or, clé USB, branding écran, heures sup…), chacun avec
   nom + prix + description.
2. **Les cartes « Services »** — les vignettes Mariage / Entreprise / Anniversaire…
   de la page d'accueil (titre + description + icône).

### Découverte importante
Ces deux contenus existent déjà mais **codés en dur** :
- Add-ons : tableau `options` dans `src/pages/Tarifs.jsx` (~ligne 280), avec déjà la
  sélection, le calcul du total et la barre sticky.
- Services : tableau `DEFAULT_SERVICES` dans `src/pages/Home.jsx` (~ligne 251). La page
  lit `content.services` **uniquement** s'il contient ≥ 4 items, sinon le tableau
  codé en dur l'emporte.

Le travail consiste donc à **faire passer ces deux contenus sous contrôle du CMS**,
en suivant le modèle existant (un tableau dans `content` + un module dashboard).

## 2. Périmètre

**Inclus**
- Modèle de données `content.addons` + module dashboard « Options à louer » (CRUD).
- Page Tarifs lit `content.addons` au lieu du tableau codé en dur.
- Formulaire de devis : section « Options souhaitées » (cases à cocher) ; les options
  choisies remontent dans le lead (dashboard) et dans les emails.
- Modèle de données `content.services` enrichi (icône) + module dashboard « Services » (CRUD).
- Page d'accueil lit `content.services` directement (suppression de la condition « ≥ 4 »).
- Mise à jour du backend email (Google Apps Script) pour afficher les options.

**Exclu (inchangé)**
- Pages de ville (`location-photobooth-*`), articles de blog, SEO, prerender, sitemap.
  → **Aucun risque référencement.**
- Pas d'image par add-on, pas de réordonnancement par glisser-déposer (ordre = ordre
  de création). YAGNI.

## 3. Architecture

Aucune nouvelle infrastructure. On réutilise le pattern existant :
- Tout le contenu éditable vit dans un objet `content` unique, persisté dans Supabase
  (table `site_content`, colonne `content` jsonb) + cache `localStorage`, via
  `updateContent(...)` dans `src/context/ContentContext.jsx`.
- Chaque module du dashboard lit/écrit une clé de `content` et affiche un bouton
  « Enregistrer » (`SaveBar`).

### 3.1 Modèle de données

```js
// content.addons — NOUVEAU (migré depuis Tarifs.jsx)
addons: [
  { id: 'guestbook', name: "Livre d'or Premium", price: 39, desc: 'Avec collages et stylos', enabled: true },
  { id: 'usb',       name: 'Clé USB souvenirs',  price: 15, desc: 'Toutes les photos en HD', enabled: true },
  { id: 'branding',  name: 'Branding Écran',     price: 29, desc: 'Votre logo sur l’interface', enabled: true },
]

// content.services — ENRICHI (migré depuis Home.jsx DEFAULT_SERVICES)
services: [
  { id: 'wedding',   icon: 'wedding',   title: 'Mariage',            desc: '…' },
  { id: 'corporate', icon: 'corporate', title: 'Entreprise',         desc: '…' },
  { id: 'birthday',  icon: 'birthday',  title: 'Anniversaire',       desc: '…' },
  { id: 'baptism',   icon: 'baptism',   title: 'Baptême',            desc: '…' },
  { id: 'hen',       icon: 'hen',       title: 'EVJF / EVG',         desc: '…' },
  { id: 'seminar',   icon: 'seminar',   title: 'Séminaire',          desc: '…' },
  { id: 'prom',      icon: 'prom',      title: 'Bal de promo',       desc: '…' },
  { id: 'xmas',      icon: 'xmas',      title: "Noël d'entreprise",  desc: '…' },
]
```

`price` est un **nombre** (le calcul du total dans Tarifs fait une addition).
`icon` est une **clé** parmi la liste connue (cf. 3.4) ; une clé inconnue retombe sur
l'icône `Sparkles`.

### 3.2 Valeurs par défaut & fusion (`ContentContext.jsx`)

- Ajouter `addons: [...]` dans `DEFAULT_CONTENT`.
- Remplacer `DEFAULT_CONTENT.services` (actuellement 3 items `{title, desc}`) par la
  liste enrichie à 8 items ci-dessus.
- Dans `buildMergedContent` :
  - ajouter la ligne `addons: parsed.addons || DEFAULT_CONTENT.addons`.
  - la ligne `services: parsed.services || DEFAULT_CONTENT.services` existe déjà : elle
    bénéficiera automatiquement du nouveau défaut.

Conséquence : `content.addons` et `content.services` sont **toujours** présents après
fusion (y compris en prerender/offline), ce qui simplifie les pages consommatrices.

### 3.3 Module « Options à louer » (`AddonsManager`)

Nouveau composant exporté depuis `src/components/admin/CMSModules.jsx`, calqué sur
`FAQMaster` / `PriceArchitect` :
- Liste les `content.addons`. Pour chaque option : champ **nom** (texte), **prix**
  (nombre), **description** (texte), interrupteur **actif** (`enabled`), bouton
  **supprimer**.
- Bouton **« + Ajouter une option »** → pousse `{ id: 'opt-'+Date.now(), name:'Nouvelle option', price:0, desc:'', enabled:true }`.
- Écrit via `updateContent({ addons: ... })`. `SaveBar` en bas.

### 3.4 Module « Services » (`ServicesManager`)

Nouveau composant exporté depuis `CMSModules.jsx` :
- Liste les `content.services`. Pour chaque service : **titre** (texte),
  **description** (texte), **icône** (menu déroulant), bouton **supprimer**.
- Menu déroulant d'icônes = les clés connues : `wedding, corporate, birthday, baptism,
  hen, seminar, prom, xmas` (libellés FR lisibles dans le select).
- Bouton **« + Ajouter un service »**.
- Écrit via `updateContent({ services: ... })`. `SaveBar` en bas.

> Note : la `ICON_MAP` (clé → composant lucide) reste dans `Home.jsx`. La même liste de
> clés est dupliquée dans le module ; on documente ce couplage par un commentaire dans
> les deux fichiers (source de vérité = `Home.jsx`).

### 3.5 Intégration au dashboard (`AdminSidebar.jsx`)

- Importer `AddonsManager` et `ServicesManager` depuis `./admin/CMSModules`.
- Ajouter deux entrées de menu :
  - `{ id: 'addons',   label: 'Options à louer', icon: PlusCircle, category: 'BUSINESS' }`
    (à côté de « Tarifs & Plans »).
  - `{ id: 'services', label: 'Services',         icon: Sparkles,   category: 'CONTENU' }`.
  - Importer `PlusCircle` et `Sparkles` depuis `lucide-react` en tête de fichier.
- Ajouter les deux `case` dans le `switch` de `renderContent()`.

### 3.6 Page Tarifs (`src/pages/Tarifs.jsx`)

- Supprimer le tableau `options` codé en dur.
- Le remplacer par : `const options = (content.addons || []).filter(o => o.enabled !== false);`
- Si `options.length === 0`, **ne pas afficher** la section « Personnalisez votre pack ».
- `toggleOption`, `calculateTotal`, la barre sticky : inchangés (mêmes champs
  `id/name/price/desc`).

### 3.7 Page d'accueil (`src/pages/Home.jsx`)

- Supprimer le `DEFAULT_SERVICES` local et la condition `content.services.length >= 4`.
- Utiliser directement `const services = content.services || [];` (le contexte garantit
  la présence ; garder le `|| []` par sécurité).
- `ICON_MAP` et le rendu marquee : inchangés.

## 4. Flux de données — option dans le devis

Fichier : `src/pages/Contact.jsx`.

1. `formData` : ajouter `addons: []` (tableau d'`id` sélectionnés).
2. UI (étape 2, après le choix de formule) : section **« Options souhaitées »** rendant
   `content.addons` filtré sur `enabled`, en cases à cocher (même style que les chips de
   formule). Un clic ajoute/retire l'`id` dans `formData.addons`.
3. À la soumission (`handleSubmit`) :
   - calculer
     `const selected = (content.addons||[]).filter(a => formData.addons.includes(a.id));`
     `const addonsText = selected.map(a => a.name + ' (' + a.price + '€)').join(', ');`
   - ajouter à `autoMessage` la ligne `addonsText ? 'Options souhaitées : ' + addonsText : null`.
   - ajouter `addons: addonsText` à l'objet `booking` (payload vers le script).
   - ajouter `addons: addonsText` à l'objet `newMessage` (lead stocké dans
     `content.messages`).
4. Récap de confirmation (`SummaryRow`) : afficher une ligne « Options » si `addonsText`
   (optionnel, cosmétique).

Résultat :
- **Dashboard (lead)** : les options apparaissent automatiquement (via `fullMessage`).
- **Email propriétaire** : apparaissent via le bloc « Message » (déjà présent) — sans
  redéploiement.
- **Email client + Google Calendar** : nécessitent l'ajout au script (cf. §5).

## 5. Backend email (`google-apps-script/booking-api.gs`)

Pour afficher proprement les options dans **l'email client** et **l'événement Calendar** :
- `sendClientEmail` : ajouter au tableau `rows` la ligne
  `['Options souhaitées', data.addons || '—']`.
- `sendOwnerEmail` : idem (ligne propre, en plus du bloc message).
- `createCalendarEvent` : ajouter à `description` la ligne
  `'Options : ' + (data.addons || 'Aucune')`.

> ⚠️ **Action manuelle requise de l'utilisateur** : le script Google Apps Script doit
> être **recollé et redéployé** sur script.google.com (procédure déjà décrite en tête du
> fichier `.gs`). L'URL ne change pas ; rien à modifier côté Vercel. Tant que ce n'est
> pas redéployé : les options restent visibles dans le dashboard et l'email
> propriétaire, mais pas dans l'email client ni le Calendar.

## 6. Impact SEO / prerender

Aucun. Les pages modifiées (Accueil, Tarifs, Contact) sont déjà prérendues ; elles
liront `content` exactement comme aujourd'hui. On ne touche ni aux routes, ni au
sitemap, ni aux pages de ville/blog.

## 7. Compatibilité & migration

- Les sites déjà en production ont un `content` sans `addons` et avec un `services`
  potentiellement à 3 items : la fusion par défaut (§3.2) injecte les nouveaux défauts
  sans écraser d'éventuelles personnalisations.
- Aucun script de migration de données nécessaire.

## 8. Validation / tests

- `npm run build:spa` doit passer.
- Manuel (dev server) :
  - Dashboard → « Options à louer » : ajouter / éditer / désactiver / supprimer ; vérifier
    le reflet immédiat sur la page Tarifs (option active/inactive, prix dans le total).
  - Dashboard → « Services » : éditer titre/desc/icône, ajouter, supprimer ; vérifier le
    marquee d'accueil.
  - Devis : cocher des options → vérifier le récap, le lead dans le dashboard, et (après
    redeploy script) l'email client.
- Vérifier l'absence de régression sur la sélection de pack / barre sticky / total.

## 9. Fichiers touchés (récap)

| Fichier | Nature |
|---|---|
| `src/context/ContentContext.jsx` | défauts `addons` + `services` enrichis + fusion |
| `src/components/admin/CMSModules.jsx` | + `AddonsManager`, + `ServicesManager` |
| `src/components/AdminSidebar.jsx` | imports, 2 entrées menu, 2 `case` |
| `src/pages/Tarifs.jsx` | lit `content.addons` |
| `src/pages/Home.jsx` | lit `content.services` (retrait du gate ≥ 4) |
| `src/pages/Contact.jsx` | section options + propagation lead/email |
| `google-apps-script/booking-api.gs` | options dans email client + owner + calendar (redeploy manuel) |

## 10. Étapes opérationnelles post-déploiement

1. Déployer le code (push → Vercel).
2. Recoller + redéployer le Google Apps Script (pour les options dans l'email client/Calendar).
3. Briefer le propriétaire : où trouver « Options à louer » et « Services » dans le dashboard.
