import './Work.css';
import Nav from './Nav';
import BroadcastAscii from './BroadcastAscii';
import imgTechnicalLy from './assets/technical.ly.gif';
import imgStride from './assets/6fb80f6da4ca8760bfd70495e32e0d792071f288.png';
import imgPentup from './assets/c52614be57450f8c6e1fa96ffabf4e79b24ce4fc.png';
import imgAnalysis from './assets/7f5ad0fab4208493f8350635e5ab8eb7f87994b0.png';
import imgResearch from './assets/8758e72ecde3286b6144b7b8c12d40bc41529f48.png';
import imgQuickFlicks from './assets/a523302f0ee1de7840dfe472e6b4ed4a78510d52.png';
import imgFox from './assets/fox.gif';
import videoAssignments from './assets/assignments-editor.mp4';
import videoQuickFlicks from './assets/quickflicks.mp4';

function ProjectCard({ image, video, imageFit = 'cover', imageHeight, imageAspectRatio, meta, title, titleHref, imageHref, description, imageStyle, customImage }) {
  const imageContainerStyle = imageAspectRatio
    ? { aspectRatio: imageAspectRatio }
    : { height: imageHeight };
  const href = imageHref || titleHref;

  const media = video ? (
    <video
      src={video}
      className="project-img"
      style={{ objectFit: 'cover' }}
      autoPlay
      loop
      muted
      playsInline
    />
  ) : image ? (
    <img
      src={image}
      alt=""
      className="project-img"
      style={{ objectFit: imageFit, ...imageStyle }}
    />
  ) : (
    <div className="project-img-placeholder" />
  );

  return (
    <div className="project-card">
      {customImage ? (
        href ? (
          <a href={href} target="_blank" rel="noreferrer" className="project-image-custom">
            {customImage}
          </a>
        ) : (
          <div className="project-image-custom">{customImage}</div>
        )
      ) : (
        <div className="project-image" style={imageContainerStyle}>
          {href ? (
            <a href={href} target="_blank" rel="noreferrer">
              {media}
            </a>
          ) : (
            media
          )}
        </div>
      )}
      <div className="project-meta">{meta}</div>
      {titleHref ? (
        <a href={titleHref} target="_blank" rel="noreferrer" className="project-title project-title--link">
          {title}
        </a>
      ) : (
        <h2 className="project-title">{title}</h2>
      )}
      <p className="project-description">{description}</p>
    </div>
  );
}

export default function Work() {
  return (
    <div className="work-page">
      <Nav />

      <p className="bio">
        fiona herzog is a <em>communications</em> &amp; <em>computer science</em> student passionate
        about learning tools to create meaningful projects. below are projects spanning product
        development, project management, and data analysis.
      </p>

      <div className="work-grid">
        {/* Column 1 */}
        <div className="work-col">
          <ProjectCard
            image={imgTechnicalLy}
            imageAspectRatio="417/250"
            imageFit="cover"
            imageStyle={{ transform: 'scale(1.35)', transformOrigin: 'center center' }}
            meta="September 2024 - May 2025 | Product Management Internship"
            title="Technical.ly Media"
            titleHref="https://www.figma.com/design/6yoTBLEsRoOg3Yr34SfH8R/Technically-Designs?node-id=0-1&t=0pwdbhzCQKvP3g7q-1"
            imageHref="https://www.figma.com/design/6yoTBLEsRoOg3Yr34SfH8R/Technically-Designs?node-id=0-1&t=0pwdbhzCQKvP3g7q-1"
            description={
              <>
                Translated regional ecosystem research into building the{' '}
                <em>Map of Innovations</em>, connecting key stakeholders and surfacing trends in US
                tech culture.
              </>
            }
          />
          <ProjectCard
            image={imgPentup}
            imageAspectRatio="417/372"
            imageFit="cover"
            meta="Winter 2025 | Project | Product Manager"
            title="Pent-Up"
            titleHref="https://spark-project-pentup.netlify.app"
            imageHref="https://www.figma.com/deck/YZNnxjdtHuQ8gsYnHGjR7S"
            description="A deployed digital experience that is anonymous & authenticated for Penn students to express, manage, and release their pent-up emotions."
          />
          <ProjectCard
            video={videoAssignments}
            imageAspectRatio="432/386"
            titleHref="https://www.34st.com/staff/fiona_herzog"
            meta="Fall 2023 - Present | Executive Board"
            title="Assignments Editor @ 34th Street Magazine"
            description="Author 20+ articles on film, culture, & topical events. Oversee cross-team collaboration with S&P, copy, and design departments, ensuring cohesive branding and alignment between editorial and promotional efforts."
          />
        </div>

        {/* Column 2 */}
        <div className="work-col">
          <ProjectCard
            image={imgFox}
            imageAspectRatio="417/235"
            imageFit="cover"
            meta="Summer 2025 | Internship"
            title="Fox Tech"
            description="Owned 0→1 design and development of a custom Slack app that streamlined editorial feedback and approval workflows for Fox Sports' personalized newsletters."
          />
          <ProjectCard
            image={imgAnalysis}
            imageAspectRatio="417/170"
            imageFit="cover"
            imageStyle={{ objectPosition: '30% center' }}
            imageHref="https://www.34st.com/staff/fiona_herzog"
            meta="Winter 2024 | Project"
            title="NLP Text Analysis"
            titleHref="https://www.34st.com/staff/fiona_herzog"
            description="Built an NLP pipeline to process 5 years of articles using n-grams, KWIC analysis, frequency analysis and more on language patterns in the magazine."
          />
          <ProjectCard
            video={videoQuickFlicks}
            imageAspectRatio="884/1474"
            meta="Spring 2024 | Project | Product Designer"
            title="QuickFlicks"
            titleHref="https://quickflicks.onrender.com/play"
            description="Conceptualized and designed a film trivia game inspired by NYT Connections, creating engaging interaction flows, visual hierarchy, and grouping mechanics to enhance user experience and test players' movie knowledge."
          />
        </div>

        {/* Column 3 */}
        <div className="work-col">
          <ProjectCard
            customImage={<BroadcastAscii height={321} />}
            meta="Spring 2026 | Design Engineer | Job"
            title="Center of Media Technology & Democracy"
            titleHref="https://www.linkedin.com/company/penn-center-on-media-technology-and-democracy/"
            description="Designed visual identity and full website redesign for UPenn academic center w/ logo, brand system, and multi-page site. Delivered production-ready HTML/CSS/JS with scroll animations, theme switching, and editorial layout system."
          />
          <ProjectCard
            image={imgStride}
            imageAspectRatio="417/166"
            imageFit="cover"
            imageStyle={{ objectPosition: 'center center' }}
            imageHref="https://drive.google.com/file/d/1jMT_3r9PM-nb2xRpqvAQTl48ltEfj2eI/view"
            meta="Winter 2024 | Project | Product Manager"
            title="Stride"
            titleHref="https://drive.google.com/file/d/1jMT_3r9PM-nb2xRpqvAQTl48ltEfj2eI/view"
            description="A transit companion app dedicated to streamlining the commuter experience and boosting public transport ridership."
          />
          <ProjectCard
            image={imgResearch}
            imageAspectRatio="417/250"
            imageFit="cover"
            imageHref="https://pricelab.sas.upenn.edu/projects/minor-lables"
            meta={
              <>
                Summer 2025 | Research |<br />Price Lab of Digital Humanities
              </>
            }
            title="Detecting Genres"
            titleHref="https://pricelab.sas.upenn.edu/projects/minor-lables"
            description="Merged, cleaned, and analyzed music datasets (35K+ records) using Python; applied clustering, sentiment analysis, and network analysis to identify trends in genre evolution, with visualizations of temporal dynamics."
          />
        </div>
      </div>
    </div>
  );
}
