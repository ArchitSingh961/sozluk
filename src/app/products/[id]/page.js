'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './detail.module.css';
import Link from 'next/link';

export default function ProductDetailPage() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inquiry, setInquiry] = useState({
    name: '', email: '', phone: '', company: '', message: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (id) {
      fetch(`/api/products/${id}`)
        .then(res => res.json())
        .then(data => {
          setProduct(data.product);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  }, [id]);

  const handleInquiry = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...inquiry, product: id }),
      });
      setSubmitted(true);
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={styles.loading}>Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Navbar />
        <div className={styles.page}>
          <div className={styles.loading}>Product not found.</div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className="container">
          <motion.div
            className={styles.breadcrumb}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <Link href="/products">Products</Link>
            <span>/</span>
            <span>{product.name}</span>
          </motion.div>

          <div className={styles.layout}>
            <motion.div
              className={styles.imageSection}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={styles.mainImage}>
                {product.technicalDrawing || product.image ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.technicalDrawing || product.image}
                    alt={product.name}
                  />
                ) : (
                  <div className={styles.placeholder}>
                    <span>Technical Drawing</span>
                  </div>
                )}
              </div>
            </motion.div>

            <motion.div
              className={styles.infoSection}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <span className={styles.seriesBadge}>
                {product.series === '31mm-sliding' ? '31 MM Sliding Series' : '41 MM Casement Series'}
              </span>
              <h1 className={styles.productName}>{product.name}</h1>

              <div className={styles.specs}>
                <div className={styles.specRow}>
                  <span className={styles.specLabel}>Product Code</span>
                  <span className={styles.specValue}>{product.code}</span>
                </div>
                {product.weight && (
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Weight</span>
                    <span className={styles.specValue}>{product.weight}</span>
                  </div>
                )}
                {product.dimensions && (
                  <div className={styles.specRow}>
                    <span className={styles.specLabel}>Dimensions</span>
                    <span className={styles.specValue}>{product.dimensions}</span>
                  </div>
                )}
              </div>

              {product.description && (
                <p className={styles.description}>{product.description}</p>
              )}

              <div className={styles.actions}>
                {product.pdfUrl && (
                  <a href={product.pdfUrl} className="btn btn-primary" download>
                    ↓ Download PDF
                  </a>
                )}
                <a href="#inquiry" className="btn btn-outline-dark">
                  Request Quote
                </a>
              </div>
            </motion.div>
          </div>

          <motion.div
            id="inquiry"
            className={styles.inquirySection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <h2 className={styles.inquiryTitle}>Request Information</h2>
            <p className={styles.inquirySubtitle}>
              Fill out the form below and we&apos;ll get back to you shortly.
            </p>

            {submitted ? (
              <div className={styles.successMsg}>
                Thank you for your inquiry. We&apos;ll be in touch soon.
              </div>
            ) : (
              <form className={styles.form} onSubmit={handleInquiry}>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label>Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiry.name}
                      onChange={(e) => setInquiry({ ...inquiry, name: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email *</label>
                    <input
                      type="email"
                      required
                      value={inquiry.email}
                      onChange={(e) => setInquiry({ ...inquiry, email: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input
                      type="tel"
                      value={inquiry.phone}
                      onChange={(e) => setInquiry({ ...inquiry, phone: e.target.value })}
                    />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Company</label>
                    <input
                      type="text"
                      value={inquiry.company}
                      onChange={(e) => setInquiry({ ...inquiry, company: e.target.value })}
                    />
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label>Message *</label>
                  <textarea
                    required
                    rows={4}
                    value={inquiry.message}
                    onChange={(e) => setInquiry({ ...inquiry, message: e.target.value })}
                  />
                </div>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? 'Sending...' : 'Submit Inquiry'}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
      <Footer />
    </>
  );
}
