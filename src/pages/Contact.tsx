import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageSquare, Clock, User } from 'lucide-react';
import { submitContactForm } from '../lib/database';
import Button from '../components/UI/Button';
import toast from 'react-hot-toast';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast.error('Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      await submitContactForm(formData.name, formData.email, formData.message);
      setFormData({ name: '', email: '', message: '' });
    } catch (error) {
      // Error is already handled in the function
    } finally {
      setLoading(false);
    }
  };

  const contactInfo = [
    {
      icon: Mail,
      title: 'Email Us',
      value: 'support@gamearena.com',
      description: 'Send us an email and we\'ll respond within 24 hours',
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: '+1 (555) 123-4567',
      description: 'Available Monday to Friday, 9 AM - 6 PM EST',
    },
    {
      icon: MapPin,
      title: 'Visit Us',
      value: 'Gaming District, Esports City',
      description: 'Our headquarters in the heart of gaming culture',
    },
  ];

  const faqs = [
    {
      question: 'How do I find teammates for matches?',
      answer: 'Use our Players section to browse and filter players by level, availability, and preferences. You can send match requests directly through the platform.',
    },
    {
      question: 'When are V/S matches available?',
      answer: 'V/S matches are available daily between 9 PM and 12 AM. This ensures peak player activity and faster matchmaking.',
    },
    {
      question: 'How do tournament registrations work?',
      answer: 'Browse available tournaments in the Tournaments section. Free tournaments are open to all, while paid tournaments may require entry fees. Registration closes before the tournament start time.',
    },
    {
      question: 'What are tokens and how do I earn them?',
      answer: 'Tokens are earned by winning matches and tournaments. They showcase your gaming achievements and can unlock exclusive features.',
    },
  ];

  return (
    <div className="min-h-screen py-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h1 className="font-orbitron font-bold text-4xl md:text-6xl mb-6 text-white">
            Get in Touch
          </h1>
          <p className="text-xl text-gray-400 font-rajdhani max-w-2xl mx-auto">
            Have questions or feedback? We'd love to hear from you. 
            Our team is here to help you dominate the arena.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="gaming-card neon-border"
          >
            <h2 className="font-orbitron font-bold text-2xl mb-6 text-white flex items-center">
              <MessageSquare className="w-6 h-6 mr-3 text-primary-400" />
              Send us a Message
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 gaming-input"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

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
                    placeholder="your@email.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Message
                </label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-4 py-3 gaming-input resize-none"
                  rows={6}
                  placeholder="Tell us about your question or feedback..."
                  required
                />
              </div>

              <Button
                type="submit"
                size="lg"
                loading={loading}
                className="w-full neon-glow"
              >
                <Send className="w-5 h-5 mr-2" />
                Send Message
              </Button>
            </form>
          </motion.div>

          {/* Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="gaming-card"
            >
              <h2 className="font-orbitron font-bold text-2xl mb-6 text-white">
                Contact Information
              </h2>
              
              <div className="space-y-6">
                {contactInfo.map((info, index) => {
                  const Icon = info.icon;
                  return (
                    <motion.div
                      key={info.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className="flex items-start space-x-4 p-4 bg-dark-100 rounded-lg hover:bg-dark-200 transition-colors duration-300"
                    >
                      <div className="flex items-center justify-center w-12 h-12 bg-primary-500/20 rounded-lg flex-shrink-0">
                        <Icon className="w-6 h-6 text-primary-400" />
                      </div>
                      <div>
                        <h3 className="font-orbitron font-semibold text-white mb-1">
                          {info.title}
                        </h3>
                        <p className="text-primary-400 font-medium mb-1">
                          {info.value}
                        </p>
                        <p className="text-gray-400 text-sm">
                          {info.description}
                        </p>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>

            {/* Response Time */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="gaming-card text-center"
            >
              <Clock className="w-12 h-12 text-primary-400 mx-auto mb-4" />
              <h3 className="font-orbitron font-semibold text-xl text-white mb-2">
                Quick Response Time
              </h3>
              <p className="text-gray-400 font-rajdhani">
                We typically respond to all inquiries within 2-4 hours during business hours, 
                and within 24 hours on weekends.
              </p>
            </motion.div>
          </div>
        </div>

        {/* FAQ Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20"
        >
          <h2 className="font-orbitron font-bold text-3xl md:text-4xl text-center mb-12 text-white">
            Frequently Asked Questions
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 * index }}
                viewport={{ once: true }}
                className="gaming-card hover:neon-border transition-all duration-300"
              >
                <h3 className="font-orbitron font-semibold text-lg text-white mb-3">
                  {faq.question}
                </h3>
                <p className="text-gray-400 font-rajdhani leading-relaxed">
                  {faq.answer}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Emergency Contact */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center gaming-card bg-gradient-to-r from-red-500/10 to-red-600/10 border-red-500/30"
        >
          <h3 className="font-orbitron font-bold text-xl text-white mb-2">
            Report Issues
          </h3>
          <p className="text-gray-400 font-rajdhani mb-4">
            For urgent matters like security issues or platform abuse, 
            please contact us immediately at:
          </p>
          <p className="text-red-400 font-orbitron font-semibold">
            urgent@gamearena.com
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;