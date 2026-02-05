import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Tools from './pages/Tools';
import Settings from './pages/Settings';
import ToolWrapper from './pages/ToolWrapper';
import { useEffect } from 'react';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark font-sans selection:bg-primary/30 pb-20 md:pb-0 transition-colors duration-300">
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/tools" element={<Tools />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tools/:toolId" element={<ToolWrapper />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
