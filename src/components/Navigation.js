import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navigation = React.memo(() => {
  const location = useLocation();

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">
          <h1>Performance App</h1>
        </Link>
        <ul className="nav-links">
          <li>
            <Link 
              to="/" 
              className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}
            >
              Home
            </Link>
          </li>
          <li>
            <Link 
              to="/about" 
              className={`nav-link ${location.pathname === '/about' ? 'active' : ''}`}
            >
              About
            </Link>
          </li>
          <li>
            <Link 
              to="/dashboard" 
              className={`nav-link ${location.pathname === '/dashboard' ? 'active' : ''}`}
            >
              Dashboard
            </Link>
          </li>
          <li>
            <Link 
              to="/virtual-list" 
              className={`nav-link ${location.pathname === '/virtual-list' ? 'active' : ''}`}
            >
              Virtual List
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
});

Navigation.displayName = 'Navigation';

export default Navigation;