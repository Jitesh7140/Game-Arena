import { motion, useScroll, useTransform } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Users, Sword, Trophy, Zap } from 'lucide-react';
import Button from '../components/UI/Button';

const Home = () => {
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '50%']);

  const features = [
    {
      icon: Users,
      title: 'Find Players',
      description: 'Connect with skilled BGMI players in your region. Filter by level, availability, and play style to find your perfect teammate.',
      image: 'https://images.pexels.com/photos/442576/pexels-photo-442576.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'Browse Players',
      link: '/players',
    },
    {
      icon: Sword,
      title: 'V/S Matches',
      description: 'Quick competitive matches between 9 PM - 12 AM. Get instantly matched with players of similar skill levels for intense 1v1, 2v2, or 4v4 battles.',
      image: 'https://images.pexels.com/photos/7915669/pexels-photo-7915669.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'Find Match',
      link: '/vs-match',
    },
    {
      icon: Trophy,
      title: 'Tournaments',
      description: 'Join exciting tournaments with cash prizes and exclusive rewards. Compete against the best players and climb the leaderboards.',
      image: 'https://images.pexels.com/photos/163064/play-stone-network-networked-interactive-163064.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'View Tournaments',
      link: '/tournaments',
    },
    {
      icon: Zap,
      title: 'Real-time Matching',
      description: 'Advanced matchmaking system that pairs you with compatible teammates based on your gaming preferences and performance.',
      image: 'https://images.pexels.com/photos/3165335/pexels-photo-3165335.jpeg?auto=compress&cs=tinysrgb&w=600',
      buttonText: 'Start Playing',
      link: '/players',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex mt-[8rem] sm:mt-[9rem] justify-center text-center px-4">
        <motion.div
          style={{ y }}
          className="max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="mb-8"
          >
            <h1 className="font-orbitron font-black text-4xl md:text-7xl lg:text-8xl mb-6 bg-gradient-to-r from-primary-400 via-purple-400 to-primary-400 bg-clip-text text-transparent">
              GAME ARENA
            </h1>
            <p className="text-base md:text-2xl text-gray-300 mb-8 font-rajdhani leading-relaxed">
              The ultimate BGMI esports platform where players find teammates, 
              get free room IDs, and dominate TDM matches
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button
              size="lg"
              onClick={() => navigate('/players')}
              className="  sm:w-auto min-w-[200px] neon-glow"
            >
              <Users className="w-5 h-5 mr-2" />
              Find Players
            </Button>
            <Button
              size="lg"
              variant="secondary"
              onClick={() => navigate('/vs-match')}
              className=" sm:w-auto min-w-[200px] neon-border"
            >
              <Sword className="w-5 h-5 mr-2" />
              V/S Match
            </Button>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-16 left-1/2 transform -translate-x-1/2"
        >
          <div className="w-6 h-10 border-2 border-primary-400 rounded-full flex justify-center">
            <motion.div
              animate={{ y: [0, 12, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-1 h-3 bg-primary-400 rounded-full mt-2"
            />
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-white">
              Why Choose Game Arena?
            </h2>
            <p className="text-xl text-gray-400 max-w-3xl mx-auto font-rajdhani">
              Experience the next level of BGMI esports with our cutting-edge platform
            </p>
          </motion.div>

          <div className="space-y-20">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              const isEven = index % 2 === 0;

              return (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  viewport={{ once: true }}
                  className={`flex flex-col ${
                    isEven ? 'lg:flex-row' : 'lg:flex-row-reverse'
                  } items-center gap-8 lg:gap-16`}
                >
                  <div className="flex-1">
                    <div className="relative rounded-2xl overflow-hidden group">
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-full h-64 lg:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-500/20 to-purple-500/20 group-hover:from-primary-500/30 group-hover:to-purple-500/30 transition-all duration-500" />
                      <div className="absolute inset-0 border border-primary-500/30 rounded-2xl" />
                    </div>
                  </div>

                  <div className="flex-1 text-center lg:text-left">
                    <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-primary-500 to-purple-500 rounded-2xl mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    
                    <h3 className="font-orbitron font-bold text-2xl lg:text-3xl mb-4 text-white">
                      {feature.title}
                    </h3>
                    
                    <p className="text-gray-400 text-lg mb-8 font-rajdhani leading-relaxed">
                      {feature.description}
                    </p>
                    
                    <Button
                      onClick={() => navigate(feature.link)}
                      className="inline-flex items-center"
                    >
                      {feature.buttonText}
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="ml-2"
                      >
                        →
                      </motion.div>
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-dark-50  ">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            <h2 className="font-orbitron font-bold text-3xl md:text-4xl mb-6 text-white">
              Ready to Dominate the Arena?
            </h2>
            <p className="text-xl text-gray-400 mb-8 font-rajdhani">
              Join thousands of BGMI players and start your esports journey today
            </p>
            <Button
              size="lg"
              onClick={() => navigate('/signup')}
              className="neon-glow"
            >
              Start Your Journey
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Home;