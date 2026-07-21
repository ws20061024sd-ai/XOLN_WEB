"use client";
import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export default class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="h-14 w-14 rounded-2xl bg-[var(--border-light)] flex items-center justify-center">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-[var(--text-muted)]">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <p className="text-lg font-medium text-[var(--text)]">出了点问题</p>
            <p className="text-sm text-[var(--text-muted)]">请刷新页面重试</p>
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-lg bg-[var(--accent)] px-6 py-2.5 text-sm font-medium text-white"
            >
              重试
            </button>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
