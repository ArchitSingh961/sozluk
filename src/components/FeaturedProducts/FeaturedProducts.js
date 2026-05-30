'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ScrollReveal from '../ScrollReveal';
import styles from './FeaturedProducts.module.css';

export default function FeaturedProducts({ products = [] }) {
  const [fetchedProducts, setFetchedProducts] = useState([]);
  const [loading, setLoading] = useState(!products.length);

  useEffect(() => {
    if (products.length === 0) {
      fetch('/api/products?featured=true')
        .then(res => res.json())
        .then(data => {
          setFetchedProducts(data.products || []);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [products]);

  const displayProducts = products.length > 0 ? products : fetchedProducts;

  if (loading) return <div className="container" style={{ padding: '40px 0', textAlign: 'center' }}>Loading featured products...</div>;
  if (displayProducts.length === 0) return null;

  return (
    <section className="section bg-white" id="featured">
      <div className="container">
        <ScrollReveal>
          <div className={styles.header}>
            <p className="section-label">FEATURED PROFILES</p>
            <h2 className="section-title">Selected Products</h2>
            <Link href="/products" className={styles.viewAll}>
              View All Products →
            </Link>
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {displayProducts.map((product, index) => (
            <ScrollReveal key={product._id} delay={index * 0.1}>
              <div className={styles.card}>
                <Link href={`/products/${product._id}`}>
                  <div className={styles.imagePlaceholder}>
                    {product.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={product.image} alt={product.name} />
                    ) : (
                      <span>Profile Detail</span>
                    )}
                  </div>
                  <div className={styles.content}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span className={styles.code}>{product.code}</span>
                      {product.category && (
                        <span className={styles.cardCategory}>{product.category.name}</span>
                      )}
                    </div>
                    <h3 className={styles.name}>{product.name}</h3>
                    <div className={styles.specs}>
                      {product.weight && <span>{product.weight}</span>}
                      {product.dimensions && <span>{product.dimensions}</span>}
                    </div>
                  </div>
                </Link>
                <div className={styles.footer}>
                  <button className={styles.downloadBtn}>↓ Download PDF</button>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
