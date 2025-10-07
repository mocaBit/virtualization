import React from 'react';
import styles from './index.module.css';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Loader: React.FC<LoaderProps> = ({ size = 'md', className = '' }) => {
  const sizeClass = styles[`spinner${size.charAt(0).toUpperCase() + size.slice(1)}`];
  
  return (
    <div className={`${styles.loader} ${className}`}>
      <div
        className={`${styles.spinner} ${sizeClass}`}
        role="status"
        aria-label="Loading"
      />
    </div>
  );
};

export default Loader;
