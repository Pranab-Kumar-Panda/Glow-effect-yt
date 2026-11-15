(() => {
  const CFG = {
    enabled: true, instagram: true, youtube: true,
    size: 0.35,        
    opacity: 0.6,     
    brightness: 0.5,  
    saturate: 1.3,    
    softness: 3,      
    fps: 12           
  };

  const isIG = location.hostname.includes('instagram.com');
  const isYT = location.hostname.includes('youtube.com');

  const active = () =>
    CFG.enabled && (
      (isIG && CFG.instagram && /^\/(reels?)\//.test(location.pathname)) ||
      (isYT && CFG.youtube && location.pathname.startsWith('/shorts'))
    );

  const SRC_W = 32;
  const src = document.createElement('canvas');
  const sctx = src.getContext('2d');
  let wrap, left, right, video = null;
  let lastPick = 0, lastDraw = 0, lastT = -1, geo = '', sh = 0;

  function applySettings(s) {
    Object.assign(CFG, s);
    geo = ''; sh = 0; lastT = -1;
  }
  try {
    chrome.storage.local.get(CFG, applySettings);
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area !== 'local') return;
      const s = {};
      for (const k in changes) s[k] = changes[k].newValue;
      applySettings(s);
    });
  } catch (e) {}

  const fade = dir =>
    `linear-gradient(to ${dir}, transparent 0%, rgba(0,0,0,.15) 15%, ` +
    `rgba(0,0,0,.4) 35%, rgba(0,0,0,.7) 60%, rgba(0,0,0,.92) 82%, #000 100%)`;

  function panel(dir) {
    const box = document.createElement('div');
    Object.assign(box.style, {
      position: 'absolute', top: '0', height: '100%', overflow: 'hidden'
    });
    const cv = document.createElement('canvas');
    Object.assign(cv.style, { position: 'absolute', transformOrigin: 'center center' });
    const gr = document.createElement('div');
    Object.assign(gr.style, {
      position: 'absolute', top: '0', height: '100%', background: fade(dir)
    });
    box.append(cv, gr);
    wrap.appendChild(box);
    return { box, cv, gr, ctx: cv.getContext('2d') };
  }

  function build() {
    wrap = document.createElement('div');
    Object.assign(wrap.style, {
      position: 'fixed', inset: '0', pointerEvents: 'none',
      zIndex: '2147483000', mixBlendMode: 'screen',
      opacity: '0', transition: 'opacity .4s'
    });
    left = panel('left');
    right = panel('right');
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
    if (!active()) { if (wrap) wrap.style.opacity = '0'; return; }
    if (!wrap) build();

    if (!video || !video.isConnected || ts - lastPick > 150) {
      video = pickVideo(); lastPick = ts;
    }
    if (!video) { wrap.style.opacity = '0'; return; }

    const r = video.getBoundingClientRect();
    const W = innerWidth;
    const g = [r.left, r.top, r.width, r.height, W].map(Math.round).join(',');

    if (g !== geo) {
      geo = g;
      const e = r.width * CFG.size;
      const k = 1 + (2 * e) / r.width;
      const sizeStyle = {
        top: r.top + 'px', width: r.width + 'px', height: r.height + 'px',
        transform: `scale(${k})`
      };

      left.box.style.left = '0px';
      left.box.style.width = Math.max(0, r.left) + 'px';
      Object.assign(left.cv.style, sizeStyle, { left: r.left + 'px' });
      Object.assign(left.gr.style, { left: (r.left - e) + 'px', width: e + 'px' });

      right.box.style.left = r.right + 'px';
      right.box.style.width = Math.max(0, W - r.right) + 'px';
      Object.assign(right.cv.style, sizeStyle, { left: '0px' });
      Object.assign(right.gr.style, { left: '0px', width: e + 'px' });

      const h = Math.max(8, Math.round(SRC_W * r.height / r.width));
      if (h !== sh) {
        sh = h;
        for (const c of [src, left.cv, right.cv]) { c.width = SRC_W; c.height = h; }
        sctx.filter = `blur(${CFG.softness}px) saturate(${CFG.saturate}) brightness(${CFG.brightness})`;
      }
    }
    wrap.style.opacity = String(CFG.opacity);

    if (ts - lastDraw > 1000 / CFG.fps && video.readyState >= 2 &&
        video.currentTime !== lastT && sh) {
      lastDraw = ts; lastT = video.currentTime;
      try {
        sctx.drawImage(video, 0, 0, SRC_W, sh);
        left.ctx.drawImage(src, 0, 0);
        right.ctx.drawImage(src, 0, 0);
      } catch (e) {}
    }
  }
  requestAnimationFrame(frame);
})();