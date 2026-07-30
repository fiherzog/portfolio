import { useRef, useState } from 'react';
import Nav from './Nav';
import './Playground.css';

import imgRiso        from './assets/riso.png';
import imgPikachu     from './assets/pikachu.png';
import imgAppleCraft  from './assets/applecraft.png';
import imgKoifish     from './assets/koifish.png';
import imgLuckycat    from './assets/luckycat.png';
import imgBeads       from './assets/beads.png';
import imgImg5500     from './assets/img5500.png';
import imgCatcoasters from './assets/catcoasters.png';
import imgImg4915     from './assets/img4915.png';
import imgImg1852     from './assets/img1852.png';
import imgBoloButton  from './assets/bolobutton.png';

/* ── Cursor-following tooltip labels ── */

const risoLabel = (
  <>
    <p>
      series of <a href="https://risottostudio.com/pages/what-is-risograph-printing?srsltid=AfmBOoreAiBNWhZX5vLfqpYtv_ckWVhxpTIVSGigYOOaguzDGK5QLgRe" target="_blank" rel="noreferrer">riso-prints</a>.
    </p>
    <p>&nbsp;</p>
    <p>
      <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Materials: </span>
      <span style={{ fontStyle: 'normal', fontWeight: 400 }}>Risoprinting machine, Adobe Illustrator. </span>
    </p>
    <p style={{ fontStyle: 'normal', fontWeight: 400 }}>
      Designed by me. Other blocks on this page feature other risoprinted projects.
    </p>
  </>
);

const appleLabel = 'glass-blown apple';

const boloLabel = (
  <>
    <p>Oversized Button Bolo Tie</p>
    <p>&nbsp;</p>
    <p>
      <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Materials</span>
      <span style={{ fontStyle: 'normal', fontWeight: 400 }}>:</span>
    </p>
    <p style={{ fontStyle: 'normal', fontWeight: 400 }}>Laser-cut Eucalyptus &amp; Para-cord.</p>
  </>
);

const beadsLabel = (
  <>
    <p>glass bead jewelry</p>
    <p>&nbsp;</p>
    <p>
      <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Materials: </span>
      <span style={{ fontStyle: 'normal', fontWeight: 400 }}>24 gauge wire, glass beads.</span>
    </p>
  </>
);

const koifishLabel = (
  <>
    <p>3-D multi-layered puzzle</p>
    <p>&nbsp;</p>
    <p>
      <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Materials: </span>
      <span style={{ fontStyle: 'normal', fontWeight: 400 }}>Acrylic paint, spray paint, blue acrylic, clear acrylic, laser-cut</span>
    </p>
  </>
);

const luckycatLabel = (
  <>
    <p>lucky-cat keychains w/ bottle-opener, ruler, &amp; charms</p>
    <p>&nbsp;</p>
    <p>
      <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Materials &amp; Tools</span>
      <span style={{ fontStyle: 'normal', fontWeight: 400 }}>:</span>
    </p>
    <p style={{ fontStyle: 'normal', fontWeight: 400 }}>
      Rhino, Figma, Adobe Illustrator, laser-cutting, wood, acrylic, para-cord
    </p>
    <p style={{ fontStyle: 'italic', fontWeight: 400 }}>Sold in markets in Philadelphia</p>
  </>
);

const img4915Label = (
  <>
    <p>resin-cast lotus ring</p>
    <p>&nbsp;</p>
    <p>
      <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Materials: </span>
      <span style={{ fontStyle: 'normal', fontWeight: 400 }}>UV resin, silicone mold,</span>
    </p>
    <p style={{ fontStyle: 'normal', fontWeight: 400 }}>
      MeshyAI and Blender.<br />
      3D model was generated using MeshyAI and refined in Blender before being cast in resin.
    </p>
  </>
);

function Img({ src, alt = '', ratio, label }) {
  const tooltipRef = useRef(null);
  const rafRef     = useRef(null);
  const [hovered, setHovered] = useState(false);

  function move(x, y) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    });
  }

  function handleMouseMove(e)  { move(e.clientX, e.clientY); }
  function handleMouseEnter(e) { move(e.clientX, e.clientY); setHovered(true); }
  function handleMouseLeave()  { setHovered(false); }

  return (
    <div
      className={`pg-img${label ? ' pg-img--labeled' : ''}`}
      style={{ aspectRatio: ratio }}
      onMouseMove={label ? handleMouseMove : undefined}
      onMouseEnter={label ? handleMouseEnter : undefined}
      onMouseLeave={label ? handleMouseLeave : undefined}
    >
      <img src={src} alt={alt} />
      {label && (
        <span ref={tooltipRef} className={`pg-tooltip${hovered ? ' pg-tooltip--visible' : ''}`}>
          {label}
        </span>
      )}
    </div>
  );
}

function ComingSoon({ stretch = false }) {
  return (
    <div className={`pg-img pg-coming-soon${stretch ? ' pg-coming-soon--stretch' : ''}`}>
      <span>image coming soon!</span>
    </div>
  );
}

export default function Playground() {
  return (
    <div className="playground-page">
      <Nav />
      <div className="playground-container">
        <p className="pg-intro">
          from learning 3D model to manning a risograph printer, if a tool/technology/skill can help
          me achieve a goal, I will be sure to learn it. enjoy some of my non-work projects. hover
          over each image to learn more about my creation process.
        </p>

        <div className="pg-masonry">

          {/* Row 1: riso (col 1) | wide coming soon (cols 2–3) */}
          <div className="pg-row">
            <div className="pg-col">
              <Img src={imgRiso} ratio="427/573" label={risoLabel} />
            </div>
            <div className="pg-col-wide">
              <ComingSoon stretch />
            </div>
          </div>

          {/* Row 2: applecraft/bolo/img4915/beads + wide coming soon (cols 1–2) | koifish, pikachu, img1852 stacked continuously (col 3) */}
          <div className="pg-row">
            <div className="pg-col-wide">
              <div className="pg-row">
                <div className="pg-col">
                  <Img src={imgAppleCraft} ratio="426/379" label={appleLabel} />
                  <Img src={imgImg4915}    ratio="426/495" label={img4915Label} />
                </div>
                <div className="pg-col">
                  <Img src={imgBoloButton} ratio="426/538" label={boloLabel} />
                  <Img src={imgBeads}      ratio="426/352" label={beadsLabel} />
                </div>
              </div>
              <ComingSoon stretch />
            </div>
            <div className="pg-col">
              <Img src={imgKoifish}  ratio="426/438" label={koifishLabel} />
              <Img src={imgPikachu} ratio="426/379" />
              <Img src={imgImg1852} ratio="426/568" />
            </div>
          </div>

          {/* Row 4: three image columns */}
          <div className="pg-row">
            <div className="pg-col">
              <Img src={imgLuckycat}    ratio="427/451" label={luckycatLabel} />
            </div>
            <div className="pg-col">
              <Img src={imgImg5500}     ratio="426/728" />
            </div>
            <div className="pg-col">
              <Img src={imgCatcoasters} ratio="427/440" />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
