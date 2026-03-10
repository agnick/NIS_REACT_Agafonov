import { Component, ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-[200px] p-8">
          <div className="cyber-card max-w-md w-full text-center">
            <h2 className="text-neon-pink font-display text-xl mb-4">
              Произошла ошибка
            </h2>
            <p className="text-gray-400 mb-4 text-sm font-mono">
              {this.state.error?.message ?? "Неизвестная ошибка"}
            </p>
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="btn-neon-pink"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
