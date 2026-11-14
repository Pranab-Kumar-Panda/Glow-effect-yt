(() => {
  const CFG = {
     
  };

  const isIG = location.hostname.includes('instagram.com');
  const isYT = location.hostname.includes('youtube.com');

  const active = () =>
    (isIG && /^\/(reels?)\//.test(location.pathname)) ||
    (isYT && location.pathname.startsWith('/shorts'));

  let wrap, inner, ctx, lastDraw = 0, cw = 0, ch = 0;

  function build() {
    wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'fixed', inset: '0', overflow: 'hidden',
      pointerEvents: 'none', zIndex: '2147483000',
      mixBlendMode: 'screen',           
      opacity: '0', transition: 'opacity .4s'
    });
    inner = document.createElement('canvas');
    Object.assign(inner.style, {
      position: 'absolute', transformOrigin: 'center center',
      filter: `blur(${CFG.blur}px) saturate(${CFG.saturate}) brightness(${CFG.brightness})`
    });
    ctx = inner.getContext('2d');
    wrap.appendChild(inner);
    document.documentElement.appendChild(wrap);
  }
  function pickVideo() {
    const vh = innerHeight, vw = innerWidth;
    let best = null, bestArea = 0;
    for (const v of document.querySelectorAll('video')) {
      const r = v.getBoundingClientRect();
      if (r.width < 80 || r.height < 80) continue;
      const w = Math.min(r.right, vw) - Math.max(r.left, 0);
      const h = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      const area = Math.max(0, w) * Math.max(0, h);
      if (area > bestArea) { bestArea = area; best = v; }
    }
    return best;
  }

  function frame(ts) {
    requestAnimationFrame(frame);
    if (!wrap) build();

    const v = active() ? pickVideo() : null;
    if (!v) { wrap.style.opacity = '0'; return; }

    const r = v.getBoundingClientRect();
    const W = innerWidth, H = innerHeight;

    const w = 64, h = Math.max(8, Math.round(64 * r.height / r.width));
    if (w !== cw || h !== ch) { inner.width = cw = w; inner.height = ch = h; }

    const k = Math.max(CFG.minScale, (W / r.width) * 1.05);
    Object.assign(inner.style, {
      left: r.left + 'px', top: r.top + 'px',
      width: r.width + 'px', height: r.height + 'px',
      transform: `scale(${k})`
    });

    const x1 = r.left, y1 = r.top, x2 = r.right, y2 = r.bottom;
    wrap.style.clipPath =
      `path(evenodd,'M0 0H${W}V${H}H0Z M${x1} ${y1}H${x2}V${y2}H${x1}Z')`;
    wrap.style.opacity = String(CFG.opacity);

    if (ts - lastDraw > 1000 / CFG.fps && v.readyState >= 2) {
      lastDraw = ts;
      try { ctx.drawImage(v, 0, 0, cw, ch); } catch (e) {}
    }
  }
  requestAnimationFrame(frame);
})();
