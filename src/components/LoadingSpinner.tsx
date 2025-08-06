'use client';

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
}

export function LoadingSpinner({ message = 'Loading...' }: LoadingSpinnerProps) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <div className="loading-spinner w-12 h-12 mb-4"></div>
      <p className="text-gray-600 dark:text-slate-400 text-sm">{message}</p>
    </div>
  );
}

export default LoadingSpinner;
