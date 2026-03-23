import React, { Component, ErrorInfo, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
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
        <div className="min-h-screen bg-cream flex items-center justify-center p-6 text-center">
          <div className="max-w-md">
            <h2 className="text-3xl font-serif font-medium text-dark mb-4">Ups! Algo correu mal.</h2>
            <p className="text-dark/60 mb-8 font-light">
              Pedimos desculpa pelo incómodo. Por favor, tente recarregar a página.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="bg-gold text-dark px-8 py-4 rounded-full font-bold uppercase tracking-widest text-xs hover:bg-gold-dk transition-all"
            >
              Recarregar Página
            </button>
            {process.env.NODE_ENV === 'development' && (
              <pre className="mt-8 p-4 bg-red-50 text-red-600 text-left text-xs overflow-auto rounded-xl border border-red-100">
                {this.state.error?.message}
              </pre>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
