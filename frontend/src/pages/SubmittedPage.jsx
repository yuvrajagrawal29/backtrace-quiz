import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Submission Confirmation Page - BACKTRACE THEME
 * NO RESULTS SHOWN - Only confirmation message
 */
function SubmittedPage() {
  const navigate = useNavigate();

  useEffect(() => {
    // Ensure session is cleared
    const sessionId = localStorage.getItem('sessionId');
    if (sessionId) {
      // Clear all session data
      localStorage.removeItem('sessionId');
      localStorage.removeItem('participantName');
      localStorage.removeItem('startTime');
    }
  }, []);

  const handleNewAttempt = () => {
    // Clear everything
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-dark-bg grid-bg flex items-center justify-center p-4 scanline">
      <div className="max-w-2xl w-full">
        
        {/* Main confirmation card */}
        <div className="bg-dark-surface border-2 border-neon-green rounded-lg p-8 md:p-12 mb-6 fade-in relative overflow-hidden text-center">
          
          {/* Glitch effect overlay */}
          <div className="absolute top-0 left-0 w-full h-1 bg-neon-green"></div>
          
          {/* Success Icon */}
          <div className="mb-6">
            <div className="inline-block p-6 bg-black border-2 border-neon-green rounded-full">
              <svg className="w-16 h-16 text-neon-green" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>

          {/* Header */}
          <h1 className="text-4xl md:text-5xl font-bold text-neon-green mb-4 font-mono neon-text tracking-wider">
            TRACE SUBMITTED
          </h1>
          
          <div className="h-0.5 w-32 bg-neon-green mx-auto mb-6"></div>

          {/* Message */}
          <div className="bg-black border border-neon-cyan rounded p-6 mb-6">
            <p className="text-neon-cyan text-lg font-mono mb-4">
              [ RESPONSE_RECORDED ]
            </p>
            <p className="text-gray-400 font-mono text-sm leading-relaxed">
              YOUR RESPONSES HAVE BEEN SUCCESSFULLY RECORDED IN THE SYSTEM.
            </p>
            <p className="text-gray-400 font-mono text-sm leading-relaxed mt-2">
              RESULTS WILL BE ANNOUNCED BY THE ORGANIZERS.
            </p>
          </div>

          {/* Info boxes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="bg-black border border-gray-700 rounded p-4">
              <div className="text-gray-500 text-xs font-mono mb-1">STATUS</div>
              <div className="text-neon-green text-lg font-mono font-bold">SUBMITTED</div>
            </div>
            <div className="bg-black border border-gray-700 rounded p-4">
              <div className="text-gray-500 text-xs font-mono mb-1">TIMESTAMP</div>
              <div className="text-neon-cyan text-sm font-mono">
                {new Date().toLocaleString()}
              </div>
            </div>
          </div>

          {/* Important Notice */}
          <div className="bg-yellow-900 bg-opacity-20 border border-yellow-500 rounded p-4 mb-6">
            <div className="flex items-start">
              <span className="text-yellow-500 text-2xl mr-3">⚠</span>
              <div className="text-left">
                <p className="text-yellow-400 font-mono text-sm font-bold mb-1">IMPORTANT</p>
                <p className="text-gray-300 font-mono text-xs">
                  Individual scores are not displayed to participants. The leaderboard will be published by event organizers.
                </p>
              </div>
            </div>
          </div>

          {/* Thank you message */}
          <p className="text-gray-500 font-mono text-sm mb-6">
            THANK YOU FOR PARTICIPATING IN BACKTRACE - ROUND 01
          </p>

          {/* Action button */}
          <button
            onClick={handleNewAttempt}
            className="btn-terminal-cyan"
          >
            [ RETURN TO BASE ]
          </button>

          {/* Corner decorations */}
          <div className="absolute top-2 right-2 text-neon-green opacity-30 text-xs font-mono">
            COMPLETE
          </div>
          <div className="absolute bottom-2 left-2 text-neon-cyan opacity-30 text-xs font-mono">
            SESSION_END
          </div>
        </div>

        {/* Additional info */}
        <div className="text-center text-xs text-gray-600 font-mono">
          <p>SESSION TERMINATED | DATA ENCRYPTED</p>
          <p className="mt-1">BACKTRACE_01 © 2026</p>
        </div>
      </div>
    </div>
  );
}

export default SubmittedPage;
