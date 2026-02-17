import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

/**
 * Landing Page Component - BACKTRACE THEME
 * Dark, terminal-style interface with admin authentication
 */
function LandingPage() {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleStartQuiz = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!name.trim() || name.trim().length < 2) {
      setError('ACCESS DENIED: NAME MUST BE AT LEAST 2 CHARACTERS');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Check if admin (exact match: "sam altman")
      if (name === 'sam altman') {
        // Admin authentication
        const adminResponse = await quizAPI.adminAuthenticate(name);
        
        if (adminResponse.success && adminResponse.data.isAdmin) {
          // Store admin token
          localStorage.setItem('adminToken', adminResponse.data.adminToken);
          localStorage.setItem('isAdmin', 'true');
          
          // Navigate to admin panel
          navigate('/admin');
          return;
        }
      }

      // Regular participant flow
      const response = await quizAPI.startQuiz(name.trim());
      
      if (response.success) {
        // Store session data
        localStorage.setItem('sessionId', response.data.sessionId);
        localStorage.setItem('participantName', response.data.name);
        localStorage.setItem('startTime', response.data.startTime);
        
        // Navigate to quiz
        navigate('/quiz');
      }
    } catch (err) {
      console.error('Error starting quiz:', err);
      setError(err.response?.data?.message || 'SYSTEM ERROR: FAILED TO INITIALIZE SESSION');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg grid-bg flex items-center justify-center p-4 scanline">
      <div className="bg-dark-surface border-2 border-neon-green rounded-lg shadow-2xl p-8 md:p-12 max-w-2xl w-full fade-in relative overflow-hidden">
        
        {/* Glitch effect overlay */}
        <div className="absolute top-0 left-0 w-full h-1 bg-neon-green opacity-20"></div>
        
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <h1 className="text-5xl md:text-6xl font-bold text-neon-green mb-2 neon-text font-mono tracking-wider">
            &gt; BACKTRACE
          </h1>
          <p className="text-2xl text-neon-cyan font-mono tracking-widest">
            [ ROUND_01 ]
          </p>
          <div className="mt-4 h-0.5 w-32 bg-neon-green mx-auto"></div>
          <p className="text-sm text-gray-500 mt-2 font-mono">
            REVERSE ENGINEERING CHALLENGE
          </p>
        </div>

        {/* System Info */}
        <div className="bg-black border border-neon-green rounded p-6 mb-6 font-mono text-sm">
          <div className="text-neon-green mb-3 flex items-center">
            <span className="text-neon-cyan mr-2">$</span>
            <span>SYSTEM PARAMETERS:</span>
          </div>
          <ul className="space-y-2 text-gray-400 pl-4">
            <li className="flex items-start">
              <span className="text-neon-green mr-2">•</span>
              <span><span className="text-neon-cyan">TARGETS:</span> 500 ENCRYPTED QUERIES</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-green mr-2">•</span>
              <span><span className="text-neon-cyan">BASE_TIME:</span> 1800 SECONDS (30 MIN)</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-green mr-2">•</span>
              <span><span className="text-neon-cyan">BONUS_TIME:</span> AVAILABLE (WITH PENALTY)</span>
            </li>
            <li className="flex items-start">
              <span className="text-neon-green mr-2">•</span>
              <span><span className="text-neon-cyan">SCORING:</span> +1 PER CRACK | NO NEGATIVE</span>
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">⚠</span>
              <span className="text-red-400"><span className="text-red-500">WARNING:</span> NO SYSTEM RESET ALLOWED</span>
            </li>
          </ul>
        </div>

        {/* Input Form */}
        <form onSubmit={handleStartQuiz} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-mono text-neon-cyan mb-2 tracking-wide">
              &gt; ENTER_CODENAME:
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              placeholder="john_doe"
              className="w-full input-terminal"
              disabled={loading}
              autoFocus
            />
            <p className="text-xs text-gray-600 mt-1 font-mono">
              // Minimum 2 characters required
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-900 bg-opacity-20 border border-red-500 text-red-400 px-4 py-3 rounded font-mono text-sm">
              <span className="text-red-500">[ERROR]</span> {error}
            </div>
          )}

          {/* Start Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full btn-terminal text-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center font-mono">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                INITIALIZING...
              </span>
            ) : (
              '[ INJECT ] INITIATE BACKTRACE'
            )}
          </button>
        </form>

        {/* Warning Footer */}
        <div className="mt-6 text-center text-xs text-gray-600 font-mono space-y-1">
          <p className="flex items-center justify-center">
            <span className="text-red-500 mr-2">⚠</span>
            TIMER CANNOT BE PAUSED OR RESET
          </p>
          <p className="flex items-center justify-center">
            <span className="text-yellow-500 mr-2">⚡</span>
            ENSURE STABLE CONNECTION
          </p>
        </div>

        {/* Corner decorations */}
        <div className="absolute top-2 right-2 text-neon-green opacity-30 text-xs font-mono">
          v1.0.0
        </div>
        <div className="absolute bottom-2 left-2 text-neon-cyan opacity-30 text-xs font-mono">
          SESSION_NULL
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
