import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('React ErrorBoundary caught:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  handleHome = () => {
    window.location.href = '/';
  };

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          background: 'linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: "'DM Sans', sans-serif",
          color: '#fff',
          padding: '40px 20px',
          textAlign: 'center',
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.05)',
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px',
            padding: '60px 40px',
            maxWidth: '500px',
            width: '100%',
          }}>
            <div style={{
              width: '80px', height: '80px', margin: '0 auto 24px',
              background: 'linear-gradient(135deg, #ef4444, #dc2626)',
              borderRadius: '20px',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '32px',
            }}>
              ⚠️
            </div>
            <h1 style={{ fontSize: '28px', fontWeight: '700', marginBottom: '16px' }}>
              Something went wrong
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '16px', marginBottom: '32px', lineHeight: '1.6' }}>
              We're sorry for the inconvenience. Please try again or return to home.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <button
                onClick={this.handleRetry}
                style={{
                  padding: '12px 24px',
                  background: 'linear-gradient(135deg, #6366f1, #a855f7)',
                  color: '#fff', border: 'none', borderRadius: '12px',
                  fontSize: '15px', fontWeight: '600', cursor: 'pointer',
                }}
              >
                Try Again
              </button>
              <button
                onClick={this.handleHome}
                style={{
                  padding: '12px 24px',
                  background: 'rgba(255,255,255,0.1)',
                  color: '#fff', border: '1px solid rgba(255,255,255,0.2)',
                  borderRadius: '12px', fontSize: '15px', fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Go Home
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && (
              <details style={{ marginTop: '32px', textAlign: 'left' }}>
                <summary style={{ cursor: 'pointer', color: '#a5b4fc', fontSize: '14px' }}>Development Error</summary>
                <pre style={{ 
                  background: 'rgba(0,0,0,0.3)', padding: '12px', borderRadius: '8px',
                  fontSize: '12px', color: '#fca5a5', marginTop: '8px', overflow: 'auto',
                  maxHeight: '200px'
                }}>
                  {this.state.error?.message || this.state.error?.toString()}
                </pre>
              </details>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

