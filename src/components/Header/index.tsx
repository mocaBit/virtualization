import React from 'react';
import styles from './index.module.css';

export const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>
        🌍 Natural Events Timeline
      </h1>
      <p className={styles.subtitle}>
        Real-time earthquake data from USGS with virtualized scrolling
      </p>
      <div className={styles.indicators}>
        <span className={styles.indicator}>
          <span className={`${styles.indicatorDot} ${styles.indicatorDotGreen}`}></span>
          Live Data
        </span>
        <span className={styles.indicator}>
          <span className={`${styles.indicatorDot} ${styles.indicatorDotBlue}`}></span>
          Virtualized
        </span>
        <span className={styles.indicator}>
          <span className={`${styles.indicatorDot} ${styles.indicatorDotPurple}`}></span>
          Infinite Scroll
        </span>
      </div>
    </header>
  );
};

export default Header;
