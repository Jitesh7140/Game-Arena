import  { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import './forCSS.css';
import { 
  Home, Users, MessageSquare, Sword, Trophy, 
  Bell, Menu, X, LogOut   , GamepadIcon 
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, profile, signOut } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navItems = [
    { name: 'Home', path: '/', icon: Home },
    { name: 'Players', path: '/players', icon: Users },
    { name: 'Requests', path: '/requests', icon: MessageSquare, requireAuth: true },
    { name: 'V/S Match', path: '/vs-match', icon: Sword },
    { name: 'Matches', path: '/matches', icon: GamepadIcon, requireAuth: true },
    { name: 'Tournaments', path: '/tournaments', icon: Trophy },
    { name: 'Notifications', path: '/notifications', icon: Bell, requireAuth: true },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
    setIsMobileMenuOpen(false);
  };

  const handleNavClick = (item: any) => {
    if (item.requireAuth && !user) {
      navigate('/login');
    } else {
      navigate(item.path);
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 bg-black/90 backdrop-blur-md border-b border-primary-500/20"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
              <GamepadIcon className="w-6 h-6 text-white" />
            </div>
            <span className="font-orbitron font-bold text-xl text-white">
              Game Arena
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <button
                  key={item.name}
                  onClick={() => handleNavClick(item)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-lg marginfix transition-all duration-300 ${
                    isActive 
                      ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                      : 'text-gray-300 hover:text-primary-400 hover:bg-primary-500/10'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-rajdhani font-medium">{item.name}</span>
                </button>
              );
            })}
          </div>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user ? (
              <div className="flex items-center space-x-4">
                <div className="w-[7rem] flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">
                      {profile?.username?.charAt(0) || 'U'}
                    </span>
                  </div>
                  <div>
                    <p className="text-white font-medium">{profile?.username}</p>
                    <p className="text-primary-400 text-sm">{profile?.tokens} tokens</p>
                  </div>
                </div>
                <button
                  onClick={handleSignOut}
                  className="p-2 text-gray-300 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-300 hover:text-primary-400 font-rajdhani font-medium transition-colors"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="h-[2rem] w-[5rem] px-[0rem] m-[1rem] pt-[0.5rem] pl-[0.5rem] text-xs gaming-button text-black"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white p-2"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-primary-500/20"
          >
            <div className="space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <button
                    key={item.name}
                    onClick={() => handleNavClick(item)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-300 ${
                      isActive 
                        ? 'bg-primary-500/20 text-primary-400 border border-primary-500/30' 
                        : 'text-gray-300 hover:text-primary-400 hover:bg-primary-500/10'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-rajdhani font-medium">{item.name}</span>
                  </button>
                );
              })}
              
              {user ? (
                <div className="pt-4 border-t border-primary-500/20">
                  <div className="flex items-center space-x-3 px-4 py-2">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white font-bold">
                        {profile?.username?.charAt(0) || 'U'}
                      </span>
                    </div>
                    <div>
                      <p className="text-white font-medium">{profile?.username}</p>
                      <p className="text-primary-400 text-sm">{profile?.tokens} tokens</p>
                    </div>
                  </div>
                  <button
                    onClick={handleSignOut}
                    className="w-full flex items-center space-x-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-300"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-rajdhani font-medium">Sign Out</span>
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-primary-500/20 space-y-2">
                  <Link
                    to="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center text-gray-300 hover:text-primary-400 font-rajdhani font-medium border border-primary-500/30 rounded-lg transition-colors"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="block w-full px-4 py-3 text-center gaming-button text-black"
                  >
                    Sign Up
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

export default Navbar;