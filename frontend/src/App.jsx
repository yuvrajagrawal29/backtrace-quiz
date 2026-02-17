import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import QuizPage from './pages/QuizPage';
import SubmittedPage from './pages/SubmittedPage';
import AdminPanel from './pages/AdminPanel';

/**
 * Main App Component
 * Routes:
 * / - Landing page
 * /quiz - Quiz interface
 * /submitted - Submission confirmation (NO results shown)
 * /admin - Admin panel (requires "sam altman" authentication)
 */
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/submitted" element={<SubmittedPage />} />
        <Route path="/admin" element={<AdminPanel />} />
      </Routes>
    </Router>
  );
}

export default App;
