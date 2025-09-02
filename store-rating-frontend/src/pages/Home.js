import React from "react";
import { Link } from "react-router-dom";

const Home = () => (
  <div style={{
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '2rem',
    paddingTop: '120px',
    background: 'radial-gradient(ellipse at center, #667eea 0%, #764ba2 50%, #f093fb 100%)',
    backgroundAttachment: 'fixed',
    textAlign: 'center',
    position: 'relative'
  }}>
    {/* Background particles effect */}
    <div style={{
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundImage: `
        radial-gradient(circle at 25% 25%, rgba(120, 119, 198, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 75% 75%, rgba(255, 119, 198, 0.2) 0%, transparent 50%),
        radial-gradient(circle at 50% 50%, rgba(120, 219, 255, 0.2) 0%, transparent 50%)
      `,
      pointerEvents: 'none',
      zIndex: 1,
      animation: 'float 8s ease-in-out infinite'
    }} />
    
    {/* Main content container */}
    <div style={{
      background: 'rgba(255, 255, 255, 0.12)',
      backdropFilter: 'blur(25px)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      borderRadius: '24px',
      padding: '4rem 3rem',
      maxWidth: '600px',
      width: '100%',
      position: 'relative',
      zIndex: 2,
      boxShadow: `
        0 25px 50px rgba(0, 0, 0, 0.15),
        inset 0 1px 0 rgba(255, 255, 255, 0.2)
      `,
      animation: 'slideIn 0.8s cubic-bezier(0.4, 0, 0.2, 1)',
      overflow: 'hidden'
    }}>
      {/* Glass reflection line */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        height: '1px',
        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.4), transparent)'
      }} />
      
      {/* Main heading */}
      <h1 style={{
        color: 'rgba(255, 255, 255, 0.95)',
        fontSize: '3rem',
        fontWeight: 700,
        marginBottom: '1.5rem',
        textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.7))',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Welcome to Store Rating App
      </h1>
      
      {/* Subtitle */}
      <p style={{
        color: 'rgba(255, 255, 255, 0.85)',
        fontSize: '1.3rem',
        marginBottom: '3rem',
        fontWeight: 400,
        lineHeight: 1.6
      }}>
        Discover and rate your favorite stores!
      </p>
      
      {/* Buttons container */}
      <div style={{
        display: 'flex',
        gap: '1.5rem',
        justifyContent: 'center',
        flexWrap: 'wrap'
      }}>
        {/* Login Link */}
        <Link to="/login" style={{
          display: 'inline-block',
          padding: '1.2rem 2.5rem',
          background: 'linear-gradient(135deg, rgba(0, 122, 255, 0.8), rgba(0, 81, 168, 0.8))',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '16px',
          fontSize: '1.1rem',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `
            0 8px 25px rgba(0, 122, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: '140px'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(0, 122, 255, 0.9), rgba(0, 81, 168, 0.9))';
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = `
            0 15px 35px rgba(0, 122, 255, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(0, 122, 255, 0.8), rgba(0, 81, 168, 0.8))';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = `
            0 8px 25px rgba(0, 122, 255, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `;
        }}>
          Login
        </Link>
        
        {/* Sign Up Link */}
        <Link to="/signup" style={{
          display: 'inline-block',
          padding: '1.2rem 2.5rem',
          background: 'linear-gradient(135deg, rgba(52, 199, 89, 0.8), rgba(40, 167, 69, 0.8))',
          color: 'white',
          textDecoration: 'none',
          borderRadius: '16px',
          fontSize: '1.1rem',
          fontWeight: 600,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: `
            0 8px 25px rgba(52, 199, 89, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `,
          textShadow: '0 1px 2px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
          minWidth: '140px'
        }}
        onMouseEnter={(e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(52, 199, 89, 0.9), rgba(40, 167, 69, 0.9))';
          e.target.style.transform = 'translateY(-3px)';
          e.target.style.boxShadow = `
            0 15px 35px rgba(52, 199, 89, 0.4),
            inset 0 1px 0 rgba(255, 255, 255, 0.3)
          `;
        }}
        onMouseLeave={(e) => {
          e.target.style.background = 'linear-gradient(135deg, rgba(52, 199, 89, 0.8), rgba(40, 167, 69, 0.8))';
          e.target.style.transform = 'translateY(0)';
          e.target.style.boxShadow = `
            0 8px 25px rgba(52, 199, 89, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.2)
          `;
        }}>
          Sign Up
        </Link>
      </div>
      
      {/* Shimmer effect overlay */}
      <div style={{
        position: 'absolute',
        top: '-50%',
        left: '-50%',
        width: '200%',
        height: '200%',
        background: 'linear-gradient(45deg, transparent, rgba(255, 255, 255, 0.03), transparent)',
        animation: 'shimmerRotate 8s linear infinite',
        pointerEvents: 'none'
      }} />
    </div>
    
    {/* Add required keyframes styles */}
    <style jsx>{`
      @keyframes float {
        0%, 100% {
          transform: translateY(0px);
        }
        50% {
          transform: translateY(-20px);
        }
      }
      
      @keyframes slideIn {
        from {
          opacity: 0;
          transform: translateY(40px) scale(0.9);
        }
        to {
          opacity: 1;
          transform: translateY(0) scale(1);
        }
      }
      
      @keyframes shimmerRotate {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
      @media (max-width: 768px) {
        .home-container {
          padding: 1.5rem !important;
          padding-top: 100px !important;
        }
        
        .home-content {
          padding: 2.5rem 2rem !important;
        }
        
        .home-title {
          font-size: 2.2rem !important;
        }
        
        .home-subtitle {
          font-size: 1.1rem !important;
          margin-bottom: 2rem !important;
        }
        
        .home-buttons {
          flex-direction: column !important;
          gap: 1rem !important;
        }
        
        .home-button {
          width: 100% !important;
          min-width: auto !important;
        }
      }
    `}</style>
  </div>
);

export default Home;