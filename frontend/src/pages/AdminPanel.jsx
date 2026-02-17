import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { quizAPI } from '../services/api';

/**
 * Admin Panel - CONTROL ROOM THEME
 * Access: Only "sam altman" (case-sensitive)
 * Features: View all participants, sort, search, export CSV
 */
function AdminPanel() {
  const navigate = useNavigate();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [sortBy, setSortBy] = useState('score');
  const [searchTerm, setSearchTerm] = useState('');
  const [adminToken, setAdminToken] = useState('');

  useEffect(() => {
    // Verify admin access
    const token = localStorage.getItem('adminToken');
    const isAdmin = localStorage.getItem('isAdmin');

    if (!token || !isAdmin || isAdmin !== 'true') {
      alert('UNAUTHORIZED ACCESS DETECTED');
      navigate('/');
      return;
    }

    setAdminToken(token);
    loadParticipants(token, 'score');
  }, [navigate]);

  const loadParticipants = async (token, sortOption) => {
    try {
      setLoading(true);
      const response = await quizAPI.getAdminParticipants(token, sortOption);
      
      if (response.success) {
        setParticipants(response.data.participants);
      }
    } catch (err) {
      console.error('Error loading participants:', err);
      if (err.response?.status === 403) {
        alert('SESSION EXPIRED. REDIRECTING...');
        localStorage.clear();
        navigate('/');
      } else {
        setError('FAILED TO LOAD PARTICIPANT DATA');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (sortOption) => {
    setSortBy(sortOption);
    loadParticipants(adminToken, sortOption);
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const exportToCSV = () => {
    const headers = ['Rank', 'Name', 'Score', 'Correct', 'Bonus Time', 'Penalty', 'Time Spent (s)', 'Avg Speed (s)', 'Submitted At'];
    
    const csvData = filteredParticipants.map(p => [
      p.rank,
      p.name,
      p.totalScore,
      p.totalCorrect,
      p.bonusTimeUsed || 0,
      p.bonusPenalty || 0,
      p.totalTimeSpent,
      p.averageSpeed.toFixed(2),
      new Date(p.submittedAt).toLocaleString()
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `backtrace_leaderboard_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  // Filter participants based on search
  const filteredParticipants = participants.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-neon-green mx-auto mb-4"></div>
          <p className="text-neon-cyan font-mono">LOADING CONTROL PANEL...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="bg-dark-surface border-2 border-red-500 rounded-lg p-8 max-w-md w-full text-center">
          <div className="text-red-500 text-5xl mb-4">⚠</div>
          <h2 className="text-2xl font-bold text-red-400 mb-2 font-mono">[ERROR]</h2>
          <p className="text-gray-400 mb-6 font-mono">{error}</p>
          <button onClick={handleLogout} className="btn-terminal-danger">
            LOGOUT
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-bg grid-bg scanline">
      {/* Header */}
      <div className="bg-dark-surface border-b-2 border-neon-green">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-neon-green font-mono neon-text tracking-wider">
                &gt; ADMIN CONTROL PANEL
              </h1>
              <p className="text-sm text-neon-cyan font-mono mt-1">BACKTRACE - ROUND 01 | LEADERBOARD</p>
            </div>
            <button
              onClick={handleLogout}
              className="btn-terminal-danger text-sm"
            >
              [ LOGOUT ]
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-dark-surface border-2 border-neon-green rounded p-4">
            <div className="text-gray-500 text-xs font-mono mb-1">TOTAL PARTICIPANTS</div>
            <div className="text-neon-green text-3xl font-mono font-bold">{participants.length}</div>
          </div>
          <div className="bg-dark-surface border-2 border-neon-cyan rounded p-4">
            <div className="text-gray-500 text-xs font-mono mb-1">HIGHEST SCORE</div>
            <div className="text-neon-cyan text-3xl font-mono font-bold">
              {participants.length > 0 ? participants[0].totalScore : 0}
            </div>
          </div>
          <div className="bg-dark-surface border-2 border-neon-blue rounded p-4">
            <div className="text-gray-500 text-xs font-mono mb-1">FASTEST SPEED</div>
            <div className="text-neon-blue text-3xl font-mono font-bold">
              {participants.length > 0 ? Math.min(...participants.map(p => p.averageSpeed)).toFixed(1) : 0}s
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="bg-dark-surface border-2 border-neon-green rounded p-4 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            
            {/* Search */}
            <div className="w-full md:w-1/2">
              <label className="block text-xs font-mono text-neon-cyan mb-2">SEARCH BY NAME:</label>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Enter name..."
                className="w-full input-terminal text-sm"
              />
            </div>

            {/* Sort */}
            <div className="w-full md:w-1/4">
              <label className="block text-xs font-mono text-neon-cyan mb-2">SORT BY:</label>
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className="w-full input-terminal text-sm"
              >
                <option value="score">Highest Score</option>
                <option value="speed">Fastest Speed</option>
              </select>
            </div>

            {/* Export */}
            <div className="w-full md:w-auto">
              <label className="block text-xs font-mono text-neon-cyan mb-2">EXPORT:</label>
              <button
                onClick={exportToCSV}
                className="btn-terminal-blue text-sm w-full md:w-auto"
              >
                [ EXPORT CSV ]
              </button>
            </div>
          </div>
        </div>

        {/* Leaderboard Table */}
        <div className="bg-dark-surface border-2 border-neon-green rounded overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-black border-b-2 border-neon-green">
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Rank</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Score</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Correct</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Bonus</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Penalty</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Time (s)</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Speed (s)</th>
                  <th className="px-4 py-3 text-left text-xs font-mono text-neon-green uppercase tracking-wider">Submitted</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {filteredParticipants.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="px-4 py-8 text-center text-gray-500 font-mono">
                      NO DATA FOUND
                    </td>
                  </tr>
                ) : (
                  filteredParticipants.map((participant, index) => (
                    <tr key={index} className="hover:bg-gray-900 transition-colors">
                      <td className="px-4 py-3 text-sm font-mono text-neon-cyan">
                        {participant.rank <= 3 ? (
                          <span className="text-yellow-400 font-bold">#{participant.rank}</span>
                        ) : (
                          `#${participant.rank}`
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-300">{participant.name}</td>
                      <td className="px-4 py-3 text-sm font-mono text-neon-green font-bold">{participant.totalScore}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-300">{participant.totalCorrect}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-300">
                        {participant.bonusTimeUsed ? `+${participant.bonusTimeUsed} min` : '-'}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-red-400">
                        {participant.bonusPenalty || 0}
                      </td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-300">{participant.totalTimeSpent}</td>
                      <td className="px-4 py-3 text-sm font-mono text-neon-blue">{participant.averageSpeed.toFixed(2)}</td>
                      <td className="px-4 py-3 text-sm font-mono text-gray-400">
                        {new Date(participant.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-6 text-center text-xs text-gray-600 font-mono">
          <p>SHOWING {filteredParticipants.length} OF {participants.length} PARTICIPANTS</p>
          <p className="mt-1">LAST UPDATED: {new Date().toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminPanel;
