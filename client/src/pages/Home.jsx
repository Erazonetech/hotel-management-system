import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useAnimation, useInView,AnimatePresence} from 'framer-motion'
import { 
  FiChevronRight, FiStar, FiClock, FiAward, FiTruck, 
  FiHeart, FiUsers, FiCoffee, FiTrendingUp, FiPlay,
  FiPause, FiArrowRight, FiCheckCircle
} from 'react-icons/fi';
import { useRef } from 'react';

const Home = () => {
  const [activeTestimonial, setActiveTestimonial] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  
  const featuresRef = useRef(null);
  const isFeaturesInView = useInView(featuresRef, { once: true, amount: 0.2 });

  // Auto-rotate testimonials
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  const features = [
    { 
      icon: <FiStar className="h-8 w-8" />, 
      title: 'Premium Quality', 
      description: 'We use only the freshest, locally-sourced ingredients prepared with passion.',
      color: 'from-yellow-500 to-orange-500',
      stats: '100% Fresh',
      delay: 0
    },
    { 
      icon: <FiAward className="h-8 w-8" />, 
      title: 'Award Winning', 
      description: 'Recognized for excellence in culinary innovation and exceptional service.',
      color: 'from-purple-500 to-pink-500',
      stats: '50+ Awards',
      delay: 0.1
    },
    { 
      icon: <FiUsers className="h-8 w-8" />, 
      title: 'Expert Chefs', 
      description: 'Our Michelin-starred chefs bring decades of experience to your table.',
      color: 'from-blue-500 to-cyan-500',
      stats: '20+ Chefs',
      delay: 0.2
    },
    { 
      icon: <FiTruck className="h-8 w-8" />, 
      title: 'Fast Delivery', 
      description: 'Quick and reliable delivery service to your doorstep within 30 minutes.',
      color: 'from-green-500 to-emerald-500',
      stats: '30 min avg',
      delay: 0.3
    },
    { 
      icon: <FiCoffee className="h-8 w-8" />, 
      title: 'Cozy Ambiance', 
      description: 'Enjoy dining in our beautifully designed, warm and inviting atmosphere.',
      color: 'from-amber-500 to-orange-500',
      stats: '200+ Seats',
      delay: 0.4
    },
    { 
      icon: <FiHeart className="h-8 w-8" />, 
      title: 'Excellent Service', 
      description: 'Our dedicated staff ensures every visit is a memorable experience.',
      color: 'from-red-500 to-pink-500',
      stats: '24/7 Support',
      delay: 0.5
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Food Critic',
      text: 'Absolutely divine! The attention to detail and flavors are unparalleled. A true culinary masterpiece.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150'
    },
    {
      name: 'Michael Chen',
      role: 'Regular Customer',
      text: 'Best dining experience in the city. The service is impeccable and the food is consistently amazing.',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150'
    },
    {
      name: 'Emma Williams',
      role: 'Food Blogger',
      text: 'Every dish tells a story. The creativity and presentation are outstanding. Highly recommended!',
      rating: 5,
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150'
    }
  ];

  const stats = [
    { number: '10+', label: 'Years of Excellence', icon: FiAward },
    { number: '50+', label: 'Expert Chefs', icon: FiUsers },
    { number: '1000+', label: 'Happy Customers', icon: FiStar },
    { number: '200+', label: 'Delicious Dishes', icon: FiCoffee }
  ];

  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-screen min-h-[600px] bg-cover bg-center bg-fixed" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3)'
      }}>
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-black/50" />
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white max-w-3xl"
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <FiStar className="h-4 w-4 text-yellow-400" />
              <span className="text-sm">Est. 2014 • Award Winning Restaurant</span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-5xl md:text-7xl font-bold mb-6 leading-tight"
            >
              Welcome to 
              <span className="text-primary-400 block">Hotel Restaurant</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl mb-8 text-gray-200 max-w-2xl"
            >
              Experience the finest dining with our exquisite menu crafted by world-class chefs. 
              Every dish tells a story of passion and perfection.
            </motion.p>
            
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/menu" className="btn-primary inline-flex items-center gap-2 text-lg px-8 py-3">
                Explore Menu
                <FiArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/reservations" className="border-2 border-white text-white px-8 py-3 rounded-lg hover:bg-white hover:text-primary-600 transition-all duration-300 text-lg font-semibold">
                Book a Table
              </Link>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <div className="animate-bounce">
            <div className="w-6 h-10 border-2 border-white rounded-full flex justify-center">
              <div className="w-1 h-2 bg-white rounded-full mt-2 animate-pulse"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="text-4xl font-bold text-primary-600 mb-2">{stat.number}</div>
                <div className="flex items-center justify-center gap-2 text-gray-600">
                  <stat.icon className="h-4 w-4" />
                  <span>{stat.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section - Enhanced */}
      <section ref={featuresRef} className="py-20 bg-gradient-to-br from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary-600 to-primary-800 bg-clip-text text-transparent">
              Why Choose Us?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-lg">
              Discover what makes Hotel Restaurant the premier dining destination
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                animate={isFeaturesInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: feature.delay, duration: 0.5 }}
                whileHover={{ y: -10, scale: 1.02 }}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`} />
                
                <div className="p-8">
                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${feature.color} text-white flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  
                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-800 mb-3">{feature.title}</h3>
                  
                  {/* Description */}
                  <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                  
                  {/* Stats Badge */}
                  <div className="inline-flex items-center gap-2 text-sm font-semibold text-primary-600">
                    <FiTrendingUp className="h-4 w-4" />
                    <span>{feature.stats}</span>
                  </div>
                </div>
                
                {/* Bottom Border Animation */}
                <div className={`h-1 bg-gradient-to-r ${feature.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left`} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-primary-900 to-primary-700 text-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">What Our Guests Say</h2>
            <p className="text-primary-100">Don't just take our word for it</p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTestimonial}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.5 }}
                className="bg-white/10 backdrop-blur-sm rounded-2xl p-8"
              >
                <div className="flex flex-col md:flex-row items-center gap-6">
                  <img
                    src={testimonials[activeTestimonial].image}
                    alt={testimonials[activeTestimonial].name}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white"
                  />
                  <div className="flex-1 text-center md:text-left">
                    <div className="flex justify-center md:justify-start text-yellow-400 mb-3">
                      {'★'.repeat(testimonials[activeTestimonial].rating)}
                    </div>
                    <p className="text-lg italic mb-4">"{testimonials[activeTestimonial].text}"</p>
                    <h4 className="font-semibold text-lg">{testimonials[activeTestimonial].name}</h4>
                    <p className="text-primary-200 text-sm">{testimonials[activeTestimonial].role}</p>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Controls */}
            <div className="flex justify-center items-center gap-4 mt-8">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors"
              >
                {isPlaying ? <FiPause className="h-5 w-5" /> : <FiPlay className="h-5 w-5" />}
              </button>
              <div className="flex gap-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setActiveTestimonial(index);
                      setIsPlaying(false);
                    }}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeTestimonial === index ? 'w-8 bg-white' : 'w-2 bg-white/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl p-12 text-center text-white">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready for an Unforgettable Experience?</h2>
              <p className="text-primary-100 mb-8 max-w-2xl mx-auto">
                Join us today and indulge in a culinary journey like no other. Book your table now!
              </p>
              <div className="flex flex-wrap gap-4 justify-center">
                <Link to="/reservations" className="bg-white text-primary-600 px-8 py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2">
                  Book a Table
                  <FiArrowRight className="h-5 w-5" />
                </Link>
                <Link to="/menu" className="border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-primary-600 transition-all">
                  View Menu
                </Link>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;