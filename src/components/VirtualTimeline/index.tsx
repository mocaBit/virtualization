import React, { useState, useEffect, useCallback } from 'react';
import type { EarthquakeFeature, LoadingState } from '../../types/earthquake';
import { useVirtualScroll } from '../../hooks/useVirtualScroll';
import { EarthquakeAPI } from '../../services/earthquakeAPI';
import TimelineItem from '../TimelineItem';
import Loader from '../Loader';
import styles from './index.module.css';
import loadingStyles from '../LoadingStates/index.module.css';

interface VirtualTimelineProps {
  className?: string;
}

const ITEM_HEIGHT = 96;
const VIEWPORT_HEIGHT = 600;
const LOAD_MORE_THRESHOLD = 10;
const PAGE_SIZE = 50;

export const VirtualTimeline: React.FC<VirtualTimelineProps> = ({ className = '' }) => {
  const [earthquakes, setEarthquakes] = useState<EarthquakeFeature[]>([]);
  const [loading, setLoading] = useState<LoadingState>({
    isLoading: true,
    error: null,
    hasMore: true
  });
  const [filters, setFilters] = useState({
    minMagnitude: 2.5,
    timeRange: 30 // days
  });
  const [currentOffset, setCurrentOffset] = useState(0);

  const { containerRef, startIndex, endIndex, offsetY, totalHeight } = useVirtualScroll({
    itemHeight: ITEM_HEIGHT,
    itemCount: earthquakes.length,
    viewportHeight: VIEWPORT_HEIGHT,
    overscan: 5
  });

  const loadInitialData = useCallback(async () => {
    try {
      setLoading(prev => ({ ...prev, isLoading: true, error: null }));
      setCurrentOffset(0);
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - filters.timeRange);
      
      const data = await EarthquakeAPI.fetchEarthquakesByTimeRange(
        startDate,
        new Date(),
        PAGE_SIZE,
        0
      );
      
      const filteredData = data.filter(eq => eq.properties.mag >= filters.minMagnitude);
      
      setEarthquakes(filteredData);
      setCurrentOffset(PAGE_SIZE);
      setLoading(prev => ({ 
        ...prev, 
        isLoading: false, 
        hasMore: filteredData.length >= PAGE_SIZE 
      }));
    } catch (error) {
      setLoading(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }));
    }
  }, [filters.minMagnitude, filters.timeRange]);

  const loadMoreData = useCallback(async () => {
    if (loading.isLoading || !loading.hasMore) return;

    try {
      setLoading(prev => ({ ...prev, isLoading: true }));
      
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - filters.timeRange);
      
      const data = await EarthquakeAPI.fetchEarthquakesByTimeRange(
        startDate,
        new Date(),
        PAGE_SIZE,
        currentOffset
      );
      
      const filteredData = data.filter(eq => eq.properties.mag >= filters.minMagnitude);
      
      if (filteredData.length > 0) {
        setEarthquakes(prev => [...prev, ...filteredData]);
        setCurrentOffset(prev => prev + PAGE_SIZE);
      }
      
      setLoading(prev => ({ 
        ...prev, 
        isLoading: false, 
        hasMore: filteredData.length >= PAGE_SIZE 
      }));
    } catch (error) {
      setLoading(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to load more data' 
      }));
    }
  }, [loading.isLoading, loading.hasMore, filters.minMagnitude, filters.timeRange, currentOffset]);

  // Check if we need to load more data when approaching the end
  useEffect(() => {
    if (endIndex >= earthquakes.length - LOAD_MORE_THRESHOLD && loading.hasMore && !loading.isLoading) {
      loadMoreData();
    }
  }, [endIndex, earthquakes.length, loading.hasMore, loading.isLoading, loadMoreData]);

  // Load initial data
  useEffect(() => {
    loadInitialData();
  }, [loadInitialData]);

  const visibleEarthquakes = earthquakes.slice(startIndex, endIndex + 1);

  const handleMagnitudeFilter = (minMag: number) => {
    setFilters(prev => ({ ...prev, minMagnitude: minMag }));
    setCurrentOffset(0);
    setEarthquakes([]); // Clear current data to trigger reload
  };

  if (loading.isLoading && earthquakes.length === 0) {
    return (
      <div className={loadingStyles.loadingState}>
        <Loader size="lg" />
        <p className={loadingStyles.text}>Loading earthquake data...</p>
      </div>
    );
  }

  if (loading.error && earthquakes.length === 0) {
    return (
      <div className={loadingStyles.errorState}>
        <div className={loadingStyles.errorContent}>
          <h3 className={loadingStyles.errorTitle}>Failed to load data</h3>
          <p className={loadingStyles.errorMessage}>{loading.error}</p>
          <button
            onClick={loadInitialData}
            className={loadingStyles.errorButton}
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.timeline} ${className}`}>
      {/* Header with filters */}
      <div className={styles.header}>
        <div className={styles.headerTop}>
          <h2 className={styles.title}>
            Recent Earthquakes
          </h2>
          <span className={styles.count}>
            {earthquakes.length} events
          </span>
        </div>
        
        <div className={styles.filters}>
          <span className={styles.filterLabel}>Min magnitude:</span>
          {[2.5, 3.0, 4.0, 5.0, 6.0].map((mag) => (
            <button
              key={mag}
              onClick={() => handleMagnitudeFilter(mag)}
              className={`${styles.filterBtn} ${
                filters.minMagnitude === mag ? styles.filterBtnActive : styles.filterBtnInactive
              }`}
            >
              {mag}+
            </button>
          ))}
        </div>
      </div>

      {/* Virtual scrollable timeline */}
      <div
        ref={containerRef}
        className={styles.container}
      >
        {/* Virtual spacer to maintain scroll height */}
        <div className={styles.spacer} style={{ height: totalHeight }}>
          {/* Visible items container */}
          <div 
            className={styles.viewport}
            style={{ transform: `translateY(${offsetY}px)` }}
          >
            {visibleEarthquakes.map((earthquake) => (
              <TimelineItem
                key={earthquake.id}
                earthquake={earthquake}
              />
            ))}
          </div>
        </div>
        
        {/* Loading indicator at the bottom */}
        {loading.isLoading && earthquakes.length > 0 && (
          <div className={styles.loadingOverlay}>
            <Loader size="sm" />
          </div>
        )}
      </div>

      {/* Footer with stats */}
      <div className={styles.footer}>
        <div className={styles.footerFlex}>
          <span>
            Data from USGS Earthquake Hazards Program • Last {filters.timeRange} days • 
            Magnitude ≥ {filters.minMagnitude}
            {loading.hasMore && (
              <span> • Scroll down for more</span>
            )}
          </span>
          <span className={styles.stats}>
            Rendering {visibleEarthquakes.length} of {earthquakes.length} items
          </span>
        </div>
      </div>
    </div>
  );
};

export default VirtualTimeline;
