'use client';

import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import Link from 'next/link';
import { TextReveal } from '../ScrollReveal';
import styles from './Hero.module.css';

export default function Hero() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  // Parallax effects
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const fadeUpVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] }
    },
  };

  return (
    <section className={styles.hero} ref={ref}>
      <motion.div className={styles.bgWrapper} style={{ y, opacity }}>
        <div className={styles.bgImage}></div>
        <div className={styles.overlay}></div>
      </motion.div>
      
      <div className={`container ${styles.content}`}>
        <div className={styles.textContent}>
          <div className={styles.brandWrapper}>
            <TextReveal delay={0.2}>
              <span className={styles.brand}>SÖZLÜK</span>
            </TextReveal>
          </div>
          
          <h1 className={styles.title}>
            <TextReveal delay={0.4}>Premium Aluminium</TextReveal>
            <br />
            <TextReveal delay={0.5}>Window & Door Systems</TextReveal>
          </h1>
          
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.p variants={fadeUpVariants} className={styles.subtitle}>
              Sliding Systems • Casement Systems • Architectural Aluminium Profiles
            </motion.p>
            
            <motion.div variants={fadeUpVariants} className={styles.actions}>
              <Link href="/products" className="btn btn-primary">
                Explore Products
              </Link>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                className="btn btn-outline"
              >
                Contact Us
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      <div className={styles.scrollIndicator}>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </motion.div>
      </div>
    </section>
  );
}
