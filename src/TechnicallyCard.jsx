import './TechnicallyCard.css';

/* Slow, ambient gradient behind the Technical.ly wordmark. Colour blobs drift on
   long (20-30s) loops so the card feels alive without competing with the page. */
export default function TechnicallyCard() {
  return (
    <div className="tl-card" role="img" aria-label="Technical.ly logo">
      <div className="tl-blob tl-blob--green" />
      <div className="tl-blob tl-blob--teal" />
      <div className="tl-blob tl-blob--violet" />
      <div className="tl-blob tl-blob--mint" />

      <svg className="tl-logo" viewBox="10 10 930 250" aria-hidden="true">
        {/* ring, open at the upper right */}
        <path
          d="M210.8 100.7 A94 94 0 1 0 125 218.9"
          fill="none"
          stroke="#fff"
          strokeWidth="22"
        />
        {/* T inside the ring; its stem runs down into the ring's bottom */}
        <rect x="68" y="85" width="90" height="25" fill="#fff" />
        <rect x="103" y="85" width="22" height="145" fill="#fff" />
        <text x="148" y="226" className="tl-word">
          echnical<tspan fill="#74f08a">.</tspan>ly
        </text>
      </svg>
    </div>
  );
}
