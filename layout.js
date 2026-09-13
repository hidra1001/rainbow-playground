/* 놀이 화면을 왼쪽(문제)·오른쪽(답) 두 칸으로 묶어요. 세로 화면에서는 CSS(display: contents)로 원래처럼 한 줄로 보여요 */
(function () {
  function arrange() {
    const game = document.getElementById('game');
    if (!game || game.querySelector('.cols')) return;
    const byId = ids => ids.map(id => document.getElementById(id)).filter(Boolean);
    let L = [], R = [], wide = false;
    if (document.getElementById('answers')) {            // 아케이드: 무대 | 규칙·답·안내
      L = byId(['area']); R = byId(['ask', 'answers', 'skip-btn', 'feedback']); wide = true;
    } else if (document.getElementById('area')) {        // 두뇌: 판 | 안내
      L = byId(['area']); R = byId(['ask', 'feedback']); wide = true;
    } else if (document.getElementById('pad')) {         // 산수: 문제 | 보기·숫자판
      L = byId(['ask', 'stage', 'eq']); R = byId(['choices', 'pad', 'feedback']);
    } else {                                              // 한글: 그림·낱말 | 보기·타일
      L = [...game.querySelectorAll('.pic'), ...byId(['ask', 'word'])]; R = byId(['choices', 'tiles', 'tools', 'feedback']);
    }
    if (!L.length) return;
    const cols = document.createElement('div'); cols.className = 'cols' + (wide ? ' wide-left' : '');
    const cl = document.createElement('div'); cl.className = 'colL';
    const cr = document.createElement('div'); cr.className = 'colR';
    game.insertBefore(cols, L[0]);
    L.forEach(el => cl.appendChild(el)); R.forEach(el => cr.appendChild(el));
    cols.appendChild(cl); cols.appendChild(cr);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', arrange); else arrange();
})();
