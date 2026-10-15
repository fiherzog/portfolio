import { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Nav from './Nav';
import './CaseStudy.css';

const assets = import.meta.glob('./assets/mediated/*.{jpg,mp4,svg}', {
  eager: true,
  query: '?url',
  import: 'default',
});
const asset = (name) => assets[`./assets/mediated/${name}`];

const LIVE_URL = 'https://mediated.upenn.edu';

const SECTIONS = [
  { id: 'overview', label: 'Overview' },
  { id: 'goals', label: 'Goals' },
  { id: 'audiences', label: 'Audiences' },
  { id: 'architecture', label: 'Information architecture' },
  { id: 'identity', label: 'Visual identity' },
  { id: 'compendium', label: 'Research compendium' },
  { id: 'dashboard', label: 'LLM dashboard' },
  { id: 'system', label: 'The wider system' },
  { id: 'responsive', label: 'Responsive' },
  { id: 'build', label: 'Build' },
  { id: 'reflection', label: 'Reflection' },
];

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ── Media primitives ── */

function Frame({ url = 'mediated.upenn.edu', caption, children, className = '' }) {
  return (
    <figure className={`cs-figure ${className}`}>
      <div className="cs-frame">
        <div className="cs-frame-bar" aria-hidden="true">
          <span /><span /><span />
          <div className="cs-frame-url">{url}</div>
        </div>
        <div className="cs-frame-body">{children}</div>
      </div>
      {caption && <figcaption className="cs-caption">{caption}</figcaption>}
    </figure>
  );
}

function Shot({ name, alt, url, caption, className }) {
  // Intrinsic sizes reserve layout space so lazy-loading never shifts the page
  const [width, height] = name.startsWith('nav-') ? [1600, 660] : [2000, 1250];
  return (
    <Frame url={url} caption={caption} className={className}>
      <img src={asset(`${name}.jpg`)} alt={alt} width={width} height={height} loading="lazy" decoding="async" />
    </Frame>
  );
}

// Looping clip of the live site. Plays only while on screen.
function Clip({ name, url, caption, className, aspect = '1280 / 800', bare = false }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    el.muted = true;
    if (prefersReducedMotion()) {
      el.pause();
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const video = (
    <video
      ref={ref}
      src={asset(`${name}.mp4`)}
      poster={asset(`${name}-poster.jpg`)}
      style={{ aspectRatio: aspect }}
      loop
      muted
      playsInline
      preload="metadata"
      aria-label={caption}
    />
  );

  if (bare) {
    return (
      <figure className={`cs-figure ${className || ''}`}>
        <div className="cs-clip-bare">{video}</div>
        {caption && <figcaption className="cs-caption">{caption}</figcaption>}
      </figure>
    );
  }
  return (
    <Frame url={url} caption={caption} className={className}>
      {video}
    </Frame>
  );
}

function Reveal({ children, className = '', as: Tag = 'div' }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) {
      setShown(true);
      return undefined;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px' },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag ref={ref} className={`cs-reveal${shown ? ' is-shown' : ''} ${className}`}>
      {children}
    </Tag>
  );
}

function Section({ id, index, label, title, children }) {
  return (
    <section id={id} className="cs-section" data-cs-section>
      <Reveal>
        <p className="cs-kicker">
          <span>{String(index).padStart(2, '0')}</span> {label}
        </p>
        <h2 className="cs-h2">{title}</h2>
      </Reveal>
      {children}
    </section>
  );
}

function Decision({ title, children }) {
  return (
    <Reveal className="cs-decision">
      <h3>{title}</h3>
      <p>{children}</p>
    </Reveal>
  );
}

/* ── Audience explorer ── */

const AUDIENCES = [
  {
    id: 'press',
    label: 'Journalists & media leaders',
    arrives: 'On deadline, looking for what the research says about a story they are already reporting.',
    needs: 'A plain-language takeaway, who the Penn expert is, and a link they can cite without reading the paper first.',
    path: ['Research', 'Research Compendium', 'Key takeaway', 'Copy entry link'],
  },
  {
    id: 'policy',
    label: 'Policymakers & civil society',
    arrives: 'Trying to decide what to do about platforms, AI and elections, and need evidence rather than abstracts.',
    needs: 'Why a finding matters and what follows from it, stated before any methods.',
    path: ['Research Compendium', 'Full summary & details', 'Why is this important?', 'Key recommendations'],
  },
  {
    id: 'researchers',
    label: 'Researchers & faculty',
    arrives: 'Looking for collaborators, funding and data, or checking where their own work sits in the field.',
    needs: 'Clear grant criteria, the datasets the center supports, and a sense of who else is working nearby.',
    path: ['Grants', 'Request for Proposals', 'Data & PennMAP', 'Affiliated Faculty'],
  },
  {
    id: 'students',
    label: 'Students & early-career scholars',
    arrives: 'Curious about the field, or looking for a seminar, a fellowship or a job.',
    needs: 'To know the door is open to them: who can attend, how to register, and what roles exist.',
    path: ['Events', 'Seminar schedule', 'Event Registration', 'Job Openings'],
  },
  {
    id: 'educators',
    label: 'Teachers & newcomers',
    arrives: 'Needs to get up to speed on a fast-moving topic, such as how LLMs are shaping civic life, before teaching or writing about it.',
    needs: 'An orientation, then a way to browse by theme instead of searching for terms they do not know yet.',
    path: ['LLM Civic Discourse', 'Topic Primer', 'Theme chips', 'Paper cards'],
  },
];

function AudienceExplorer() {
  const [active, setActive] = useState(AUDIENCES[0].id);
  const current = AUDIENCES.find((a) => a.id === active);

  return (
    <Reveal className="cs-audiences">
      <div className="cs-tabs" role="tablist" aria-label="Audiences">
        {AUDIENCES.map((a) => (
          <button
            key={a.id}
            type="button"
            role="tab"
            id={`tab-${a.id}`}
            aria-selected={a.id === active}
            aria-controls="audience-panel"
            className={`cs-tab${a.id === active ? ' is-active' : ''}`}
            onClick={() => setActive(a.id)}
          >
            {a.label}
          </button>
        ))}
      </div>
      <div className="cs-audience-panel" id="audience-panel" role="tabpanel" aria-labelledby={`tab-${active}`} key={active}>
        <div className="cs-audience-cols">
          <div>
            <h4>Arrives</h4>
            <p>{current.arrives}</p>
          </div>
          <div>
            <h4>Needs in the first ten seconds</h4>
            <p>{current.needs}</p>
          </div>
        </div>
        <h4>Path I designed for</h4>
        <ol className="cs-path">
          {current.path.map((step) => (
            <li key={step}>{step}</li>
          ))}
        </ol>
      </div>
    </Reveal>
  );
}

/* ── Sitemap ── */

const SITEMAP = [
  { label: 'Home', kids: ["What's New", 'Newsletter'] },
  { label: 'Research', kids: ['Research Compendium', 'LLM Civic Discourse'] },
  { label: 'Blog', kids: [] },
  { label: 'Data', kids: ['PennMAP'] },
  { label: 'Grants', kids: ['Grants Overview', 'Request for Proposals'] },
  { label: 'Events', kids: ['Seminar schedule', 'Event Registration'] },
  { label: 'Team', kids: ['Leadership & Staff', 'Affiliated Faculty', 'Job Openings'] },
  { label: 'About', kids: [] },
];

function Sitemap() {
  return (
    <Reveal className="cs-sitemap">
      <div className="cs-sitemap-root">Penn MEDIATED</div>
      <div className="cs-sitemap-grid">
        {SITEMAP.map((node) => (
          <div className="cs-sitemap-node" key={node.label}>
            <div className="cs-sitemap-top">{node.label}</div>
            {node.kids.map((k) => (
              <div className="cs-sitemap-kid" key={k}>{k}</div>
            ))}
          </div>
        ))}
      </div>
    </Reveal>
  );
}

/* ── Identity pieces ── */

const SWATCHES = [
  { name: 'Signal violet', token: '--c-accent', hex: '#5533ee', dark: true },
  { name: 'Broadcast red', token: '--c-red-dark', hex: '#df3611', dark: true },
  { name: 'Ink', token: '--c-dark', hex: '#0d0d0c', dark: true },
  { name: 'Paper', token: '--c-light-bg', hex: '#f8f7f4', dark: false },
  { name: 'Teal', token: '--c-acc-3', hex: '#2bccb4', dark: false },
  { name: 'Magenta', token: '--c-acc-4', hex: '#d120a9', dark: true },
];

const THEME_CHIPS = [
  { label: 'Content Moderation', bg: '#f9e4f5', fg: '#6f285c', border: '#d120a9' },
  { label: 'Misinformation', bg: '#fce4dc', fg: '#7b2719', border: '#f03d1f' },
  { label: 'Political Bias', bg: '#ebe7fd', fg: '#3d3c86', border: '#5533ee' },
  { label: 'Public Deliberation', bg: '#e6f9f6', fg: '#005b4a', border: '#2bccb4' },
];

const TOKENS = `:root {
  --c-bg: #ffffff;
  --c-dark: #0d0d0c;
  --c-light-bg: #f8f7f4;
  --c-accent: #5533ee;
  --c-red-dark: #df3611;

  /* every accent ships as a trio: color, tint, readable text */
  --c-acc-3: #2bccb4;
  --c-acc-3-tint: #e6f9f6;
  --c-acc-3-text: #005b4a;

  /* 4px-based spacing scale */
  --space-100: 8px;
  --space-200: 16px;
  --space-300: 24px;
  --space-400: 32px;
  --space-600: 48px;
  --space-1000: 80px;
}`;

/* ── Page ── */

export default function MediatedCaseStudy() {
  const [active, setActive] = useState(SECTIONS[0].id);
  const [progress, setProgress] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const tocRef = useRef(null);

  const scrollToSection = (id, smooth = true) => {
    const el = document.getElementById(id);
    if (!el) return;
    el.scrollIntoView({ behavior: smooth && !prefersReducedMotion() ? 'smooth' : 'auto', block: 'start' });
  };

  const onTocClick = (e, id) => {
    e.preventDefault();
    scrollToSection(id);
    setSearchParams({ s: id }, { replace: true });
  };

  // Deep link: /work/mediated?s=compendium
  useEffect(() => {
    const target = searchParams.get('s');
    if (!target) return undefined;
    const t = setTimeout(() => scrollToSection(target, false), 60);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Scrollspy + reading progress
  useEffect(() => {
    const onScroll = () => {
      const doc = document.documentElement;
      const max = doc.scrollHeight - doc.clientHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);

      const line = window.innerHeight * 0.35;
      let current = SECTIONS[0].id;
      document.querySelectorAll('[data-cs-section]').forEach((el) => {
        if (el.getBoundingClientRect().top <= line) current = el.id;
      });
      if (max > 0 && window.scrollY >= max - 4) current = SECTIONS[SECTIONS.length - 1].id;
      setActive(current);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  // Keep the active chip visible in the mobile section bar
  useEffect(() => {
    const bar = tocRef.current;
    const chip = bar?.querySelector('[aria-current="true"]');
    if (bar && chip && bar.scrollWidth > bar.clientWidth) {
      bar.scrollTo({ left: chip.offsetLeft - 16, behavior: 'smooth' });
    }
  }, [active]);

  const index = (id) => SECTIONS.findIndex((s) => s.id === id) + 1;

  return (
    <div className="cs-page">
      <div className="cs-progress" style={{ transform: `scaleX(${progress})` }} aria-hidden="true" />
      <Nav />

      <div className="cs-crumbs">
        <Link to="/work">← Work</Link>
        <span>/</span>
        <span>Center on Media, Technology &amp; Democracy</span>
      </div>

      <div className="cs-layout">
        <aside className="cs-toc" aria-label="Sections">
          <p className="cs-toc-label">On this page</p>
          <ul ref={tocRef}>
            {SECTIONS.map((s, i) => (
              <li key={s.id}>
                <a
                  href={`#/work/mediated?s=${s.id}`}
                  onClick={(e) => onTocClick(e, s.id)}
                  aria-current={active === s.id ? 'true' : undefined}
                  className={active === s.id ? 'is-active' : ''}
                >
                  <span className="cs-toc-num">{String(i + 1).padStart(2, '0')}</span>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
          <button type="button" className="cs-toc-top" onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? 'auto' : 'smooth' })}>
            ↑ Back to top
          </button>
        </aside>

        <main className="cs-main">
          {/* 01 Overview */}
          <section id="overview" className="cs-section cs-section--first" data-cs-section>
            <Reveal>
              <h1 className="cs-title">
                A front door for Penn&rsquo;s research on media, technology <em>&amp;</em> democracy
              </h1>
              <p className="cs-lede">
                The Center on Media, Technology and Democracy (Penn MEDIATED) studies how information moves
                through society. I designed its visual identity and rebuilt its website so that research
                written for other academics becomes something a journalist, a policymaker or a student can
                actually use.
              </p>
            </Reveal>

            <Reveal className="cs-meta">
              <div>
                <h4>Role</h4>
                <p>Design engineer</p>
              </div>
              <div>
                <h4>Timeline</h4>
                <p>Spring 2026</p>
              </div>
              <div>
                <h4>Scope</h4>
                <p>Logo &amp; brand system, information architecture, UX, front-end build</p>
              </div>
              <div>
                <h4>Live</h4>
                <p>
                  <a href={LIVE_URL} target="_blank" rel="noreferrer">mediated.upenn.edu ↗</a>
                </p>
              </div>
            </Reveal>

            <Clip
              name="hero"
              caption="The home page: a broadcast-tower motif drawn in dots, set on the brand gradient."
              className="cs-figure--hero"
            />

            <Reveal className="cs-stats">
              <div><strong>7</strong><span>Penn schools &amp; centers represented</span></div>
              <div><strong>69</strong><span>Compendium entries, each with a plain-language takeaway</span></div>
              <div><strong>87</strong><span>Papers in the LLM &amp; civic discourse dashboard</span></div>
              <div><strong>8</strong><span>Top-level destinations, nothing deeper than two clicks</span></div>
            </Reveal>

            <Reveal className="cs-prose">
              <h3>What I delivered</h3>
              <ul className="cs-list">
                <li>A logo, color system, type pairing and spacing tokens that the center&rsquo;s staff can extend without me.</li>
                <li>A sitemap and navigation organized around what each visitor is trying to do, not around the center&rsquo;s org chart.</li>
                <li>The Research Compendium, a searchable and filterable library of Penn research written for non-specialists.</li>
                <li>A themed dashboard for LLMs &amp; civic discourse, plus pages for grants, events, data and people.</li>
                <li>Production-ready HTML, CSS and JavaScript with scroll animations, theme switching and an editorial layout system.</li>
              </ul>
            </Reveal>
          </section>

          {/* 02 Goals */}
          <Section id="goals" index={index('goals')} label="Goals" title="Research this good shouldn’t need a decoder ring.">
            <Reveal className="cs-prose">
              <p>
                Penn MEDIATED pulls together empirical work from seven schools and centers, from Annenberg and
                Wharton to SEAS and Carey Law. That is a strength, and it is also a problem. Each paper is
                written for a specialist audience, and the center&rsquo;s stated purpose is to make rigorous
                research &ldquo;more accessible and actionable.&rdquo; The website is where that promise either
                holds or collapses.
              </p>
            </Reveal>
            <Reveal className="cs-goals">
              <div>
                <span>1</span>
                <h3>Translate, don&rsquo;t just list</h3>
                <p>Every research entry leads with what it means before what it measured.</p>
              </div>
              <div>
                <span>2</span>
                <h3>One home, many visitors</h3>
                <p>A journalist and a first-year PhD student should both find their next click within seconds.</p>
              </div>
              <div>
                <span>3</span>
                <h3>Look like evidence, feel alive</h3>
                <p>Credible enough for a university center, distinctive enough to be remembered.</p>
              </div>
            </Reveal>
          </Section>

          {/* 03 Audiences */}
          <Section id="audiences" index={index('audiences')} label="Audiences" title="Five kinds of visitors, five different first questions.">
            <Reveal className="cs-prose">
              <p>
                The center&rsquo;s own writing names its readers: journalists, media leaders, civil society
                organizations and policymakers. The rest of the site makes clear who else walks through the
                door: Penn faculty applying for grants, PhD students and postdocs attending the seminar,
                prospective fellows and staff, and anyone trying to get oriented on a fast-moving topic.
                Rather than designing for an average visitor, I wrote down what each person arrives wanting,
                then designed the shortest believable path to it.
              </p>
            </Reveal>
            <AudienceExplorer />
            <Decision title="Design for the ten-second reader first">
              Journalists and policymakers will not scroll past a wall of methods. So the first thing every
              research entry shows is a one-to-two sentence takeaway, and everything deeper is one click away
              for the readers who want it.
            </Decision>
          </Section>

          {/* 04 Architecture */}
          <Section id="architecture" index={index('architecture')} label="Information architecture" title="Organize by intent, then repeat it where people look.">
            <Reveal className="cs-prose">
              <p>
                The navigation has eight top-level items and never goes deeper than one dropdown. Labels are
                nouns people already use (Research, Grants, Events, Team) rather than internal program names.
                Dropdowns exist only where a section has two or more genuine destinations, so Blog, Data and
                About stay as direct links.
              </p>
            </Reveal>
            <Sitemap />
            <div className="cs-pair">
              <Shot name="nav-research" alt="Research dropdown open, showing Research Compendium and LLM Civic Discourse" url="mediated.upenn.edu" caption="Dropdowns stay short, and the current page is marked in the brand red." />
              <Shot name="nav-team" alt="Team dropdown open, showing Leadership and Staff, Faculty and Job Openings" url="mediated.upenn.edu" caption="Team groups people and opportunities together: staff, faculty and jobs." />
            </div>
            <Clip name="nav" caption="Hovering through each menu." />
            <Decision title="The footer is a second sitemap, grouped by what you want to do">
              The header follows the site&rsquo;s structure. The footer regroups the same pages into
              <strong> Research</strong>, <strong>Center</strong> and <strong>Resources</strong>. The last
              column collects the pages people act on, like the grants call for proposals, data access and
              event registration, so they are findable without knowing which section they belong to.
            </Decision>
          </Section>

          {/* 05 Identity */}
          <Section id="identity" index={index('identity')} label="Visual identity" title="A signal in a quiet room.">
            <Reveal className="cs-prose">
              <p>
                A center about the media ecosystem suggested a broadcast metaphor: a signal radiating outward.
                That became a dotted tower with concentric rings on the home page, a dot-grid texture that
                runs through cards and section breaks, and a single bold gradient reserved for moments that
                matter. Everything else stays restrained, with a black header, generous white space and a
                serif headline face, so the research itself reads as the loudest thing on the page.
              </p>
            </Reveal>

            <Reveal className="cs-identity">
              <div className="cs-logo-tile" aria-label="MEDIATED logo on the brand gradient">
                <img src={asset('logo.svg')} alt="Penn MEDIATED, University of Pennsylvania wordmark" />
              </div>
              <div className="cs-specimen">
                <p className="cs-specimen-label">Headlines · EB Garamond</p>
                <p className="cs-specimen-display">Research Compendium</p>
                <p className="cs-specimen-label">Body &amp; interface · DM Sans</p>
                <p className="cs-specimen-body">
                  Evidence linking algorithms to harmful online outcomes is inconclusive, as user preferences
                  and content supply also shape what people consume.
                </p>
              </div>
            </Reveal>

            <Reveal className="cs-swatches">
              {SWATCHES.map((s) => (
                <div key={s.token} className="cs-swatch" style={{ background: s.hex, color: s.dark ? '#fff' : '#0d0d0c' }}>
                  <strong>{s.name}</strong>
                  <code>{s.hex}</code>
                </div>
              ))}
            </Reveal>

            <Decision title="Every accent comes as a trio, so color never hurts legibility">
              The theme tags that organize the research each use a color, a pale tint and a darker text shade.
              Pairing them keeps small labels readable while still letting eight themes be told apart at a glance.
            </Decision>
            <Reveal className="cs-chips" aria-label="Example theme tags">
              {THEME_CHIPS.map((c) => (
                <span key={c.label} style={{ background: c.bg, color: c.fg, borderColor: c.border }}>{c.label}</span>
              ))}
            </Reveal>

            <Reveal className="cs-code">
              <p className="cs-code-label">Design tokens (excerpt)</p>
              <pre><code>{TOKENS}</code></pre>
            </Reveal>
          </Section>

          {/* 06 Compendium */}
          <Section id="compendium" index={index('compendium')} label="Research compendium" title="Sixty-nine papers, one question: what does this mean for me?">
            <Reveal className="cs-prose">
              <p>
                The compendium is the heart of the site and the hardest design problem in it. It has to be
                scannable for someone skimming for a quote, deep enough for a researcher, and honest about
                what each study found. I treated each entry as a small piece of editorial writing: a title, a
                lead, then supporting detail.
              </p>
            </Reveal>

            <Shot name="comp-top" alt="Research Compendium landing view with intro text, newsletter card and filter bar" caption="The page opens with who the compendium is for, a newsletter prompt, and then straight into the library." />

            <Decision title="A table, not a grid of cards">
              People comparing studies read across: who led it, when, and what it found. A four-column table
              (title, Penn faculty lead, date, key takeaway) makes that comparison effortless in a way tiles do
              not. Titles are set in the serif headline face so that they read as headlines, not data.
            </Decision>

            <Clip name="compendium" caption="Searching, filtering by theme and year, clearing filters, then opening a full summary." />

            <Decision title="Filters that behave like a conversation">
              The filter bar is sticky, so it follows the reader down the list. A live count (&ldquo;18 of 69
              entries&rdquo;) confirms every change, and Clear filters stays quiet until there is something to
              clear. Themes, faculty leads, years and sort order cover the ways people are likely to look,
              from &ldquo;what&rsquo;s new&rdquo; to &ldquo;everything by this professor.&rdquo;
            </Decision>

            <Shot name="comp-filtered" alt="Compendium filtered to LLMs and Civic Discourse, showing 18 of 69 entries" caption="Filtered to one theme: the count updates, themes appear as color-coded tags, and the most recent entries carry a NEW badge." />

            <Decision title="Progressive disclosure for the full story">
              &ldquo;Full summary &amp; details&rdquo; expands inline into three panels: an
              <strong> Overview</strong>, <strong>Why is this important?</strong> and
              <strong> Key recommendations</strong>. It keeps the list calm for skimmers while giving
              policymakers the argument, in the order they need it. &ldquo;Copy entry link&rdquo; gives
              journalists a stable URL for one specific study.
            </Decision>

            <Shot name="comp-expanded" alt="An expanded compendium entry showing Overview, Why is this important, and Key recommendations panels" caption="An expanded entry. Each panel has its own tint so the structure is visible before a word is read." />
          </Section>

          {/* 07 Dashboard */}
          <Section id="dashboard" index={index('dashboard')} label="LLM dashboard" title="Same research, a different job: helping newcomers explore.">
            <Reveal className="cs-prose">
              <p>
                The LLMs &amp; Civic Discourse page collects 87 papers on a topic moving faster than any
                textbook. Visitors here are often orienting, not citing, so I chose a different pattern from
                the compendium on purpose. Cards with abstracts and color-coded themes invite browsing, and
                a row of theme chips turns the whole collection into a filter you can explore without knowing
                the right search term.
              </p>
            </Reveal>
            <Shot name="llm-top" alt="LLMs and Civic Discourse page with intro text, related center programming and theme chips" caption="An introduction on the left, and related center programming (convenings, grants, reports) on the right." />
            <Clip name="llm" caption="Toggling theme chips and searching narrows the paper cards instantly." />
            <Decision title="Connect research to everything else the center does">
              The sidebar brings events, grants and reports about the same topic next to the papers. A reader
              who arrives for research can discover that there is a convening to attend or a grant to apply for,
              and the page works as a hub instead of a dead end.
            </Decision>
            <Shot name="llm-cards" alt="Grid of paper cards with theme tags, authors and abstracts" caption="Penn-authored papers are flagged with a tab, and each card shows venue, year, authors and a short abstract." />
          </Section>

          {/* 08 System */}
          <Section id="system" index={index('system')} label="The wider system" title="The same rules, from the home page to the people page.">
            <Reveal className="cs-prose">
              <p>
                Once the patterns for headlines, color bands and cards were settled, the other pages followed
                them. Full-width gradient bands signal a change of subject, white pages carry the reading, and
                a small set of card styles keeps everything feeling like one publication.
              </p>
            </Reveal>
            <Shot name="home-news" alt="Home page What's New section with a mix of colored feature cards" caption="Home: a bento-style What&rsquo;s New, where one lead story and several smaller ones each get their own color." />
            <div className="cs-pair">
              <Shot name="team" alt="Leadership and Staff page with portrait cards on a gradient band" caption="Team: portraits sit in a uniform circle and grayscale, so a faculty director and a new fellow carry equal weight." />
              <Shot name="events" alt="Events page showing the Fall 2026 seminar schedule next to a gradient band" caption="Events: the seminar poster is shown at full legibility beside the key facts." />
            </div>
            <div className="cs-pair">
              <Shot name="grants-2" alt="Grants overview page with three category cards with colored top borders" caption="Grants: three categories, each tied to a theme color so they can be told apart without reading." />
              <Shot name="data" alt="Data Infrastructure page describing PennMAP" caption="Data: a plainspoken explanation of PennMAP, with the brand red reserved for links." />
            </div>
          </Section>

          {/* 09 Responsive */}
          <Section id="responsive" index={index('responsive')} label="Responsive" title="Designed for the phone someone reads it on between meetings.">
            <Reveal className="cs-prose">
              <p>
                A lot of this audience will arrive from a link in an email or a post. On a phone, navigation
                collapses to a single menu, the broadcast tower drops below the headline, and long copy keeps
                a comfortable line length. Interactive tools like filters are sized for touch.
              </p>
            </Reveal>
            <Reveal className="cs-phones">
              <figure><img src={asset('m-home.jpg')} alt="Home page on a phone" width="780" height="1688" loading="lazy" /><figcaption className="cs-caption">Home</figcaption></figure>
              <figure><img src={asset('m-comp.jpg')} alt="Research compendium on a phone" width="780" height="1688" loading="lazy" /><figcaption className="cs-caption">Compendium</figcaption></figure>
              <figure><img src={asset('m-llm.jpg')} alt="LLM dashboard on a phone" width="780" height="1688" loading="lazy" /><figcaption className="cs-caption">LLM dashboard</figcaption></figure>
              <figure><img src={asset('m-team.jpg')} alt="Team page on a phone" width="780" height="1688" loading="lazy" /><figcaption className="cs-caption">Team</figcaption></figure>
            </Reveal>
            <div className="cs-phone-clip">
              <Clip name="mobile" aspect="390 / 844" bare caption="Home on a 390px-wide screen, then the collapsed menu." />
            </div>
          </Section>

          {/* 10 Build */}
          <Section id="build" index={index('build')} label="Build" title="Design that the team can keep shipping.">
            <Reveal className="cs-prose">
              <p>
                I built the site as production-ready HTML, CSS and JavaScript, with the interactive pieces,
                like the compendium and dashboards, as self-contained modules that run inside the
                center&rsquo;s existing WordPress site. That keeps the content team in the CMS they already
                know, while the library data and interactions live in code that can be updated without
                redesigning a page.
              </p>
            </Reveal>
            <Reveal className="cs-build-grid">
              <div>
                <h3>Design tokens first</h3>
                <p>Color, type and spacing live in CSS variables, so a change to the palette or scale propagates everywhere.</p>
              </div>
              <div>
                <h3>Motion with restraint</h3>
                <p>Scroll animations introduce sections and respect reduced-motion preferences.</p>
              </div>
              <div>
                <h3>Theme switching</h3>
                <p>Theme changes are driven by the same tokens, so switching does not mean maintaining a second stylesheet.</p>
              </div>
              <div>
                <h3>Editorial layout system</h3>
                <p>A small set of reusable page patterns (intro, band, card grid, table) lets staff add a page without a designer.</p>
              </div>
            </Reveal>
          </Section>

          {/* 11 Reflection */}
          <Section id="reflection" index={index('reflection')} label="Reflection" title="What I learned">
            <Reveal className="cs-prose cs-reflection">
              <h3>Pattern follows task</h3>
              <p>
                The compendium is a table and the dashboard is a set of cards because one is for comparing and
                the other is for exploring. Choosing the pattern from the task, instead of reusing one
                component everywhere, was the most valuable decision in the project.
              </p>
              <h3>A brand system is a handoff</h3>
              <p>
                Tokens, accent trios and a handful of layouts mattered more than any single page. They are what
                lets the center add a seminar, a grant round or a new theme months after I am gone.
              </p>
              <h3>What I would do next</h3>
              <p>
                I would put the filters in front of real journalists and first-year students and watch where
                they hesitate, then use search and filter analytics to see which themes people actually reach for.
              </p>
            </Reveal>

            <Reveal className="cs-cta">
              <a className="cs-btn" href={LIVE_URL} target="_blank" rel="noreferrer">Visit the live site ↗</a>
              <Link className="cs-btn cs-btn--ghost" to="/work">← Back to all work</Link>
            </Reveal>
          </Section>
        </main>
      </div>
    </div>
  );
}
