import React from 'react';
import { motion } from 'framer-motion';
import { GamepadIcon, Users, Trophy, Target, Zap, Shield, Clock, Star } from 'lucide-react';
import Button from '../components/UI/Button';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Users,
      title: 'Player Matching',
      description: 'Advanced algorithm to connect players based on skill level, availability, and preferences.',
    },
    {
      icon: Zap,
      title: 'Real-time V/S Matches',
      description: 'Instant competitive matches during peak hours with automatic opponent matching.',
    },
    {
      icon: Trophy,
      title: 'Tournament System',
      description: 'Regular tournaments with cash prizes and ranking systems to showcase your skills.',
    },
    {
      icon: Target,
      title: 'Skill Tracking',
      description: 'Comprehensive statistics and performance tracking to monitor your improvement.',
    },
    {
      icon: Shield,
      title: 'Secure Platform',
      description: 'Advanced security measures to protect user data and ensure fair gameplay.',
    },
    {
      icon: Clock,
      title: '24/7 Support',
      description: 'Round-the-clock assistance to help you with any questions or issues.',
    },
  ];

  const stats = [
    { number: '10K+', label: 'Active Players' },
    { number: '500+', label: 'Daily Matches' },
    { number: '50+', label: 'Tournaments' },
    { number: '99.9%', label: 'Uptime' },
  ];

  const team = [
    {
      name: 'Alex Chen',
      role: 'Founder & CEO',
      image: 'https://images.pexels.com/photos/3765035/pexels-photo-3765035.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Former esports pro with 8+ years in competitive gaming.',
    },
    {
      name: 'Sarah Kim',
      role: 'Head of Community',
      image: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Community management expert passionate about gaming culture.',
    },
    {
      name: 'Mike Rodriguez',
      role: 'Lead Developer',
      image: 'https://images.pexels.com/photos/3777931/pexels-photo-3777931.jpeg?auto=compress&cs=tinysrgb&w=300',
      description: 'Full-stack engineer specializing in gaming platforms.',
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-6 text-white">
            About Game Arena
          </h1>
          <p className="text-xl text-gray-400 font-rajdhani max-w-3xl mx-auto leading-relaxed">
            We're revolutionizing the BGMI esports scene by connecting players, organizing tournaments, 
            and building the ultimate competitive gaming community.
          </p>
        </motion.div>

        {/* Hero Image */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-2xl overflow-hidden mb-20 group"
        >
          <img
            src="https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Gaming Arena"
            className="w-full h-64 md:h-96 object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/60" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <GamepadIcon className="w-20 h-20 text-primary-400 mx-auto mb-4 animate-float" />
              <h2 className="font-orbitron font-bold text-3xl text-white mb-2">
                Built by Gamers, for Gamers
              </h2>
              <p className="text-gray-300 font-rajdhani text-lg">
                Every feature designed with competitive gaming in mind
              </p>
            </div>
          </div>
        </motion.div>

        {/* Our Mission */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="gaming-card text-center max-w-4xl mx-auto">
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-6 text-white">
              Our Mission
            </h2>
            <p className="text-lg text-gray-300 font-rajdhani leading-relaxed mb-8">
              To create the most comprehensive and user-friendly platform for BGMI players to connect, 
              compete, and grow their skills. We believe every gamer deserves access to quality opponents, 
              fair competition, and opportunities to showcase their talent.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Users className="w-8 h-8 text-primary-400" />
                </div>
                <h3 className="font-orbitron font-semibold text-white mb-2">Connect</h3>
                <p className="text-gray-400 text-sm">Bring players together</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-500/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-purple-400" />
                </div>
                <h3 className="font-orbitron font-semibold text-white mb-2">Compete</h3>
                <p className="text-gray-400 text-sm">Fair and exciting competitions</p>
              </div>
              <div className="text-center">
                <div className="w-16 h-16 bg-success/20 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <Star className="w-8 h-8 text-success" />
                </div>
                <h3 className="font-orbitron font-semibold text-white mb-2">Excel</h3>
                <p className="text-gray-400 text-sm">Help players reach their potential</p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl text-center mb-12 text-white">
            Platform Features
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="gaming-card hover:neon-border transition-all duration-300 group text-center"
                >
                  <div className="w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:animate-float">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="font-orbitron font-semibold text-xl mb-3 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400 font-rajdhani leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <div className="gaming-card">
            <h2 className="font-orbitron font-bold text-3xl text-center mb-12 text-white">
              Platform Statistics
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  viewport={{ once: true }}
                  className="text-center"
                >
                  <div className="font-orbitron font-bold text-3xl md:text-4xl text-primary-400 mb-2">
                    {stat.number}
                  </div>
                  <div className="text-gray-400 font-rajdhani">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* Team */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-20"
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl text-center mb-12 text-white">
            Meet Our Team
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 * index }}
                viewport={{ once: true }}
                className="gaming-card text-center group hover:neon-border transition-all duration-300"
              >
                <div className="relative w-24 h-24 mx-auto mb-4">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full rounded-full object-cover border-4 border-primary-500/30 group-hover:border-primary-500/60 transition-all duration-300"
                  />
                  <div className="absolute inset-0 rounded-full bg-gradient-to-t from-primary-500/20 to-transparent" />
                </div>
                <h3 className="font-orbitron font-semibold text-xl mb-1 text-white">
                  {member.name}
                </h3>
                <p className="text-primary-400 font-rajdhani font-medium mb-3">
                  {member.role}
                </p>
                <p className="text-gray-400 text-sm font-rajdhani">
                  {member.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center gaming-card"
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-6 text-white">
            Ready to Join the Arena?
          </h2>
          <p className="text-xl text-gray-400 font-rajdhani mb-8 max-w-2xl mx-auto">
            Experience the future of BGMI competitive gaming. Connect with players, 
            join tournaments, and climb the leaderboards.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="neon-glow"
            >
              Create Account
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/players')}
            >
              Explore Players
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default About;