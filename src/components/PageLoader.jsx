import React, { useState, useEffect } from 'react';

const PageLoader = ({ children }) => {
  const [showLoader, setShowLoader] = useState(false);
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    // Check if user has visited before in this session or ever
    // (User said "first time", but typically we do it once per session for better UX)
    const hasVisited = localStorage.getItem('pr_first_visit_v2');
    
    if (!hasVisited) {
      setShowLoader(true);
      // Wait for the animation cycle
      const timerLoad = setTimeout(() => {
        setIsDone(true);
        localStorage.setItem('pr_first_visit_v2', 'true');
        // Final cleanup to remove the loader from DOM
        setTimeout(() => setShowLoader(false), 1500);
      }, 2500);

      return () => clearTimeout(timerLoad);
    }
  }, []);

  if (!showLoader) return <>{children}</>;

  return (
    <>
      <div className={`page-loader ${isDone ? 'loaded' : ''}`}>
        <div className="loader-shutter">
           <div className="shutter-top"></div>
           <div className="shutter-bottom"></div>
        </div>
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
