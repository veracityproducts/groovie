'use client';

import { useState } from 'react';
import { motion } from 'motion/react';

const AltButton = () => {
  const [isPressed, setIsPressed] = useState(false);

  return (
    <motion.button
      className='group relative rounded-lg border-2 border-primary-500 bg-primary-500 px-4 py-2 text-sm font-semibold text-white hover:shadow-lg'
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      animate={
        isPressed
          ? {
              y: 2,
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.2)',
            }
          : {
              y: 0,
              boxShadow: '0 8px 16px rgba(0, 0, 0, 0.1)',
            }
      }
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 20,
      }}
    >
      <motion.span
        className='absolute top-0 left-0 size-full rounded-md border-2 border-dashed border-primary-100 shadow-inner shadow-white/30 group-active:shadow-white/10'
        animate={
          isPressed
            ? { opacity: 0.8, scale: 0.98 }
            : { opacity: 1, scale: 1 }
        }
        transition={{
          type: 'spring',
          stiffness: 300,
          damping: 20,
        }}
      />
      <span className='absolute top-0 left-0 size-full rotate-180 rounded-md border-primary-50 shadow-inner shadow-black/30 group-active:shadow-black/10' />
      Stitches Button
    </motion.button>
  );
};

export default AltButton;
