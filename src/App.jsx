import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Share from './pages/Share';
import Fetch from './pages/Fetch';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen bg-black bg-gradient-to-tr from-zinc-900/50 to-zinc-700/30">
        <header className="top-0 z-30 w-full px-4 sm:fixed backdrop-blur bg-zinc-900/50">
          <div className="container mx-auto">
            <div className="flex flex-col items-center justify-between gap-2 pt-6 sm:h-20 sm:flex-row sm:pt-0">
              <nav className="flex items-center grow">
                
                <ul className="flex flex-wrap items-center justify-end gap-4 grow">
                  <li>
                    <Link className="flex items-center px-3 py-2 duration-150 text-sm sm:text-base hover:text-zinc-50 text-zinc-200" to="/share">Share</Link>
                  </li>
                  <li>
                    <Link className="flex items-center px-3 py-2 duration-150 text-sm sm:text-base hover:text-zinc-50 text-zinc-400" to="/fetch">Fetch</Link>
                  </li>
                  <li>
                     BoxEnv
                 </li>
                </ul>
              </nav>
            </div>
          </div>
        </header>

        <main className="pt-24">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/share" element={<Share />} />
            <Route path="/fetch/:id" element={<Fetch />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
