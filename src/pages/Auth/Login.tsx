import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, GamepadIcon } from 'lucide-react';
import { signIn } from '../../lib/auth';
import Button from '../../components/UI/Button';
import toast from 'react-hot-toast';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await signIn(formData.email, formData.password);
      
      if (error) {
        toast.error(error);
        return;
      }

      if (data?.user) {
        toast.success('Welcome back to Game Arena!');
        navigate('/');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="max-w-6xl w-full mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Image */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Gaming"
                className="w-full h-[600px] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <GamepadIcon className="w-20 h-20 text-primary-400 mx-auto mb-6" />
                  <h2 className="font-orbitron font-bold text-3xl mb-4 text-white">
                    Welcome Back
                  </h2>
                  <p className="text-xl text-gray-300 font-rajdhani">
                    Ready to dominate the arena again?
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Form */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="gaming-card neon-border"
          >
            <div className="text-center mb-8">
              <h1 className="font-orbitron font-bold text-3xl md:text-4xl mb-4 text-white">
                Sign In
              </h1>
              <p className="text-gray-400 font-rajdhani text-lg">
                Enter your credentials to access your account
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 gaming-input"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full pl-10 pr-12 py-3 gaming-input"
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full neon-glow"
              >
                Sign In
              </Button>

              {/* Links */}
              <div className="text-center space-y-4">
                <p className="text-gray-400">
                  Don't have an account?{' '}
                  <Link
                    to="/signup"
                    className="text-primary-400 hover:text-primary-300 font-orbitron font-medium transition-colors"
                  >
                    Sign Up
                  </Link>
                </p>
                
                <div className="flex items-center space-x-4 text-sm">
                  <Link
                    to="/forgot-password"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Forgot Password?
                  </Link>
                  <span className="text-gray-600">•</span>
                  <Link
                    to="/"
                    className="text-gray-400 hover:text-primary-400 transition-colors"
                  >
                    Back to Home
                  </Link>
                </div>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Login;