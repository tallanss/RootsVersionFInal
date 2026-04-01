import React, { useState, useEffect } from 'react';

const PageLoader = ({ children }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user has visited before in this session or ever
    const hasVisited = localStorage.getItem('pr_first_visit_v3');
    
    if (!hasVisited) {
      setShowLoader(true);
      // Wait for the animation cycle (reduced to 1.8s for faster feel)
      const timerLoad = setTimeout(() => {
        setIsDone(true);
        localStorage.setItem('pr_first_visit_v3', 'true');
        // Final cleanup to remove the loader from DOM
        setTimeout(() => setShowLoader(false), 800);
      }, 1800);

      return () => clearTimeout(timerLoad);
    }
  }, []);

  if (!showLoader) return <>{children}</>;

  return (
    <>
      <div className={`page-loader ${isDone ? 'loaded' : ''}`}>
        <div className="loader-content">
          <img 
            src="/logo-icon.png" 
            alt="PhotoRoots" 
            className="loader-logo" 
          />
          <div className="loader-brand">PhotoRoots</div>
        </div>
      </div>
      {children}
    </>
  );
};

export default PageLoader;
