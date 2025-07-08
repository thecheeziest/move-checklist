import React from 'react';

interface TabButtonProps {
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  color: 'pink' | 'green';
  isLast?: boolean;
}

export const TabButton: React.FC<TabButtonProps> = ({
  isActive,
  onClick,
  children,
  color,
  isLast = false,
}) => {
  const baseClasses = `
    relative px-6 py-3 rounded-t-2xl font-medium transition-all duration-200 select-none text-sm z-10
    border border-gray-200 border-b-0
    ${isActive 
      ? 'bg-white text-yellow-600 shadow-none' 
      : 'bg-blue-100 text-blue-400 hover:bg-yellow-100 hover:text-yellow-600 shadow-none'
    }
    ${!isLast ? 'mr-4' : ''}
  `;

  const colorClasses = {
    pink: isActive
      ? 'text-yellow-600'
      : 'text-gray-600 hover:bg-yellow-100 hover:text-yellow-600',
    green: isActive
      ? 'text-yellow-600'
      : 'text-gray-600 hover:bg-yellow-100 hover:text-yellow-600',
  };

  return (
    <button
      onClick={onClick}
      className={`${baseClasses} ${colorClasses[color]}`}
      aria-selected={isActive}
      role="tab"
    >
      <span>{children}</span>
    </button>
  );
}; 