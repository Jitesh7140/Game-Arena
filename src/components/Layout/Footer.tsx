 
import { Link } from 'react-router-dom';
import { GamepadIcon, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-dark-50 border-t border-dark-200 ">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-primary-500 to-purple-500 rounded-lg flex items-center justify-center">
                <GamepadIcon className="w-6 h-6 text-white" />
              </div>
              <span className="font-orbitron font-bold text-xl text-white">
                Game Arena
              </span>
            </div>
            <p className="text-gray-400 mb-6 max-w-md">
              The ultimate BGMI esports platform where players connect, compete, and conquer. 
              Find teammates, join tournaments, and climb the leaderboards.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 hover:bg-primary-500/30 transition-colors">
                <span className="font-bold">fb</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 hover:bg-primary-500/30 transition-colors">
                <span className="font-bold">tw</span>
              </a>
              <a href="#" className="w-10 h-10 bg-primary-500/20 rounded-lg flex items-center justify-center text-primary-400 hover:bg-primary-500/30 transition-colors">
                <span className="font-bold">ig</span>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-orbitron font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/players" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Find Players
                </Link>
              </li>
              <li>
                <Link to="/tournaments" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Tournaments
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="font-orbitron font-semibold text-white mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center space-x-3 text-gray-400">
                <Mail className="w-4 h-4" />
                <span>support@gamearena.com</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </li>
              <li className="flex items-center space-x-3 text-gray-400">
                <MapPin className="w-4 h-4" />
                <span>Gaming District, Esports City</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-dark-200 mt-8 pt-8 text-center">
          <p className="text-gray-400">
            © 2024 Game Arena. All rights reserved. Built for BGMI esports enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;