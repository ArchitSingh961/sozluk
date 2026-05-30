'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [categories, setCategories] = useState([]);
  const pathname = usePathname();

  const isHome = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    if (isHome) {
      // Only attach scroll listener on homepage
      window.addEventListener('scroll', handleScroll);
      // Run once on mount to check initial scroll position
      handleScroll();
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [isHome]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Failed to fetch categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const parentCategories = categories.filter(c => !c.parent);

  const headerClass = isHome ? (scrolled ? styles.scrolled : '') : styles.scrolled;
  const btnClass = isHome && !scrolled ? 'btn-outline' : 'btn-primary';

  return (
    <header className={`${styles.header} ${headerClass}`}>
      <div className={`container-wide ${styles.navContainer}`}>
        <Link href="/" className={styles.logo}>
          SÖZLÜK
        </Link>

        <nav className={`${styles.nav} ${mobileMenuOpen ? styles.mobileOpen : ''}`}>
          <div className={styles.navLinks}>
            <div className={styles.navItem}>
              <Link href="/" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                Home
              </Link>
            </div>
            <div className={`${styles.navItem} ${styles.hasMegaMenu}`}>
              <Link href="/products" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                Products <span className={styles.arrow}>▼</span>
              </Link>
              <div className={styles.megaMenu}>
                <div className={styles.megaMenuGrid}>
                  
                  {/* Parent Categories as Columns */}
                  {parentCategories.map(parent => {
                    const children = categories.filter(c => c.parent === parent._id);
                    return (
                      <div key={parent._id} className={styles.megaMenuCol}>
                        <Link 
                          href={`/products?category=${parent.slug}`} 
                          className={styles.megaMenuHeading}
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          {parent.name}
                        </Link>
                        {children.length > 0 && (
                          <div className={styles.megaMenuList}>
                            {children.map(child => (
                              <Link 
                                key={child._id} 
                                href={`/products?category=${child.slug}`} 
                                className={styles.megaMenuLink}
                                onClick={() => setMobileMenuOpen(false)}
                              >
                                {child.name}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}

                  

                </div>
              </div>
            </div>

            <div className={styles.navItem}>
              <Link href="/#about" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                About
              </Link>
            </div>
            <div className={styles.navItem}>
              <Link href="/#gallery" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                Gallery
              </Link>
            </div>
            <div className={styles.navItem}>
              <Link href="/#downloads" className={styles.navLink} onClick={() => setMobileMenuOpen(false)}>
                Downloads
              </Link>
            </div>
          </div>
          
          <button 
            className={`btn ${btnClass}`} 
            onClick={() => {
              setMobileMenuOpen(false);
              window.dispatchEvent(new CustomEvent('openContactModal'));
            }}
          >
            Contact Us
          </button>
        </nav>

        <button 
          className={styles.hamburger} 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLine1 : ''}`}></div>
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLine2 : ''}`}></div>
          <div className={`${styles.hamburgerLine} ${mobileMenuOpen ? styles.hamburgerLine3 : ''}`}></div>
        </button>
      </div>
    </header>
  );
}
