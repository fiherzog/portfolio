import { useEffect, useRef } from 'react';

export default function BroadcastAscii({ height }) {
  const stageRef = useRef(null);
  const preRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const el = preRef.current;
    if (!stage || !el) return;

    const W = 57, H = 29;
    const CX = Math.floor(W / 2), CY = Math.floor(H / 2);
    let mx = 0.5, my = 0.5;
    let animMx = 0.5, animMy = 0.5;
    let vx = 0, vy = 0;
    let rafId;

    const onMouseMove = (e) => {
      const r = stage.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      const ny = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      vx = (nx - mx) * 60;
      vy = (ny - my) * 60;
      mx = nx; my = ny;
    };

    const onTouchMove = (e) => {
      e.preventDefault();
      const t = e.touches[0];
      const r = stage.getBoundingClientRect();
      const nx = Math.max(0, Math.min(1, (t.clientX - r.left) / r.width));
      const ny = Math.max(0, Math.min(1, (t.clientY - r.top) / r.height));
      vx = (nx - mx) * 60;
      vy = (ny - my) * 60;
      mx = nx; my = ny;
    };

    stage.addEventListener('mousemove', onMouseMove);
    stage.addEventListener('touchmove', onTouchMove, { passive: false });

    const RINGS = [
      { r: 2,  chars: ['·','·','·','·'],  speed: 0.00004  },
      { r: 4,  chars: ['-','·','-','·'],  speed: 0.000055 },
      { r: 7,  chars: ['—','·','—','·'],  speed: 0.00007  },
      { r: 10, chars: ['=','·','=','·'],  speed: 0.000085 },
      { r: 14, chars: ['≈','·','≈','·'],  speed: 0.0001   },
      { r: 19, chars: ['~','·','~','·'],  speed: 0.00012  },
    ];

    const ANTENNAE = [[0,-1],[0,-2],[0,-3],[-1,-2],[1,-2]];

    const ringChar = (ring, angle, phase) => {
      const seg = Math.floor(((angle / (Math.PI * 2)) + phase) * ring.chars.length * 4) % ring.chars.length;
      return ring.chars[((seg % ring.chars.length) + ring.chars.length) % ring.chars.length];
    };

    const dist = (x, y, cx, cy) => Math.sqrt((x - cx) ** 2 + ((y - cy) * 1.9) ** 2);

    const render = (t) => {
      const speed = Math.sqrt(vx * vx + vy * vy);
      const cx = CX + (animMx - 0.5) * 10;
      const cy = CY + (animMy - 0.5) * 6;
      const cursorX = animMx * (W - 1);
      const cursorY = animMy * (H - 1);

      const grid = Array.from({ length: H }, () => Array(W).fill(' '));
      const put = (x, y, ch) => {
        const xi = Math.round(x), yi = Math.round(y);
        if (xi >= 0 && xi < W && yi >= 0 && yi < H) grid[yi][xi] = ch;
      };

      for (const ring of RINGS) {
        const phase = -t * ring.speed;
        const steps = Math.max(32, ring.r * 14);
        for (let i = 0; i < steps; i++) {
          const angle = (i / steps) * Math.PI * 2;
          const velAngle = Math.atan2(vy, vx);
          const dot = Math.cos(angle - velAngle);
          const warp = 1 + dot * speed * 0.025;
          const effR = ring.r * warp;
          const stretch = 1 + speed * 0.018;
          const rx = cx + Math.cos(angle) * effR;
          const ry = cy + Math.sin(angle) * effR * 0.52 * stretch;
          put(rx, ry, ringChar(ring, angle, phase));
        }
      }

      const bcx = Math.round(cx), bcy = Math.round(cy);
      put(bcx, bcy, '█'); put(bcx - 1, bcy, '▐'); put(bcx + 1, bcy, '▌');
      put(bcx, bcy - 1, '▄'); put(bcx, bcy + 1, '▀');
      for (const [dx, dy] of ANTENNAE) put(bcx + dx, bcy + dy, '|');
      put(bcx, bcy - 3, '°'); put(bcx - 1, bcy - 2, '/'); put(bcx + 1, bcy - 2, '\\');

      const intensity = 0.5 + 0.5 * Math.sin(t * 0.0012);
      const sparkCount = Math.floor(2 + intensity * 3);
      const sPhase = -t * 0.00012;
      for (let s = 0; s < sparkCount; s++) {
        const angle = (s / sparkCount) * Math.PI * 2 + sPhase * 3;
        const r = 3.5 + Math.sin(sPhase * 7 + s) * 1.5;
        put(cx + Math.cos(angle) * r, cy + Math.sin(angle) * r * 0.52, ['*','✦','·','+','×'][s % 5]);
      }

      for (let y = 0; y < H; y++) {
        for (let x = 0; x < W; x++) {
          if (grid[y][x] !== ' ') continue;
          const dCursor = dist(x, y, cursorX, cursorY);

          if (dCursor < 1.2) { grid[y][x] = '▓'; continue; }
          if (dCursor < 2.2) { grid[y][x] = '░'; continue; }

          if (speed > 0.3 && dCursor < 4 + speed * 3) {
            const trailAngle = Math.atan2(vy, vx);
            const toPoint = Math.atan2((y - cursorY) * 1.9, x - cursorX);
            const diff = Math.abs(((trailAngle - toPoint + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            if (diff < Math.PI * 0.45) {
              const fade = 1 - dCursor / (4 + speed * 3);
              grid[y][x] = ['·', '-', '—', '~', '≈'][Math.floor(fade * 4)];
              continue;
            }
          }

          if (speed > 1.5 && dCursor < 2.5 + speed * 2) {
            const trailAngle = Math.atan2(vy, vx) + Math.PI;
            const toPoint = Math.atan2((y - cursorY) * 1.9, x - cursorX);
            const diff = Math.abs(((trailAngle - toPoint + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
            if (diff < Math.PI * 0.35) { grid[y][x] = '·'; continue; }
          }

          const d = dist(x, y, cx, cy);
          if (dCursor < 2.8 && d > 3) {
            const wave = Math.sin(d * 0.7 - (-t * 0.00045) * 8) * 0.5 + 0.5;
            grid[y][x] = wave > 0.65 ? '·' : ' ';
          }
        }
      }

      el.textContent = grid.map(r => r.join('')).join('\n');
    };

    const loop = (t) => {
      vx *= 0.82; vy *= 0.82;
      animMx += (mx - animMx) * 0.055;
      animMy += (my - animMy) * 0.055;
      render(t);
      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      stage.removeEventListener('mousemove', onMouseMove);
      stage.removeEventListener('touchmove', onTouchMove);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      style={{
        background: '#0A0800',
        height: height,
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        cursor: 'crosshair',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      <pre
        ref={preRef}
        style={{
          fontFamily: "'Courier New', Courier, monospace",
          fontSize: 13,
          lineHeight: 1.35,
          letterSpacing: '0.06em',
          whiteSpace: 'pre',
          color: '#FFD97A',
          textShadow: '0 0 6px rgba(255,200,60,0.55), 0 0 14px rgba(255,160,20,0.28), 0 0 28px rgba(255,120,0,0.14)',
        }}
      />
    </div>
  );
}
