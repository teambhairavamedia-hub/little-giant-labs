/* Text-free diagrams for the first two growth pillars, drawn in the same visual
   language as the loyalty loop: mint for the system, gold for the outcome. */

/* 01 Attention Engineering — a viewfinder framing the viewer's eye, beside a
   retention curve that holds high where a typical one falls away. */
export function AttentionDiagram() {
  return (
    <figure className="pillar-visual" aria-hidden="true">
      <svg viewBox="0 0 600 220" focusable="false">
        <defs>
          <linearGradient id="pa-curve" x1="340" y1="0" x2="560" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A9D2BE" />
            <stop offset="1" stopColor="#E2C077" />
          </linearGradient>
        </defs>

        {/* Viewfinder */}
        <g fill="none" stroke="#A9D2BE" strokeWidth="2.5" strokeLinecap="round" opacity=".85">
          <path d="M50,58 V30 H78" /><path d="M262,30 H290 V58" />
          <path d="M290,162 V190 H262" /><path d="M78,190 H50 V162" />
        </g>
        <circle cx="72" cy="50" r="5" className="pv-pulse" fill="#E2C077" />
        <g stroke="rgba(169,210,190,.28)" strokeWidth="1">
          <path d="M170,96 V124 M156,110 H184" />
        </g>
        <path d="M110,110 Q170,62 230,110 Q170,158 110,110 Z" fill="rgba(255,255,255,.04)" stroke="#EEF5F0" strokeWidth="2.5" strokeLinejoin="round" />
        <circle cx="170" cy="110" r="20" fill="none" stroke="#EEF5F0" strokeWidth="2.5" />
        <circle cx="170" cy="110" r="8" fill="#EEF5F0" />
        <circle cx="176" cy="104" r="2.5" fill="#0B3E31" />

        {/* Retention chart */}
        <g stroke="rgba(169,210,190,.35)" strokeWidth="1.2">
          <path d="M340,34 V190 H566" />
          <path d="M340,72 H566 M340,112 H566 M340,152 H566" strokeDasharray="2 6" opacity=".6" />
        </g>
        <path d="M344,46 C380,120 420,170 562,180" fill="none" stroke="rgba(238,245,240,.32)" strokeWidth="2" strokeDasharray="5 6" />
        <path d="M344,46 C400,58 470,64 562,74 V190 H344 Z" fill="rgba(226,192,119,.1)" />
        <path d="M344,46 C400,58 470,64 562,74" fill="none" stroke="url(#pa-curve)" strokeWidth="3" strokeLinecap="round" />
        <circle cx="344" cy="46" r="4.5" fill="#A9D2BE" />
        <circle cx="452" cy="62" r="4.5" fill="#CFCB9A" />
        <circle cx="562" cy="74" r="6" fill="#E2C077" className="pv-glow" />
      </svg>
    </figure>
  );
}

/* 02 Performance Architecture — a layered media-buying stack feeding a rising,
   compounding revenue chart. */
export function PerformanceDiagram() {
  return (
    <figure className="pillar-visual" aria-hidden="true">
      <svg viewBox="0 0 600 220" focusable="false">
        <defs>
          <linearGradient id="pp-flow" x1="236" y1="0" x2="330" y2="0" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A9D2BE" />
            <stop offset="1" stopColor="#E2C077" />
          </linearGradient>
          <linearGradient id="pp-bar" x1="0" y1="40" x2="0" y2="190" gradientUnits="userSpaceOnUse">
            <stop offset="0" stopColor="#A9D2BE" stopOpacity=".55" />
            <stop offset="1" stopColor="#A9D2BE" stopOpacity=".08" />
          </linearGradient>
          <marker id="pp-arrow" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#E2C077" />
          </marker>
        </defs>

        {/* Media-buying stack */}
        <path d="M140,148 L216,170 L140,192 L64,170 Z" fill="rgba(169,210,190,.06)" stroke="rgba(169,210,190,.45)" strokeWidth="2" strokeLinejoin="round" />
        <path d="M140,110 L216,132 L140,154 L64,132 Z" fill="rgba(169,210,190,.1)" stroke="#A9D2BE" strokeWidth="2" strokeLinejoin="round" opacity=".85" />
        <path d="M140,72 L216,94 L140,116 L64,94 Z" fill="rgba(226,192,119,.14)" stroke="#E2C077" strokeWidth="2.2" strokeLinejoin="round" />
        <g fill="#EEF5F0">
          <circle cx="112" cy="94" r="3" /><circle cx="140" cy="94" r="3" /><circle cx="168" cy="94" r="3" />
        </g>
        <path d="M140,30 V60" stroke="rgba(226,192,119,.6)" strokeWidth="1.6" strokeDasharray="3 5" strokeLinecap="round" markerEnd="url(#pp-arrow)" />

        {/* Flow into results */}
        <path d="M236,132 C266,104 296,160 326,132" className="pv-flow" stroke="url(#pp-flow)" markerEnd="url(#pp-arrow)" />

        {/* Rising revenue chart */}
        <path d="M352,190 H570" stroke="rgba(169,210,190,.35)" strokeWidth="1.2" />
        <g fill="url(#pp-bar)" stroke="rgba(169,210,190,.4)" strokeWidth="1">
          <rect x="360" y="160" width="28" height="30" rx="3" />
          <rect x="402" y="140" width="28" height="50" rx="3" />
          <rect x="444" y="112" width="28" height="78" rx="3" />
          <rect x="486" y="80" width="28" height="110" rx="3" />
          <rect x="528" y="44" width="28" height="146" rx="3" fill="rgba(226,192,119,.28)" stroke="#E2C077" />
        </g>
        <path d="M374,148 L416,128 L458,100 L500,68 L540,32" fill="none" stroke="#E2C077" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" markerEnd="url(#pp-arrow)" />
        <g fill="#0A3329" stroke="#E2C077" strokeWidth="2">
          <circle cx="374" cy="148" r="4" /><circle cx="416" cy="128" r="4" /><circle cx="458" cy="100" r="4" /><circle cx="500" cy="68" r="4" />
        </g>
      </svg>
    </figure>
  );
}
