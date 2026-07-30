import { useEffect, useRef } from 'react';
import './WellsFargoCard.css';
import cardImg from './assets/Autograph.png';

export default function WellsFargoCard({ height = 250 }) {
  const stageRef = useRef(null);
  const cardRef = useRef(null);
  const shineRef = useRef(null);

  useEffect(() => {
    const stage = stageRef.current;
    const card = cardRef.current;
    const shine = shineRef.current;
    if (!stage || !card || !shine) return;

    let mx = 0.5, my = 0.5;
    let px = 0.5, py = 0.5;
    let hover = 0, hoverTarget = 0;
    let idleT = Math.random() * 100;
    let rafId;

    const onMove = (e) => {
      const r = stage.getBoundingClientRect();
      mx = Math.max(0, Math.min(1, (e.clientX - r.left) / r.width));
      my = Math.max(0, Math.min(1, (e.clientY - r.top) / r.height));
      hoverTarget = 1;
    };
    const onLeave = () => { hoverTarget = 0; };

    stage.addEventListener('mousemove', onMove);
    stage.addEventListener('mouseleave', onLeave);

    const loop = () => {
      idleT += 0.024;
      hover += (hoverTarget - hover) * 0.06;

      const idleX = 0.5 + Math.sin(idleT) * 0.36;
      const idleY = 0.5 + Math.cos(idleT * 0.8) * 0.24;
      px += ((mx * hover + idleX * (1 - hover)) - px) * 0.12;
      py += ((my * hover + idleY * (1 - hover)) - py) * 0.12;

      const rotY = (px - 0.5) * 30;
      const rotX = (0.5 - py) * 20;
      const scale = 1 + hover * 0.05;

      card.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${scale})`;

      const shadowX = -rotY * 1.2;
      const shadowY = rotX * 1.1 + 22;
      const shadowBlur = 36 + hover * 22;
      card.style.filter = `drop-shadow(${shadowX}px ${shadowY}px ${shadowBlur}px rgba(0,0,0,${0.5 + hover * 0.18}))`;

      const shineOpacity = 0.16 + hover * 0.38;
      shine.style.background = `radial-gradient(circle at ${px * 100}% ${py * 100}%, rgba(255,255,255,${shineOpacity}) 0%, rgba(255,255,255,0) 42%)`;

      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(rafId);
      stage.removeEventListener('mousemove', onMove);
      stage.removeEventListener('mouseleave', onLeave);
    };
  }, []);

  return (
    <div
      ref={stageRef}
      style={{
        height,
        background: 'radial-gradient(ellipse at 50% 55%, rgba(140,25,95,0.32), rgba(0,0,0,0) 62%), #000',
        borderRadius: 10,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        cursor: 'pointer',
      }}
    >
      <div style={{ position: 'relative', width: '78%', perspective: 1000 }}>
        <div
          ref={cardRef}
          style={{ position: 'relative', width: '100%', transformStyle: 'preserve-3d', willChange: 'transform' }}
        >
          <img
            src={cardImg}
            alt="Wells Fargo Autograph card"
            style={{ width: '100%', display: 'block', pointerEvents: 'none' }}
            draggable={false}
          />
          <div
            ref={shineRef}
            style={{
              position: 'absolute',
              inset: 0,
              WebkitMaskImage: `url(${cardImg})`,
              maskImage: `url(${cardImg})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              mixBlendMode: 'overlay',
              pointerEvents: 'none',
            }}
          />
          <div
            style={{
              position: 'absolute',
              inset: 0,
              WebkitMaskImage: `url(${cardImg})`,
              maskImage: `url(${cardImg})`,
              WebkitMaskSize: '100% 100%',
              maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat',
              maskRepeat: 'no-repeat',
              overflow: 'hidden',
              pointerEvents: 'none',
            }}
          >
            <div className="wf-shimmer" />
          </div>
          <img
            src={cardImg}
            alt=""
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              width: '100%',
              transform: 'scaleY(-1)',
              opacity: 0.22,
              WebkitMaskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)',
              maskImage: 'linear-gradient(to bottom, rgba(0,0,0,0.55), rgba(0,0,0,0) 70%)',
              pointerEvents: 'none',
            }}
            draggable={false}
          />
        </div>
      </div>
    </div>
  );
}
