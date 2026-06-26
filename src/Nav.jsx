import { Link, useLocation } from 'react-router-dom';
import imgApple from './assets/apple-2.svg';
import './Nav.css';

export default function Nav() {
  const { pathname } = useLocation();

  return (
    <nav className="nav">
      <div className="nav-logo">
        <img src={imgApple} alt="fiona logo" className="nav-apple" />
      </div>
      <Link to="/" className="nav-name">fiona!</Link>
      <div className="nav-links">
        <Link to="/work" className={`nav-link${pathname === '/work' || pathname === '/' ? ' nav-link--active' : ''}`}>work</Link>
        <Link to="/blog" className={`nav-link${pathname === '/blog' ? ' nav-link--active' : ''}`}>blog</Link>
        <Link to="/playground" className={`nav-link${pathname === '/playground' ? ' nav-link--active' : ''}`}>playground</Link>
        <Link to="/about" className={`nav-link${pathname === '/about' ? ' nav-link--active' : ''}`}>about</Link>
      </div>
    </nav>
  );
}
