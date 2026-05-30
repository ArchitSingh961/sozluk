'use client';

import Link from 'next/link';
import ScrollReveal from '../ScrollReveal';
import styles from './CTA.module.css';

export default function CTA() {
  return (
    <section className={`section ${styles.cta}`} id="contact">
      <div className="container">
        <ScrollReveal>
          <div className={styles.content}>
            <h2 className={styles.title}>Build Better With Sözlük</h2>
            <p className={styles.subtitle}>
              Premium aluminium profile systems for modern architecture. Partner with us for your next visionary project.
            </p>
            <div className={styles.actions}>
              <Link href="/products" className="btn btn-primary">
                Explore Systems
              </Link>
              <button 
                onClick={() => window.dispatchEvent(new CustomEvent('openContactModal'))}
                className="btn btn-outline"
              >
                Contact Us
              </button>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
