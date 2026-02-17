import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * Results Page Component
 * Displays final quiz results with detailed breakdown
 */
function ResultsPage() {
  const navigate = useNavigate();
  const [results, setResults] = useState(null);

  useEffect(() => {
    // Load results from localStorage
    const storedResults = localStorage.getItem('quizResults');
    
    if (!storedResults) {
      navigate('/');
      return;
    }

    setResults(JSON.parse(storedResults));
  }, [navigate]);

  if (!results) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  const {
    name,
    totalCorrect,
    totalQuestions,
    totalScore,
    bonusTimeUsed,
    bonusPenalty,
    totalTimeSpent,
    averageTimePerQuestion,
    submittedAt
  } = results;

  // Calculate percentage
  const percentage = ((totalCorrect / totalQuestions) * 100).toFixed(2);

  // Format time
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}m ${secs}s`;
  };

  // Get performance message
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { msg: 'Outstanding! 🏆', color: 'text-yellow-600' };
    if (percentage >= 75) return { msg: 'Excellent! 🌟', color: 'text-green-600' };
    if (percentage >= 60) return { msg: 'Good Job! 👍', color: 'text-blue-600' };
    if (percentage >= 50) return { msg: 'Not Bad! 💪', color: 'text-purple-600' };
    return { msg: 'Keep Practicing! 📚', color: 'text-orange-600' };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="text-center text-white mb-8 fade-in">
          <h1 className="text-5xl font-bold mb-2">Quiz Completed!</h1>
          <p className="text-xl opacity-90">Here are your results</p>
        </div>

        {/* Main Results Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 mb-6 fade-in">
          
          {/* Participant Name */}
          <div className="text-center mb-8">
            <p className="text-gray-600 text-sm mb-2">Participant</p>
            <h2 className="text-3xl font-bold text-gray-800">{name}</h2>
          </div>

          {/* Score Circle */}
          <div className="flex justify-center mb-8">
            <div className="relative">
              <div className="w-48 h-48 rounded-full border-8 border-blue-200 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-blue-600">{totalScore}</div>
                  <div className="text-sm text-gray-600 mt-1">Final Score</div>
                </div>
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="text-center mb-8">
            <p className={`text-3xl font-bold ${performance.color}`}>
              {performance.msg}
            </p>
            <p className="text-gray-600 mt-2">{percentage}% Accuracy</p>
          </div>

          {/* Detailed Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            
            {/* Correct Answers */}
            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-700 mb-1">Correct Answers</p>
                  <p className="text-3xl font-bold text-green-800">{totalCorrect}</p>
                  <p className="text-xs text-green-600 mt-1">out of {totalQuestions}</p>
                </div>
                <div className="text-5xl">✅</div>
              </div>
            </div>

            {/* Time Spent */}
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-700 mb-1">Total Time</p>
                  <p className="text-3xl font-bold text-blue-800">{formatTime(totalTimeSpent)}</p>
                  <p className="text-xs text-blue-600 mt-1">
                    Avg: {averageTimePerQuestion.toFixed(1)}s/question
                  </p>
                </div>
                <div className="text-5xl">⏱️</div>
              </div>
            </div>

            {/* Bonus Time */}
            {bonusTimeUsed > 0 && (
              <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 border border-orange-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-orange-700 mb-1">Bonus Time Used</p>
                    <p className="text-3xl font-bold text-orange-800">+{bonusTimeUsed} min</p>
                    <p className="text-xs text-orange-600 mt-1">
                      Penalty: {bonusPenalty} points
                    </p>
                  </div>
                  <div className="text-5xl">⏰</div>
                </div>
              </div>
            )}

            {/* Accuracy */}
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-700 mb-1">Accuracy</p>
                  <p className="text-3xl font-bold text-purple-800">{percentage}%</p>
                  <p className="text-xs text-purple-600 mt-1">
                    {totalCorrect} correct answers
                  </p>
                </div>
                <div className="text-5xl">🎯</div>
              </div>
            </div>

          </div>

          {/* Score Breakdown */}
          <div className="bg-gray-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-gray-800 mb-4 text-center">Score Breakdown</h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Base Score (Correct × 1)</span>
                <span className="font-semibold text-gray-800">+{totalCorrect}</span>
              </div>
              {bonusPenalty < 0 && (
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Bonus Time Penalty</span>
                  <span className="font-semibold text-red-600">{bonusPenalty}</span>
                </div>
              )}
              <div className="border-t pt-3 flex justify-between items-center">
                <span className="font-bold text-gray-800 text-lg">Final Score</span>
                <span className="font-bold text-blue-600 text-2xl">{totalScore}</span>
              </div>
            </div>
          </div>

          {/* Submission Time */}
          <div className="text-center text-sm text-gray-500">
            <p>Submitted on {new Date(submittedAt).toLocaleString()}</p>
          </div>

        </div>

        {/* Actions */}
        <div className="text-center fade-in">
          <p className="text-white text-sm mb-4">
            Thank you for participating in BACKTRACE - Round 1!
          </p>
          <button
            onClick={() => {
              localStorage.clear();
              navigate('/');
            }}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-200 active:scale-95 shadow-lg"
          >
            Take Quiz Again
          </button>
        </div>
      </div>
    </div>
  );
}

export default ResultsPage;
