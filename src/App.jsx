import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Each page carries its own image/video weight, so only the page a visitor
// actually opens should end up in the initial download. Work stays static
// (loading fast on this route matters most — it's the "/" redirect target),
// while About/Playground/Blog split into their own chunks, fetched on nav.
import Work from './Work';
const About = lazy(() => import('./About'));
const Playground = lazy(() => import('./Playground'));
const Blog = lazy(() => import('./Blog'));

export default function App() {
  return (
    <HashRouter>
      <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Navigate to="/work" replace />} />
          <Route path="/work" element={<Work />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/playground" element={<Playground />} />
        </Routes>
      </Suspense>
    </HashRouter>
  );
}
