import React from 'react';

interface SlidePanelContentProps {
  children: React.ReactNode;
  showActions?: boolean;
  onSave?: () => void;
  onDelete?: () => void;
  saveText?: string;
  deleteText?: string;
  isSaveDisabled?: boolean;
}

export const SlidePanelContent: React.FC<SlidePanelContentProps> = ({
  children,
  showActions = false,
  onSave,
  onDelete,
  saveText = '저장',
  deleteText = '삭제',
  isSaveDisabled = false,
}) => {
  return (
    <>
      {/* Main Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 py-6" style={{ marginTop: 0, paddingTop: 0 }}>
        {children}
      </div>

      {/* Action Buttons - Fixed at bottom */}
      {showActions && (
        <div className="flex-shrink-0 p-4 space-y-3">
          {onSave && (
            <button
              onClick={onSave}
              disabled={isSaveDisabled}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors duration-200 font-medium disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              {saveText}
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {deleteText}
            </button>
          )}
        </div>
      )}
    </>
  );
}; 