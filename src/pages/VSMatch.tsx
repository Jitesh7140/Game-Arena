import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Sword, Clock, Users, Zap, AlertTriangle, Trophy, GamepadIcon } from 'lucide-react';
import { createVSMatch, getMyMatches } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isVSMatchTime, formatDateTime12Hour } from '../lib/utils';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import toast from 'react-hot-toast';

interface VSMatch {
  id: string;
  match_type: '1v1' | '2v2' | '4v4';
  status: 'waiting' | 'matched' | 'completed' | 'timeout';
  room_id?: string;
  room_password?: string;
  opponent_id?: string;
  result?: 'won' | 'lost' | 'draw';
  tokens_earned?: number;
  created_at: string;
}

const VSMatch = () => {
  const [showMatchModal, setShowMatchModal] = useState(false);
  const [selectedMatchType, setSelectedMatchType] = useState<'1v1' | '2v2' | '4v4'>('1v1');
  const [currentMatch, setCurrentMatch] = useState<VSMatch | null>(null);
  const [matchHistory, setMatchHistory] = useState<VSMatch[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0);

  const { user } = useAuth();
  const navigate = useNavigate();

  const matchTypes = [
    {
      type: '1v1' as const,
      title: 'Solo Duel',
      description: 'One-on-one intense combat',
      icon: Users,
      players: 1,
    },
    {
      type: '2v2' as const,
      title: 'Duo Battle',
      description: 'Team up with a partner',
      icon: Users,
      players: 2,
    },
    {
      type: '4v4' as const,
      title: 'Squad War',
      description: 'Full squad tactical warfare',
      icon: Users,
      players: 4,
    },
  ];

  useEffect(() => {
    loadMatches();

    // Check match time every minute
    const interval = setInterval(() => {
      const now = new Date();
      const hour = now.getHours();
      if (hour >= 21 && hour < 24) {
        const nextMidnight = new Date();
        nextMidnight.setHours(24, 0, 0, 0);
        setTimeLeft(nextMidnight.getTime() - now.getTime());
      } else {
        const next9PM = new Date();
        if (hour >= 24) {
          next9PM.setDate(next9PM.getDate() + 1);
        }
        next9PM.setHours(21, 0, 0, 0);
        setTimeLeft(next9PM.getTime() - now.getTime());
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const loadMatches = async () => {
    try {
      const { vsMatches, error } = await getMyMatches();
      if (error) throw error;

      const activeMatch = vsMatches.find((match: VSMatch) =>
        match.status === 'waiting' || match.status === 'matched'
      );

      setCurrentMatch(activeMatch || null);
      setMatchHistory(vsMatches.filter((match: VSMatch) =>
        match.status === 'completed' || match.status === 'timeout'
      ));
    } catch (error) {
      console.error('Failed to load matches:', error);
    }
  };

  const handleFindMatch = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (!isVSMatchTime()) {
      toast.error('V/S matches are only available between 9 PM - 12 AM');
      return;
    }

    setShowMatchModal(true);
  };

  const handleStartMatch = async () => {
    setLoading(true);
    try {
      const { data, error } = await createVSMatch(selectedMatchType);
      if (error) throw error;

      setCurrentMatch(data);
      setShowMatchModal(false);
      toast.success('Searching for opponent...');

      // Simulate matching timeout after 60 seconds
      setTimeout(async () => {
        await loadMatches();
      }, 61000);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create match');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeRemaining = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((ms % (1000 * 60)) / 1000);

    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    return `${minutes}m ${seconds}s`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'text-yellow-400';
      case 'matched':
        return 'text-success';
      case 'completed':
        return 'text-primary-400';
      case 'timeout':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'waiting':
        return <Clock className="w-5 h-5" />;
      case 'matched':
        return <Zap className="w-5 h-5" />;
      case 'completed':
        return <Trophy className="w-5 h-5" />;
      case 'timeout':
        return <AlertTriangle className="w-5 h-5" />;
      default:
        return <GamepadIcon className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron font-bold text-2xl md:text-5xl mb-4 text-white">
            V/S Match Arena
          </h1>
          <p className="text-sm sm:text-xl text-gray-400 font-rajdhani">
            Quick competitive matches • Available 9 PM - 12 AM
          </p>
        </motion.div>

        {/* Time Status */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`gaming-card mb-8 ${isVSMatchTime() ? 'neon-border' : 'border-yellow-500/30'}`}
        >
          <div className="flex items-center justify-center space-x-4">
            <Clock className={`w-6 h-6 ${isVSMatchTime() ? 'text-success' : 'text-yellow-400'}`} />
            <div className="text-center">
              {isVSMatchTime() ? (
                <div>
                  <p className="text-success font-orbitron font-semibold">Arena is LIVE!</p>
                  <p className="text-gray-400 text-sm">
                    Time remaining: {formatTimeRemaining(timeLeft)}
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-yellow-400 font-orbitron font-semibold">Arena Closed</p>
                  <p className="text-gray-400 text-sm">
                    Next session starts in: {formatTimeRemaining(timeLeft)}
                  </p>
                </div>
              )}
            </div>
          </div>
        </motion.div>

        {/* Current Match Status */}
        {currentMatch && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="gaming-card neon-glow mb-8"
          >
            <div className="text-center">
              <h3 className="font-orbitron font-semibold text-xl mb-4 text-white">
                Current Match Status
              </h3>

              <div className="flex items-center justify-center space-x-2 mb-4">
                {getStatusIcon(currentMatch.status)}
                <span className={`font-orbitron font-medium ${getStatusColor(currentMatch.status)}`}>
                  {currentMatch.status.toUpperCase()}
                </span>
                <span className="text-primary-400">•</span>
                <span className="text-primary-400">{currentMatch.match_type}</span>
              </div>

              {currentMatch.status === 'waiting' && (
                <div className="space-y-2">
                  <div className="w-16 h-16 mx-auto loading-spinner" />
                  <p className="text-gray-400">Searching for opponent...</p>
                </div>
              )}

              {currentMatch.status === 'matched' && currentMatch.room_id && (
                <div className="bg-dark-100 rounded-lg p-6 max-w-md mx-auto">
                  <p className="text-success mb-4 font-orbitron font-semibold">Match Found!</p>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Room ID:</span>
                      <span className="text-white font-mono">{currentMatch.room_id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Password:</span>
                      <span className="text-white font-mono">{currentMatch.room_password}</span>
                    </div>
                  </div>
                </div>
              )}

              {currentMatch.status === 'timeout' && (
                <div className="text-center">
                  <p className="text-red-400 mb-4">Match timed out - no opponent found</p>
                  <Button onClick={() => setCurrentMatch(null)}>
                    Try Again
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Match Types */}
        {!currentMatch && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="grid sm:grid-cols-3 md:grid-cols-3 gap-6 mb-12"
          >
            {matchTypes.map((matchType, index) => {
              const Icon = matchType.icon;
              return (
                <motion.div
                  key={matchType.type}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="gaming-card flex   hover:neon-border cursor-pointer transition-all duration-300 group text-center"
                  onClick={() => setSelectedMatchType(matchType.type)}
                >
                  <div className='flex '>
                    <div className="flex !m-[1rem] items-center justify-center   w-16  h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl mx-auto mb-4">
                      <Icon className="w-8 h-8 text-white" />
                    </div>


                  </div>

                  <div>
                    <h3 className="font-orbitron font-semibold text-xl mb-2 text-white">
                      {matchType.title}
                    </h3>
                  <p className="text-gray-400 mb-4">
                    {matchType.description}
                  </p>

                  <div className="flex items-center justify-center space-x-2 text-primary-400">
                    <Users className="w-4 h-4" />
                    <span>{matchType.players} vs {matchType.players}</span>
                  </div>

                  </div>

                </motion.div>
              );
            })}
          </motion.div>
        )}

        {/* Find Match Button */}
        {!currentMatch && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-center mb-12"
          >
            <Button
              size="lg"
              onClick={handleFindMatch}
              className="neon-glow "
              disabled={isVSMatchTime()}  // disabled={!isVSMatchTime()}   for find match button enabled
            >
              <Sword className="w-5 h-5 mr-2" />
              Find Match ({selectedMatchType})
            </Button>
          </motion.div>
        )}

        {/* Match History */}
        {matchHistory.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="font-orbitron font-bold text-2xl mb-6 text-white text-center">
              Match History
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {matchHistory.slice(0, 6).map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="gaming-card"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      {getStatusIcon(match.status)}
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-orbitron font-medium text-white">
                            {match.match_type}
                          </span>
                          {match.result && (
                            <span className={`text-xs px-2 py-1 rounded ${match.result === 'won'
                                ? 'bg-success/20 text-success'
                                : match.result === 'lost'
                                  ? 'bg-red-500/20 text-red-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              }`}>
                              {match.result.toUpperCase()}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-400">
                          {formatDateTime12Hour(match.created_at)}
                        </p>
                      </div>
                    </div>

                    {match.tokens_earned && (
                      <div className="text-right">
                        <span className="text-yellow-400 font-orbitron font-medium">
                          +{match.tokens_earned}
                        </span>
                        <p className="text-xs text-gray-400">tokens</p>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Match Type Selection Modal */}
        <Modal
          isOpen={showMatchModal}
          onClose={() => setShowMatchModal(false)}
          title="Select Match Type"
        >
          <div className="space-y-6">
            <p className="text-gray-300 text-center">
              Choose your preferred match type for competitive play
            </p>

            <div className="space-y-4">
              {matchTypes.map((matchType) => {
                const Icon = matchType.icon;
                return (
                  <label key={matchType.type} className="flex items-center space-x-4 p-4 gaming-card cursor-pointer hover:neon-border transition-all duration-300">
                    <input
                      type="radio"
                      name="matchType"
                      value={matchType.type}
                      checked={selectedMatchType === matchType.type}
                      onChange={(e) => setSelectedMatchType(e.target.value as '1v1' | '2v2' | '4v4')}
                      className="text-primary-500"
                    />
                    <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-orbitron font-semibold text-white">
                        {matchType.title}
                      </h3>
                      <p className="text-gray-400 text-sm">{matchType.description}</p>
                    </div>
                    <div className="text-primary-400 text-sm">
                      {matchType.players}v{matchType.players}
                    </div>
                  </label>
                );
              })}
            </div>

            <div className="flex space-x-4">
              <Button
                variant="secondary"
                onClick={() => setShowMatchModal(false)}
                className="flex-1"
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                onClick={handleStartMatch}
                className="flex-1"
                loading={loading}
              >
                Start Searching
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default VSMatch;