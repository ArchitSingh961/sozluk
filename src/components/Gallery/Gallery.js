'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from '../ScrollReveal';
import styles from './Gallery.module.css';

export default function Gallery() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/gallery')
      .then(res => res.json())
      .then(data => {
        setItems(data.items || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (items.length === 0) return null;

  return (
    <section className="section bg-light" id="gallery">
      <div className="container">
        <ScrollReveal>
          <div className={styles.header}>
            <p className="section-label">GALLERY</p>
            <h2 className="section-title">Our Projects</h2>
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {items.map((item, index) => (
            <ScrollReveal key={item._id} delay={index * 0.1} animation="scale">
              <div className={styles.imageWrapper}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={item.image} alt={item.title || `Project ${index + 1}`} loading="lazy" />
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
