'use client';

import ScrollReveal from '../ScrollReveal';
import styles from './About.module.css';

export default function About() {
  const pillars = [
    {
      icon: '⚙️',
      title: 'Precision Engineering',
      desc: 'Extruded to exact tolerances for perfect fit and finish.'
    },
    {
      icon: '🏆',
      title: 'Premium Quality',
      desc: 'Highest grade aluminium alloys for durability and strength.'
    },
    {
      icon: '✨',
      title: 'Modern Design',
      desc: 'Sleek, minimal profiles that complement contemporary architecture.'
    },
    {
      icon: '🏢',
      title: 'Architectural Systems',
      desc: 'Comprehensive solutions for commercial and residential builds.'
    }
  ];

  return (
    <section className={`section ${styles.aboutSection}`} id="about">
      <div className="container">
        <div className={styles.content}>
          <ScrollReveal>
            <div className={styles.header}>
              <p className="section-label">ABOUT SÖZLÜK</p>
              <h2 className={styles.title}>Engineering Excellence in Aluminium</h2>
              <p className={styles.description}>
                Sözlük manufactures premium architectural aluminium systems. We combine precision engineering with modern design aesthetics to deliver high-performance sliding, casement, and structural profiles for the world&apos;s most demanding architectural projects.
              </p>
            </div>
          </ScrollReveal>

          <div className={styles.grid}>
            {pillars.map((pillar, index) => (
              <ScrollReveal key={index} delay={index * 0.15} animation="scale" className={styles.cardWrapper}>
                <div className={styles.card}>
                  <div className={styles.icon}>{pillar.icon}</div>
                  <h3 className={styles.cardTitle}>{pillar.title}</h3>
                  <p className={styles.cardDesc}>{pillar.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
