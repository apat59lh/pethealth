import React from 'react';

const Welcome = () => {
  const handleGetStarted = () => {
    window.location.href = '/pet-type';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #FF6B6B, #4ECDC4)',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      textAlign: 'center',
      color: 'white',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif'
    }}>
      <div style={{ fontSize: '80px', marginBottom: '20px' }}>🐾</div>
      
      <h1 style={{ 
        fontSize: '32px', 
        marginBottom: '15px', 
        fontWeight: '700',
        margin: '0 0 15px 0'
      }}>
        PawTracker
      </h1>
      
      <p style={{ 
        fontSize: '18px', 
        marginBottom: '40px', 
        opacity: 0.9, 
        lineHeight: 1.4,
        maxWidth: '300px'
      }}>
        Help your furry friend live their best life with personalized health insights
      </p>
      
      <div style={{
        background: 'rgba(255,255,255,0.2)',
        borderRadius: '16px',
        padding: '25px',
        marginBottom: '40px',
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255,255,255,0.1)'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-around',
          marginBottom: '15px',
          fontSize: '24px'
        }}>
          <div>📊</div>
          <div>🍽️</div>
          <div>🏃</div>
          <div>💡</div>
        </div>
        <p style={{ 
          fontSize: '14px', 
          margin: '0', 
          opacity: 0.9 
        }}>
          Track • Learn • Improve • Share
        </p>
      </div>
      
      <button 
        onClick={handleGetStarted}
        style={{
          background: 'white',
          color: '#4ECDC4',
          border: 'none',
          borderRadius: '25px',
          padding: '15px 40px',
          fontSize: '18px',
          fontWeight: '700',
          cursor: 'pointer',
          width: '80%',
          maxWidth: '250px',
          marginBottom: '15px',
          boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
          transition: 'transform 0.2s'
        }}
        onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
        onMouseOut={(e) => e.target.style.transform = 'translateY(0px)'}
      >
        Get Started
      </button>
      
      <p style={{ 
        fontSize: '12px', 
        opacity: 0.7,
        margin: 0
      }}>
        Takes less than 5 minutes to setup
      </p>
    </div>
  );
};

export default Welcome;