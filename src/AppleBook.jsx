import { useEffect, useRef, useState } from 'react';
import { PageFlip } from 'page-flip';
import './AppleBook.css';

import pageCover from './assets/apple-book/01-cover.jpg';
import pageContents from './assets/apple-book/02-contents.jpg';
import pageDedication from './assets/apple-book/03-dedication.jpg';
import pageChapterIntro from './assets/apple-book/04-chapter-intro.jpg';
import pagePerfectApple from './assets/apple-book/05-perfect-apple.jpg';
import pageAppleOneTitle from './assets/apple-book/06-apple-one-title.jpg';
import pageAppleOneStory from './assets/apple-book/07-apple-one-story.jpg';
import pageAppleTwoTitle from './assets/apple-book/08-apple-two-title.jpg';
import pageAppleTwoStory from './assets/apple-book/09-apple-two-story.jpg';
import pageAppleThreeTitle from './assets/apple-book/10-apple-three-title.jpg';
import pageAppleThreeStory from './assets/apple-book/11-apple-three-story.jpg';
import pageBackCover from './assets/apple-book/12-back-cover.jpg';

// Plain sequential pages — StPageFlip pairs them into spreads itself
// (via showCover) and does the actual paper-curl rendering, so there's
// no leaf/front-back bookkeeping needed on our side any more.
const PAGES = [
  { src: pageCover },
  { src: pageContents },
  { src: pageDedication },
  { src: pageChapterIntro, crop: true },
  { src: pagePerfectApple },
  { src: pageAppleOneTitle },
  { src: pageAppleOneStory },
  { src: pageAppleTwoTitle },
  { src: pageAppleTwoStory },
  { src: pageAppleThreeTitle },
  { src: pageAppleThreeStory },
  { src: pageBackCover, crop: true },
];

const AUTOPLAY_INTERVAL = 3000;
const AUTOPLAY_PAUSE_AT_END = 1600;

const appleBookLabel = (
  <>
    <p style={{ fontWeight: 700 }}>apple book</p>
    <p>&nbsp;</p>
    <p>
      <span style={{ fontStyle: 'normal', fontWeight: 700 }}>Materials: </span>
      <span style={{ fontStyle: 'normal', fontWeight: 400 }}>
        lasercut acrylic, Adobe Illustrator, spray painted metal rings.
      </span>
    </p>
    <p style={{ fontStyle: 'normal', fontWeight: 400 }}>Designed by me.</p>
  </>
);

// Single-page aspect ratio (height / width) from the source art.
const PAGE_ASPECT = 1294 / 1000;

// `size: 'stretch'` reads the container's size once at construction
// and never re-measures it, so it tends to catch the container mid
// layout (before its flex/percentage sizing has settled) and freeze
// on a too-small book. Measuring it ourselves and using `size: 'fixed'`
// sidesteps that entirely.
function measurePageSize(container) {
  const { width, height } = container.getBoundingClientRect();
  const byWidth = { w: width / 2, h: (width / 2) * PAGE_ASPECT };
  const byHeight = { w: height / PAGE_ASPECT, h: height };
  const fit = byWidth.h <= height ? byWidth : byHeight;
  return { width: Math.max(1, Math.round(fit.w)), height: Math.max(1, Math.round(fit.h)) };
}

function buildPageEl(page, index) {
  const el = document.createElement('div');
  el.className = 'ab-page';
  if (index === 0 || index === PAGES.length - 1) {
    el.dataset.density = 'hard';
  }
  const img = document.createElement('img');
  img.src = page.src;
  img.alt = '';
  img.draggable = false;
  if (page.crop) img.className = 'ab-page-img--crop';
  el.appendChild(img);
  return el;
}

function FlipBook({ interactive = false, autoPlay = false }) {
  const containerRef = useRef(null);
  const flipRef = useRef(null);
  const autoplayTimer = useRef(null);
  const [pageNum, setPageNum] = useState(0);
  const [pageCount, setPageCount] = useState(PAGES.length);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    // PageFlip's destroy() removes the root element it's given, which
    // would rip out our React-managed ref node (fatal under StrictMode's
    // mount→cleanup→mount cycle, since the second mount reuses the same
    // node). Give it a disposable inner wrapper instead so `container`
    // itself is never touched by the library.
    const root = document.createElement('div');
    root.style.width = '100%';
    root.style.height = '100%';
    // The library's own internal wrapper doesn't always end up exactly
    // as tall as the height we ask for — center it explicitly so any
    // leftover space splits evenly above/below instead of collecting
    // on one side.
    root.style.display = 'flex';
    root.style.alignItems = 'center';
    root.style.justifyContent = 'center';
    container.appendChild(root);

    const pageEls = PAGES.map((page, i) => buildPageEl(page, i));
    pageEls.forEach((el) => root.appendChild(el));

    const { width, height } = measurePageSize(container);
    // Pin root's height to exactly the computed book height (rather
    // than 100% of a possibly-taller wrap) so there's no leftover
    // vertical space for the library's internal layout to mismanage —
    // width stays flexible since it already centers a single cover
    // page vs. a two-page spread correctly on its own.
    root.style.height = `${height}px`;
    const flip = new PageFlip(root, {
      width,
      height,
      size: 'fixed',
      maxShadowOpacity: 0.5,
      showCover: true,
      flippingTime: 1400,
      useMouseEvents: interactive,
      clickEventForward: interactive,
      disableFlipByClick: !interactive,
      mobileScrollSupport: false,
    });
    flip.loadFromHTML(pageEls);
    flip.on('flip', (e) => setPageNum(e.data));
    setPageCount(flip.getPageCount());
    flipRef.current = flip;

    if (autoPlay) {
      autoplayTimer.current = setInterval(() => {
        const cur = flip.getCurrentPageIndex();
        if (cur >= flip.getPageCount() - 1) {
          setTimeout(() => flip.turnToPage(0), AUTOPLAY_PAUSE_AT_END);
        } else {
          flip.flipNext();
        }
      }, AUTOPLAY_INTERVAL);
    }

    return () => {
      if (autoplayTimer.current) clearInterval(autoplayTimer.current);
      flip.destroy();
      container.innerHTML = '';
      flipRef.current = null;
    };
  }, [interactive, autoPlay]);

  useEffect(() => {
    if (!interactive) return undefined;
    function onKey(e) {
      if (!flipRef.current) return;
      if (e.key === 'ArrowRight') flipRef.current.flipNext();
      if (e.key === 'ArrowLeft') flipRef.current.flipPrev();
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [interactive]);

  return (
    <div className="ab-wrap">
      <div className="ab-flip-outer" ref={containerRef} />
      {interactive && (
        <div className="ab-controls">
          <button
            type="button"
            onClick={() => flipRef.current?.flipPrev()}
            disabled={pageNum === 0}
            aria-label="Previous page"
          >
            ‹
          </button>
          <span className="ab-counter">
            {pageNum + 1} / {pageCount}
          </span>
          <button
            type="button"
            onClick={() => flipRef.current?.flipNext()}
            disabled={pageNum >= pageCount - 1}
            aria-label="Next page"
          >
            ›
          </button>
        </div>
      )}
    </div>
  );
}

export default function AppleBook() {
  const [open, setOpen] = useState(false);
  const [hovered, setHovered] = useState(false);
  const tooltipRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    function onKey(e) {
      if (e.key === 'Escape') setOpen(false);
    }
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open]);

  function moveTooltip(x, y) {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      if (tooltipRef.current) {
        tooltipRef.current.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
      }
    });
  }

  return (
    <>
      <button
        type="button"
        className="pg-img pg-img--labeled pg-coming-soon pg-coming-soon--stretch ab-card"
        onClick={() => setOpen(true)}
        onMouseMove={(e) => moveTooltip(e.clientX, e.clientY)}
        onMouseEnter={(e) => {
          moveTooltip(e.clientX, e.clientY);
          setHovered(true);
        }}
        onMouseLeave={() => setHovered(false)}
        aria-label="Open interactive Apples book preview"
      >
        <FlipBook autoPlay />
        <span ref={tooltipRef} className={`pg-tooltip${hovered ? ' pg-tooltip--visible' : ''}`}>
          {appleBookLabel}
        </span>
      </button>

      {open && (
        <div className="ab-modal-backdrop" onClick={() => setOpen(false)}>
          <div className="ab-modal" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="ab-modal-close"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              ×
            </button>
            <FlipBook interactive />
          </div>
        </div>
      )}
    </>
  );
}
