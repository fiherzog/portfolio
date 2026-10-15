import { useEffect, useRef } from 'react';
import './ModelingGallery.css';

import img1 from './assets/modeling/model-1.jpg';
import img2 from './assets/modeling/model-2.jpg';
import img3 from './assets/modeling/model-3.jpg';
import img4 from './assets/modeling/model-4.jpg';
import img5 from './assets/modeling/model-5.jpg';
import img6 from './assets/modeling/model-6.jpg';
import img7 from './assets/modeling/model-7.jpg';
import img8 from './assets/modeling/model-8.jpg';
import img9 from './assets/modeling/model-9.jpg';
import img10 from './assets/modeling/model-10.jpg';
import img11 from './assets/modeling/model-11.jpg';
import img12 from './assets/modeling/model-12.jpg';
import img13 from './assets/modeling/model-13.jpg';
import img14 from './assets/modeling/model-14.jpg';
import img15 from './assets/modeling/model-15.jpg';

/* Mixed aspect ratios so the grid reads as an editorial collage, not a uniform wall. */
const PHOTOS = [
  { src: img3, ratio: '3 / 4', pos: 'center 30%' },
  { src: img10, ratio: '2 / 3', pos: 'center 30%' },
  { src: img6, ratio: '1 / 1', pos: 'center 55%' },
  { src: img13, ratio: '4 / 5', pos: 'center 45%' },
  { src: img7, ratio: '4 / 5', pos: 'center 20%' },
  { src: img1, ratio: '4 / 5', pos: 'center 35%' },
  { src: img11, ratio: '2 / 3', pos: 'center 40%' },
  { src: img8, ratio: '3 / 4', pos: 'center 35%' },
  { src: img14, ratio: '1 / 1', pos: 'center 35%' },
  { src: img9, ratio: '2 / 3', pos: 'center 50%' },
  { src: img4, ratio: '2 / 3', pos: 'center 40%' },
  { src: img12, ratio: '3 / 4', pos: 'center 35%' },
  { src: img5, ratio: '3 / 4', pos: 'center 45%' },
  { src: img15, ratio: '4 / 5', pos: 'center 30%' },
  { src: img2, ratio: '1 / 1', pos: 'center 30%' },
];

export default function ModelingGallery({ onClose }) {
  const closeRef = useRef(null);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKey);
    closeRef.current?.focus();
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [onClose]);

  return (
    <div
      className="mg-overlay"
      role="dialog"
      aria-modal="true"
      aria-label="Modeling photo gallery"
      onClick={onClose}
    >
      <div className="mg-panel" onClick={(e) => e.stopPropagation()}>
        <div className="mg-header">
          <h2 className="mg-title">Modeling</h2>
          <button ref={closeRef} type="button" className="mg-close" onClick={onClose} aria-label="Close gallery">
            &times;
          </button>
        </div>
        <div className="mg-grid">
          {PHOTOS.map((p, i) => (
            <figure key={i} className="mg-item" style={{ aspectRatio: p.ratio }}>
              <img src={p.src} alt="" loading="lazy" style={{ objectPosition: p.pos }} />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}
