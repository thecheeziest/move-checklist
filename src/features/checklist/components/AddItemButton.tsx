import React from 'react';

interface AddItemButtonProps {
  onClick: () => void;
}

export const AddItemButton: React.FC<AddItemButtonProps> = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="p-2 text-blue-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all duration-200 group self-start"
      title="새 항목 추가"
    >
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
}; 