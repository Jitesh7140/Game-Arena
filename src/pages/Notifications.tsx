import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Bell, BellOff, Trophy, GamepadIcon, Users, AlertCircle, Check, Trash2 } from 'lucide-react';
import { getNotifications, markNotificationAsRead } from '../lib/database';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { formatDateTime12Hour } from '../lib/utils';
import Button from '../components/UI/Button';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import toast from 'react-hot-toast';

interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'match' | 'tournament' | 'tokens' | 'general';
  read: boolean;
  created_at: string;
}

const Notifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');
  
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    loadNotifications();
  }, [user, navigate]);

  const loadNotifications = async () => {
    try {
      const { data, error } = await getNotifications();
      if (error) throw error;
      setNotifications(data || []);
    } catch (error) {
      toast.error('Failed to load notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const { error } = await markNotificationAsRead(notificationId);
      if (error) throw error;
      
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === notificationId 
            ? { ...notif, read: true }
            : notif
        )
      );
    } catch (error) {
      toast.error('Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    
    try {
      await Promise.all(
        unreadNotifications.map(notif => markNotificationAsRead(notif.id))
      );
      
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read: true }))
      );
      
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all notifications as read');
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'match':
        return <GamepadIcon className="w-5 h-5 text-primary-400" />;
      case 'tournament':
        return <Trophy className="w-5 h-5 text-yellow-400" />;
      case 'tokens':
        return <Users className="w-5 h-5 text-success" />;
      default:
        return <AlertCircle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationBg = (type: string) => {
    switch (type) {
      case 'match':
        return 'bg-primary-500/10 border-primary-500/20';
      case 'tournament':
        return 'bg-yellow-500/10 border-yellow-500/20';
      case 'tokens':
        return 'bg-success/10 border-success/20';
      default:
        return 'bg-gray-500/10 border-gray-500/20';
    }
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || (filter === 'unread' && !notif.read)
  );

  const unreadCount = notifications.filter(n => !n.read).length;

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
          className="flex flex-col md:flex-row md:items-center justify-between mb-8"
        >
          <div>
            <h1 className="font-orbitron font-bold text-4xl md:text-5xl mb-2 text-white">
              Notifications
            </h1>
            <p className="text-xl text-gray-400 font-rajdhani">
              Stay updated with your gaming activity
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4 md:mt-0">
            {unreadCount > 0 && (
              <div className="flex items-center space-x-2 text-primary-400">
                <Bell className="w-5 h-5" />
                <span className="font-orbitron font-semibold">
                  {unreadCount} unread
                </span>
              </div>
            )}
            
            {unreadCount > 0 && (
              <Button
                size="sm"
                variant="secondary"
                onClick={handleMarkAllAsRead}
              >
                <Check className="w-4 h-4 mr-2" />
                Mark All Read
              </Button>
            )}
          </div>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex space-x-1 bg-dark-100 rounded-lg p-1 mb-8 w-fit"
        >
          <button
            onClick={() => setFilter('all')}
            className={`px-4 py-2 rounded-md transition-all duration-300 font-orbitron font-medium text-sm ${
              filter === 'all'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-white hover:bg-dark-200'
            }`}
          >
            All ({notifications.length})
          </button>
          <button
            onClick={() => setFilter('unread')}
            className={`px-4 py-2 rounded-md transition-all duration-300 font-orbitron font-medium text-sm ${
              filter === 'unread'
                ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30'
                : 'text-gray-400 hover:text-white hover:bg-dark-200'
            }`}
          >
            Unread ({unreadCount})
          </button>
        </motion.div>

        {/* Notifications List */}
        <div className="space-y-4">
          {filteredNotifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`gaming-card transition-all duration-300 ${
                !notification.read 
                  ? `${getNotificationBg(notification.type)} neon-border` 
                  : 'hover:neon-border'
              }`}
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center justify-center w-12 h-12 bg-dark-100 rounded-lg flex-shrink-0">
                  {getNotificationIcon(notification.type)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-orbitron font-semibold text-white text-lg">
                      {notification.title}
                    </h3>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      {!notification.read && (
                        <div className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" />
                      )}
                      
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatDateTime12Hour(notification.created_at)}
                      </span>
                      
                      {!notification.read && (
                        <button
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="p-1 text-gray-400 hover:text-primary-400 hover:bg-primary-500/10 rounded transition-all duration-300"
                          title="Mark as read"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-gray-300 leading-relaxed">
                    {notification.message}
                  </p>
                  
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs px-2 py-1 rounded font-orbitron ${
                      notification.type === 'match' 
                        ? 'bg-primary-500/20 text-primary-400'
                        : notification.type === 'tournament'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : notification.type === 'tokens'
                        ? 'bg-success/20 text-success'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {notification.type.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-20"
          >
            {filter === 'unread' ? (
              <>
                <BellOff className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-orbitron font-semibold text-xl text-gray-400 mb-2">
                  No unread notifications
                </h3>
                <p className="text-gray-500">
                  You're all caught up! Check back later for updates.
                </p>
              </>
            ) : (
              <>
                <Bell className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="font-orbitron font-semibold text-xl text-gray-400 mb-2">
                  No notifications yet
                </h3>
                <p className="text-gray-500">
                  Start playing matches and joining tournaments to receive notifications
                </p>
              </>
            )}
          </motion.div>
        )}

        {notifications.length > 0 && unreadCount === 0 && filter === 'all' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 bg-success/10 border border-success/20 rounded-lg mt-8"
          >
            <Check className="w-12 h-12 text-success mx-auto mb-2" />
            <p className="text-success font-orbitron font-medium">
              All notifications read!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Notifications;