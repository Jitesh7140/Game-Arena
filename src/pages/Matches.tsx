import   { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { GamepadIcon, Clock, User, Trophy, Target, Calendar, Users, Sword, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getMyMatches } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDefaultAvatar, formatDateTime12Hour, formatTime12Hour } from '../lib/utils';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface MatchRequest {
  id: string;
  sender_id: string;
  receiver_id: string;
  match_type: string;
  available_time: string;
  status: 'pending' | 'accepted' | 'rejected';
  rejection_reason?: string;
  created_at: string;
  sender: {
    username: string;
    game_uid: string;
    level: number;
    profile_photo?: string;
  };
  receiver: {
    username: string;
    game_uid: string;
    level: number;
    profile_photo?: string;
  };
}

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

const Matches = () => {
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [vsMatches, setVSMatches] = useState<VSMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'requests' | 'vs-matches'>('requests');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadMatches();
  }, [user, navigate]);

  const loadMatches = async () => {
    try {
      const { requests: matchRequests, vsMatches: vsMatchData, error } = await getMyMatches();
      if (error) throw error;
      
      setRequests(matchRequests || []);
      setVSMatches(vsMatchData || []);
    } catch (error) {
      toast.error('Failed to load matches');
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'matched':
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected':
      case 'timeout':
        return <XCircle className="w-5 h-5 text-red-400" />;
      case 'pending':
      case 'waiting':
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
      default:
        return <GamepadIcon className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
      case 'matched':
      case 'completed':
        return 'text-success';
      case 'rejected':
      case 'timeout':
        return 'text-red-400';
      case 'pending':
      case 'waiting':
        return 'text-yellow-400';
      default:
        return 'text-gray-400';
    }
  };

  const getResultBadge = (result?: string) => {
    if (!result) return null;
    
    const colors = {
      won: 'bg-success/20 text-success',
      lost: 'bg-red-500/20 text-red-400',
      draw: 'bg-yellow-500/20 text-yellow-400',
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-orbitron ${colors[result as keyof typeof colors]}`}>
        {result.toUpperCase()}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

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
            Match History
          </h1>
          <p className="text-sm sm:text-xl text-gray-400 font-rajdhani">
            Track your gaming journey and match statistics
          </p>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
        >
          <div className="gaming-card p-[1rem] text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-primary-500/20 rounded-lg mx-auto mb-2">
              <Target className="w-6 h-6 text-primary-400" />
            </div>
            <h3 className="font-orbitron font-semibold text-2xl text-white">
              {requests.length}
            </h3>
            <p className="text-gray-400 text-sm">Total Requests</p>
          </div>

          <div className="gaming-card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-success/20 rounded-lg mx-auto mb-2">
              <CheckCircle className="w-6 h-6 text-success" />
            </div>
            <h3 className="font-orbitron font-semibold text-2xl text-white">
              {requests.filter(r => r.status === 'accepted').length}
            </h3>
            <p className="text-gray-400 text-sm">Accepted</p>
          </div>

          <div className="gaming-card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-lg mx-auto mb-2">
              <Sword className="w-6 h-6 text-purple-400" />
            </div>
            <h3 className="font-orbitron font-semibold text-2xl text-white">
              {vsMatches.length}
            </h3>
            <p className="text-gray-400 text-sm">V/S Matches</p>
          </div>

          <div className="gaming-card text-center">
            <div className="flex items-center justify-center w-12 h-12 bg-yellow-500/20 rounded-lg mx-auto mb-2">
              <Trophy className="w-6 h-6 text-yellow-400" />
            </div>
            <h3 className="font-orbitron font-semibold text-2xl text-white">
              {vsMatches.reduce((acc, match) => acc + (match.tokens_earned || 0), 0)}
            </h3>
            <p className="text-gray-400 text-sm">Tokens Earned</p>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex space-x-1 bg-dark-100 rounded-lg p-1 mb-8"
        >
          <button
            onClick={() => setActiveTab('requests')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all duration-300 font-orbitron font-medium ${
              activeTab === 'requests'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-white hover:bg-dark-200'
            }`}
          >
            <Users className="w-4 h-4" />
            <span>Match Requests</span>
          </button>
          <button
            onClick={() => setActiveTab('vs-matches')}
            className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-md transition-all duration-300 font-orbitron font-medium ${
              activeTab === 'vs-matches'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-white hover:bg-dark-200'
            }`}
          >
            <Sword className="w-4 h-4" />
            <span>V/S Matches</span>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {activeTab === 'requests' && (
            <div className="space-y-4">
              {requests.map((request, index) => {
                const isCurrentUserSender = request.sender_id === user?.id;
                const otherUser = isCurrentUserSender ? request.receiver : request.sender;
                
                return (
                  <motion.div
                    key={request.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="gaming-card p-[0.5rem] sm:p-6 hover:neon-border transition-all duration-300"
                  >
                    <div className="flex flex-col md:flex-row md:items-center gap-4">
                      <div className="flex items-center space-x-4 flex-1">
                        <img
                          src={otherUser.profile_photo || getDefaultAvatar(otherUser.username)}
                          alt={otherUser.username}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary-500/30"
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-orbitron font-semibold text-white">
                              {otherUser.username}
                            </h3>
                            <span className="text-primary-400 text-sm">Level {otherUser.level}</span>
                            {getStatusIcon(request.status)}
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                            <div className="flex text-xs sm:text-sm items-center">
                              <User className="w-4 h-4 mr-1" />
                              {otherUser.game_uid}
                            </div>
                            <div className="flex !ml-4 w-[6rem] text-xs sm:text-sm items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {formatTime12Hour(request.available_time)}
                            </div>
                            <div className="flex text-xs sm:text-sm items-center">
                              <Calendar className="w-4 h-4 mr-1" />
                              {formatDateTime12Hour(request.created_at)}
                            </div>
                          </div>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="bg-primary-500/20 text-xs sm:text-sm text-primary-400 px-2 py-1 rounded">
                              {request.match_type}
                            </span>
                            <span className={`font-medium text-xs sm:text-sm ${getStatusColor(request.status)}`}>
                              {isCurrentUserSender ? 'Sent' : 'Received'} • {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                            </span>
                            {request.rejection_reason && (
                              <span className="text-red-400 text-xs sm:text-sm  ">
                                Reason: {request.rejection_reason}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}

              {requests.length === 0 && (
                <div className="text-center py-20">
                  <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-xl text-gray-400 mb-2">
                    No match requests yet
                  </h3>
                  <p className="text-gray-500">
                    Start by sending match requests to other players
                  </p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'vs-matches' && (
            <div className="space-y-4">
              {vsMatches.map((match, index) => (
                <motion.div
                  key={match.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="gaming-card hover:neon-border transition-all duration-300"
                >
                  <div className="flex flex-col md:flex-row md:items-center gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex items-center justify-center w-12 h-12 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg">
                        <Sword className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-orbitron font-semibold text-white">
                            {match.match_type} Match
                          </h3>
                          {getStatusIcon(match.status)}
                          {getResultBadge(match.result)}
                        </div>
                        
                        <div className="flex items-center space-x-4 text-sm text-gray-400 mb-2">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {formatDateTime12Hour(match.created_at)}
                          </div>
                          <span className={`font-medium ${getStatusColor(match.status)}`}>
                            {match.status.charAt(0).toUpperCase() + match.status.slice(1)}
                          </span>
                        </div>
                        
                        {match.room_id && match.status === 'matched' && (
                          <div className="bg-dark-100 rounded p-2 text-xs space-y-1">
                            <div>Room ID: <span className="text-white font-mono">{match.room_id}</span></div>
                            <div>Password: <span className="text-white font-mono">{match.room_password}</span></div>
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {match.tokens_earned && (
                      <div className="text-right">
                        <div className="flex items-center text-yellow-400">
                          <Trophy className="w-4 h-4 mr-1" />
                          <span className="font-orbitron font-semibold">+{match.tokens_earned}</span>
                        </div>
                        <span className="text-xs text-gray-400">tokens earned</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}

              {vsMatches.length === 0 && (
                <div className="text-center py-20">
                  <Sword className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="font-orbitron font-semibold text-xl text-gray-400 mb-2">
                    No V/S matches yet
                  </h3>
                  <p className="text-gray-500">
                    Join the V/S arena between 9 PM - 12 AM to start your competitive journey
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Matches;