/* 특별 캐릭터(전설·신화) 그리기: 이모지 하나에 색 필터와 작은 장식을 얹어 환상종처럼 보이게 해요.
   놀이터(index)와 각 놀이의 결과 화면이 함께 써요. window.rpGlyph(c) → HTML, window.rpName(c) → 이름 */
(function () {
  const INFO = {
    /* 전설: 사신(청룡·주작·현무·백호)과 유니콘·페가수스·구미호·기린 */
    '🐉': { name: '청룡',   f: 'sepia(1) saturate(4) hue-rotate(185deg) brightness(.95)',                 ov: [['⚡', 'tr']] },
    '🦅': { name: '주작',   f: 'sepia(1) saturate(6) hue-rotate(-30deg)', ov: [['🔥', 'br'], ['🔥', 'bl']] },
    '🐢': { name: '현무',   f: 'saturate(.3) brightness(.6)',     ov: [['🐍', 'tr']] },
    '🐅': { name: '백호',   f: 'saturate(0) brightness(1.35) contrast(1.15)',        ov: [['❄️', 'tl']] },
    '🦄': { name: '유니콘', f: '',                                                    ov: [['✨', 'tr']] },
    '🐎': { name: '페가수스', f: 'saturate(0) brightness(1.6) contrast(1.05)',                       img: 'img/pegasus.svg', ov: [['✨', 'tr']] },   // 그림 파일로 그려요 (freesvg.org CC0 "One adorable winged unicorn"에서 뿔을 뺀 것)
    '🦊': { name: '구미호', f: 'saturate(.5) brightness(1.25)',                        ov: [['🌙', 'tl'], ['✨', 'br']] },
    '🦌': { name: '기린',   f: 'hue-rotate(15deg) saturate(1.9) brightness(1.1)',     ov: [['🔥', 'bl'], ['✨', 'tr']] },
    /* 신화: 황룡·봉황·천사·우주고래 */
    '🐲': { name: '황룡',   f: 'sepia(1) saturate(4) brightness(1.05)',  ov: [['👑', 't'], ['✨', 'bl'], ['✨', 'br']] },
    '🦚': { name: '봉황',   f: 'saturate(1.6) brightness(1.05)',                     ov: [['🔥', 'tl'], ['🔥', 'tr'], ['✨', 'b']] },
    '👼': { name: '천사',   f: 'brightness(1.08)',                                    ov: [['🌟', 't'], ['☁️', 'b']] },
    '🐋': { name: '우주고래', f: 'hue-rotate(60deg) saturate(1.4) brightness(.95)',    ov: [['🪐', 'tr'], ['⭐', 'bl'], ['✨', 'tl']] },
  };
  /* 이 기기가 이모지를 그릴 수 있는지: 그려서 '없는 글자' 모양과 같으면 못 그리는 거예요 */
  const CAN = {};
  function canDraw(ch) {
    if (ch in CAN) return CAN[ch];
    try {
      const cv = document.createElement('canvas'); cv.width = cv.height = 32; const x = cv.getContext('2d');
      const draw = t => { x.clearRect(0, 0, 32, 32); x.font = '24px sans-serif'; x.textBaseline = 'top'; x.fillText(t, 2, 2); return x.getImageData(0, 0, 32, 32).data.join(); };
      CAN[ch] = draw(ch) !== draw('\u{10FFFF}');
    } catch (e) { CAN[ch] = true; }
    return CAN[ch];
  }
  const POS = { wl: 'left:-16%;top:-10%;font-size:.5em;transform:scaleX(-1)', wr: 'right:-6%;top:-10%;font-size:.5em', tl: 'left:-6%;top:-6%', tr: 'right:-6%;top:-6%', 'tr-flip': 'right:-6%;top:-6%;transform:scaleX(-1)', bl: 'left:-4%;bottom:-4%', br: 'right:-4%;bottom:-4%', t: 'left:50%;top:-18%;transform:translateX(-50%)', b: 'left:50%;bottom:-14%;transform:translateX(-50%)' };
  function glyph(c) {
    const i = INFO[c];
    if (!i) return c || '';
    const body = i.img ? `<img class="rg-e rg-img" src="${i.img}" alt="${i.name}" draggable="false">` : `<span class="rg-e" style="filter:${i.f || 'none'}">${c}</span>`;
    return `<span class="rg" data-c="${c}" title="${i.name}">${body}${i.ov.map(([e, p, k]) => `<i class="rg-o${k ? ' rg-' + k : ''}" style="${POS[p]}">${e}</i>`).join('')}</span>`;
  }
  const css = document.createElement('style');
  css.textContent = `
    .rg { position: relative; display: inline-grid; place-items: center; line-height: 1; }
    .rg-e { display: block; line-height: 1; }
    .rg-img { width: 1.2em; height: 1.1em; object-fit: contain; }
    .rg-o { position: absolute; font-style: normal; font-size: .4em; line-height: 1; pointer-events: none; animation: rg-twinkle 1.6s ease-in-out infinite alternate; }
    .rg-W { filter: saturate(.45) brightness(1.25); animation: none; }   /* 연보라빛 하얀 날개 */
    .rg-o:nth-child(3) { animation-delay: .5s; } .rg-o:nth-child(4) { animation-delay: 1s; }
    @keyframes rg-twinkle { from { opacity: .75; } to { opacity: 1; } }
    @media (prefers-reduced-motion: reduce) { .rg-o { animation: none; } }`;
  document.head.appendChild(css);
  window.rpGlyph = glyph;
  window.rpName = c => (INFO[c] || {}).name || '';
  window.rpCharInfo = INFO;
})();
