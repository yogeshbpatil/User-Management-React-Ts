import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="container mt-5">
          <div className="row justify-content-center">
            <div className="col-md-6">
              <div className="alert alert-danger text-center" role="alert">
                <h4 className="alert-heading">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Something went wrong!
                </h4>
                <p>Oops! An unexpected error occurred. Please try refreshing the page.</p>
                <hr />
                <p className="mb-0">
                  <button
                    className="btn btn-outline-danger"
                    onClick={() => window.location.reload()}
                  >
                    Refresh Page
                  </button>
                </p>
                {process.env.NODE_ENV === 'development' && this.state.error && (
                  <details className="mt-3 text-start">
                    <summary>Error Details (Development)</summary>
                    <pre className="mt-2 small">{this.state.error.message}</pre>
                  </details>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
