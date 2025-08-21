import React from 'react';

const LoadingSpinner = React.memo(() => {
  return (
    <div className="loading">
      <div className="spinner" />
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

export default LoadingSpinner;