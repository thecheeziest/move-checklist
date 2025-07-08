import React from 'react';

interface SlidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}

export const SlidePanel: React.FC<SlidePanelProps> = ({
  isOpen,
  onClose,
  children,
  title,
}) => {
  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black transition-opacity duration-300 z-[99999] ${
          isOpen ? 'bg-opacity-50 pointer-events-auto' : 'bg-opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Panel */}
      <div
        className={`fixed top-0 right-0 h-screen w-96 bg-white shadow-2xl z-[999999] flex flex-col mt-0 slide-panel ${
          isOpen ? 'open' : ''
        }`}
      >
        {/* Header */}
        <div className="flex-shrink-0 bg-white py-2 px-4">
          <div className="flex items-center justify-between">
            {title && (
              <h3 className="text-lg font-bold text-yellow-400" style={{fontWeight: 700}}>{title}</h3>
            )}
            {!title && <div></div>}
            <button
              onClick={onClose}
              className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col min-h-0">
          {children}
        </div>
      </div>
    </>
  );
}; 