import styles from './adminLoading.module.css';

export default function AdminLoading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p className={styles.text}>Loading Dashboard...</p>
    </div>
  );
}
