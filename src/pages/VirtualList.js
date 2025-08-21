import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';

const VirtualList = () => {
  // Generate large dataset
  const items = useMemo(() => {
    return Array.from({ length: 10000 }, (_, index) => ({
      id: index,
      name: `Item ${index + 1}`,
      description: `This is a description for item ${index + 1}. It contains some sample text to demonstrate the virtual list performance.`,
      value: Math.floor(Math.random() * 1000),
      category: ['Technology', 'Science', 'Arts', 'Sports', 'Music'][index % 5],
      timestamp: new Date(Date.now() - Math.random() * 10000000000).toISOString()
    }));
  }, []);

  return (
    <div className="container">
      <h1>Virtual List Performance Demo</h1>
      <p>This page demonstrates rendering 10,000 items efficiently using react-window for virtualization.</p>
      
      <div className="virtual-list-container">
        <List
          height={600}
          itemCount={items.length}
          itemSize={120}
          itemData={items}
          width="100%"
        >
          {VirtualListItem}
        </List>
      </div>
      
      <div className="performance-info">
        <h3>Performance Benefits:</h3>
        <ul>
          <li>Only renders visible items in the viewport</li>
          <li>Maintains smooth scrolling performance with large datasets</li>
          <li>Reduces DOM nodes and memory usage</li>
          <li>Scales to millions of items without performance degradation</li>
        </ul>
      </div>
    </div>
  );
};

// Memoized virtual list item component
const VirtualListItem = React.memo(({ index, style, data }) => {
  const item = data[index];
  
  return (
    <div style={style} className="virtual-list-item">
      <div className="item-content">
        <div className="item-header">
          <h4>{item.name}</h4>
          <span className="item-value">${item.value}</span>
        </div>
        <p className="item-description">{item.description}</p>
        <div className="item-meta">
          <span className="item-category">{item.category}</span>
          <span className="item-timestamp">{new Date(item.timestamp).toLocaleDateString()}</span>
        </div>
      </div>
    </div>
  );
});

VirtualListItem.displayName = 'VirtualListItem';

export default VirtualList;