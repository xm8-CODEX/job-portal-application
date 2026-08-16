// src/components/ui/ErrorState.jsx

import { AlertCircle, RefreshCcw } from 'lucide-react';

export default function ErrorState({ message = 'Something went wrong.', onRetry }) {
  return (
    <div className="empty-state">
      <div className="empty-state__icon" style={{ background: 'var(--error-bg)', color: 'var(--error)' }}>
        <AlertCircle size={36} />
      </div>
      <h3 className="empty-state__title">Error</h3>
      <p className="empty-state__desc">{message}</p>
      {onRetry && (
        <button className="btn btn--primary" onClick={onRetry}>
          <RefreshCcw size={16} /> Try Again
        </button>
      )}
    </div>
  );
}
