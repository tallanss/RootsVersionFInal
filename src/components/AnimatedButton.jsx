import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, CheckCircle2 } from 'lucide-react';
import MagneticEffect from './MagneticEffect';

const AnimatedButton = ({ 
  to, 
  children, 
  className = "btn-primary", 
  style = {} 
}) => {
  const [status, setStatus] = useState('idle'); // 'idle' | 'loading' | 'success'
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    if (status !== 'idle') return;

    setStatus('loading');
    
    // Simulate complex calculation / payment setup to build excitement
    setTimeout(() => {
      setStatus('success');
      
      // Keep checkmark visible before navigating
      setTimeout(() => {
        navigate(to);
        // Reset state after navigation happens so browser back works
        setTimeout(() => setStatus('idle'), 500);
      }, 600);
      
    }, 700);
  };

  return (
    <MagneticEffect strength={0.2}>
      <button 
      className={`${className} ${status !== 'idle' ? 'animating' : ''}`}
      style={{
        ...style,
        position: 'relative',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        overflow: 'hidden',
        transition: 'all 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      onClick={handleClick}
      disabled={status !== 'idle'}
    >
      {/* Normal Content */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        opacity: status === 'idle' ? 1 : 0,
        transform: status === 'idle' ? 'scale(1)' : 'scale(0.9)',
        transition: 'all 0.3s ease-in-out',
        width: '100%',
        justifyContent: 'center'
      }}>
        {children}
      </div>

      {/* Loading Spinner */}
      {status === 'loading' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'delayed-fade-in 0.3s ease-out'
        }}>
          <Loader2 size={20} className="shimmer-spinner" />
        </div>
      )}

      {/* Success Checkmark */}
      {status === 'success' && (
        <div style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'spring-pop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)'
        }}>
          <CheckCircle2 size={24} style={{ color: 'currentColor', fill: 'currentColor', fillOpacity: 0.2 }} strokeWidth={2.5} />
        </div>
      )}
      </button>
    </MagneticEffect>
  );
};

export default AnimatedButton;
