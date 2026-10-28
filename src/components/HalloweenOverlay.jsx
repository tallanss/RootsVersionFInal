import { useContent } from '../context/ContentContext';

// ============================================================
// HalloweenOverlay — habillage saisonnier ÉPHÉMÈRE (Halloween)
// ------------------------------------------------------------
// Toile d'araignée dans le coin haut-gauche (+ araignée qui descend/remonte).
// - 100% SVG + CSS (aucune image → zéro bande passante).
// - Actif AUTOMATIQUEMENT du 25 oct. au 1er nov. (puis extinction seule).
// - Réglable dans le CMS : content.halloween = 'auto' | 'on' | 'off'.
// - Respecte prefers-reduced-motion. Discret sur mobile (densité réduite).
// - pointer-events: none → n'intercepte aucun clic du site.
// ============================================================

const inHalloweenWindow = (d = new Date()) => {
  const m = d.getMonth(); // 0 = janvier … 9 = octobre, 10 = novembre
  const day = d.getDate();
  return (m === 9 && day >= 25) || (m === 10 && day <= 1);
};

export default function HalloweenOverlay() {
  const { content } = useContent();
  const mode = content.halloween || 'auto';
  const active = mode === 'on' || (mode === 'auto' && inHalloweenWindow());

  if (!active) return null;

  return (
    <div className="hw-overlay" aria-hidden="true">
      <style>{`
        .hw-overlay{position:fixed; inset:0; z-index:60; pointer-events:none; overflow:hidden;}
        .hw-web{position:absolute; top:-6px; left:-6px; width:150px; height:150px; color:var(--primary,#c5a059); opacity:.55;}
        .hw-web svg{width:100%; height:100%; display:block;}
        .hw-spider{position:absolute; top:0; left:104px; color:var(--primary,#c5a059); opacity:.7;
          animation:hw-drop 6s ease-in-out infinite;}
        .hw-spider .hw-thread{position:absolute; left:50%; top:-320px; width:1px; height:320px; background:currentColor; opacity:.45;}
        .hw-spider svg{width:22px; height:22px; display:block;}
        @keyframes hw-drop{0%,100%{transform:translateY(4px);} 50%{transform:translateY(60px);}}
        @media (max-width:760px){
          .hw-web{width:104px; height:104px;}
          .hw-spider{left:70px;}
        }
        @media (prefers-reduced-motion: reduce){ .hw-spider{animation:none;} }
      `}</style>

      {/* Toile d'araignée (coin haut-gauche) */}
      <div className="hw-web">
        <svg viewBox="0 0 170 170" fill="none" stroke="currentColor" strokeWidth="1.1">
          <path d="M0 0 L170 170 M0 0 L120 0 M0 0 L0 120 M0 0 L150 60 M0 0 L60 150 M0 0 L90 30 M0 0 L30 90" />
          <path d="M28 28 Q44 20 60 28 Q52 44 60 60 Q44 52 28 60 Q36 44 28 28 Z" opacity=".9" />
          <path d="M52 52 Q78 40 104 52 Q92 78 104 104 Q78 92 52 104 Q64 78 52 52 Z" opacity=".75" />
          <path d="M80 80 Q118 66 150 80 Q136 118 150 150" opacity=".6" />
        </svg>
      </div>

      {/* Araignée suspendue */}
      <div className="hw-spider">
        <div className="hw-thread" />
        <svg viewBox="0 0 24 24" fill="currentColor">
          <circle cx="12" cy="13" r="4.5" /><circle cx="12" cy="8.5" r="2.4" />
          <g stroke="currentColor" strokeWidth="1.1" fill="none" strokeLinecap="round">
            <path d="M8 11 L2 8 M8 13 L2 13 M8 15 L3 19 M16 11 L22 8 M16 13 L22 13 M16 15 L21 19" />
          </g>
        </svg>
      </div>
    </div>
  );
}
