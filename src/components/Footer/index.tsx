import React from 'react';
import styles from './index.module.css';

export const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>
        Built with React + Vite + TypeScript • Data from{' '}
        <a 
          href="https://earthquake.usgs.gov/" 
          target="_blank" 
          rel="noopener noreferrer"
          className={styles.link}
        >
          USGS Earthquake Hazards Program
        </a>
      </p>
      <p>
        Demonstrating custom virtualization for handling large datasets
      </p>
    </footer>
  );
};

export default Footer;
