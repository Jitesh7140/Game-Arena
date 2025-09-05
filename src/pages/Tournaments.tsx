import   { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Trophy, Users, Calendar, DollarSign, Clock,     AlertCircle } from 'lucide-react';
import { getTournaments, registerForTournament } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDateTime12Hour } from '../lib/utils';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface Tournament {
  id: string;
  title: string;
  description: string;
  image_url: string;
  entry_fee: number;
  prize_pool: number;
  max_participants: number;
  current_participants: number;
  start_time: string;
  registration_deadline: string;
  rules: string;
  status: 'upcoming' | 'ongoing' | 'completed';
  created_at: string;
}

const Tournaments = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRegisterModal, setShowRegisterModal] = useState(false);
  const [teamName, setTeamName] = useState('');
  const [registerLoading, setRegisterLoading] = useState(false);
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    loadTournaments();
  }, []);

  const loadTournaments = async () => {
    try {
      const { data, error } = await getTournaments();
      if (error) throw error;
      setTournaments(data || []);
    } catch (error) {
      toast.error('Failed to load tournaments');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (tournament: Tournament) => {
    setSelectedTournament(tournament);
    setShowDetailsModal(true);
  };

  const handleRegister = (tournament: Tournament) => {
    if (!user) {
      navigate('/login');
      return;
    }
    
    setSelectedTournament(tournament);
    setShowRegisterModal(true);
  };

  const handleRegisterConfirm = async () => {
    if (!selectedTournament) return;
    
    setRegisterLoading(true);
    try {
      const { error } = await registerForTournament(selectedTournament.id, teamName);
      if (error) throw error;

      toast.success('Successfully registered for tournament!');
      setShowRegisterModal(false);
      setTeamName('');
      setSelectedTournament(null);
      await loadTournaments();
    } catch (error: any) {
      toast.error(error.message || 'Failed to register for tournament');
    } finally {
      setRegisterLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors = {
      upcoming: 'bg-primary-500/20 text-primary-400',
      ongoing: 'bg-success/20 text-success',
      completed: 'bg-gray-500/20 text-gray-400',
    };
    
    return (
      <span className={`px-2 py-1 rounded text-xs font-orbitron ₹{colors[status as keyof typeof colors]}`}>
        {status.toUpperCase()}
      </span>
    );
  };

  const isRegistrationOpen = (tournament: Tournament) => {
    const now = new Date();
    const deadline = new Date(tournament.registration_deadline);
    return now < deadline && tournament.status === 'upcoming' && tournament.current_participants < tournament.max_participants;
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
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron font-bold text-4xl md:text-5xl mb-4 text-white">
            Tournaments
          </h1>
          <p className="text-xl text-gray-400 font-rajdhani">
            Compete in epic tournaments and win amazing prizes
          </p>
        </motion.div>

        {/* Tournaments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tournaments.map((tournament, index) => (
            <motion.div
              key={tournament.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="gaming-card hover:neon-border transition-all duration-300 overflow-hidden group"
            >
              {/* Tournament Image */}
              <div className="relative h-48 mb-4 -mx-6 -mt-6">
                <img
                  src={tournament.image_url}
                  alt={tournament.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  {getStatusBadge(tournament.status)}
                </div>
                <div className="absolute top-4 right-4">
                  {tournament.entry_fee > 0 ? (
                    <span className="bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded text-xs font-orbitron">
                      PAID
                    </span>
                  ) : (
                    <span className="bg-success/20 text-success px-2 py-1 rounded text-xs font-orbitron">
                      FREE
                    </span>
                  )}
                </div>
              </div>

              {/* Tournament Info */}
              <div className="space-y-4">
                <div>
                  <h3 className="font-orbitron font-bold text-xl mb-2 text-white group-hover:text-primary-400 transition-colors">
                    {tournament.title}
                  </h3>
                  <p className="text-gray-400 text-sm line-clamp-2">
                    {tournament.description}
                  </p>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-400" />
                      Prize Pool
                    </div>
                    <span className="text-yellow-400 font-orbitron font-semibold">
                      ₹{tournament.prize_pool.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <Users className="w-4 h-4 mr-2 text-primary-400" />
                      Participants
                    </div>
                    <span className="text-white">
                      {tournament.current_participants}/{tournament.max_participants}
                    </span>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-400">
                      <Calendar className="w-4 h-4 mr-2 text-purple-400" />
                      Starts
                    </div>
                    <span className="text-white">
                      {formatDateTime12Hour(tournament.start_time)}
                    </span>
                  </div>
                  
                  {tournament.entry_fee > 0 && (
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-400">
                        <DollarSign className="w-4 h-4 mr-2 text-green-400" />
                        Entry Fee
                      </div>
                      <span className="text-yellow-400 font-orbitron">
                        ₹{tournament.entry_fee}
                      </span>
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-dark-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `₹{(tournament.current_participants / tournament.max_participants) * 100}%` }}
                  />
                </div>

                {/* Action Buttons */}
                <div className="flex space-x-2 pt-4">
                  <Button
                    size="sm"
                    variant="secondary"
                    onClick={() => handleViewDetails(tournament)}
                    className="flex-1"
                  >
                    Details
                  </Button>
                  
                  {isRegistrationOpen(tournament) ? (
                    <Button
                      size="sm"
                      onClick={() => handleRegister(tournament)}
                      className="flex-1 neon-glow"
                    >
                      Register
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled
                      className="flex-1"
                    >
                      {tournament.current_participants >= tournament.max_participants 
                        ? 'Full' 
                        : tournament.status === 'completed' 
                        ? 'Completed' 
                        : 'Closed'
                      }
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {tournaments.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <Trophy className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-orbitron font-semibold text-xl text-gray-400 mb-2">
              No tournaments available
            </h3>
            <p className="text-gray-500">
              Check back soon for exciting tournaments and competitions
            </p>
          </motion.div>
        )}

        {/* Tournament Details Modal */}
        <Modal
          isOpen={showDetailsModal}
          onClose={() => setShowDetailsModal(false)}
          title="Tournament Details"
          size="lg"
        >
          {selectedTournament && (
            <div className="space-y-6">
              <div className="relative h-48 -mx-6 rounded-lg overflow-hidden">
                <img
                  src={selectedTournament.image_url}
                  alt={selectedTournament.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute top-4 left-4">
                  {getStatusBadge(selectedTournament.status)}
                </div>
              </div>

              <div>
                <h3 className="font-orbitron font-bold text-2xl mb-2 text-white">
                  {selectedTournament.title}
                </h3>
                <p className="text-gray-300 leading-relaxed">
                  {selectedTournament.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    <span className="text-gray-400">Prize Pool:</span>
                    <span className="text-yellow-400 font-orbitron font-semibold">
                      ₹{selectedTournament.prize_pool.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Users className="w-5 h-5 text-primary-400" />
                    <span className="text-gray-400">Participants:</span>
                    <span className="text-white">
                      {selectedTournament.current_participants}/{selectedTournament.max_participants}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-5 h-5 text-green-400" />
                    <span className="text-gray-400">Entry Fee:</span>
                    <span className={selectedTournament.entry_fee > 0 ? 'text-yellow-400 font-orbitron' : 'text-success'}>
                      {selectedTournament.entry_fee > 0 ? `₹₹{selectedTournament.entry_fee}` : 'FREE'}
                    </span>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-5 h-5 text-purple-400" />
                    <span className="text-gray-400">Starts:</span>
                    <span className="text-white text-sm">
                      {formatDateTime12Hour(selectedTournament.start_time)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <Clock className="w-5 h-5 text-red-400" />
                    <span className="text-gray-400">Registration Ends:</span>
                    <span className="text-white text-sm">
                      {formatDateTime12Hour(selectedTournament.registration_deadline)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <AlertCircle className="w-5 h-5 text-orange-400" />
                    <span className="text-gray-400">Status:</span>
                    <span className="text-white">
                      {selectedTournament.status.charAt(0).toUpperCase() + selectedTournament.status.slice(1)}
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-orbitron font-semibold text-lg mb-3 text-white">Rules & Regulations</h4>
                <div className="bg-dark-100 rounded-lg p-4">
                  <pre className="text-gray-300 text-sm whitespace-pre-wrap">
                    {selectedTournament.rules}
                  </pre>
                </div>
              </div>

              {isRegistrationOpen(selectedTournament) && (
                <div className="flex justify-end">
                  <Button onClick={() => {
                    setShowDetailsModal(false);
                    handleRegister(selectedTournament);
                  }}>
                    Register Now
                  </Button>
                </div>
              )}
            </div>
          )}
        </Modal>

        {/* Registration Modal */}
        <Modal
          isOpen={showRegisterModal}
          onClose={() => setShowRegisterModal(false)}
          title="Tournament Registration"
        >
          {selectedTournament && (
            <div className="space-y-6">
              <div className="bg-dark-100 rounded-lg p-4">
                <h3 className="font-orbitron font-semibold text-white mb-2">
                  {selectedTournament.title}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Entry Fee:</span>
                    <span className={selectedTournament.entry_fee > 0 ? 'text-yellow-400' : 'text-success'}>
                      {selectedTournament.entry_fee > 0 ? `₹₹{selectedTournament.entry_fee}` : 'FREE'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Prize Pool:</span>
                    <span className="text-yellow-400">₹{selectedTournament.prize_pool.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Starts:</span>
                    <span className="text-white">{formatDateTime12Hour(selectedTournament.start_time)}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Team Name (Optional)
                </label>
                <input
                  type="text"
                  value={teamName}
                  onChange={(e) => setTeamName(e.target.value)}
                  placeholder="Enter your team name..."
                  className="w-full gaming-input"
                />
                <p className="text-gray-400 text-xs mt-1">
                  Leave blank if playing solo
                </p>
              </div>

              <div className="flex space-x-4">
                <Button
                  variant="secondary"
                  onClick={() => setShowRegisterModal(false)}
                  className="flex-1"
                  disabled={registerLoading}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleRegisterConfirm}
                  className="flex-1"
                  loading={registerLoading}
                >
                  Register Now
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default Tournaments;