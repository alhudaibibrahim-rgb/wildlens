/* Original illustrated portraits. Each returns inner SVG for a 320x240 viewBox. */
const ART = (() => {
  const sky = (id, a, b) => `<defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient></defs><rect width="320" height="240" fill="url(#${id})"/>`;
  const wrap = (inner, label) => `<svg viewBox="0 0 320 240" role="img" aria-label="Illustration of ${label}" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">${inner}</svg>`;

  const art = {
    "red-fox": () => sky("gFox", "#F6DDB0", "#E8A96A") +
      `<circle cx="258" cy="58" r="22" fill="#FBEBC8"/>
       <path d="M0 175 Q80 150 160 168 T320 160 V240 H0Z" fill="#B7793C"/>
       <path d="M0 200 Q100 185 190 198 T320 192 V240 H0Z" fill="#8C5A2B"/>
       <path d="M40 205 l4 -26 M52 204 l-3 -22 M270 200 l3 -24 M282 202 l-4 -20" stroke="#6E4520" stroke-width="3" stroke-linecap="round"/>
       <path d="M196 196 C258 204 290 160 266 124 C250 146 232 172 196 176Z" fill="#D8612A"/>
       <path d="M266 124 C282 142 278 166 258 174 C264 158 266 142 266 124Z" fill="#FFF6EA"/>
       <ellipse cx="170" cy="164" rx="42" ry="46" fill="#D8612A"/>
       <ellipse cx="150" cy="162" rx="19" ry="32" fill="#FFF3E6"/>
       <rect x="140" y="190" width="10" height="26" rx="4" fill="#2C1C12"/><rect x="160" y="192" width="10" height="24" rx="4" fill="#2C1C12"/>
       <rect x="186" y="196" width="10" height="20" rx="4" fill="#2C1C12"/>
       <path d="M128 90 L136 58 L152 84Z" fill="#D8612A"/><path d="M152 82 L168 56 L174 92Z" fill="#D8612A"/>
       <path d="M134 84 L137 68 L145 83Z" fill="#3B2416"/><path d="M158 82 L166 66 L169 88Z" fill="#3B2416"/>
       <ellipse cx="148" cy="108" rx="30" ry="24" fill="#D8612A"/>
       <path d="M126 104 L92 118 L124 126Z" fill="#D8612A"/>
       <path d="M124 116 L94 120 L126 132 L142 126Z" fill="#FFF3E6"/>
       <circle cx="93" cy="118" r="4" fill="#1B120C"/>
       <ellipse cx="140" cy="102" rx="3.5" ry="3" fill="#1B120C"/><circle cx="141" cy="101" r="1" fill="#fff"/>`,

    "golden-eagle": () => sky("gEag", "#9CC3E0", "#DCEBF3") +
      `<path d="M0 150 L50 90 L90 130 L140 70 L200 140 L250 100 L320 160 V240 H0Z" fill="#8FA7B8"/>
       <path d="M140 70 L156 88 L148 90 L140 80 L132 92 L126 86Z" fill="#F4F8FB"/>
       <path d="M80 240 L110 190 L220 185 L260 240Z" fill="#6D6A63"/><path d="M110 190 L220 185 L200 200 L120 204Z" fill="#8A867D"/>
       <path d="M150 190 C120 150 130 90 170 78 C205 84 215 140 200 190Z" fill="#4E321D"/>
       <path d="M160 188 C140 150 150 110 190 104 C214 130 214 168 200 190Z" fill="#3B2615"/>
       <path d="M188 118 C200 140 204 166 198 188 L214 196 C222 160 214 128 188 118Z" fill="#2C1C10"/>
       <circle cx="168" cy="80" r="22" fill="#5A3A20"/>
       <path d="M160 62 C176 58 190 68 190 84 C182 76 172 72 160 72Z" fill="#C99A3E"/>
       <path d="M150 78 L128 82 C126 90 134 94 140 90 L152 88Z" fill="#F2C14E"/>
       <path d="M128 82 C124 88 128 94 134 92 L132 86Z" fill="#2A2522"/>
       <circle cx="160" cy="76" r="3.4" fill="#2A1A0C"/><circle cx="161" cy="75" r="1" fill="#F6D48A"/>
       <path d="M150 190 l-4 8 M158 190 l0 9 M166 190 l4 8 M184 190 l-3 8 M192 190 l1 9" stroke="#F2C14E" stroke-width="4" stroke-linecap="round"/>`,

    "arabian-oryx": () => sky("gOryx", "#FBEFD2", "#F2D39B") +
      `<circle cx="70" cy="60" r="26" fill="#FFF7E3"/>
       <path d="M0 170 Q70 140 150 162 Q230 184 320 150 V240 H0Z" fill="#E7BE7E"/>
       <path d="M0 205 Q120 180 220 200 T320 196 V240 H0Z" fill="#D8A661"/>
       <ellipse cx="170" cy="146" rx="62" ry="28" fill="#F6F2EA"/>
       <path d="M112 150 C120 168 138 172 150 170 L150 160Z" fill="#6A5442"/>
       <path d="M116 146 L118 204 L126 204 L128 160Z" fill="#F6F2EA"/><path d="M118 184 L118 204 L126 204 L126 184Z" fill="#5A4636"/>
       <path d="M140 160 L140 206 L148 206 L150 164Z" fill="#F6F2EA"/><path d="M140 186 L140 206 L148 206 L148 186Z" fill="#5A4636"/>
       <path d="M200 162 L204 204 L212 204 L212 160Z" fill="#F6F2EA"/><path d="M204 184 L204 204 L212 204 L212 184Z" fill="#5A4636"/>
       <path d="M220 150 L228 202 L236 202 L232 150Z" fill="#F6F2EA"/><path d="M228 184 L228 202 L236 202 L234 184Z" fill="#5A4636"/>
       <path d="M230 138 C244 146 246 162 240 174" stroke="#5A4636" stroke-width="6" fill="none" stroke-linecap="round"/>
       <path d="M110 150 C104 128 104 112 112 100 L128 108 C126 124 128 136 132 146Z" fill="#F6F2EA"/>
       <path d="M96 96 C92 108 96 118 104 120 L118 118 L122 98 C114 92 102 92 96 96Z" fill="#F6F2EA"/>
       <path d="M100 98 L104 118 L112 118 L110 96Z" fill="#2E2520"/><path d="M114 94 L118 110 L124 100Z" fill="#2E2520"/>
       <path d="M110 100 L150 30" stroke="#3A302A" stroke-width="4" stroke-linecap="round"/>
       <path d="M118 102 L160 34" stroke="#3A302A" stroke-width="4" stroke-linecap="round"/>
       <path d="M118 96 l8 -8 l4 8Z" fill="#F6F2EA"/>
       <circle cx="110" cy="104" r="2.2" fill="#F6F2EA"/>`,

    "green-sea-turtle": () => sky("gTur", "#3FA3B8", "#12506A") +
      `<path d="M60 0 L100 0 L40 240 L0 240Z M180 0 L210 0 L170 240 L130 240Z" fill="#fff" opacity=".07"/>
       <path d="M0 214 Q60 200 120 212 T240 208 T320 214 V240 H0Z" fill="#D9C48E"/>
       <path d="M30 214 c-4-20 6-34 2-48 M40 214 c6-18-2-30 4-44 M280 212 c-6-22 4-36 0-52 M292 212 c4-18-2-28 2-40" stroke="#3E7A45" stroke-width="4" fill="none" stroke-linecap="round"/>
       <path d="M118 108 C80 86 58 96 50 110 C74 112 96 118 116 128Z" fill="#8E7B4E"/>
       <path d="M204 108 C240 86 262 96 270 110 C246 112 224 118 206 128Z" fill="#8E7B4E"/>
       <path d="M124 170 C104 182 98 196 104 204 C118 196 128 186 136 176Z" fill="#8E7B4E"/>
       <path d="M196 170 C216 182 222 196 216 204 C202 196 192 186 184 176Z" fill="#8E7B4E"/>
       <ellipse cx="160" cy="140" rx="54" ry="46" fill="#5F6F32"/>
       <ellipse cx="160" cy="140" rx="46" ry="38" fill="#7A8740"/>
       <path d="M160 108 L178 122 L172 144 L148 144 L142 122Z" fill="#8C9A4C" stroke="#4E5A28" stroke-width="2"/>
       <path d="M148 144 L172 144 L176 166 L160 176 L144 166Z" fill="#8C9A4C" stroke="#4E5A28" stroke-width="2"/>
       <path d="M142 122 L148 144 L144 166 L122 156 L118 128Z" fill="#8C9A4C" stroke="#4E5A28" stroke-width="2"/>
       <path d="M178 122 L172 144 L176 166 L198 156 L202 128Z" fill="#8C9A4C" stroke="#4E5A28" stroke-width="2"/>
       <ellipse cx="160" cy="88" rx="16" ry="18" fill="#9C8A58"/>
       <circle cx="152" cy="84" r="2.6" fill="#1C1A12"/><circle cx="168" cy="84" r="2.6" fill="#1C1A12"/>
       <circle cx="240" cy="50" r="5" fill="none" stroke="#CFEFF6" stroke-width="1.5"/><circle cx="250" cy="34" r="3" fill="none" stroke="#CFEFF6" stroke-width="1.5"/>`,

    "bottlenose-dolphin": () => sky("gDol", "#8FD0E8", "#2C7FA8") +
      `<path d="M0 150 Q40 140 80 150 T160 150 T240 150 T320 150 V240 H0Z" fill="#1F6A91"/>
       <path d="M0 150 Q40 140 80 150 T160 150 T240 150 T320 150" stroke="#E8F7FC" stroke-width="3" fill="none" opacity=".7"/>
       <path d="M60 170 C90 90 180 58 250 96 C232 94 214 96 200 102 C170 116 128 150 100 188Z" fill="#7F909C"/>
       <path d="M76 176 C104 128 150 100 196 104 C160 118 124 146 98 186Z" fill="#DCE3E7"/>
       <path d="M150 82 C154 62 166 50 182 46 C176 60 176 72 180 80Z" fill="#6B7C88"/>
       <path d="M250 96 C262 96 272 100 276 106 C266 106 256 104 246 104Z" fill="#7F909C"/>
       <path d="M60 170 C46 176 36 190 34 204 C48 196 58 192 70 192 C62 186 60 178 60 170Z" fill="#6B7C88"/>
       <path d="M60 170 C58 186 64 200 76 208 C74 196 74 186 70 176Z" fill="#6B7C88"/>
       <circle cx="232" cy="96" r="2.6" fill="#1C2328"/>
       <path d="M236 104 Q246 108 258 106" stroke="#4F5E68" stroke-width="1.5" fill="none"/>
       <path d="M20 200 q10 -6 20 0 M240 190 q12 -6 24 0 M180 214 q8 -5 16 0" stroke="#BDE6F4" stroke-width="2" fill="none"/>`,

    "snow-leopard": () => sky("gSnow", "#C9D7E4", "#EEF3F7") +
      `<path d="M0 120 L60 70 L110 110 L170 50 L240 110 L290 80 L320 100 V240 H0Z" fill="#A5B4C2"/>
       <path d="M170 50 L190 68 L178 70 L170 62 L160 74 L152 66Z M60 70 L74 82 L64 84 L54 78Z" fill="#fff"/>
       <path d="M0 176 L90 160 L200 170 L320 158 V240 H0Z" fill="#8C8A84"/><path d="M0 176 L90 160 L200 170 L320 158 V168 L200 180 L90 172 L0 188Z" fill="#E9EEF2"/>
       <path d="M236 156 C290 150 300 190 268 200 C250 206 236 196 246 188 C262 186 276 180 266 168 C258 162 246 164 236 166Z" fill="#DCD8CE"/>
       <ellipse cx="180" cy="150" rx="66" ry="26" fill="#DCD8CE"/>
       <ellipse cx="98" cy="136" rx="30" ry="26" fill="#DCD8CE"/>
       <path d="M76 118 L80 102 L92 114Z M104 112 L114 100 L118 116Z" fill="#CFCAC0"/>
       <ellipse cx="84" cy="146" rx="12" ry="8" fill="#EDEAE3"/>
       <path d="M80 142 L88 142 L84 147Z" fill="#8A6F6A"/>
       <ellipse cx="86" cy="130" rx="3" ry="2.4" fill="#5B6A5E"/><ellipse cx="104" cy="130" rx="3" ry="2.4" fill="#5B6A5E"/>
       <path d="M110 164 L96 176 L124 178 L128 166Z M200 166 L196 178 L224 178 L220 164Z" fill="#DCD8CE"/>
       <g fill="none" stroke="#5E5D59" stroke-width="2.4">
       <circle cx="150" cy="140" r="6"/><circle cx="172" cy="132" r="5"/><circle cx="196" cy="140" r="6"/><circle cx="218" cy="148" r="5"/>
       <circle cx="160" cy="158" r="5"/><circle cx="186" cy="156" r="6"/><circle cx="130" cy="150" r="4"/><circle cx="210" cy="130" r="4"/>
       <circle cx="262" cy="160" r="4"/><circle cx="282" cy="176" r="4"/><circle cx="270" cy="192" r="4"/></g>
       <g fill="#5E5D59"><circle cx="100" cy="120" r="1.6"/><circle cx="92" cy="122" r="1.6"/><circle cx="110" cy="124" r="1.6"/><circle cx="118" cy="136" r="2"/></g>`,

    "gray-wolf": () => sky("gWolf", "#1E2A44", "#3E5170") +
      `<circle cx="236" cy="62" r="34" fill="#F1EEDD"/><circle cx="226" cy="54" r="6" fill="#E0DCC6"/><circle cx="246" cy="74" r="4" fill="#E0DCC6"/>
       <g fill="#F1EEDD"><circle cx="40" cy="30" r="1.4"/><circle cx="90" cy="60" r="1.2"/><circle cx="150" cy="24" r="1.4"/><circle cx="300" cy="120" r="1.2"/><circle cx="20" cy="110" r="1"/></g>
       <path d="M0 190 L40 150 L60 170 L90 130 L110 160 L0 240Z" fill="#1A2436"/>
       <path d="M60 240 L130 176 L320 170 V240Z" fill="#2A3444"/>
       <path d="M150 180 C140 140 146 110 162 96 L186 106 C196 130 206 160 214 182Z" fill="#8E949B"/>
       <path d="M160 176 C156 146 160 124 172 110 C180 134 184 156 186 178Z" fill="#D4D6D8"/>
       <path d="M200 176 C236 172 262 180 270 196 L200 196Z" fill="#8E949B"/>
       <path d="M150 180 L148 212 L158 212 L160 184Z M196 180 L200 212 L210 212 L206 180Z" fill="#7A8087"/>
       <path d="M162 96 C158 80 166 62 180 54 L218 34 L212 48 L200 58 C204 66 200 76 192 82 L186 106Z" fill="#8E949B"/>
       <path d="M184 60 L176 40 L194 54Z" fill="#6F757C"/>
       <path d="M200 58 L218 34 L214 50Z" fill="#2B2F34"/>
       <path d="M192 82 L204 68 L212 52 L200 64Z" fill="#D4D6D8"/>
       <circle cx="186" cy="66" r="2.2" fill="#E7C467"/>
       <path d="M270 196 C284 192 296 196 300 204 C288 206 276 204 264 202Z" fill="#6F757C"/>`,

    "african-elephant": () => sky("gEle", "#F7D59A", "#F2B36A") +
      `<circle cx="80" cy="84" r="30" fill="#FBE3B0"/>
       <path d="M0 176 Q160 160 320 178 V240 H0Z" fill="#C9A15A"/><path d="M0 208 Q160 192 320 206 V240 H0Z" fill="#B18846"/>
       <path d="M262 176 L262 120" stroke="#4E3A26" stroke-width="5"/><path d="M226 116 Q262 96 302 116 Q262 124 226 116Z" fill="#6B7E3C"/>
       <path d="M262 132 L242 120 M262 128 L284 118" stroke="#4E3A26" stroke-width="3"/>
       <path d="M110 96 C110 70 150 58 196 64 C232 70 246 100 240 136 C236 160 226 170 214 172 L106 172 C98 150 100 118 110 96Z" fill="#8C8781"/>
       <path d="M112 172 L110 216 L128 216 L130 170Z M146 172 L146 216 L164 216 L162 170Z M196 170 L198 214 L216 214 L214 168Z M222 166 L228 210 L244 210 L236 150Z" fill="#7D7872"/>
       <path d="M244 110 C252 126 254 150 248 168" stroke="#7D7872" stroke-width="5" fill="none" stroke-linecap="round"/>
       <path d="M70 80 C60 90 58 116 64 132 C78 118 92 110 108 108 L110 84 C96 76 80 74 70 80Z" fill="#8C8781"/>
       <path d="M110 76 C90 60 58 66 50 94 C44 122 58 146 84 150 C98 150 108 138 112 124Z" fill="#9A958E"/>
       <path d="M110 76 C92 66 66 72 60 96 C56 118 66 138 86 142 C98 140 106 130 108 120Z" fill="#B09088" opacity=".45"/>
       <path d="M66 118 C58 140 52 170 58 196 C62 208 72 206 70 196 C66 174 72 148 80 128Z" fill="#8C8781"/>
       <path d="M78 126 C68 130 56 128 48 120 C58 118 68 118 76 118Z" fill="#F4EEDC"/>
       <circle cx="84" cy="100" r="3" fill="#2A2522"/>`,

    "giant-panda": () => sky("gPan", "#DDEBCF", "#B8D4A0") +
      `<g stroke="#5E8C3A" stroke-width="8" stroke-linecap="round"><path d="M34 240 V0"/><path d="M280 240 V10"/><path d="M300 240 V60"/></g>
       <g stroke="#4C7A2E" stroke-width="2"><path d="M30 60 h8 M30 130 h8 M276 90 h8 M296 150 h8 M276 180 h8"/></g>
       <g fill="#77A84B"><path d="M38 70 q30 -6 44 -24 q-30 4 -44 24Z"/><path d="M280 50 q-30 0 -48 -18 q30 0 48 18Z"/><path d="M300 110 q-26 6 -44 -8 q26 -6 44 8Z"/></g>
       <path d="M0 206 Q160 190 320 206 V240 H0Z" fill="#6E9A45"/>
       <ellipse cx="160" cy="160" rx="62" ry="54" fill="#F7F6F1"/>
       <path d="M100 150 C96 176 104 204 124 214 L150 214 C140 192 136 170 140 152Z" fill="#1F1F22"/>
       <path d="M220 150 C224 176 216 204 196 214 L170 214 C180 192 184 170 180 152Z" fill="#1F1F22"/>
       <path d="M104 130 C120 118 200 118 216 130 C212 142 204 148 196 150 L124 150 C116 148 108 142 104 130Z" fill="#1F1F22"/>
       <path d="M110 150 C96 150 88 128 104 116 L128 132Z M210 150 C224 150 232 128 216 116 L192 132Z" fill="#1F1F22"/>
       <circle cx="160" cy="88" r="42" fill="#F7F6F1"/>
       <circle cx="126" cy="54" r="15" fill="#1F1F22"/><circle cx="194" cy="54" r="15" fill="#1F1F22"/>
       <ellipse cx="144" cy="86" rx="10" ry="14" transform="rotate(30 144 86)" fill="#1F1F22"/>
       <ellipse cx="176" cy="86" rx="10" ry="14" transform="rotate(-30 176 86)" fill="#1F1F22"/>
       <circle cx="146" cy="86" r="3" fill="#F7F6F1"/><circle cx="174" cy="86" r="3" fill="#F7F6F1"/>
       <ellipse cx="160" cy="104" rx="7" ry="5" fill="#1F1F22"/>
       <path d="M152 114 Q160 120 168 114" stroke="#1F1F22" stroke-width="2" fill="none"/>
       <path d="M112 128 L112 70" stroke="#6C9C3E" stroke-width="6" stroke-linecap="round"/><path d="M112 76 q-18 -8 -24 -26 q20 6 24 26Z" fill="#77A84B"/>`,

    "emperor-penguin": () => sky("gPen", "#B7D3EA", "#EAF3FA") +
      `<path d="M0 120 L50 104 L70 120 L120 96 L150 112 L200 90 L260 116 L320 100 V160 H0Z" fill="#DCEAF4"/>
       <path d="M0 160 Q160 150 320 160 V240 H0Z" fill="#F4F9FC"/><path d="M0 200 Q100 194 200 204 T320 200" stroke="#C9DCEA" stroke-width="2" fill="none"/>
       <ellipse cx="160" cy="214" rx="46" ry="8" fill="#C9DCEA"/>
       <path d="M122 120 C118 70 138 40 164 40 C190 40 206 70 202 120 C200 170 192 206 162 212 C132 206 124 170 122 120Z" fill="#20252E"/>
       <path d="M138 124 C136 96 146 82 164 82 C182 82 190 98 188 124 C186 166 180 198 162 204 C144 198 140 166 138 124Z" fill="#FBFAF4"/>
       <path d="M138 104 C140 88 150 80 164 82 C160 90 152 98 138 104Z" fill="#FBE7A6"/>
       <path d="M188 104 C186 88 176 80 164 82 C168 90 176 98 188 104Z" fill="#FBE7A6"/>
       <path d="M132 62 C128 74 132 90 142 98 C140 86 142 74 140 64Z" fill="#F5B83A"/>
       <path d="M194 62 C198 74 194 90 184 98 C186 86 184 74 186 64Z" fill="#F5B83A"/>
       <path d="M150 52 L98 66 L150 62Z" fill="#20252E"/><path d="M140 60 L104 65.5 L140 62.5Z" fill="#EE8E3A"/>
       <circle cx="158" cy="50" r="2.4" fill="#5A6270"/>
       <path d="M124 110 C110 130 108 160 114 180 C124 170 128 150 128 130Z M200 110 C214 130 216 160 210 180 C200 170 196 150 196 130Z" fill="#20252E"/>
       <path d="M146 208 l-8 6 h16Z M174 208 l8 6 h-16Z" fill="#20252E"/>`,

    "great-horned-owl": () => sky("gOwl", "#2B3252", "#4A4E6E") +
      `<circle cx="64" cy="54" r="20" fill="#EFE9D2"/>
       <path d="M0 196 C80 186 160 200 320 186 V240 H0Z" fill="#1C2034"/>
       <path d="M60 176 C120 168 220 168 290 172 L290 186 C220 182 120 184 60 190Z" fill="#5A3E2A"/><path d="M280 174 L312 150" stroke="#5A3E2A" stroke-width="8" stroke-linecap="round"/>
       <path d="M116 170 C104 130 110 80 160 70 C210 80 216 130 204 170Z" fill="#7A5638"/>
       <path d="M132 168 C126 136 132 110 160 104 C188 110 194 136 188 168Z" fill="#C9A77A"/>
       <g stroke="#5A3E2A" stroke-width="2"><path d="M140 124 h8 M156 118 h8 M172 124 h8 M140 140 h8 M156 136 h8 M172 142 h8 M146 156 h8 M166 156 h8"/></g>
       <path d="M110 64 C114 40 126 34 134 32 C132 46 132 56 138 66Z M210 64 C206 40 194 34 186 32 C188 46 188 56 182 66Z" fill="#6A4A30"/>
       <ellipse cx="160" cy="80" rx="46" ry="34" fill="#8C6644"/>
       <circle cx="140" cy="80" r="17" fill="#C8905A"/><circle cx="180" cy="80" r="17" fill="#C8905A"/>
       <circle cx="140" cy="80" r="11" fill="#F2B33A"/><circle cx="180" cy="80" r="11" fill="#F2B33A"/>
       <circle cx="140" cy="80" r="5.5" fill="#15110C"/><circle cx="180" cy="80" r="5.5" fill="#15110C"/>
       <circle cx="142" cy="78" r="1.6" fill="#fff"/><circle cx="182" cy="78" r="1.6" fill="#fff"/>
       <path d="M154 90 L160 106 L166 90Z" fill="#3A2C22"/>
       <path d="M146 64 L160 72 L174 64" stroke="#F1E6D0" stroke-width="3" fill="none"/>
       <path d="M144 170 l-4 8 M150 170 l0 9 M170 170 l0 9 M176 170 l4 8" stroke="#D9B45A" stroke-width="3" stroke-linecap="round"/>`,

    "bengal-tiger": () => sky("gTig", "#7FA35A", "#3F6A33") +
      `<g fill="#2F5528"><path d="M0 0 Q30 60 0 120Z"/><path d="M320 20 Q280 80 320 150Z"/><path d="M0 150 Q50 190 0 240Z"/><path d="M320 170 Q270 200 320 240Z"/></g>
       <g fill="#5E8B3E"><path d="M20 30 q40 10 60 -10 q-40 -10 -60 10Z"/><path d="M300 90 q-40 10 -60 -10 q40 -10 60 10Z"/><path d="M26 200 q40 0 54 -20 q-40 0 -54 20Z"/></g>
       <path d="M102 60 C98 40 112 30 128 38 L130 60Z M218 60 C222 40 208 30 192 38 L190 60Z" fill="#E48A2F"/>
       <path d="M108 56 C108 46 116 42 124 46 L124 58Z M212 56 C212 46 204 42 196 46 L196 58Z" fill="#F6E9D6"/>
       <path d="M90 118 C88 70 122 44 160 44 C198 44 232 70 230 118 C228 160 198 196 160 200 C122 196 92 160 90 118Z" fill="#E48A2F"/>
       <path d="M90 128 C96 164 122 190 160 196 C198 190 224 164 230 128 C214 150 194 158 176 150 L160 170 L144 150 C126 158 106 150 90 128Z" fill="#F6E9D6"/>
       <path d="M130 70 C136 64 146 64 150 70 C140 70 134 72 130 70Z M190 70 C184 64 174 64 170 70 C180 70 186 72 190 70Z" fill="#F6E9D6"/>
       <g fill="#1E1712">
       <path d="M160 50 L152 56 L160 70 L168 56Z"/><path d="M140 52 L146 62 L136 64Z"/><path d="M180 52 L174 62 L184 64Z"/>
       <path d="M92 104 L118 110 L94 114Z"/><path d="M228 104 L202 110 L226 114Z"/>
       <path d="M96 130 L120 128 L100 138Z"/><path d="M224 130 L200 128 L220 138Z"/>
       <path d="M104 150 L124 142 L112 158Z"/><path d="M216 150 L196 142 L208 158Z"/>
       <path d="M106 84 L126 92 L108 94Z"/><path d="M214 84 L194 92 L212 94Z"/></g>
       <ellipse cx="138" cy="102" rx="9" ry="6" fill="#F3D04A"/><ellipse cx="182" cy="102" rx="9" ry="6" fill="#F3D04A"/>
       <ellipse cx="138" cy="102" rx="3" ry="5.5" fill="#1E1712"/><ellipse cx="182" cy="102" rx="3" ry="5.5" fill="#1E1712"/>
       <path d="M148 128 L172 128 L160 142Z" fill="#C8756A"/>
       <path d="M160 142 L160 152 M160 152 Q150 162 140 156 M160 152 Q170 162 180 156" stroke="#1E1712" stroke-width="2.4" fill="none"/>
       <g fill="#1E1712"><circle cx="136" cy="148" r="1.4"/><circle cx="130" cy="142" r="1.4"/><circle cx="184" cy="148" r="1.4"/><circle cx="190" cy="142" r="1.4"/></g>`
  };

  const generic = () => sky("gGen", "#DCE8D2", "#AFC79C") +
    `<circle cx="160" cy="120" r="58" fill="none" stroke="#2F5D3A" stroke-width="3" opacity=".5"/>
     <path d="M160 70 C196 92 196 148 160 170 C124 148 124 92 160 70Z" fill="#2F5D3A" opacity=".75"/><path d="M160 76 V166" stroke="#DCE8D2" stroke-width="2"/>`;

  let seq = 0;
  return {
    get(id, label) { const n = ++seq; return wrap((art[id] || generic)(), label || id).replace(/(id="|url\(#)(g[A-Za-z]+)/g, (m, a, b) => a + b + '_' + n); },
    has(id) { return !!art[id]; }
  };
})();
