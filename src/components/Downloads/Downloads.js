'use client';

import { useState, useEffect } from 'react';
import ScrollReveal from '../ScrollReveal';
import styles from './Downloads.module.css';

export default function Downloads() {
  const [downloads, setDownloads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/downloads')
      .then(res => res.json())
      .then(data => {
        setDownloads(data.downloads || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return null;
  if (downloads.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'catalogue': return '📄';
      case 'technical': return '📐';
      case 'cad': return '🏗️';
      default: return '📄';
    }
  };

  return (
    <section className="section bg-white" id="downloads">
      <div className="container">
        <ScrollReveal>
          <div className={styles.header}>
            <p className="section-label">RESOURCES</p>
            <h2 className="section-title">Downloads & Documents</h2>
          </div>
        </ScrollReveal>

        <div className={styles.grid}>
          {downloads.map((resource, index) => (
            <ScrollReveal key={resource._id} delay={index * 0.1}>
              <div className={styles.card}>
                <div className={styles.iconWrapper}>
                  <span className={styles.icon}>{resource.icon || getIcon(resource.type)}</span>
                </div>
                <div className={styles.content}>
                  <h3 className={styles.cardTitle}>{resource.title}</h3>
                  <p className={styles.cardDesc}>{resource.description}</p>
                  <div className={styles.footer}>
                    <span className={styles.fileSize}>{resource.fileSize || ''}</span>
                    <a href={resource.fileUrl} target="_blank" rel="noopener noreferrer" className="btn btn-outline-dark">Download</a>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
