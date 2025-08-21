// Performance monitoring utility
export function reportWebVitals(onPerfEntry) {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
}

// Default implementation that logs to console
const defaultReporter = (metric) => {
  console.log('Web Vital:', metric);
  
  // In production, you would send this to your analytics service
  // Example: analytics.track('Web Vital', metric);
};

// Auto-initialize with default reporter
if (typeof window !== 'undefined') {
  reportWebVitals(defaultReporter);
}

// Performance observer for additional metrics
export function initPerformanceObserver() {
  if ('PerformanceObserver' in window) {
    // Observe navigation timing
    const navObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        console.log('Navigation timing:', {
          type: entry.type,
          startTime: entry.startTime,
          duration: entry.duration,
          domContentLoadedEventEnd: entry.domContentLoadedEventEnd,
          loadEventEnd: entry.loadEventEnd
        });
      }
    });
    
    navObserver.observe({ entryTypes: ['navigation'] });

    // Observe resource timing
    const resourceObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.duration > 100) { // Only log slow resources
          console.log('Slow resource:', {
            name: entry.name,
            duration: entry.duration,
            size: entry.transferSize
          });
        }
      }
    });
    
    resourceObserver.observe({ entryTypes: ['resource'] });
  }
}

// Initialize performance observer
initPerformanceObserver();