/* 무지개 놀이터 목소리: 미리 녹음한 클립(밝은 '선희' 목소리)을 먼저 쓰고, 없으면 기기 목소리를 밝게 조절해서 읽어요 */
(function () {
  const safe = t => String(t).replace(/[.?!,]/g, '').trim().replace(/ /g, '_');
  let list = null;
  try { fetch('audio/list.json').then(r => r.ok ? r.json() : null).then(a => { if (a) list = new Set(a); }).catch(() => {}); } catch (e) {}
  let cur = null;
  const mode = () => { try { return localStorage.getItem('rp-voice') || 'clip'; } catch (e) { return 'clip'; } };
  function tts(text) {
    try {
      if (!('speechSynthesis' in window)) return;
      speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(text);
      u.lang = 'ko-KR'; u.rate = .92; u.pitch = 1.35;          // 조금 빠르고 높게: 밝고 또렷하게
      const vs = speechSynthesis.getVoices().filter(v => v.lang && v.lang.replace('_', '-').toLowerCase().startsWith('ko'));
      const pref = vs.find(v => /female|여성|sunhi|yuna|heami|google/i.test(v.name)) || vs[0];
      if (pref) u.voice = pref;
      speechSynthesis.speak(u);
    } catch (e) {}
  }
  window.rpSpeak = function (text) {
    if (!text) return;
    try { if (cur) { cur.pause(); cur = null; } if ('speechSynthesis' in window) speechSynthesis.cancel(); } catch (e) {}
    if (mode() === 'tts') return tts(text);
    const name = safe(text);
    if (list && !list.has(name)) return tts(text);
    try {
      const a = new Audio('audio/' + encodeURIComponent(name) + '.mp3');
      cur = a; a.onerror = () => tts(text);
      a.play().catch(() => tts(text));
    } catch (e) { tts(text); }
  };
  window.rpStopSpeak = function () { try { if (cur) { cur.pause(); cur = null; } speechSynthesis.cancel(); } catch (e) {} };
  if ('speechSynthesis' in window) speechSynthesis.onvoiceschanged = () => {};
})();
