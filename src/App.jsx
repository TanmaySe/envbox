import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home';
import Share from './pages/Share';
import Fetch from './pages/Fetch';

function App() {
  return (

        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/share" element={<Share />} />
                <Route path="/fetch/:id" element={<Fetch />} />
            </Routes>
        </Router>

  );
}

export default App;
