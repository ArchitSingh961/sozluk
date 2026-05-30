'use client';

import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

export default function ScrollReveal({ 
  children, 
  delay = 0, 
  direction = 'up', 
  animation = 'fade', // 'fade', 'slide', 'scale', 'blur'
  duration = 0.8,
  className = '' 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  const getVariants = () => {
    const ease = [0.16, 1, 0.3, 1]; // Premium smooth ease
    
    switch (animation) {
      case 'scale':
        return {
          hidden: { opacity: 0, scale: 0.9, y: 20 },
          visible: { 
            opacity: 1, 
            scale: 1, 
            y: 0,
            transition: { duration: 1.2, ease, delay } 
          }
        };
      case 'blur':
        return {
          hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
          visible: { 
            opacity: 1, 
            filter: 'blur(0px)', 
            y: 0,
            transition: { duration: 1.2, ease, delay } 
          }
        };
      case 'slide':
      case 'fade':
      default:
        return {
          hidden: {
            opacity: 0,
            y: direction === 'up' ? 40 : direction === 'down' ? -40 : 0,
            x: direction === 'left' ? 40 : direction === 'right' ? -40 : 0,
          },
          visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration, ease, delay },
          },
        };
    }
  };

  return (
    <motion.div
      ref={ref}
      variants={getVariants()}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      className={className}
    >
      {children}
    </motion.div>
  );
}

// Special component for masking text reveals (like headers)
export function TextReveal({ children, delay = 0 }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });
  
  return (
    <div ref={ref} style={{ overflow: 'hidden', display: 'inline-block', maxWidth: '100%', verticalAlign: 'top' }}>
      <motion.div
        initial={{ y: '100%', opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: '100%', opacity: 0 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1], delay }}
      >
        {children}
      </motion.div>
    </div>
  );
}
