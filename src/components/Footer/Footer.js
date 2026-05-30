'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import styles from './Footer.module.css';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    fetch('/api/categories')
      .then(res => res.json())
      .then(data => {
        const topLevel = (data.categories || []).filter(cat => !cat.parent);
        setCategories(topLevel);
      })
      .catch(() => {});
  }, []);

  return (
    <footer className={styles.footer}>
      <div className="container">
        
        {/* Map Section */}
        <div className={styles.mapSection}>
          <h3 className={styles.mapTitle}>Find Us</h3>
          <div className={styles.mapContainer}>
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1754.5266256700356!2d77.41401848869532!3d28.41765000295571!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390cc2fc88856825%3A0xcef00dbd48052e43!2sDungarpur%2C%20Haryana%20121101!5e0!3m2!1sen!2sin!4v1780134187471!5m2!1sen!2sin" 
              width="100%" 
              height="300" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          </div>
          
          <h3 className={styles.socialTitle}>Follow Us</h3>
          <div className={styles.socialIcons}>
            <a href="#" className={styles.socialIcon} style={{ background: '#1877F2' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
            </a>
            <a href="#" className={styles.socialIcon} style={{ background: 'linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
            </a>
          </div>
        </div>

        <div className={styles.grid}>
          <div className={styles.colBrand}>
            <Link href="/" className={styles.logo}>
              SÖZLÜK
            </Link>
            <p className={styles.tagline}>
              Premium Aluminium Window & Door Systems. Precision engineered for modern architecture.
            </p>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Products</h4>
            <ul className={styles.list}>
              {categories.map(cat => (
                <li key={cat._id}>
                  <Link href={`/products?series=${cat.slug}`}>{cat.name}</Link>
                </li>
              ))}
              <li><Link href="/products">All Products</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Resources</h4>
            <ul className={styles.list}>
              <li><Link href="/#downloads">Downloads</Link></li>
              <li><Link href="/#gallery">Project Gallery</Link></li>
              <li><Link href="/#about">About Us</Link></li>
            </ul>
          </div>

          <div className={styles.col}>
            <h4 className={styles.colTitle}>Contact</h4>
            <ul className={styles.list}>
              <li>sozlukindia@gmail.com</li>
              <li>+91 8178405023</li>
              <li>Khewat no. 14, Rect No. 22, Killa No., 18/1/1(1-13), 1(1-13), Dungarpur Du (157)Tigaon Faridabad, Faridabad, Haryana, 121101</li>
            </ul>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>© {currentYear} Sözlük Aluminium Systems. All rights reserved.</p>
          <div className={styles.bottomLinks}>
            <Link href="#">Privacy Policy</Link>
            <Link href="#">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
