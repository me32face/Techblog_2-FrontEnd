import React from 'react';
import '../../Assets/Styles/LoadingScreen.css';

function LoadingScreen() {
  return (
    <div className="loading-wrapper">
      <h2>🚀 Starting TechBlog...</h2>
      <p>Please wait while we connect to the server.</p>
    </div>
  );
}

export default LoadingScreen;
