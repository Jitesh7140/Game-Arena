import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, Clock, User, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { getMyRequests, updateRequestStatus } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { getDefaultAvatar, formatTime12Hour, formatDateTime12Hour } from '../lib/utils';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
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
}

const Requests = () => {
  const [requests, setRequests] = useState<MatchRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<MatchRequest | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login');
    } else if (user) {
      loadRequests();
    }
  }, [user, authLoading, navigate]);

  useEffect(() => {
    const handleFocus = () => {
      if (user) loadRequests();
    };
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [user]);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const { data, error } = await getMyRequests();
      if (error) throw error;
      setRequests(data || []);
    } catch (error) {
      toast.error('Failed to load requests');
    } finally {
      setLoading(false);
    }
  };

  const handleAccept = async (requestId: string) => {
    setActionLoading(true);
    try {
      const { error } = await updateRequestStatus(requestId, 'accepted');
      if (error) throw error;

      toast.success('Request accepted successfully!');
      await loadRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to accept request');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = (request: MatchRequest) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedRequest || !rejectReason) return;

    setActionLoading(true);
    try {
      const { error } = await updateRequestStatus(selectedRequest.id, 'rejected', rejectReason);
      if (error) throw error;

      toast.success('Request rejected');
      setShowRejectModal(false);
      setRejectReason('');
      setSelectedRequest(null);
      await loadRequests();
    } catch (error: any) {
      toast.error(error.message || 'Failed to reject request');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return <CheckCircle className="w-5 h-5 text-success" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-400" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted':
        return 'text-success';
      case 'rejected':
        return 'text-red-400';
      default:
        return 'text-yellow-400';
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
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="font-orbitron font-bold text-2xl md:text-5xl mb-4 text-white">
            Match Requests
          </h1>
          <p className="text-base sm:text-xl text-gray-400 font-rajdhani">
            Manage your incoming match requests
          </p>
        </motion.div>

        {/* Requests List */}
        <div className="space-y-6">
          {requests.map((request, index) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="p-2 sm:p-4 gaming-card hover:neon-border transition-all duration-300"
            >
              <div className="flex flex-col md:flex-row md:items-center ">
                <div className="flex items-center space-x-4 flex-1">
                  <img
                    src={request.sender.profile_photo || getDefaultAvatar(request.sender.username)}
                    alt={request.sender.username}
                    className="w-14 h-14 rounded-full object-cover border-2 border-primary-500/30"
                  />

                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-orbitron font-semibold text-white text-lg">
                        {request.sender.username}
                      </h3>
                      <span className="text-primary-400 text-sm">Level {request.sender.level}</span>
                      {getStatusIcon(request.status)}
                    </div>

                    <div className="flex items-center space-x-4 text-[0.6rem] sm:text-sm text-gray-400 mb-2">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1" />
                        {request.sender.game_uid}
                      </div>
                      <div className="flex  w-[4rem] sm:w-[5rem] items-center">
                        <Clock className="w-4 h-4 mr-1" />
                        {formatTime12Hour(request.available_time)}
                      </div>

                      <div className="flex items-center space-x-4 !ml-1 text-sm">
                        <span className="bg-primary-500/20 text-[0.6rem] sm:text-base text-primary-400 px-1 sm:px-2 sm:py-1 rounded">
                          {request.match_type}
                        </span>
                        <span className={`font-medium ${getStatusColor(request.status)}`}>
                          {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                        </span>
                      </div>

                    </div>
                        {request.rejection_reason && (
                          <span className="text-red-400 text-xs">
                            Reason: {request.rejection_reason}
                          </span>
                        )}


                  </div>
                </div>

                <div className="flex flex-col items-end space-y-2">
                  <span className="text-xs text-gray-400">
                    {formatDateTime12Hour(request.created_at)}
                  </span>

                  {request.status === 'pending' && (
                    <div className="flex space-x-2">
                      <Button
                        className='px-2 py-1  sm:px-3 sm:py-2'
                        size="sm"
                        variant="success"
                        onClick={() => handleAccept(request.id)}
                        loading={actionLoading}
                      >
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        className='px-2 py-1  sm:px-3 sm:py-2'
                        variant="danger"
                        onClick={() => handleReject(request)}
                        loading={actionLoading}
                      >
                        Reject
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {requests.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="font-orbitron font-semibold text-xl text-gray-400 mb-2">
              No requests yet
            </h3>
            <p className="text-gray-500 mb-6">
              Share your profile with other players to start receiving match requests
            </p>
            <Button onClick={() => navigate('/players')}>
              Find Players
            </Button>
          </motion.div>
        )}

        {/* Reject Modal */}
        <Modal
          isOpen={showRejectModal}
          onClose={() => setShowRejectModal(false)}
          title="Reject Request"
        >
          <div className="space-y-4">
            <p className="text-gray-300">
              Please select a reason for rejecting this match request:
            </p>

            <div className="space-y-2">
              {[
                'Not available at requested time',
                'Different game mode preference',
                'Currently busy',
                'Looking for different skill level',
                'Other'
              ].map((reason) => (
                <label key={reason} className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="rejectReason"
                    value={reason}
                    checked={rejectReason === reason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    className="text-primary-500"
                  />
                  <span className="text-gray-300">{reason}</span>
                </label>
              ))}
            </div>

            <div className="flex space-x-4 pt-4">
              <Button
                variant="secondary"
                onClick={() => setShowRejectModal(false)}
                className="flex-1"
                disabled={actionLoading}
              >
                Cancel
              </Button>
              <Button
                variant="danger"
                onClick={handleRejectConfirm}
                className="flex-1"
                loading={actionLoading}
                disabled={!rejectReason}
              >
                Reject Request
              </Button>
            </div>
          </div>
        </Modal>
      </div>
    </div>
  );
};

export default Requests;
