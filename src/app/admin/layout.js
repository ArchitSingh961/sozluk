'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import styles from './admin.module.css';

export default function AdminLayout({ children }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (status === 'unauthenticated' && pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  }, [status, pathname, router]);

  if (status === 'loading') {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (status === 'unauthenticated' || pathname === '/admin/login') {
    return <>{children}</>;
  }

  const navItems = [
    { name: 'Dashboard', path: '/admin' },
    { name: 'Products', path: '/admin/products' },
    { name: 'Categories', path: '/admin/categories' },
    { name: 'Gallery', path: '/admin/gallery' },
    { name: 'Downloads', path: '/admin/downloads' },
  ];

  return (
    <div className={styles.adminLayout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <Link href="/admin" className={styles.logo}>
            SÖZLÜK ADMIN
          </Link>
        </div>
        <nav className={styles.nav}>
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.path}
              className={`${styles.navLink} ${pathname === item.path ? styles.active : ''}`}
            >
              {item.name}
            </Link>
          ))}
        </nav>
        <div className={styles.sidebarFooter}>
          <button onClick={() => signOut()} className={styles.logoutBtn}>
            Logout
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        <div className={styles.topbar}>
          <span>Welcome, {session?.user?.name || 'Admin'}</span>
          <Link href="/" target="_blank" className={styles.viewSite}>View Site ↗</Link>
        </div>
        <div className={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}
