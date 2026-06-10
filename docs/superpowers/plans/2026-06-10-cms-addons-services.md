# Add-ons & Services éditables (CMS) — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rendre les add-ons (options à louer) et les cartes Services entièrement gérables par le propriétaire via le dashboard CMS, sans intervention développeur.

**Architecture:** On réutilise le pattern CMS existant — tout vit dans l'objet `content` (Supabase `site_content` jsonb) édité via `updateContent(...)`. Deux contenus aujourd'hui codés en dur (`options` dans Tarifs, `DEFAULT_SERVICES` dans Home) deviennent des clés de `content` (`addons`, `services` enrichi), chacune pilotée par un nouveau module dashboard. Le formulaire de devis lit `content.addons` et propage les options choisies vers le lead et les emails.

**Tech Stack:** React 19, Vite, react-router-dom v7, Supabase (jsonb), lucide-react, Google Apps Script (Resend).

> **Note vérification (pas de framework de test) :** ce projet n'a pas de runner de tests (`package.json` = `lint`/`build`/`build:spa`/`prerender`). Chaque tâche se vérifie par `npm run build:spa` (compilation) + un contrôle manuel ciblé dans `npm run dev`. C'est la voie de validation réelle du projet ; on n'introduit pas de suite de tests (hors périmètre).

---

## Task 1 : Modèle de données — defaults `addons` + `services` enrichi + fusion

**Files:**
- Modify: `src/context/ContentContext.jsx` (DEFAULT_CONTENT ~13-17 et 46-84 ; buildMergedContent ~159-172)

- [ ] **Step 1 : Enrichir le défaut `services` dans `DEFAULT_CONTENT`**

Remplacer le bloc `services` actuel (les 3 items `{title, desc}`) par la liste enrichie à 8 items (mêmes libellés/descriptions que `DEFAULT_SERVICES` de `Home.jsx`) :

```js
  services: [
    { id: 'wedding',   icon: 'wedding',   title: 'Mariage',            desc: 'Des souvenirs inoubliables pour le plus beau jour.' },
    { id: 'corporate', icon: 'corporate', title: 'Entreprise',         desc: "Soirées d'entreprise, inaugurations, salons." },
    { id: 'birthday',  icon: 'birthday',  title: 'Anniversaire',       desc: 'Petits et grands, rires garantis en famille.' },
    { id: 'baptism',   icon: 'baptism',   title: 'Baptême',            desc: 'Un souvenir tendre pour les plus beaux moments.' },
    { id: 'hen',       icon: 'hen',       title: 'EVJF / EVG',         desc: "L'ambiance idéale pour célébrer entre amis." },
    { id: 'seminar',   icon: 'seminar',   title: 'Séminaire',          desc: "Cohésion d'équipe et team-building animés." },
    { id: 'prom',      icon: 'prom',      title: 'Bal de promo',       desc: 'Immortalisez la fin de vos études en beauté.' },
    { id: 'xmas',      icon: 'xmas',      title: "Noël d'entreprise",  desc: 'Ambiance festive garantie pour vos collaborateurs.' },
  ],
```

- [ ] **Step 2 : Ajouter le défaut `addons` dans `DEFAULT_CONTENT`**

Juste après le bloc `pricing_plans: [ ... ],` (avant `theme:`), insérer :

```js
  addons: [
    { id: 'guestbook', name: "Livre d'or Premium", price: 39, desc: 'Avec collages et stylos', enabled: true },
    { id: 'usb',       name: 'Clé USB souvenirs',  price: 15, desc: 'Toutes les photos en HD', enabled: true },
    { id: 'branding',  name: 'Branding Écran',     price: 29, desc: "Votre logo sur l'interface", enabled: true },
  ],
```

- [ ] **Step 3 : Migrer + fusionner dans `buildMergedContent`**

Dans l'objet `merged`, **remplacer** la ligne existante
`services: parsed.services || DEFAULT_CONTENT.services,`
par une migration qui détecte l'ancien format (items sans `icon`) et le remplace par le nouveau défaut, puis **ajouter** la fusion `addons` juste en dessous :

```js
    // Migration : l'ancien format de services (sans `icon`) est remplacé par le
    // nouveau défaut enrichi. Une liste éditée via le CMS (avec `icon`) est conservée.
    services: (() => {
      const stored = parsed.services;
      if (!Array.isArray(stored) || stored.length === 0 || !stored[0].icon) {
        return DEFAULT_CONTENT.services;
      }
      return stored;
    })(),
    addons: parsed.addons || DEFAULT_CONTENT.addons,
```

- [ ] **Step 4 : Compiler**

Run: `npm run build:spa`
Expected: build OK (`✓ built in …`), aucune erreur.

- [ ] **Step 5 : Commit**

```bash
git add src/context/ContentContext.jsx
git commit -m "CMS : defaults addons + services enrichi (icônes) + migration"
```

---

## Task 2 : Page Tarifs lit `content.addons`

**Files:**
- Modify: `src/pages/Tarifs.jsx` (const `options` ~280-284 ; `calculateTotal` ~293-303 ; section add-ons ~725)

- [ ] **Step 1 : Remplacer le tableau codé en dur par la lecture du CMS**

Supprimer le bloc :

```js
  const options = [
    { id: 'guestbook', name: 'Livre d\'or Premium', price: 39, desc: 'Avec collages et stylos' },
    { id: 'usb', name: 'Clé USB souvenirs', price: 15, desc: 'Toutes les photos en HD' },
    { id: 'branding', name: 'Branding Écran', price: 29, desc: 'Votre logo sur l\'interface' },
  ];
```

et le remplacer par :

```js
  // Options à la carte gérées via le CMS (dashboard → « Options à louer »).
  const options = (content.addons || []).filter(o => o.enabled !== false);
```

- [ ] **Step 2 : Rendre le total robuste (prix numérique)**

Dans `calculateTotal`, remplacer la ligne d'addition des options :

```js
      return total + (option ? option.price : 0);
```

par :

```js
      return total + (option ? (Number(option.price) || 0) : 0);
```

- [ ] **Step 3 : Masquer la section si aucune option active**

Modifier la condition d'affichage de la section « OPTIONS ADD-ONS » :

```js
      {selectedPlanId !== null && !plans.find(p => p.id === selectedPlanId)?.isCustom && (
```

en :

```js
      {selectedPlanId !== null && options.length > 0 && !plans.find(p => p.id === selectedPlanId)?.isCustom && (
```

- [ ] **Step 4 : Compiler + vérifier manuellement**

Run: `npm run build:spa` → OK
Run: `npm run dev`, ouvrir `/tarifs`, sélectionner un pack non « Sur-Mesure » : la section « Personnalisez votre pack » affiche les 3 options ; cocher une option augmente le total dans la barre sticky du bon montant.

- [ ] **Step 5 : Commit**

```bash
git add src/pages/Tarifs.jsx
git commit -m "Tarifs : options à la carte lues depuis le CMS (content.addons)"
```

---

## Task 3 : Page d'accueil lit `content.services`

**Files:**
- Modify: `src/pages/Home.jsx` (~245-263)

- [ ] **Step 1 : Supprimer le tableau codé en dur et le gate « ≥ 4 »**

Dans l'IIFE de la section Services, supprimer le `const DEFAULT_SERVICES = [ ... ]` (8 lignes) **et** remplacer :

```js
          const services = (content.services && content.services.length >= 4)
            ? content.services
            : DEFAULT_SERVICES;
```

par :

```js
          // Services gérés via le CMS (dashboard → « Services »). ICON_MAP ci-dessus
          // reste la source de vérité des clés d'icônes disponibles.
          const services = content.services || [];
```

Conserver `ICON_MAP`, `loop`, et tout le rendu marquee inchangés.

- [ ] **Step 2 : Compiler + vérifier manuellement**

Run: `npm run build:spa` → OK
Run: `npm run dev`, ouvrir `/` : le marquee « Pour chaque occasion » affiche les 8 services avec leurs icônes (Mariage cœur, Entreprise mallette, etc.), défilement infini intact.

- [ ] **Step 3 : Commit**

```bash
git add src/pages/Home.jsx
git commit -m "Accueil : cartes Services lues depuis le CMS (content.services)"
```

---

## Task 4 : Module dashboard « Options à louer » (`AddonsManager`)

**Files:**
- Modify: `src/components/admin/CMSModules.jsx` (ajout d'un export ; imports d'icônes en tête ~2-29)

- [ ] **Step 1 : S'assurer des imports d'icônes**

En tête de `CMSModules.jsx`, vérifier que `Plus`, `Trash2`, `Check` sont importés (ils le sont déjà). Aucun nouvel import nécessaire pour ce module.

- [ ] **Step 2 : Ajouter le composant `AddonsManager`**

Ajouter, après le composant `PriceArchitect` (juste avant `/* FAQ MASTER */`), le bloc complet :

```jsx
/* ========================================== */
/* ➕ ADDONS MANAGER (Options à louer)        */
/* ========================================== */
export const AddonsManager = () => {
  const { content, updateContent, saveStatus } = useContent();
  const addons = content.addons || [];

  const updateAddon = (idx, field, value) => {
    const next = [...addons];
    const v = field === 'price' ? (Number(String(value).replace(/[^0-9]/g, '')) || 0) : value;
    next[idx] = { ...next[idx], [field]: v };
    updateContent({ addons: next });
  };

  const toggleEnabled = (idx) => {
    const next = [...addons];
    next[idx] = { ...next[idx], enabled: next[idx].enabled === false ? true : false };
    updateContent({ addons: next });
  };

  const addAddon = () => {
    updateContent({ addons: [...addons, { id: 'opt-' + Date.now(), name: 'Nouvelle option', price: 0, desc: '', enabled: true }] });
  };

  const deleteAddon = (idx) => {
    updateContent({ addons: addons.filter((_, i) => i !== idx) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Options à louer</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Gérez les options à la carte proposées en plus des formules (page Tarifs + formulaire de devis).</p>
        </div>
        <button onClick={addAddon} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <Plus size={16} /> Ajouter une option
        </button>
      </header>

      {addons.length === 0 ? (
        <div className="cms-card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          Aucune option pour le moment. Cliquez sur « Ajouter une option ».
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {addons.map((opt, i) => (
            <section key={opt.id} className="cms-card" style={{ opacity: opt.enabled === false ? 0.55 : 1 }}>
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>NOM</label>
                      <input type="text" className="cms-input" value={opt.name} onChange={(e) => updateAddon(i, 'name', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>PRIX (€)</label>
                      <input type="text" inputMode="numeric" className="cms-input" value={opt.price} onChange={(e) => updateAddon(i, 'price', e.target.value)} />
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>DESCRIPTION</label>
                    <input type="text" className="cms-input" value={opt.desc} onChange={(e) => updateAddon(i, 'desc', e.target.value)} />
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px', fontWeight: 600, color: '#cbd5e1', cursor: 'pointer' }}>
                    <input type="checkbox" checked={opt.enabled !== false} onChange={() => toggleEnabled(i)} />
                    Option active (visible sur le site)
                  </label>
                </div>
                <button onClick={() => deleteAddon(i)} title="Supprimer" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
      <SaveBar status={saveStatus} onSave={() => updateContent({})} />
    </div>
  );
};
```

- [ ] **Step 3 : Compiler**

Run: `npm run build:spa`
Expected: build OK (le composant est exporté mais pas encore monté — vérifie juste la compilation).

- [ ] **Step 4 : Commit**

```bash
git add src/components/admin/CMSModules.jsx
git commit -m "CMS : module Options à louer (AddonsManager)"
```

---

## Task 5 : Module dashboard « Services » (`ServicesManager`)

**Files:**
- Modify: `src/components/admin/CMSModules.jsx` (ajout d'un export, après `AddonsManager`)

- [ ] **Step 1 : Ajouter le composant `ServicesManager`**

Ajouter, juste après `AddonsManager`, le bloc complet :

```jsx
/* ========================================== */
/* ✨ SERVICES MANAGER                         */
/* ========================================== */
// Clés d'icônes — DOIVENT rester alignées avec ICON_MAP dans src/pages/Home.jsx.
const SERVICE_ICON_OPTIONS = [
  { key: 'wedding',   label: 'Mariage (cœur)' },
  { key: 'corporate', label: 'Entreprise (mallette)' },
  { key: 'birthday',  label: 'Anniversaire (gâteau)' },
  { key: 'baptism',   label: 'Baptême (étincelles)' },
  { key: 'hen',       label: 'EVJF / EVG (cadeau)' },
  { key: 'seminar',   label: 'Séminaire (groupe)' },
  { key: 'prom',      label: 'Bal de promo (diplôme)' },
  { key: 'xmas',      label: 'Noël (cotillon)' },
];

export const ServicesManager = () => {
  const { content, updateContent, saveStatus } = useContent();
  const services = content.services || [];

  const updateService = (idx, field, value) => {
    const next = [...services];
    next[idx] = { ...next[idx], [field]: value };
    updateContent({ services: next });
  };

  const addService = () => {
    updateContent({ services: [...services, { id: 'svc-' + Date.now(), icon: 'wedding', title: 'Nouveau service', desc: '' }] });
  };

  const deleteService = (idx) => {
    updateContent({ services: services.filter((_, i) => i !== idx) });
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 800, marginBottom: '8px' }}>Services</h2>
          <p style={{ color: '#64748b', fontSize: '14px' }}>Gérez les types d'événements affichés sur la page d'accueil.</p>
        </div>
        <button onClick={addService} style={{ background: 'var(--primary)', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '12px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
          <Plus size={16} /> Ajouter un service
        </button>
      </header>

      {services.length === 0 ? (
        <div className="cms-card" style={{ textAlign: 'center', padding: '40px 20px', color: '#64748b' }}>
          Aucun service pour le moment. Cliquez sur « Ajouter un service ».
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {services.map((svc, i) => (
            <section key={svc.id || i} className="cms-card">
              <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>TITRE</label>
                      <input type="text" className="cms-input" value={svc.title} onChange={(e) => updateService(i, 'title', e.target.value)} />
                    </div>
                    <div>
                      <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>ICÔNE</label>
                      <select className="cms-input" value={svc.icon || 'wedding'} onChange={(e) => updateService(i, 'icon', e.target.value)}>
                        {SERVICE_ICON_OPTIONS.map(o => (
                          <option key={o.key} value={o.key} style={{ background: '#0f172a' }}>{o.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label style={{ fontSize: '11px', fontWeight: 800, color: '#64748b', display: 'block', marginBottom: '6px' }}>DESCRIPTION</label>
                    <input type="text" className="cms-input" value={svc.desc} onChange={(e) => updateService(i, 'desc', e.target.value)} />
                  </div>
                </div>
                <button onClick={() => deleteService(i)} title="Supprimer" style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', border: 'none', padding: '10px', borderRadius: '8px', cursor: 'pointer', flexShrink: 0 }}>
                  <Trash2 size={16} />
                </button>
              </div>
            </section>
          ))}
        </div>
      )}
      <SaveBar status={saveStatus} onSave={() => updateContent({})} />
    </div>
  );
};
```

- [ ] **Step 2 : Compiler**

Run: `npm run build:spa`
Expected: build OK.

- [ ] **Step 3 : Commit**

```bash
git add src/components/admin/CMSModules.jsx
git commit -m "CMS : module Services (ServicesManager)"
```

---

## Task 6 : Brancher les deux modules dans le dashboard

**Files:**
- Modify: `src/components/AdminSidebar.jsx` (imports lucide ~2-26 ; import CMSModules ~29-45 ; `menuItems` ~52-71 ; `renderContent` switch ~82-101)

- [ ] **Step 1 : Importer les icônes**

Dans le bloc d'import `lucide-react` en tête, ajouter `PlusCircle` et `Sparkles` à la liste (par ex. après `CalendarX,`).

- [ ] **Step 2 : Importer les deux modules**

Dans l'import depuis `'./admin/CMSModules'`, ajouter `AddonsManager,` et `ServicesManager,` à la liste destructurée.

- [ ] **Step 3 : Ajouter les entrées de menu**

Dans `menuItems`, ajouter l'entrée add-ons dans la catégorie `BUSINESS` (après la ligne `tarifs`) :

```js
    { id: 'addons', label: 'Options à louer', icon: PlusCircle, category: 'BUSINESS' },
```

et l'entrée services dans la catégorie `CONTENU` (après la ligne `pagecontent`) :

```js
    { id: 'services', label: 'Services', icon: Sparkles, category: 'CONTENU' },
```

- [ ] **Step 4 : Ajouter les `case` du switch**

Dans `renderContent()`, ajouter :

```js
      case 'addons': return <AddonsManager />;
      case 'services': return <ServicesManager />;
```

- [ ] **Step 5 : Compiler + vérifier manuellement**

Run: `npm run build:spa` → OK
Run: `npm run dev`, se connecter à `/admin`, ouvrir le dashboard :
- Onglet « Options à louer » (BUSINESS) : ajouter/éditer/désactiver/supprimer une option → vérifier le reflet immédiat sur `/tarifs` (option active/inactive, prix dans le total).
- Onglet « Services » (CONTENU) : éditer titre/desc/icône, ajouter, supprimer → vérifier le marquee de `/`.

- [ ] **Step 6 : Commit**

```bash
git add src/components/AdminSidebar.jsx
git commit -m "CMS : entrées dashboard Options à louer + Services"
```

---

## Task 7 : Formulaire de devis — sélection d'options + propagation

**Files:**
- Modify: `src/pages/Contact.jsx` (`formData` ~97-108 ; helper toggle ~207 ; `handleSubmit` ~252-293 ; UI ~910-911)

- [ ] **Step 1 : Ajouter `addons` à l'état du formulaire**

Dans l'objet initial `useState` de `formData`, ajouter le champ (après `referralSource: '',`) :

```js
    addons: [],
```

- [ ] **Step 2 : Ajouter un helper de bascule**

Juste après `const setField = (key, value) => setFormData(prev => ({ ...prev, [key]: value }));`, ajouter :

```js
  const toggleAddon = (id) => setFormData(prev => ({
    ...prev,
    addons: prev.addons.includes(id) ? prev.addons.filter(a => a !== id) : [...prev.addons, id],
  }));
```

- [ ] **Step 3 : Construire le texte des options et le propager (handleSubmit)**

Au début de `handleSubmit`, juste avant la déclaration `const autoMessage = [`, insérer :

```js
    const selectedAddons = (content.addons || []).filter(a => formData.addons.includes(a.id));
    const addonsText = selectedAddons.map(a => `${a.name} (${a.price}€)`).join(', ');
```

Dans le tableau `autoMessage`, ajouter une entrée (après la ligne `formData.formula ? ... : null,`) :

```js
      addonsText ? `Options souhaitées : ${addonsText}` : null,
```

Dans l'objet `booking`, ajouter (après `formula: formData.formula || 'Demande de devis',`) :

```js
      addons: addonsText,
```

Dans l'objet `newMessage`, ajouter (après `formula: formData.formula || 'Demande de devis',`) :

```js
        addons: addonsText,
```

- [ ] **Step 4 : Ajouter la section UI « Options souhaitées »**

Entre la fermeture du groupe « Formule » (`</div>` de la `form-group` qui se termine ligne ~910) et le commentaire `{/* Source */}`, insérer ce bloc (il ne s'affiche que si des options actives existent) :

```jsx
                {/* Options à louer (add-ons) */}
                {(content.addons || []).filter(a => a.enabled !== false).length > 0 && (
                  <div className="form-group">
                    <label className="form-label">Options souhaitées <span style={{ color: 'var(--text-light)', fontWeight: 400 }}>(optionnel)</span></label>
                    <div style={{ display: 'grid', gap: '8px', marginTop: '4px' }}>
                      {(content.addons || []).filter(a => a.enabled !== false).map((a) => {
                        const active = formData.addons.includes(a.id);
                        return (
                          <button
                            type="button"
                            key={a.id}
                            onClick={() => toggleAddon(a.id)}
                            style={{
                              display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px',
                              padding: '14px 16px', borderRadius: 'var(--radius-md)', cursor: 'pointer', textAlign: 'left',
                              background: active ? 'var(--bg-secondary)' : 'var(--bg-app)',
                              border: active ? '2px solid var(--primary)' : '2px solid var(--border-light)',
                              boxShadow: active ? '0 0 0 3px var(--accent-glow)' : 'none',
                              transition: 'all 0.2s',
                            }}
                          >
                            <span style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
                              <span style={{ fontWeight: 800, fontSize: '15px', color: 'var(--text-main)' }}>{a.name}</span>
                              {a.desc && <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>{a.desc}</span>}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                              <span style={{ fontSize: '14px', fontWeight: 800, color: active ? 'var(--primary)' : 'var(--text-muted)' }}>+{a.price}€</span>
                              <span style={{
                                width: '22px', height: '22px', borderRadius: '6px', flexShrink: 0,
                                border: active ? 'none' : '2px solid var(--border-medium)',
                                background: active ? 'var(--primary)' : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                              }}>
                                {active && <CheckCircle2 size={16} color="#fff" />}
                              </span>
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
```

- [ ] **Step 5 : Compiler + vérifier manuellement**

Run: `npm run build:spa` → OK
Run: `npm run dev`, aller sur `/contact`, étape 2 : la section « Options souhaitées » liste les options actives ; en cocher → soumettre une demande de test → dans le dashboard, onglet « Leads / Messages », le message contient la ligne « Options souhaitées : … ».

- [ ] **Step 6 : Commit**

```bash
git add src/pages/Contact.jsx
git commit -m "Devis : sélection des options à louer (lead + email)"
```

---

## Task 8 : Backend email — options dans email client + owner + Calendar

**Files:**
- Modify: `google-apps-script/booking-api.gs` (`createCalendarEvent` ~141-152 ; `sendClientEmail` rows ~175-183 ; `sendOwnerEmail` rows ~216-227)

> ⚠️ Ce fichier n'est pas déployé par Vercel. Après modification, **l'utilisateur doit recoller et redéployer** le script sur script.google.com (procédure en tête du fichier). Jusque-là : options visibles dans le dashboard + email propriétaire (via le bloc Message), mais pas dans l'email client ni le Calendar.

- [ ] **Step 1 : Ajouter les options à la description Calendar**

Dans `createCalendarEvent`, dans la construction de `description`, ajouter une ligne après `'Pack souhaité : ' + (data.formula || 'Non précisé') + '\n' +` :

```js
    'Options : ' + (data.addons || 'Aucune') + '\n' +
```

- [ ] **Step 2 : Ajouter la ligne dans l'email client**

Dans `sendClientEmail`, juste après la déclaration du tableau `const rows = [ ... ];` (avant `const tableRows =`), ajouter :

```js
  if (data.addons) rows.push(['Options souhaitées', data.addons]);
```

- [ ] **Step 3 : Ajouter la ligne dans l'email propriétaire**

Dans `sendOwnerEmail`, juste après la déclaration du tableau `const rows = [ ... ];` (avant `const tableRows =`), ajouter :

```js
  if (data.addons) rows.push(['Options souhaitées', data.addons]);
```

- [ ] **Step 4 : Commit**

```bash
git add google-apps-script/booking-api.gs
git commit -m "Email : options dans confirmation client + notif owner + Calendar"
```

---

## Task 9 : Build final + déploiement

- [ ] **Step 1 : Build complet**

Run: `npm run build:spa`
Expected: build OK, aucune erreur.

- [ ] **Step 2 : Déployer (push vers main → Vercel)**

```bash
git push origin claude/goofy-wozniak:main
```

Expected: push OK ; Vercel déclenche le déploiement automatiquement.

- [ ] **Step 3 : Action manuelle utilisateur (rappel)**

Recoller + redéployer `google-apps-script/booking-api.gs` sur script.google.com (Task 8) pour que les options apparaissent dans l'email **client** et le **Calendar**.

---

## Self-Review (effectué)

- **Couverture du spec :** addons (defaults+merge → T1 ; Tarifs → T2 ; module → T4 ; sidebar → T6 ; devis → T7), services (defaults+migration → T1 ; Home → T3 ; module → T5 ; sidebar → T6), email backend → T8, build+deploy → T9. ✔ Toutes les sections du spec sont couvertes.
- **Ajout vs spec :** migration de l'ancien format `services` (sans `icon`) ajoutée en T1 (sécurité prod non détaillée dans le spec) ; coercition `Number(price)` en T2 (prix add-on numérique). Améliorations cohérentes, pas de dérive de périmètre.
- **Cohérence des types :** `addons[].{id,name,price:number,desc,enabled}` et `services[].{id,icon,title,desc}` identiques entre defaults (T1), modules (T4/T5), Tarifs (T2), Home (T3), devis (T7). Champ propagé `addons` = chaîne lisible, lu tel quel par le `.gs` (T8). ✔
- **Placeholders :** aucun TODO/TBD ; code complet à chaque étape. ✔
