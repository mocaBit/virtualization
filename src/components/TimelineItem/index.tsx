import React from 'react';
import type { EarthquakeFeature } from '../../types/earthquake';
import { EarthquakeAPI } from '../../services/earthquakeAPI';
import { 
  formatDate, 
  formatRelativeTime, 
  formatMagnitude, 
  formatDepth, 
  formatCoordinates,
  truncateText 
} from '../../utils/formatters';
import styles from './index.module.css';

interface TimelineItemProps {
  earthquake: EarthquakeFeature;
}

export const TimelineItem: React.FC<TimelineItemProps> = ({ earthquake }) => {
  const { properties, geometry } = earthquake;
  const magnitudeLabel = EarthquakeAPI.getMagnitudeLabel(properties.mag);

  const handleItemClick = () => {
    if (properties.url) {
      window.open(properties.url, '_blank', 'noopener,noreferrer');
    }
  };

  const getMagnitudeClass = (magnitude: number): string => {
    if (magnitude >= 7) return styles.magnitudeBadgeMajor;
    if (magnitude >= 6) return styles.magnitudeBadgeStrong;
    if (magnitude >= 5) return styles.magnitudeBadgeModerate;
    if (magnitude >= 4) return styles.magnitudeBadgeLight;
    if (magnitude >= 3) return styles.magnitudeBadgeMinor;
    return styles.magnitudeBadgeLow;
  };

  return (
    <div 
      className={styles.item}
      onClick={handleItemClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          handleItemClick();
        }
      }}
    >
      {/* Magnitude Badge */}
      <div className={styles.badge}>
        <div className={`${styles.magnitudeBadge} ${getMagnitudeClass(properties.mag)}`}>
          {formatMagnitude(properties.mag)}
        </div>
      </div>

      {/* Event Details */}
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.title}>
            {truncateText(properties.place || 'Unknown location', 40)}
          </h3>
          <span className={styles.time}>
            {formatRelativeTime(properties.time)}
          </span>
        </div>
        
        <div className={styles.details}>
          <span className={`${styles.magnitudeLabel} ${getMagnitudeClass(properties.mag)}`}>
            {magnitudeLabel}
          </span>
          <span className={styles.depth}>
            {formatDepth(geometry.coordinates[2])}
          </span>
        </div>
        
        <div className={styles.footer}>
          <span>{formatDate(properties.time)}</span>
          <span className={styles.coords}>
            {formatCoordinates(geometry.coordinates)}
          </span>
        </div>
      </div>

      {/* Severity Indicator */}
      <div className={styles.indicator}>
        <div 
          className={`${styles.indicatorFill} ${getMagnitudeClass(properties.mag)}`}
          style={{ 
            height: `${Math.min(100, Math.max(20, (properties.mag / 10) * 100))}%` 
          }}
        />
      </div>
    </div>
  );
};

export default TimelineItem;
