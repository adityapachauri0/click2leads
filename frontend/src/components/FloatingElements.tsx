import React from 'react';
import { motion } from 'framer-motion';

const FloatingElements: React.FC = () => {
  const elements = [
    { size: 300, duration: 20, delay: 0, x: '10%', y: '20%' },
    { size: 200, duration: 25, delay: 5, x: '80%', y: '60%' },
    { size: 400, duration: 30, delay: 10, x: '50%', y: '80%' },
    { size: 150, duration: 15, delay: 2, x: '30%', y: '50%' },
    { size: 250, duration: 22, delay: 8, x: '70%', y: '30%' },
  ];

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {elements.map((element, index) => (
        <motion.div
          key={index}
          className="absolute rounded-full bg-gradient-to-br from-primary-500/10 to-accent-500/10 blur-3xl"
          style={{
            width: element.size,
            height: element.size,
            left: element.x,
            top: element.y,
          }}
          animate={{
            x: [0, 30, -30, 0],
            y: [0, -30, 30, 0],
            scale: [1, 1.1, 0.9, 1],
          }}
          transition={{
            duration: element.duration,
            delay: element.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
      
      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
    </div>
  );
};

export default FloatingElements;