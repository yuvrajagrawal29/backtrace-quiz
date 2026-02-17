import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';
import Timer from '../components/Timer';

/**
 * Quiz Page Component - BACKTRACE THEME
 * NO NAVIGATION BAR - Sequential only
 * Shows: Current Question Number + Attempted Count
 */
function QuizPage() {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState('');
  const [participantName, setParticipantName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Load session data and questions
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const storedSessionId = localStorage.getItem('sessionId');
        const storedName = localStorage.getItem('participantName');

        if (!storedSessionId || !storedName) {
          navigate('/');
          return;
        }

        setSessionId(storedSessionId);
        setParticipantName(storedName);

        // Fetch questions
        const response = await quizAPI.getQuestions(storedSessionId);
        if (response.success) {
          setQuestions(response.data.questions);
        }
      } catch (err) {
        console.error('Error loading quiz:', err);
        setError('SYSTEM ERROR: FAILED TO LOAD TARGETS');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [navigate]);

  // Auto-save answers every 10 seconds
  useEffect(() => {
    if (Object.keys(answers).length === 0) return;

    const autoSave = setInterval(async () => {
      try {
        setSaving(true);
        await quizAPI.saveAnswers(sessionId, answers);
      } catch (err) {
        console.error('Auto-save error:', err);
      } finally {
        setSaving(false);
      }
    }, 10000);

    return () => clearInterval(autoSave);
  }, [answers, sessionId]);

  // Prevent page refresh/close
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Handle answer selection
  const handleAnswerSelect = (optionIndex) => {
    const questionNumber = questions[currentQuestionIndex].questionNumber;
    setAnswers(prev => ({
      ...prev,
      [questionNumber]: optionIndex
    }));
  };

  // Navigation - ONLY Next/Previous (NO jumping)
  const goToNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  // Handle bonus time selection
  const handleBonusSelect = async (bonusMinutes) => {
    try {
      await quizAPI.selectBonus(sessionId, bonusMinutes);
      console.log(`Bonus time selected: ${bonusMinutes} minutes`);
    } catch (err) {
      console.error('Error selecting bonus:', err);
    }
  };

  // Submit quiz
  const handleSubmitQuiz = useCallback(async () => {
    if (submitting) return;

    const confirmSubmit = window.confirm(
      `CONFIRM SUBMISSION?\n\nTRACE COMPLETED: ${Object.keys(answers).length} / ${questions.length}\n\nTHIS ACTION CANNOT BE UNDONE.`
    );

    if (!confirmSubmit) return;

    setSubmitting(true);

    try {
      // Final save
      await quizAPI.saveAnswers(sessionId, answers);
      
      // Submit quiz
      const response = await quizAPI.submitQuiz(sessionId);
      
      if (response.success) {
        // Clear session and navigate to confirmation
        localStorage.removeItem('sessionId');
        localStorage.removeItem('participantName');
        localStorage.removeItem('startTime');
        
        // Navigate to submission confirmation (NOT results)
        navigate('/submitted');
      }
    } catch (err) {
      console.error('Error submitting quiz:', err);
      alert('SUBMISSION FAILED. PLEASE TRY AGAIN.');
      setSubmitting(false);
    }
  }, [sessionId, answers, questions.length, navigate, submitting]);

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neon-green mx-auto mb-4"></div>
          <p className="text-neon-cyan font-mono">LOADING TARGETS...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="bg-dark-surface border-2 border-red-500 rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2 font-mono">[SYSTEM ERROR]</h2>
          <p className="text-gray-400 mb-6 font-mono">{error}</p>
          <button onClick={() => navigate('/')} className="btn-terminal-danger">
            RETURN TO BASE
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?.questionNumber];
  const attemptedCount = Object.keys(answers).length;

  return (
    <div className="min-h-screen bg-dark-bg grid-bg scanline">
      {/* Timer */}
      <Timer onTimeUp={handleSubmitQuiz} onBonusSelect={handleBonusSelect} />

      {/* Header */}
      <div className="bg-dark-surface border-b-2 border-neon-green sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-neon-green font-mono tracking-wider neon-text">
                &gt; BACKTRACE_01
              </h1>
              <p className="text-sm text-neon-cyan font-mono">OPERATIVE: {participantName}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 font-mono">TRACE STATUS</div>
              <div className="text-lg font-bold text-neon-cyan font-mono">
                COMPLETED: {attemptedCount} / {questions.length}
              </div>
              {saving && (
                <div className="text-xs text-neon-green mt-1 font-mono animate-pulse">
                  [SAVING...]
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-dark-surface border-2 border-neon-cyan rounded-lg p-6 md:p-8">
          
          {/* Question Header */}
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-700">
            <div>
              <span className="text-sm font-mono text-neon-green bg-black px-3 py-1 rounded border border-neon-green">
                TARGET_{currentQuestion?.questionNumber.toString().padStart(3, '0')}
              </span>
              <span className="ml-3 text-xs text-gray-500 font-mono uppercase">
                {currentQuestion?.category}
              </span>
            </div>
            <div className="text-sm text-gray-500 font-mono">
              {currentQuestionIndex + 1} / {questions.length}
            </div>
          </div>

          {/* Question Text */}
          <h2 className="text-xl md:text-2xl font-semibold text-neon-cyan mb-8 font-mono leading-relaxed">
            {currentQuestion?.question}
          </h2>

          {/* Options */}
          <div className="space-y-4 mb-8">
            {currentQuestion?.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                className={`w-full text-left p-4 rounded border-2 transition-all duration-200 font-mono ${
                  currentAnswer === index
                    ? 'border-neon-green bg-neon-green bg-opacity-10 text-neon-green'
                    : 'border-gray-700 bg-black text-gray-400 hover:border-neon-cyan hover:text-neon-cyan'
                }`}
              >
                <div className="flex items-center">
                  <div className={`w-6 h-6 rounded-full border-2 mr-4 flex items-center justify-center ${
                    currentAnswer === index
                      ? 'border-neon-green bg-neon-green'
                      : 'border-gray-600'
                  }`}>
                    {currentAnswer === index && (
                      <svg className="w-4 h-4 text-black" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                      </svg>
                    )}
                  </div>
                  <span className="font-medium">[{String.fromCharCode(65 + index)}] {option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-700">
            <button
              onClick={goToPreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="btn-terminal-cyan disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← PREVIOUS
            </button>

            {currentQuestionIndex === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="btn-terminal-danger"
              >
                {submitting ? '[SUBMITTING...]' : '[ SUBMIT TRACE ]'}
              </button>
            ) : (
              <button
                onClick={goToNextQuestion}
                className="btn-terminal"
              >
                NEXT →
              </button>
            )}
          </div>
        </div>

        {/* Submit Button - Always Visible */}
        <div className="mt-6 text-center">
          <button
            onClick={handleSubmitQuiz}
            disabled={submitting}
            className="btn-terminal-danger"
          >
            {submitting ? '[SUBMITTING...]' : '[ SUBMIT TRACE NOW ]'}
          </button>
          <p className="text-xs text-gray-600 mt-2 font-mono">
            // You can submit anytime
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuizPage;
