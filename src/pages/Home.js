import React, { useState, useCallback, useMemo } from 'react';
import { useIntersectionObserver } from '../hooks/useIntersectionObserver';

const Home = () => {
  const [count, setCount] = useState(0);
  const [items, setItems] = useState([]);

  // Memoized expensive calculation
  const expensiveValue = useMemo(() => {
    console.log('Calculating expensive value...');
    return count * 2 + Math.random();
  }, [count]);

  // Memoized callback to prevent unnecessary re-renders
  const handleIncrement = useCallback(() => {
    setCount(prev => prev + 1);
  }, []);

  const handleAddItem = useCallback(() => {
    setItems(prev => [...prev, `Item ${prev.length + 1}`]);
  }, []);

  return (
    <div className="container">
      <h1>Performance Optimized Home</h1>
      
      <section>
        <h2>Memoization Example</h2>
        <p>Count: {count}</p>
        <p>Expensive calculation result: {expensiveValue.toFixed(4)}</p>
        <button onClick={handleIncrement}>Increment</button>
      </section>

      <section>
        <h2>List Rendering</h2>
        <button onClick={handleAddItem}>Add Item</button>
        <OptimizedList items={items} />
      </section>

      <section>
        <h2>Lazy Loading Images</h2>
        <LazyImage 
          src="https://picsum.photos/800/400?random=1" 
          alt="Lazy loaded image 1" 
        />
        <LazyImage 
          src="https://picsum.photos/800/400?random=2" 
          alt="Lazy loaded image 2" 
        />
      </section>
    </div>
  );
};

// Memoized list component to prevent unnecessary re-renders
const OptimizedList = React.memo(({ items }) => {
  return (
    <ul>
      {items.map((item, index) => (
        <ListItem key={index} item={item} />
      ))}
    </ul>
  );
});

// Memoized list item
const ListItem = React.memo(({ item }) => {
  return <li>{item}</li>;
});

// Lazy loading image component
const LazyImage = ({ src, alt, ...props }) => {
  const [ref, isIntersecting] = useIntersectionObserver({
    threshold: 0.1,
    rootMargin: '50px'
  });
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <div ref={ref} style={{ minHeight: '200px', margin: '20px 0' }}>
      {isIntersecting && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setIsLoaded(true)}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease',
            width: '100%',
            height: 'auto'
          }}
          {...props}
        />
      )}
    </div>
  );
};

OptimizedList.displayName = 'OptimizedList';
ListItem.displayName = 'ListItem';

export default Home;