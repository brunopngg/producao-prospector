'use client';

import React from 'react';

interface HeaderProps {
  activeTab: 'registro' | 'dashboard';
  onTabChange: (tab: 'registro' | 'dashboard') => void;
}

export default function Header({ activeTab, onTabChange }: HeaderProps) {
  return (
    <header className="bg-neutral-900 text-white sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <span className="text-lg">📊</span>
            <span className="font-semibold text-sm tracking-wide">PRODUTIVIDADE PROSPECTOR</span>
          </div>
          
          <nav className="flex gap-1">
            <button
              onClick={() => onTabChange('registro')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'registro'
                  ? 'bg-[#00ff00] text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Registro
            </button>
            <button
              onClick={() => onTabChange('dashboard')}
              className={`px-4 py-2 text-sm font-medium transition-colors ${
                activeTab === 'dashboard'
                  ? 'bg-[#00ff00] text-black'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Dashboard
            </button>
          </nav>
        </div>
      </div>
    </header>
  );
}
