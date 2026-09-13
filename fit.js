/* 한 화면 맞춤: 내용이 화면보다 크면 .wrap 전체를 줄여서(zoom) 스크롤 없이 다 보이게 해요.
   화면 크기·방향이 바뀌거나 내용이 바뀔 때마다 다시 잽니다. */
(function () {
  let timer = null, busy = false;
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
    busy = true;
    w.style.zoom = '1';
    for (let i = 0; i < 4; i++) {
      const n = need();
      const z = Math.min(1, innerHeight / n.h, innerWidth / n.w);
      if (z >= 0.995) break;
      const cur = parseFloat(w.style.zoom) || 1;
      w.style.zoom = String(Math.max(0.4, Math.floor(cur * z * 0.985 * 1000) / 1000));
    }
    busy = false;
  }
  const sched = () => { clearTimeout(timer); timer = setTimeout(fit, 60); };
  addEventListener('resize', sched);
  addEventListener('orientationchange', sched);
  addEventListener('load', sched);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(sched);
  new MutationObserver(recs => { if (busy) return; if (recs.some(r => !(r.type === 'attributes' && r.attributeName === 'style'))) sched(); })
    .observe(document.documentElement, { subtree: true, childList: true, attributes: true, attributeFilter: ['hidden', 'class'] });
  sched();
})();
