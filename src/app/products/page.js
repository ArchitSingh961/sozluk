'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import Navbar from '@/components/Navbar/Navbar';
import Footer from '@/components/Footer/Footer';
import styles from './products.module.css';
import Link from 'next/link';

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const filtersRef = useRef(null);

  const scrollFilters = () => {
    if (filtersRef.current) {
      filtersRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (activeCategory !== 'all') params.append('category', activeCategory);
      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error('Failed to fetch products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      const data = await res.json();
      setCategories(data.categories || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const cat = params.get('category') || params.get('series'); // fallback for old links
    if (cat && cat !== activeCategory) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setActiveCategory(cat);
    }
    
    fetchCategories();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCategory]);

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <Navbar />
      <div className={styles.page}>
        <div className={styles.header}>
          <div className="container">
            <motion.p
              className="section-label"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              OUR PRODUCTS
            </motion.p>
            <motion.h1
              className={styles.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              Aluminium Profile Systems
            </motion.h1>
          </div>
        </div>

        <div className="container">
          <div className={styles.toolbar}>
            <div className={styles.searchWrap}>
              <svg className={styles.searchIcon} width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
              </svg>
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={styles.searchInput}
              />
            </div>
            <div className={styles.filtersWrapper}>
              <div className={styles.filters} ref={filtersRef}>
                <button
                  className={`${styles.filterBtn} ${activeCategory === 'all' ? styles.active : ''}`}
                  onClick={() => setActiveCategory('all')}
                >
                  All Products
                </button>
                {categories.filter(c => !c.parent).map((parent) => {
                  const children = categories.filter(c => c.parent === parent._id);
                  return (
                    <div key={parent._id} className={styles.filterGroup}>
                      <button
                        className={`${styles.filterBtn} ${activeCategory === parent.slug ? styles.active : ''}`}
                        onClick={() => setActiveCategory(parent.slug)}
                      >
                        {parent.name} {children.length > 0 && <span style={{fontSize: '9px', marginLeft: '4px'}}>▼</span>}
                      </button>
                      {children.length > 0 && (
                        <div className={styles.filterDropdown}>
                          {children.map(child => (
                            <button
                              key={child._id}
                              className={`${styles.filterDropdownBtn} ${activeCategory === child.slug ? styles.active : ''}`}
                              onClick={() => setActiveCategory(child.slug)}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <button className={styles.scrollArrow} onClick={scrollFilters} aria-label="Scroll right">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading products...</div>
          ) : filteredProducts.length === 0 ? (
            <div className={styles.empty}>
              <p>No products found. Seed the database first.</p>
              <p className={styles.emptyHint}>
                Visit <code>/api/seed</code> (POST request) to populate sample data.
              </p>
            </div>
          ) : (
            <motion.div
              className={styles.grid}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  className={styles.card}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: i * 0.05 }}
                >
                  <Link href={`/products/${product._id}`}>
                    <div className={styles.cardImage}>
                      {product.image ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={product.image} alt={product.name} />
                      ) : (
                        <div className={styles.placeholder} />
                      )}
                    </div>
                    <div className={styles.cardContent}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className={styles.cardCode}>{product.code}</span>
                        {product.category && (
                          <span className={styles.cardCategory}>{product.category.name}</span>
                        )}
                      </div>
                      <h3 className={styles.cardName}>{product.name}</h3>
                      <div className={styles.cardMeta}>
                        {product.weight && <span>{product.weight}</span>}
                        {product.dimensions && <span>{product.dimensions}</span>}
                      </div>
                    </div>
                  </Link>
                  {product.pdfUrl && (
                    <a href={product.pdfUrl} className={styles.pdfLink} download>
                      ↓ Download PDF
                    </a>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </div>
      <Footer />
    </>
  );
}
