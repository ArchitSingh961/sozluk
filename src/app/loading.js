import styles from './loading.module.css';

export default function Loading() {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loader}>
        <div className={styles.spinner}></div>
        <p className={styles.text}>Loading Sözlük...</p>
      </div>
    </div>
  );
}
