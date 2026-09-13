/* 한 화면 맞춤: 처음 열 때(화면 크기·방향이 정해질 때) 내용이 화면보다 크면 .wrap 전체를 줄여요(zoom).
   그 뒤로는 화면이 바뀔 때(탭 전환, 놀이 화면 전환)만 window.rpFit()로 다시 잽니다. */
(function () {
  let timer = null;
  function need() {   // 내용이 차지하는 높이·너비 (body 여백 포함)
    const w = document.querySelector('.wrap'), cs = getComputedStyle(document.body);
    const r = w.getBoundingClientRect();
    const padB = parseFloat(cs.paddingBottom) || 0, padR = parseFloat(cs.paddingRight) || 0;
    let bottom = r.bottom, right = r.right;
    for (const el of w.querySelectorAll('*')) { if (el.offsetParent === null) continue; const b = el.getBoundingClientRect(); if (b.bottom > bottom) bottom = b.bottom; if (b.right > right) right = b.right; }
    return { h: bottom + padB, w: right + padR };
  }
  function fit() {
    const w = document.querySelector('.wrap');
    if (!w) return;
    w.style.zoom = '1';
    for (let i = 0; i < 4; i++) {
      const n = need();
      const z = Math.min(1, innerHeight / n.h, innerWidth / n.w);
      if (z >= 0.995) break;
      const cur = parseFloat(w.style.zoom) || 1;
      w.style.zoom = String(Math.max(0.4, Math.floor(cur * z * 0.985 * 1000) / 1000));
    }
  }
  const sched = () => { clearTimeout(timer); timer = setTimeout(fit, 60); };
  window.rpFit = sched;
  addEventListener('resize', sched);
  addEventListener('orientationchange', sched);
  addEventListener('load', sched);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sched);
  sched();
})();
