import { useState, useRef, useEffect, useCallback } from 'react';
import type { VirtualScrollOptions, VirtualScrollResult } from '../types/earthquake';

export const useVirtualScroll = (options: VirtualScrollOptions): VirtualScrollResult => {
  const { itemHeight, itemCount, viewportHeight, overscan = 5 } = options;
  const [scrollTop, setScrollTop] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const requestRef = useRef<number | null>(null);

  // Calculate visible range with proper bounds checking
  const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
  const endIndex = Math.min(
    itemCount - 1,
    Math.floor((scrollTop + viewportHeight) / itemHeight) + overscan
  );

  // Ensure we always have valid indices
  const safeStartIndex = Math.max(0, startIndex);
  const safeEndIndex = Math.max(safeStartIndex, Math.min(itemCount - 1, endIndex));

  const totalHeight = itemCount * itemHeight;
  const offsetY = safeStartIndex * itemHeight;

  // Throttled scroll handler using requestAnimationFrame
  const updateScrollPosition = useCallback(() => {
    const container = containerRef.current;
    if (container && requestRef.current) {
      setScrollTop(container.scrollTop);
      requestRef.current = null;
    }
  }, []);

  // Intersection Observer callback for performance optimization
  const handleIntersection = useCallback(() => {
    // Cancel any pending animation frame to avoid duplicate updates
    if (requestRef.current) {
      cancelAnimationFrame(requestRef.current);
    }
    
    // Schedule update on next animation frame for better performance
    requestRef.current = requestAnimationFrame(updateScrollPosition);
  }, [updateScrollPosition]);

  // Fallback scroll handler with throttling
  const handleScroll = useCallback(() => {
    handleIntersection();
  }, [handleIntersection]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Create Intersection Observer for viewport changes
    observerRef.current = new IntersectionObserver(
      handleIntersection,
      {
        root: container,
        rootMargin: '100px 0px', // Larger margin for smoother updates
        threshold: [0, 0.25, 0.5, 0.75, 1]
      }
    );

    // Create a sentinel element that spans the entire scrollable area
    const sentinel = document.createElement('div');
    sentinel.style.position = 'absolute';
    sentinel.style.top = '0';
    sentinel.style.left = '0';
    sentinel.style.width = '1px';
    sentinel.style.height = `${totalHeight}px`;
    sentinel.style.pointerEvents = 'none';
    sentinel.style.opacity = '0';
    
    // Insert sentinel into container
    container.appendChild(sentinel);

    // Initial scroll position
    setScrollTop(container.scrollTop);

    // Use both Intersection Observer and scroll listener for optimal performance
    // IO for major viewport changes, scroll for precise tracking
    container.addEventListener('scroll', handleScroll, { passive: true });
    
    if (observerRef.current) {
      observerRef.current.observe(sentinel);
    }

    // Cleanup
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
      }
      if (container.contains(sentinel)) {
        container.removeChild(sentinel);
      }
    };
  }, [handleScroll, handleIntersection, totalHeight]);

  return {
    containerRef,
    startIndex: safeStartIndex,
    endIndex: safeEndIndex,
    offsetY,
    totalHeight,
  };
};

export default useVirtualScroll;
