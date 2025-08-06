'use client';

import React from 'react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 max-w-md">
        <div className="flex items-center mb-4">
          <span className="text-red-500 text-2xl mr-3">⚠️</span>
          <h3 className="text-lg font-semibold text-red-700 dark:text-red-300">Error</h3>
        </div>
        <p className="text-red-600 dark:text-red-400 mb-4">{message}</p>
        {onRetry && (
          <button
            onClick={onRetry}
            className="w-full btn-primary bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700"
          >
            Try Again
          </button>
        )}
      </div>
    </div>
  );
}

export default ErrorMessage;
