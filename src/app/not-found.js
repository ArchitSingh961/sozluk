import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <div className={styles.notFoundContainer}>
      <div className={styles.content}>
        <div className={styles.glitch} data-text="404">404</div>
        <h1 className={styles.title}>Page Not Found</h1>
        <p className={styles.description}>
          The page you are looking for might have been removed, had its name changed,
          or is temporarily unavailable.
        </p>
        <Link href="/" className="btn btn-primary">
          Back to Homepage
        </Link>
      </div>
    </div>
  );
}
