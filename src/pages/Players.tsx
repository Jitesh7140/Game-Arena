import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Filter, Clock, Star, MessageSquare, Users } from 'lucide-react';
import { getAllPlayers, searchPlayers, sendMatchRequest } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDefaultAvatar, formatTime12Hour } from '../lib/utils';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface Player {
  id: string;
  username: string;
  game_uid: string;
  level: number;
  phone: string;
  email: string;
  active_time: string;
  profile_photo?: string;
  tokens: number;
  created_at: string;
}

const Players = () => {
  const [players, setPlayers] = useState<Player[]>([]);
  const [filteredPlayers, setFilteredPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [requestLoading, setRequestLoading] = useState(false);
  const [matchType, setMatchType] = useState('TDM');
  const [availableTime, setAvailableTime] = useState('');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadPlayers();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [searchQuery, players]);

  const loadPlayers = async () => {
    try {
      const { data, error } = await getAllPlayers();
      if (error) throw error;
      
      // Filter out current user
      const otherPlayers = data?.filter(player => player.id !== user?.id) || [];
      setPlayers(otherPlayers);
      setFilteredPlayers(otherPlayers);
    } catch (error) {
      toast.error('Failed to load players');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setFilteredPlayers(players);
      return;
    }

    try {
      const { data, error } = await searchPlayers(searchQuery);
      if (error) throw error;
      
      // Filter out current user
      const otherPlayers = data?.filter(player => player.id !== user?.id) || [];
      setFilteredPlayers(otherPlayers);
    } catch (error) {
      console.error('Search error:', error);
      setFilteredPlayers([]);
    }
  };

  const handlePlayerClick = (player: Player) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSelectedPlayer(player);
    setShowRequestModal(true);
  };

  const handleSendRequest = async () => {
    if (!selectedPlayer || !availableTime) return;

    setRequestLoading(true);
    try {
      const { error } = await sendMatchRequest(selectedPlayer.id, matchType, availableTime);
      if (error) throw error;

      toast.success('Match request sent successfully!');
      setShowRequestModal(false);
      setMatchType('TDM');
      setAvailableTime('');
      setSelectedPlayer(null);
    } catch (error: any) {
      toast.error(error.message || 'Failed to send request');
    } finally {
      setRequestLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen py-12 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron font-bold text-2xl md:text-5xl mb-4 text-white">
            Find Players
          </h1>
          <p className="text-base sm:text-xl text-gray-400 font-rajdhani">
            Connect with skilled BGMI players and build your dream team
          </p>
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="gaming-card mb-8"
        >
          <div className="flex  flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, Game UID, or level..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-3 gaming-input"
              />
            </div>
            <Button variant="secondary" className="flex px-[0.3rem] text-[0.5rem] items-center">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </motion.div>

        {/* Players Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPlayers.map((player, index) => (
            <motion.div
              key={player.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="gaming-card hover:neon-border cursor-pointer transition-all duration-300 group"
              onClick={() => handlePlayerClick(player)}
            >
              <div className="flex items-center space-x-4 mb-4">
                <div className="relative">
                  <img
                    src={player.profile_photo || getDefaultAvatar(player.username)}
                    alt={player.username}
                    className="w-16 h-16 rounded-full object-cover border-2 border-primary-500/30"
                  />
                  <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-success rounded-full border-2 border-dark-50"></div>
                </div>
                <div className="flex-1">
                  <h3 className="font-orbitron font-semibold text-white text-lg">
                    {player.username}
                  </h3>
                  <p className="text-primary-400 text-sm">Level {player.level}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center text-yellow-400 mb-1">
                    <Star className="w-4 h-4 mr-1" />
                    <span className="text-sm">{player.tokens}</span>
                  </div>
                  <span className="text-xs text-gray-400">tokens</span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-gray-300 text-sm">
                  <Users className="w-4 h-4 mr-2 text-primary-400" />
                  <span>UID: {player.game_uid}</span>
                </div>
                <div className="flex items-center text-gray-300 text-sm">
                  <Clock className="w-4 h-4 mr-2 text-primary-400" />
                  <span>Active: {formatTime12Hour(player.active_time)}</span>
                </div>
              </div>

              <Button
                className="w-full group-hover:neon-glow transition-all duration-300"
                size="sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Send Request
              </Button>
            </motion.div>
          ))}
        </div>

        {filteredPlayers.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-orbitron font-semibold text-xl text-gray-400 mb-2">
              No players found
            </h3>
            <p className="text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria' : 'Be the first to join the arena!'}
            </p>
          </motion.div>
        )}

        {/* Match Request Modal */}
        <Modal
          isOpen={showRequestModal}
          onClose={() => setShowRequestModal(false)}
          title="Send Match Request"
        >
          {selectedPlayer && (
            <div className="space-y-6">
              <div className="flex items-center space-x-4 p-4 bg-dark-100 rounded-lg">
                <img
                  src={selectedPlayer.profile_photo || getDefaultAvatar(selectedPlayer.username)}
                  alt={selectedPlayer.username}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-orbitron font-semibold text-white">
                    {selectedPlayer.username}
                  </h3>
                  <p className="text-primary-400 text-sm">Level {selectedPlayer.level}</p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Match Type
                </label>
                <select
                  value={matchType}
                  onChange={(e) => setMatchType(e.target.value)}
                  className="w-full gaming-input"
                >
                  <option value="TDM">Team Deathmatch</option>
                  <option value="Classic">Classic</option>
                  <option value="Arena">Arena</option>
                  <option value="Ranked">Ranked</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Available Time
                </label>
                <input
                  type="time"
                  value={availableTime}
                  onChange={(e) => setAvailableTime(e.target.value)}
                  className="w-full gaming-input"
                  required
                />
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowRequestModal(false)}
                  className="flex-1"
                  disabled={requestLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSendRequest}
                  className="flex-1"
                  loading={requestLoading}
                  disabled={!availableTime}
                >
                  Send Request
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Players;