'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '../ScrollReveal';
import styles from './ProductSeries.module.css';

export default function ProductSeries() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        // Only show top-level categories (no parent)
        const topLevel = (data.categories || []).filter(cat => !cat.parent);
        setCategories(topLevel);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (categories.length === 0) return null;

  return (
    <section className="section bg-light" id="series">
      <div className="container">
        <ScrollReveal>
          <div className={styles.header}>
            <p className="section-label">OUR SYSTEMS</p>
            <h2 className="section-title">Aluminium Profile Series</h2>
          </div>
        </ScrollReveal>

        <div className={styles.sliderContainer}>
          <div className={styles.sliderTrack}>
            {[...categories, ...categories].map((category, index) => (
              <div key={`${category._id}-${index}`} className={styles.sliderItem}>
                <div className={styles.card}>
                  <div className={styles.imageWrapper}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img 
                      src={category.image || (category.name.toLowerCase().includes('sliding') ? '/images/sliding-series.png' : '/images/casement-series.png')} 
                      alt={category.name} 
                    />
                  </div>
                  <div className={styles.content}>
                    <h3 className={styles.cardTitle}>{category.name}</h3>
                    {category.description && (
                      <p className={styles.cardDesc}>{category.description}</p>
                    )}
                    <Link href={`/products?category=${category.slug}`} className={styles.link}>
                      Explore Series <span>→</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
