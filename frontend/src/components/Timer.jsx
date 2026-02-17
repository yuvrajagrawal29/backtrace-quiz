import { useState, useEffect } from 'react';

/**
 * Timer Component - BACKTRACE THEME
 * System countdown style with neon accents
 * TIMER SET TO: 5 minutes (change baseTimeMinutes below)
 */
function Timer({ onTimeUp, onBonusSelect, baseTimeMinutes = 30 }) {
  const [timeRemaining, setTimeRemaining] = useState(baseTimeMinutes * 60);
  const [showBonusModal, setShowBonusModal] = useState(false);
  const [bonusSelected, setBonusSelected] = useState(false);
  const [baseTimeEnded, setBaseTimeEnded] = useState(false);

  // Bonus options
  const bonusOptions = [
    { minutes: 15, penalty: -3, label: '+15 MIN', sublabel: '(-3 POINTS)' },
    { minutes: 20, penalty: -5, label: '+20 MIN', sublabel: '(-5 POINTS)' },
    { minutes: 30, penalty: -8, label: '+30 MIN', sublabel: '(-8 POINTS)' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          
          if (!baseTimeEnded && !bonusSelected) {
            setBaseTimeEnded(true);
            setShowBonusModal(true);
            return 0;
          }
          
          if (baseTimeEnded) {
            onTimeUp();
            return 0;
          }
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [baseTimeEnded, bonusSelected, onTimeUp]);

  const handleBonusSelect = (bonusMinutes) => {
    setBonusSelected(true);
    setShowBonusModal(false);
    setTimeRemaining(bonusMinutes * 60);
    onBonusSelect(bonusMinutes);
  };

  const handleNoBonus = () => {
    setShowBonusModal(false);
    onTimeUp();
  };

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Determine color based on time remaining
  const getTimerColor = () => {
    if (timeRemaining > 300) return 'text-neon-green';
    if (timeRemaining > 120) return 'text-yellow-400';
    return 'text-red-500';
  };

  return (
    <>
      {/* Timer Display */}
      <div className="fixed top-4 right-4 z-50">
        <div className="bg-black border-2 border-neon-green rounded p-4">
          <div className="text-xs text-neon-cyan mb-1 text-center font-mono tracking-wider">
            {baseTimeEnded ? '[BONUS_TIME]' : '[COUNTDOWN]'}
          </div>
          <div className={`text-4xl font-bold ${getTimerColor()} text-center font-mono neon-text`}>
            {formatTime(timeRemaining)}
          </div>
          {baseTimeEnded && (
            <div className="text-xs text-red-400 mt-1 text-center font-mono">
              PENALTY ACTIVE
            </div>
          )}
        </div>
      </div>

      {/* Bonus Time Modal */}
      {showBonusModal && (
        <div className="fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
          <div className="bg-dark-surface border-2 border-neon-green rounded-lg max-w-md w-full p-8 fade-in relative">
            
            {/* Glitch effect */}
            <div className="absolute top-0 left-0 w-full h-1 bg-neon-green"></div>
            
            <h2 className="text-3xl font-bold text-neon-green mb-2 text-center font-mono neon-text">
              ⏰ TIME EXPIRED
            </h2>
            <p className="text-sm text-gray-400 mb-2 text-center font-mono">
              BASE_COUNTDOWN_COMPLETE
            </p>
            <p className="text-gray-300 mb-6 text-center font-mono text-sm">
              REQUEST BONUS TIME? (PENALTY WILL BE APPLIED)
            </p>

            {/* Bonus Options */}
            <div className="space-y-3 mb-6">
              {bonusOptions.map((option) => (
                <button
                  key={option.minutes}
                  onClick={() => handleBonusSelect(option.minutes)}
                  className="w-full bg-black border-2 border-neon-cyan text-neon-cyan p-4 rounded font-mono font-semibold hover:bg-neon-cyan hover:text-black transition-all duration-200 active:scale-95"
                >
                  <div className="flex justify-between items-center">
                    <span className="text-lg">{option.label}</span>
                    <span className="text-sm text-red-400">{option.sublabel}</span>
                  </div>
                </button>
              ))}
            </div>

            {/* Submit Now */}
            <button
              onClick={handleNoBonus}
              className="w-full bg-black border-2 border-red-500 text-red-400 p-4 rounded font-mono font-semibold hover:bg-red-500 hover:text-black transition-all duration-200 active:scale-95"
            >
              [ SUBMIT NOW ] (NO PENALTY)
            </button>

            <p className="text-xs text-gray-600 mt-4 text-center font-mono">
              ⚠ BONUS TIME CAN ONLY BE SELECTED ONCE
            </p>

            {/* Corner decoration */}
            <div className="absolute bottom-2 right-2 text-neon-green opacity-30 text-xs font-mono">
              BONUS_SELECT
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Timer;
