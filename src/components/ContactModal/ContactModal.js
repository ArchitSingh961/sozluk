'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import styles from './ContactModal.module.css';

export default function ContactModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [status, setStatus] = useState(''); // 'submitting', 'success', 'error'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    message: ''
  });

  useEffect(() => {
    const handleOpen = () => setIsOpen(true);
    window.addEventListener('openContactModal', handleOpen);
    return () => window.removeEventListener('openContactModal', handleOpen);
  }, []);

  // Prevent background scrolling when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('submitting');
    
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        setStatus('success');
        setTimeout(() => {
          setIsOpen(false);
          setStatus('');
          setFormData({ name: '', email: '', phone: '', company: '', message: '' });
        }, 3000);
      } else {
        setStatus('error');
      }
    } catch (err) {
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={styles.modal}
            onClick={(e) => e.stopPropagation()}
          >
            <button className={styles.closeBtn} onClick={() => setIsOpen(false)}>×</button>
            
            <div className={styles.header}>
              <h2 className={styles.title}>Contact Us</h2>
              <p className={styles.subtitle}>Send us a message and our team will get back to you shortly.</p>
            </div>

            {status === 'success' ? (
              <div className={styles.successMessage}>
                <div className={styles.successIcon}>✓</div>
                <h3>Message Sent</h3>
                <p>Thank you for reaching out. We will contact you soon.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Name *</label>
                    <input required type="text" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Email *</label>
                    <input required type="email" name="email" value={formData.email} onChange={handleChange} />
                  </div>
                </div>
                
                <div className={styles.formRow}>
                  <div className={styles.formGroup}>
                    <label>Phone</label>
                    <input type="tel" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                  <div className={styles.formGroup}>
                    <label>Company</label>
                    <input type="text" name="company" value={formData.company} onChange={handleChange} />
                  </div>
                </div>

                <div className={styles.formGroup}>
                  <label>Message *</label>
                  <textarea required name="message" rows={4} value={formData.message} onChange={handleChange} />
                </div>

                {status === 'error' && (
                  <div className={styles.errorMessage}>Failed to send message. Please try again.</div>
                )}

                <button type="submit" disabled={status === 'submitting'} className={styles.submitBtn}>
                  {status === 'submitting' ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
