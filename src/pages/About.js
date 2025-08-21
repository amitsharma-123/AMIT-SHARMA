import React from 'react';

const About = () => {
  return (
    <div className="container">
      <h1>About Performance Optimization</h1>
      
      <section>
        <h2>Key Optimization Techniques Implemented</h2>
        
        <div style={{ display: 'grid', gap: '2rem', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <div className="card">
            <h3>Code Splitting</h3>
            <p>Pages are lazy-loaded using React.lazy() and Suspense to reduce initial bundle size.</p>
          </div>
          
          <div className="card">
            <h3>Memoization</h3>
            <p>Components and expensive calculations are memoized using React.memo, useMemo, and useCallback.</p>
          </div>
          
          <div className="card">
            <h3>Image Optimization</h3>
            <p>Images are lazy-loaded using Intersection Observer API to improve initial page load.</p>
          </div>
          
          <div className="card">
            <h3>Bundle Optimization</h3>
            <p>Webpack is configured with code splitting, tree shaking, and compression for optimal bundles.</p>
          </div>
          
          <div className="card">
            <h3>Caching Strategy</h3>
            <p>Service workers cache resources for offline access and improved repeat visits.</p>
          </div>
          
          <div className="card">
            <h3>Performance Monitoring</h3>
            <p>Web Vitals are tracked to monitor real-world performance metrics.</p>
          </div>
        </div>
      </section>
      
      <section>
        <h2>Performance Best Practices</h2>
        <ul>
          <li>Use production builds for deployment</li>
          <li>Implement proper error boundaries</li>
          <li>Optimize images and use modern formats (WebP, AVIF)</li>
          <li>Enable compression (gzip/brotli)</li>
          <li>Use CDN for static assets</li>
          <li>Implement proper caching strategies</li>
          <li>Monitor Core Web Vitals</li>
          <li>Regular performance audits with Lighthouse</li>
        </ul>
      </section>
    </div>
  );
};

export default About;