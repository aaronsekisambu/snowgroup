'use client'

import React, { ReactNode, ReactElement, ErrorInfo } from 'react'

interface Props {
  children: ReactNode
  fallback?: (error: Error, reset: () => void) => ReactElement
}

interface State {
  hasError: boolean
  error: Error | null
}

/**
 * ErrorBoundary - Catches React errors in child components
 * and displays a fallback UI instead of crashing the entire app.
 * Note: Error boundaries only catch errors during rendering, in lifecycle methods,
 * and in constructors of the whole tree below them.
 */
export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
    }
  }

  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error,
    }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Log error details for debugging
    console.error('ErrorBoundary caught an error:', error)
    console.error('Error info:', errorInfo)

    // You could also send this to an error logging service here
    if (process.env.NODE_ENV === 'production') {
      // Example: reportErrorToLoggingService(error, errorInfo)
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
    })
  }

  render() {
    if (this.state.hasError) {
      // Use custom fallback if provided, otherwise use default
      if (this.props.fallback && this.state.error) {
        return this.props.fallback(this.state.error, this.handleReset)
      }

      // Default fallback UI
      return (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '400px',
            padding: '20px',
            textAlign: 'center',
            fontFamily: 'system-ui, -apple-system, sans-serif',
          }}
        >
          <div style={{ maxWidth: '600px' }}>
            <h1 style={{ fontSize: '24px', marginBottom: '10px', color: '#333' }}>
              Oops! Something went wrong
            </h1>
            <p style={{ fontSize: '16px', color: '#666', marginBottom: '20px' }}>
              We encountered an unexpected error while rendering this component. Please try refreshing the page.
            </p>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details
                style={{
                  marginTop: '20px',
                  padding: '15px',
                  backgroundColor: '#f5f5f5',
                  borderRadius: '4px',
                  textAlign: 'left',
                  cursor: 'pointer',
                }}
              >
                <summary style={{ fontWeight: 'bold', marginBottom: '10px' }}>
                  Error details (development only)
                </summary>
                <pre
                  style={{
                    overflow: 'auto',
                    fontSize: '12px',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    color: '#d32f2f',
                  }}
                >
                  {this.state.error.toString()}
                </pre>
              </details>
            )}
            <button
              onClick={this.handleReset}
              style={{
                marginTop: '20px',
                padding: '10px 20px',
                backgroundColor: '#333',
                color: '#fff',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '14px',
              }}
            >
              Try again
            </button>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
