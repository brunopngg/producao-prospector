'use client';

import React from 'react';

interface LoadingProps {
  message?: string;
}

export default function Loading({ message = 'Carregando...' }: LoadingProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-neutral-200 border-t-[#00ff00] animate-spin"></div>
        <span className="text-sm text-neutral-600">{message}</span>
      </div>
    </div>
  );
}
