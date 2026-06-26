import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Work from './Work';
import About from './About';
import Playground from './Playground';

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/work" replace />} />
        <Route path="/work" element={<Work />} />
        <Route path="/about" element={<About />} />
        <Route path="/playground" element={<Playground />} />
      </Routes>
    </BrowserRouter>
  );
}
