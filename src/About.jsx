import Nav from './Nav';
import { VineRight, VineLeft } from './Vine';
import './About.css';

import imgFiona from './assets/fiona.png';
import imgPhoto1 from './assets/photo1.png';
import imgPhoto2 from './assets/photo2.png';
import imgPhoto3 from './assets/photo3.png';
import imgLinkedin from './assets/linkedin.svg';
import imgInstagram from './assets/instagram.svg';
import imgGithub from './assets/github.svg';

const experience = [
  { role: 'Product Manager Intern', company: 'Wells Fargo', date: 'June 2026 – Present' },
  { role: 'Design Engineer', company: 'Center of Media, Technology, & Democracy', date: 'January 2026 – Present' },
  { role: 'Product Management Intern', company: 'Technical.ly', date: 'Fall 2024 – Summer 2025' },
  { role: 'Events Editor', company: 'Association of Computing Machinery (ACM) XRDS Magazine', date: 'Summer 2024 – Present' },
  { role: 'Computer Science Head Teaching Assistant', company: 'University of Pennsylvania School of Engineering', date: 'Spring 2024 – Present' },
  { role: 'Growth Marketing Intern', company: 'FOX Studios (Tech)', date: 'Summer 2025' },
  { role: 'Research Assistant', company: 'Price Labs for Digital Humanities', date: 'Spring 2025' },
  { role: 'Product Manager', company: 'Penn Spark', date: 'Fall 2023 – Present' },
  { role: 'Assignments Editor on Executive Board', company: '34th Street', date: 'Fall 2023 – Present' },
];

export default function About() {
  return (
    <div className="about-page">
      <Nav />

      <div className="about-container">

        {/* ── Introduction ── */}
        <section className="intro">
          <div className="intro-photo">
            <img src={imgFiona} alt="Fiona Herzog" />
          </div>
          <div className="intro-content">
            <p className="intro-text">
              Hello, I am Fiona Herzog!
              <br /><br />
              I am a student that is passionate about learning and utilizing technology to create an
              impact. I currently study Communications &amp; Computer Science with a concentration in
              Data and Network science at the University of Pennsylvania.
              <br /><br />
              Below you can find where to contact me and view more of my work. For any questions and
              inquiries, feel free to e-mail me at fherzog@sas.upenn.edu
            </p>
            <div className="social-links">
              <a href="https://www.linkedin.com/in/fionaherzog/" target="_blank" rel="noreferrer" className="social-item">
                <img src={imgLinkedin} alt="LinkedIn" className="social-icon" />
                <span>/fionaherzog</span>
              </a>
              <a href="https://github.com/fiherzog" target="_blank" rel="noreferrer" className="social-item">
                <img src={imgGithub} alt="GitHub" className="social-icon" />
                <span>@fiherzog</span>
              </a>
              <a href="https://www.instagram.com/blackberrings/" target="_blank" rel="noreferrer" className="social-item">
                <img src={imgInstagram} alt="Instagram" className="social-icon" />
                <span>@blackberrings</span>
              </a>
              <a href="https://drive.google.com/file/d/1rruAu3cldWcmISGVLyW3lOwKseME7wbc/view?usp=sharing" target="_blank" rel="noreferrer" className="social-item social-item--no-icon">
                <span>Resume</span>
              </a>
            </div>
          </div>
        </section>

        {/* ── Toolkit ── */}
        <section className="toolkit">
          <h2 className="section-title">Toolkit</h2>
          <div className="toolkit-body">
            <div className="toolkit-grid">
              <div className="toolkit-col">
                <p className="toolkit-heading">Languages &amp; Data</p>
                <ul>
                  <li>Python</li>
                  <li>pandas</li>
                  <li>SQL</li>
                  <li>Java</li>
                  <li>R</li>
                  <li>MATLAB</li>
                  <li>Jupyter</li>
                  <li>JavaScript</li>
                </ul>
              </div>
              <div className="toolkit-col">
                <p className="toolkit-heading">Design</p>
                <ul>
                  <li>Figma</li>
                  <li>Rhino</li>
                  <li>Solidworks</li>
                  <li>Adobe Suite</li>
                  <li>Framer</li>
                  <li>Storybook</li>
                </ul>
              </div>
              <div className="toolkit-col">
                <p className="toolkit-heading">AI &amp; ML</p>
                <ul>
                  <li>Embeddings &amp; semantic search</li>
                  <li>Fine-tuning</li>
                  <li>Context window management</li>
                  <li>Prompt Engineering</li>
                  <li>OpenAI/Anthropic API</li>
                  <li>RAG</li>
                  <li>AI Agent Design</li>
                  <li>Vector databases</li>
                </ul>
              </div>
              <div className="toolkit-col">
                <p className="toolkit-heading">PM Tools</p>
                <ul>
                  <li>Jira</li>
                  <li>Confluence</li>
                  <li>Asana</li>
                  <li>Microsoft Suite</li>
                  <li>Maze</li>
                  <li>FigJam/Miro</li>
                  <li>Notion</li>
                </ul>
              </div>
            </div>
            <VineRight className="vine-right" />
          </div>
        </section>

        {/* ── Experience ── */}
        <section className="experience">
          <h2 className="section-title">Experience</h2>
          <div className="experience-list">
            {experience.map((item, i) => (
              <div key={i} className="experience-row">
                <p className="experience-role">
                  {item.role} | <em>{item.company}</em>
                </p>
                <p className="experience-date">{item.date}</p>
              </div>
            ))}
          </div>
        </section>

        {/* ── Photos ── */}
        <section className="photos">
          <VineLeft className="vine-left" />
          <div className="photos-grid">
            <img src={imgPhoto1} alt="" className="photo" />
            <img src={imgPhoto2} alt="" className="photo" />
            <img src={imgPhoto3} alt="" className="photo" />
          </div>
        </section>

      </div>
    </div>
  );
}
