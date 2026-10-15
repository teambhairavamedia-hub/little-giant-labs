/* Recognize → Return → Retain, drawn as a loop: three stages joined by flowing
   connectors, with lifetime value arcing back from Retain to Recognize. */

const ARC = "M468,70 C420,0 180,0 132,70";

export function LoyaltyLoop() {
  return (
    <figure className="pillar-loop" aria-labelledby="loyalty-loop-caption">
      <figcaption id="loyalty-loop-caption" className="loop-caption">
        The loyalty loop <span aria-hidden="true">·</span> lifetime value feeds the next cycle
      </figcaption>

      <svg viewBox="0 0 600 178" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient id="ll-flow" gradientUnits="userSpaceOnUse" x1="150" y1="0" x2="450" y2="0">
            <stop offset="0" stopColor="#A9D2BE" />
            <stop offset="1" stopColor="#E2C077" />
          </linearGradient>
          <marker id="ll-arrow-gold" viewBox="0 0 10 10" refX="7" refY="5" markerWidth="6" markerHeight="6" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#E2C077" />
          </marker>
          <marker id="ll-arrow-mint" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="5" markerHeight="5" orient="auto">
            <path d="M0,0 L10,5 L0,10 z" fill="#A9D2BE" />
          </marker>
        </defs>

        {/* Lifetime value loops back from Retain to Recognize */}
        <path d={ARC} className="loop-return" markerEnd="url(#ll-arrow-gold)" />
        <circle r="3.5" className="loop-runner">
          <animateMotion dur="4.5s" repeatCount="indefinite" path={ARC} />
        </circle>

        {/* Forward flow between stages */}
        <path d="M154,110 C185,82 215,138 246,110" className="loop-flow" markerEnd="url(#ll-arrow-gold)" />
        <path d="M354,110 C385,82 415,138 444,110" className="loop-flow" markerEnd="url(#ll-arrow-gold)" />

        {/* 01 Recognize — an eye catching a spark of attention */}
        <circle cx="100" cy="110" r="46" className="loop-node" />
        <g fill="none" stroke="#EEF5F0" strokeWidth="2.5" strokeLinejoin="round">
          <path d="M72,110 Q100,84 128,110 Q100,136 72,110 Z" />
          <circle cx="100" cy="110" r="10" />
        </g>
        <circle cx="100" cy="110" r="4" fill="#EEF5F0" />
        <path d="M124,76 L126.5,81.5 L132,84 L126.5,86.5 L124,92 L121.5,86.5 L116,84 L121.5,81.5 Z" fill="#E2C077" />

        {/* 02 Return — the repeat cycle */}
        <circle cx="300" cy="110" r="46" className="loop-node" />
        <g fill="none" stroke="#A9D2BE" strokeWidth="2.5" strokeLinecap="round">
          <path d="M274.9,103.3 A26,26 0 0 1 318.4,91.6" markerEnd="url(#ll-arrow-mint)" />
          <path d="M325.1,116.7 A26,26 0 0 1 281.6,128.4" markerEnd="url(#ll-arrow-mint)" />
        </g>
        <circle cx="300" cy="110" r="3.5" fill="#A9D2BE" />

        {/* 03 Retain — a protected inner circle */}
        <circle cx="500" cy="110" r="62" className="loop-halo loop-halo--outer" />
        <circle cx="500" cy="110" r="54" className="loop-halo" />
        <circle cx="500" cy="110" r="46" className="loop-node" />
        <path d="M500,82 L522,90 V110 C522,124 512,134 500,139 C488,134 478,124 478,110 V90 Z" fill="rgba(226,192,119,.12)" stroke="#E2C077" strokeWidth="2.5" strokeLinejoin="round" />
        <path d="M490,110 L497,117 L511,102" fill="none" stroke="#E2C077" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>

      <ol className="loop-steps">
        <li><span>01</span><strong>Recognize</strong><small>Discovery &amp; insight</small></li>
        <li><span>02</span><strong>Return</strong><small>Repeat engagement</small></li>
        <li><span>03</span><strong>Retain</strong><small>Lifetime value</small></li>
      </ol>
    </figure>
  );
}
