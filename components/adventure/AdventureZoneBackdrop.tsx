import type { AdventureThemeId } from "@/lib/adventure/types";

/**
 * Décor illustré de la zone — une vraie scène en perspective, pas un
 * fond plat. Gare de Londres : verrière métallique, grande horloge
 * suspendue, arcades qui filent vers le fond, train à quai, cabine
 * téléphonique, bancs, lampadaires, ardoise, affiche, bagages,
 * lumière dorée de fin de journée. Tout est décoratif (aria-hidden).
 */
export function AdventureZoneBackdrop({ theme }: { theme: AdventureThemeId }) {
  if (theme === "station") return <StationBackdrop />;
  return <StationBackdrop />;
}

/* Point de fuite : (195, 168). Le sol occupe y 180 → 720. */
function StationBackdrop() {
  return (
    <svg
      aria-hidden
      viewBox="0 0 390 720"
      preserveAspectRatio="xMidYMid slice"
      className="absolute inset-0 h-full w-full"
    >
      <defs>
        <linearGradient id="st-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f7e3b8" />
          <stop offset="0.55" stopColor="#fbeed3" />
          <stop offset="1" stopColor="#fdf6e4" />
        </linearGradient>
        <linearGradient id="st-floor" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e4d3ae" />
          <stop offset="0.25" stopColor="#e9dcbd" />
          <stop offset="1" stopColor="#d9c69c" />
        </linearGradient>
        <radialGradient id="st-sun" cx="0.5" cy="0.24" r="0.55">
          <stop offset="0" stopColor="#fff3d0" stopOpacity="0.95" />
          <stop offset="0.55" stopColor="#ffe9b3" stopOpacity="0.35" />
          <stop offset="1" stopColor="#ffe9b3" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="st-lamp" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0" stopColor="#ffdf9e" stopOpacity="0.85" />
          <stop offset="1" stopColor="#ffdf9e" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="st-train" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#33436f" />
          <stop offset="0.5" stopColor="#2b3a66" />
          <stop offset="1" stopColor="#20294a" />
        </linearGradient>
        <linearGradient id="st-column" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#cdbb95" />
          <stop offset="0.5" stopColor="#e2d3b0" />
          <stop offset="1" stopColor="#bfa87d" />
        </linearGradient>
        <radialGradient id="st-vignette" cx="0.5" cy="0.42" r="0.85">
          <stop offset="0" stopColor="#3a2c14" stopOpacity="0" />
          <stop offset="0.75" stopColor="#3a2c14" stopOpacity="0" />
          <stop offset="1" stopColor="#3a2c14" stopOpacity="0.22" />
        </radialGradient>
        <linearGradient id="st-walk" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f0e4c4" />
          <stop offset="1" stopColor="#e7d7ae" />
        </linearGradient>
      </defs>

      {/* Lumière du fond de gare */}
      <rect x="0" y="0" width="390" height="200" fill="url(#st-sky)" />

      {/* Grande arche du fond, baignée de lumière */}
      <path d="M120 180 L120 128 Q195 68 270 128 L270 180 Z" fill="#f9e7bd" />
      <path
        d="M120 180 L120 128 Q195 68 270 128 L270 180"
        fill="none"
        stroke="#2c3556"
        strokeWidth="5"
      />
      <path d="M138 180 L138 134 Q195 86 252 134 L252 180" fill="#fff3d2" opacity="0.85" />
      {[152, 172, 195, 218, 238].map((x) => (
        <line key={x} x1={x} y1={x === 195 ? 92 : 108} x2={x} y2="178" stroke="#c9a95e" strokeWidth="1.6" opacity="0.6" />
      ))}

      {/* Arcades latérales qui filent vers le fond (gauche) */}
      {[
        { x: -6, w: 52, top: 30, h: 200 },
        { x: 52, w: 40, top: 74, h: 150 },
        { x: 96, w: 30, top: 106, h: 108 },
        { x: 128, w: 22, top: 128, h: 78 },
      ].map((c, i) => (
        <g key={`la-${i}`}>
          <rect x={c.x} y={c.top} width={c.w * 0.28} height={c.h + 24} fill="url(#st-column)" />
          <rect x={c.x} y={c.top} width={c.w * 0.28} height={6} fill="#b7a077" />
          <path
            d={`M${c.x + c.w * 0.28} ${c.top + 20} Q${c.x + c.w * 0.75} ${c.top - 16} ${c.x + c.w * 1.2} ${c.top + 20}`}
            fill="none"
            stroke="#2c3556"
            strokeWidth={4 - i * 0.6}
          />
          {/* Guirlande végétale sous l'arche */}
          <path
            d={`M${c.x + c.w * 0.3} ${c.top + 22} Q${c.x + c.w * 0.75} ${c.top + 40} ${c.x + c.w * 1.18} ${c.top + 22}`}
            fill="none"
            stroke="#3f7d54"
            strokeWidth={7 - i}
            strokeLinecap="round"
            opacity="0.9"
          />
          {[0.4, 0.6, 0.8].map((t) => (
            <circle
              key={t}
              cx={c.x + c.w * (0.3 + t * 0.8)}
              cy={c.top + 34}
              r={2.2 - i * 0.3}
              fill="#e88ba0"
              opacity="0.9"
            />
          ))}
        </g>
      ))}

      {/* Verrière : nervures sombres + rayons de structure */}
      <path d="M-10 96 Q195 -60 400 96 L400 -10 L-10 -10 Z" fill="#fbe9c4" opacity="0.9" />
      <path d="M-10 96 Q195 -60 400 96" fill="none" stroke="#232b45" strokeWidth="7" />
      <path d="M18 74 Q195 -34 372 74" fill="none" stroke="#2c3556" strokeWidth="4" />
      <path d="M52 52 Q195 -12 338 52" fill="none" stroke="#2c3556" strokeWidth="3" />
      {[40, 84, 130, 195, 260, 306, 350].map((x) => (
        <line
          key={x}
          x1={x}
          y1={6 + Math.abs(195 - x) * 0.22}
          x2={x}
          y2={78 + Math.abs(195 - x) * 0.1}
          stroke="#2c3556"
          strokeWidth="2.4"
          opacity="0.85"
        />
      ))}
      {/* Panneaux de verre chauds entre les nervures */}
      <path d="M-10 96 Q195 -60 400 96 L400 96 Q195 -30 -10 96 Z" fill="#ffedbe" opacity="0.5" />

      {/* Halo de soleil qui traverse la verrière */}
      <rect x="0" y="0" width="390" height="440" fill="url(#st-sun)" />
      {/* Rais de lumière */}
      <path d="M150 60 L110 400 L170 400 Z" fill="#ffe9b3" opacity="0.14" />
      <path d="M240 60 L290 430 L225 430 Z" fill="#ffe9b3" opacity="0.12" />

      {/* Grande horloge suspendue */}
      <line x1="195" y1="10" x2="195" y2="86" stroke="#232b45" strokeWidth="4" />
      <circle cx="195" cy="120" r="32" fill="#232b45" />
      <circle cx="195" cy="120" r="28.5" fill="#c98f2d" />
      <circle cx="195" cy="120" r="24" fill="#fffaf0" />
      {Array.from({ length: 12 }, (_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        return (
          <line
            key={i}
            x1={195 + 19.5 * Math.sin(a)}
            y1={120 - 19.5 * Math.cos(a)}
            x2={195 + 22 * Math.sin(a)}
            y2={120 - 22 * Math.cos(a)}
            stroke="#232b45"
            strokeWidth={i % 3 === 0 ? 2.6 : 1.4}
          />
        );
      })}
      <line x1="195" y1="120" x2="195" y2="104" stroke="#232b45" strokeWidth="3.4" strokeLinecap="round" />
      <line x1="195" y1="120" x2="206" y2="126" stroke="#c8402f" strokeWidth="2.4" strokeLinecap="round" />
      <circle cx="195" cy="120" r="2.6" fill="#232b45" />
      <circle cx="195" cy="156" r="3.4" fill="#c98f2d" />

      {/* Enseigne LONDON STATION, suspendue à gauche */}
      <line x1="52" y1="60" x2="52" y2="88" stroke="#232b45" strokeWidth="3" />
      <line x1="128" y1="42" x2="128" y2="88" stroke="#232b45" strokeWidth="3" />
      <rect x="24" y="88" width="132" height="58" rx="8" fill="#232b45" />
      <rect x="29" y="93" width="122" height="48" rx="5" fill="none" stroke="#eec153" strokeWidth="2.5" />
      <text x="90" y="114" textAnchor="middle" fontSize="15" fontWeight="800" letterSpacing="1.4" fill="#f3d998" fontFamily="Georgia, ui-serif, serif">
        LONDON
      </text>
      <text x="90" y="133" textAnchor="middle" fontSize="15" fontWeight="800" letterSpacing="1.4" fill="#f3d998" fontFamily="Georgia, ui-serif, serif">
        STATION
      </text>

      {/* Sol en perspective */}
      <rect x="0" y="178" width="390" height="542" fill="url(#st-floor)" />
      {/* Allée centrale plus claire */}
      <path d="M162 180 L228 180 L330 720 L60 720 Z" fill="url(#st-walk)" opacity="0.8" />
      {/* Joints convergents vers le point de fuite */}
      {[-260, -150, -60, 0, 60, 150, 260].map((dx) => (
        <line
          key={dx}
          x1={195 + dx * 0.14}
          y1="182"
          x2={195 + dx * 1.9}
          y2="720"
          stroke="#c4ae82"
          strokeWidth="1.3"
          opacity="0.55"
        />
      ))}
      {/* Lignes horizontales, resserrées vers l'horizon */}
      {[196, 218, 248, 288, 340, 405, 485, 580, 685].map((y) => (
        <line key={y} x1="0" y1={y} x2="390" y2={y} stroke="#c4ae82" strokeWidth="1.3" opacity="0.5" />
      ))}
      {/* Reflet chaud du soleil sur le sol */}
      <ellipse cx="195" cy="330" rx="150" ry="80" fill="#fff3d0" opacity="0.3" />

      {/* Train à quai, en perspective sur la droite */}
      <g>
        <path d="M390 96 L252 148 L252 208 L390 300 Z" fill="url(#st-train)" />
        <path d="M390 96 L252 148 L252 158 L390 116 Z" fill="#44548a" />
        {/* Bande dorée */}
        <path d="M390 236 L252 190 L252 197 L390 250 Z" fill="#c98f2d" />
        {/* Fenêtres éclairées, qui rapetissent vers le fond */}
        {[
          { x: 262, w: 13, y: 163, h: 13 },
          { x: 282, w: 16, y: 168, h: 15 },
          { x: 306, w: 19, y: 174, h: 18 },
          { x: 333, w: 22, y: 181, h: 21 },
          { x: 363, w: 24, y: 189, h: 24 },
        ].map((w, i) => (
          <rect key={i} x={w.x} y={w.y} width={w.w} height={w.h} rx="4" fill="#ffd98f" opacity="0.95" />
        ))}
        <text
          x="322"
          y="232"
          fontSize="9"
          fontWeight="800"
          letterSpacing="1.2"
          fill="#e8ebf5"
          opacity="0.8"
          fontFamily="ui-sans-serif, system-ui"
          transform="rotate(9 322 232)"
        >
          FLUENTROOM
        </text>
        {/* Quai le long du train */}
        <path d="M390 300 L252 208 L236 212 L390 322 Z" fill="#cdbb95" />
        <path d="M390 322 L236 212 L236 218 L390 334 Z" fill="#eec153" opacity="0.5" />
      </g>

      {/* Panneau des départs, à droite (devant le train) */}
      <line x1="262" y1="92" x2="262" y2="120" stroke="#232b45" strokeWidth="2.5" />
      <line x1="340" y1="80" x2="340" y2="120" stroke="#232b45" strokeWidth="2.5" />
      <rect x="240" y="118" width="122" height="76" rx="8" fill="#1b2138" />
      <rect x="240" y="118" width="122" height="19" rx="8" fill="#232b45" />
      <text x="250" y="132" fontSize="9" fontWeight="800" letterSpacing="1.6" fill="#eec153" fontFamily="ui-sans-serif, system-ui">
        DÉPARTS
      </text>
      {[
        ["10:15", "Cambridge", "Voie 3"],
        ["10:30", "Oxford", "Voie 5"],
        ["10:45", "Brighton", "Voie 2"],
      ].map(([t, city, voie], i) => (
        <g key={t} fontFamily="ui-sans-serif, system-ui" fontSize="7.6" fontWeight="700">
          <text x="248" y={151 + i * 13} fill="#eec153">{t}</text>
          <text x="276" y={151 + i * 13} fill="#e8ebf5">{city}</text>
          <text x="328" y={151 + i * 13} fill="#8d97b8">{voie}</text>
        </g>
      ))}

      {/* Cabine téléphonique rouge, premier plan gauche */}
      <g>
        <ellipse cx="46" cy="400" rx="38" ry="8" fill="#3a2c14" opacity="0.16" />
        <rect x="12" y="258" width="68" height="140" rx="7" fill="#c8402f" />
        <rect x="12" y="258" width="68" height="140" rx="7" fill="none" stroke="#a83323" strokeWidth="3" />
        <path d="M8 260 q38 -20 76 0 l0 8 l-76 0 Z" fill="#a83323" />
        <circle cx="46" cy="254" r="4" fill="#7d2418" />
        <rect x="21" y="270" width="50" height="15" rx="3" fill="#fdf3df" />
        <text x="46" y="281" textAnchor="middle" fontSize="8.5" fontWeight="800" letterSpacing="1" fill="#c8402f" fontFamily="ui-sans-serif, system-ui">
          TELEPHONE
        </text>
        {[292, 318, 344].map((y) => (
          <g key={y}>
            <rect x="20" y={y} width="15" height="20" rx="2.5" fill="#f6e9cf" opacity="0.92" />
            <rect x="38.5" y={y} width="15" height="20" rx="2.5" fill="#efdfc0" opacity="0.92" />
            <rect x="57" y={y} width="15" height="20" rx="2.5" fill="#f6e9cf" opacity="0.92" />
          </g>
        ))}
        <rect x="20" y="370" width="52" height="20" rx="2.5" fill="#a83323" />
      </g>

      {/* Lampadaires en fer forgé + halos chauds */}
      {[
        { x: 108, top: 208, h: 128, s: 1 },
        { x: 296, top: 236, h: 118, s: 1 },
        { x: 158, top: 168, h: 66, s: 0.6 },
      ].map((l, i) => (
        <g key={`lamp-${i}`}>
          <ellipse cx={l.x} cy={l.top + l.h + 4} rx={12 * l.s} ry={3.4 * l.s} fill="#3a2c14" opacity="0.14" />
          <line x1={l.x} y1={l.top + 10} x2={l.x} y2={l.top + l.h} stroke="#232b45" strokeWidth={4.4 * l.s} strokeLinecap="round" />
          <path d={`M${l.x - 7 * l.s} ${l.top + 12} h${14 * l.s} l-${3 * l.s} -${12 * l.s} h-${8 * l.s} Z`} fill="#232b45" />
          <rect x={l.x - 4.4 * l.s} y={l.top + 1} width={8.8 * l.s} height={10 * l.s} rx={2 * l.s} fill="#ffd98f" stroke="#232b45" strokeWidth={1.6 * l.s} />
          <circle cx={l.x} cy={l.top + 6} r={26 * l.s} fill="url(#st-lamp)" />
        </g>
      ))}

      {/* Bancs verts à lattes de bois */}
      {[
        { x: 118, y: 332, s: 1 },
        { x: 262, y: 430, s: 1.05 },
      ].map((b, i) => (
        <g key={`bench-${i}`} transform={`translate(${b.x} ${b.y}) scale(${b.s})`}>
          <ellipse cx="42" cy="46" rx="46" ry="7" fill="#3a2c14" opacity="0.15" />
          <rect x="0" y="0" width="84" height="7" rx="3.5" fill="#b8874e" />
          <rect x="0" y="10" width="84" height="7" rx="3.5" fill="#a97a42" />
          <rect x="0" y="24" width="84" height="8" rx="4" fill="#c89b62" />
          <rect x="0" y="34" width="84" height="8" rx="4" fill="#b8874e" />
          <path d="M4 24 q-6 -16 2 -24" fill="none" stroke="#2e5d40" strokeWidth="4" strokeLinecap="round" />
          <path d="M80 24 q6 -16 -2 -24" fill="none" stroke="#2e5d40" strokeWidth="4" strokeLinecap="round" />
          <line x1="8" y1="42" x2="8" y2="46" stroke="#2e5d40" strokeWidth="4" strokeLinecap="round" />
          <line x1="76" y1="42" x2="76" y2="46" stroke="#2e5d40" strokeWidth="4" strokeLinecap="round" />
          {i === 0 && (
            <g>
              <rect x="58" y="-10" width="8" height="10" rx="2" fill="#fdf3df" />
              <path d="M66 -7 q5 0 5 4 q0 3 -5 3" fill="none" stroke="#fdf3df" strokeWidth="2" />
            </g>
          )}
        </g>
      ))}

      {/* Ardoise « Bon voyage » sur chevalet, premier plan gauche */}
      <g transform="translate(14 428)">
        <ellipse cx="42" cy="112" rx="44" ry="8" fill="#3a2c14" opacity="0.16" />
        <path d="M8 104 L34 6 L50 6 L76 104" fill="none" stroke="#8f683c" strokeWidth="6" strokeLinecap="round" />
        <rect x="10" y="0" width="64" height="86" rx="6" fill="#2f3b33" stroke="#8f683c" strokeWidth="5" />
        <text x="42" y="30" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#f4efe2" fontFamily="Georgia, ui-serif, serif" fontStyle="italic">
          Bon voyage
        </text>
        <text x="42" y="46" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#f4efe2" fontFamily="Georgia, ui-serif, serif" fontStyle="italic">
          et bonne
        </text>
        <text x="42" y="62" textAnchor="middle" fontSize="10.5" fontWeight="700" fill="#f4efe2" fontFamily="Georgia, ui-serif, serif" fontStyle="italic">
          pratique !
        </text>
        <path d="M38 70 c-3 -4 -9 0 -5 4 l5 4 l5 -4 c4 -4 -2 -8 -5 -4" fill="#e88ba0" />
      </g>

      {/* Affiche « Visitez Londres » sur pied, premier plan droite */}
      <g transform="translate(296 402)">
        <ellipse cx="40" cy="152" rx="42" ry="8" fill="#3a2c14" opacity="0.16" />
        <rect x="0" y="0" width="80" height="140" rx="7" fill="#8f683c" />
        <rect x="6" y="6" width="68" height="128" rx="4" fill="#fbeed3" />
        <rect x="10" y="10" width="60" height="74" rx="3" fill="#f2d9a4" />
        {/* Big Ben stylisé */}
        <rect x="32" y="26" width="14" height="58" fill="#8a6b3e" />
        <path d="M32 26 L39 12 L46 26 Z" fill="#8a6b3e" />
        <rect x="34.5" y="34" width="9" height="9" rx="1.5" fill="#fbeed3" />
        <circle cx="39" cy="38.5" r="3" fill="#c98f2d" />
        <ellipse cx="39" cy="80" rx="22" ry="6" fill="#d9b978" opacity="0.7" />
        <text x="40" y="102" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="0.6" fill="#2c3556" fontFamily="Georgia, ui-serif, serif">
          VISITEZ
        </text>
        <text x="40" y="116" textAnchor="middle" fontSize="10" fontWeight="800" letterSpacing="0.6" fill="#2c3556" fontFamily="Georgia, ui-serif, serif">
          LONDRES !
        </text>
        <line x1="40" y1="140" x2="40" y2="150" stroke="#8f683c" strokeWidth="6" strokeLinecap="round" />
      </g>

      {/* Pile de valises, droite */}
      <g transform="translate(244 500)">
        <ellipse cx="46" cy="66" rx="52" ry="9" fill="#3a2c14" opacity="0.16" />
        <rect x="0" y="34" width="92" height="32" rx="6" fill="#a97a42" />
        <rect x="0" y="34" width="92" height="32" rx="6" fill="none" stroke="#8f683c" strokeWidth="2.5" />
        <line x1="24" y1="34" x2="24" y2="66" stroke="#8f683c" strokeWidth="2.5" />
        <line x1="68" y1="34" x2="68" y2="66" stroke="#8f683c" strokeWidth="2.5" />
        <rect x="38" y="28" width="16" height="8" rx="3.5" fill="#8f683c" />
        <rect x="12" y="4" width="62" height="26" rx="5" fill="#e2572f" />
        <rect x="24" y="8" width="38" height="4" rx="2" fill="#ffd9cc" opacity="0.85" />
        <rect x="36" y="-2" width="14" height="7" rx="3" fill="#a83323" />
      </g>

      {/* Panneau Voie 3, sur pied à droite */}
      <g transform="translate(326 300)">
        <ellipse cx="14" cy="76" rx="11" ry="3.4" fill="#3a2c14" opacity="0.14" />
        <line x1="14" y1="26" x2="14" y2="74" stroke="#232b45" strokeWidth="4" strokeLinecap="round" />
        <rect x="-18" y="0" width="66" height="26" rx="7" fill="#232b45" />
        <text x="6" y="17.5" textAnchor="middle" fontSize="11" fontWeight="800" fill="#f3d998" fontFamily="ui-sans-serif, system-ui">
          Voie 3
        </text>
        <path d="M34 8 l9 5 l-9 5 Z" fill="#f3d998" />
      </g>

      {/* Jardinières fleuries */}
      {[
        { x: 96, y: 268, s: 0.8 },
        { x: 232, y: 258, s: 0.7 },
        { x: 210, y: 452, s: 1.05 },
        { x: 372, y: 372, s: 0.8 },
      ].map((p, i) => (
        <g key={`plant-${i}`} transform={`translate(${p.x} ${p.y}) scale(${p.s})`}>
          <ellipse cx="0" cy="26" rx="22" ry="5" fill="#3a2c14" opacity="0.14" />
          <path d="M-16 8 h32 l-4 18 h-24 Z" fill="#b8874e" />
          <path d="M-18 6 h36 l-2 6 h-32 Z" fill="#a97a42" />
          <path d="M0 8 C-16 -6 -14 -22 -3 -25 C-3 -12 -2 -4 0 8" fill="#3f7d54" />
          <path d="M0 8 C16 -6 14 -22 3 -25 C3 -12 2 -4 0 8" fill="#4f9165" />
          <path d="M0 8 C-3 -10 3 -20 0 -30 C6 -16 3 -6 0 8" fill="#2e5d40" />
          {[[-10, -12], [9, -14], [0, -24], [-4, -4], [7, -2]].map(([fx, fy], j) => (
            <circle key={j} cx={fx} cy={fy} r="2.6" fill={j % 2 ? "#e88ba0" : "#e2572f"} />
          ))}
        </g>
      ))}

      {/* Buissons d'ambiance en bas à gauche */}
      <g transform="translate(-8 560)">
        <ellipse cx="52" cy="58" rx="64" ry="10" fill="#3a2c14" opacity="0.12" />
        <circle cx="22" cy="34" r="30" fill="#3f7d54" />
        <circle cx="58" cy="26" r="34" fill="#4f9165" />
        <circle cx="92" cy="40" r="26" fill="#2e5d40" />
        {[[16, 22], [48, 8], [78, 26], [60, 42], [30, 44]].map(([fx, fy], j) => (
          <circle key={j} cx={fx} cy={fy} r="3" fill={j % 2 ? "#e88ba0" : "#f2b84b"} />
        ))}
      </g>

      {/* Poussière dorée / bokeh */}
      {[
        [70, 170, 7], [150, 130, 5], [320, 150, 6], [250, 100, 4],
        [110, 90, 4], [352, 210, 5], [40, 230, 4],
      ].map(([x, y, r], i) => (
        <circle key={`bokeh-${i}`} cx={x} cy={y} r={r} fill="#ffe9b3" opacity="0.35" />
      ))}

      {/* Vignette douce pour la profondeur */}
      <rect x="0" y="0" width="390" height="720" fill="url(#st-vignette)" />
    </svg>
  );
}
