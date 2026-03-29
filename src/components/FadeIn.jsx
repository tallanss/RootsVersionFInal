import React from 'react';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0, duration = 0.6, direction = 'up', className = '', style = {} }) => {
  const yOffset = direction === 'down' ? -30 : direction === 'up' ? 30 : 0;
  const xOffset = direction === 'right' ? -30 : direction === 'left' ? 30 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: yOffset, x: xOffset }}
      whileInView={{ opacity: 1, y: 0, x: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration, delay }}
      className={className}
      style={style}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
