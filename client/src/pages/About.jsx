import React from 'react';
import { motion } from 'framer-motion';
import { FiUsers, FiAward, FiHeart, FiClock, FiStar, FiUser, FiTrendingUp } from 'react-icons/fi';

const About = () => {
  const stats = [
    { number: '10+', label: 'Years of Excellence', icon: FiAward },
    { number: '50+', label: 'Expert Chefs', icon: FiUsers },
    { number: '1000+', label: 'Happy Customers', icon: FiHeart },
    { number: '200+', label: 'Dishes', icon: FiStar },
  ];

  const values = [
    {
      title: 'Quality First',
      description: 'We use only the freshest, highest-quality ingredients sourced from local farms.',
      icon: FiHeart,
      color: 'bg-red-100 text-red-600'
    },
    {
      title: 'Exceptional Service',
      description: 'Our staff is trained to provide the best dining experience possible.',
      icon: FiUsers,
      color: 'bg-blue-100 text-blue-600'
    },
    {
      title: 'Innovation',
      description: 'We constantly innovate our menu to bring you exciting new flavors.',
      icon: FiStar,
      color: 'bg-yellow-100 text-yellow-600'
    },
    {
      title: 'Sustainability',
      description: 'Committed to eco-friendly practices and sustainable sourcing.',
      icon: FiTrendingUp,
      color: 'bg-green-100 text-green-600'
    }
  ];

  const team = [
    {
      name: 'Chef Michael Rodriguez',
      role: 'Executive Chef',
      image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=400',
      bio: '20+ years of culinary experience, Michelin-starred background'
    },
    {
      name: 'Chef Sarah Chen',
      role: 'Pastry Chef',
      image: 'https://images.unsplash.com/photo-1581299894007-aaa50297cf16?w=400',
      bio: 'Award-winning pastry artist specializing in French desserts'
    },
    {
      name: 'Chef David Kumar',
      role: 'Sous Chef',
      image: 'https://images.unsplash.com/photo-1583394293214-28ded15ee548?w=400',
      bio: 'Expert in Asian fusion and modern cuisine'
    },
    {
      name: 'Chef Maria Garcia',
      role: 'Health & Wellness Chef',
      image: 'https://images.unsplash.com/photo-1556910104-4a0272fae7a8?w=400',
      bio: 'Specializes in vegetarian, vegan, and gluten-free options'
    }
  ];

  return (
    <div>
      {/* Hero Section */}
      <div className="relative h-[400px] bg-cover bg-center" style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200)'
      }}>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative container mx-auto px-4 h-full flex items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-white max-w-2xl"
          >
            <h1 className="text-5xl font-bold mb-4">Our Story</h1>
            <p className="text-xl">A passion for exceptional dining since 2014</p>
          </motion.div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Our Story Section */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="max-w-3xl mx-auto text-center mb-16"
        >
          <h2 className="text-3xl font-bold mb-6">Welcome to Hotel Restaurant</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            Founded in 2014, Hotel Restaurant has been a cornerstone of culinary excellence 
            in the heart of the city. What started as a small family-owned establishment 
            has grown into a beloved dining destination known for its innovative cuisine 
            and warm hospitality.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Our philosophy is simple: use the finest ingredients, prepare them with skill 
            and passion, and serve them in an atmosphere that makes every guest feel special. 
            We believe that dining is not just about food—it's about creating memories.
          </p>
        </motion.div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center p-6 bg-white rounded-xl shadow-lg"
            >
              <stat.icon className="h-8 w-8 text-primary-500 mx-auto mb-3" />
              <div className="text-3xl font-bold text-gray-800">{stat.number}</div>
              <div className="text-gray-500 text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>

        {/* Our Values */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <div className={`${value.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4`}>
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                <p className="text-gray-600 text-sm">{value.description}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Meet the Team */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Executive Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
              >
                <img 
                  src={member.image} 
                  alt={member.name}
                  className="w-full h-64 object-cover"
                  onError={(e) => {
                    e.target.src = 'https://via.placeholder.com/400x400?text=Chef';
                  }}
                />
                <div className="p-4 text-center">
                  <h3 className="font-semibold text-lg">{member.name}</h3>
                  <p className="text-primary-600 text-sm mb-2">{member.role}</p>
                  <p className="text-gray-500 text-xs">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Testimonials */}
        <div className="bg-gray-50 rounded-2xl p-8 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">What Our Guests Say</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: 'John D.', text: 'Absolutely incredible dining experience! The service was impeccable and the food was divine.', rating: 5 },
              { name: 'Sarah M.', text: 'Best restaurant in town! The ambiance, the food, everything was perfect.', rating: 5 },
              { name: 'Michael R.', text: 'The attention to detail is remarkable. Will definitely come back!', rating: 5 }
            ].map((testimonial, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <div className="flex text-yellow-400 mb-3">
                  {'★'.repeat(testimonial.rating)}
                </div>
                <p className="text-gray-600 italic">"{testimonial.text}"</p>
                <p className="font-semibold mt-3">- {testimonial.name}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default About;