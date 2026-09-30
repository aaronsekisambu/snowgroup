'use client'

import React from 'react'
import { ErrorBoundary } from '@/components/ErrorBoundary'

/**
 * BlockErrorBoundary - Wraps individual blocks to isolate errors
 * Prevents one broken block from crashing the entire page
 */
export const BlockErrorBoundary: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <ErrorBoundary
      fallback={(error) => (
        <div
          style={{
            padding: '40px 20px',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
            borderRadius: '4px',
            border: '1px solid #eee',
            margin: '20px 0',
          }}
        >
          <p style={{ color: '#666', fontSize: '14px', margin: 0 }}>
            This content failed to load. Please try refreshing the page.
          </p>
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: '10px', fontSize: '12px', color: '#999' }}>
              <summary style={{ cursor: 'pointer' }}>Error details</summary>
              <pre style={{ textAlign: 'left', overflow: 'auto' }}>
                {error.message}
              </pre>
            </details>
          )}
        </div>
      )}
    >
      {children}
    </ErrorBoundary>
  )
}
