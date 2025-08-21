import React, { useState, useEffect, useCallback } from 'react';
import { useDebounce } from '../hooks/useDebounce';

const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  
  // Debounce search to avoid excessive API calls
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  // Simulate data fetching
  const fetchData = useCallback(async () => {
    setLoading(true);
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mockData = Array.from({ length: 50 }, (_, i) => ({
      id: i + 1,
      name: `Item ${i + 1}`,
      category: ['A', 'B', 'C'][i % 3],
      value: Math.floor(Math.random() * 1000),
      active: Math.random() > 0.3
    }));
    
    setData(mockData);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Memoized filtered data
  const filteredData = React.useMemo(() => {
    return data.filter(item => {
      const matchesSearch = item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase());
      const matchesFilter = filter === 'all' || 
        (filter === 'active' && item.active) || 
        (filter === 'inactive' && !item.active) ||
        (filter === item.category);
      
      return matchesSearch && matchesFilter;
    });
  }, [data, debouncedSearchTerm, filter]);

  const handleSearch = useCallback((e) => {
    setSearchTerm(e.target.value);
  }, []);

  const handleFilterChange = useCallback((e) => {
    setFilter(e.target.value);
  }, []);

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div className="spinner" />
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>Performance Dashboard</h1>
      
      <div className="dashboard-controls">
        <div className="search-container">
          <input
            type="text"
            placeholder="Search items..."
            value={searchTerm}
            onChange={handleSearch}
            className="search-input"
          />
        </div>
        
        <div className="filter-container">
          <select value={filter} onChange={handleFilterChange} className="filter-select">
            <option value="all">All Items</option>
            <option value="active">Active Only</option>
            <option value="inactive">Inactive Only</option>
            <option value="A">Category A</option>
            <option value="B">Category B</option>
            <option value="C">Category C</option>
          </select>
        </div>
      </div>

      <div className="dashboard-stats">
        <StatCard title="Total Items" value={data.length} />
        <StatCard title="Filtered Items" value={filteredData.length} />
        <StatCard title="Active Items" value={data.filter(item => item.active).length} />
        <StatCard title="Average Value" value={Math.round(data.reduce((sum, item) => sum + item.value, 0) / data.length)} />
      </div>

      <div className="data-table">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Category</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map(item => (
              <DataRow key={item.id} item={item} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// Memoized components to prevent unnecessary re-renders
const StatCard = React.memo(({ title, value }) => (
  <div className="stat-card">
    <h3>{title}</h3>
    <p className="stat-value">{value}</p>
  </div>
));

const DataRow = React.memo(({ item }) => (
  <tr>
    <td>{item.id}</td>
    <td>{item.name}</td>
    <td>{item.category}</td>
    <td>{item.value}</td>
    <td>
      <span className={`status ${item.active ? 'active' : 'inactive'}`}>
        {item.active ? 'Active' : 'Inactive'}
      </span>
    </td>
  </tr>
));

StatCard.displayName = 'StatCard';
DataRow.displayName = 'DataRow';

export default Dashboard;