import React from 'react';
import { useScheduleStore } from '../../../shared/stores/scheduleStore';
import { SlidePanel } from '../../../shared/components/SlidePanel';
import { SlidePanelContent } from '../../../shared/components/SlidePanelContent';

export const ScheduleDetailPanel: React.FC = () => {
  const {
    selectedItem,
    isDetailPanelOpen,
    closeDetailPanel,
    deleteItem,
  } = useScheduleStore();

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    });
  };

  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':');
    return `${hours}:${minutes}`;
  };

  return (
    <SlidePanel
      isOpen={isDetailPanelOpen}
      onClose={closeDetailPanel}
    >
      {selectedItem && (
        <SlidePanelContent
          showActions
          onDelete={() => deleteItem(selectedItem.id)}
          saveText="수정"
          deleteText="삭제"
        >
        <div>
          {/* Date */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날짜
            </label>
            <div className="text-lg font-semibold text-gray-800">
              {formatDate(selectedItem.date)}
            </div>
          </div>

          {/* Time */}
          {selectedItem.time && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                시간
              </label>
              <div className="text-lg font-semibold text-gray-800">
                {formatTime(selectedItem.time)}
              </div>
            </div>
          )}

          {/* Status */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태
            </label>
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              selectedItem.status === '완료'
                ? 'bg-green-100 text-green-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              {selectedItem.status}
            </div>
          </div>

          {/* Content */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              일정 내용
            </label>
            <div className="bg-gray-50 rounded-lg p-4 max-h-48 overflow-y-auto">
              <div className="text-gray-800 whitespace-pre-wrap break-words">
                {selectedItem.description}
              </div>
            </div>
          </div>

          {/* Dates */}
          <div className="mb-6">
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  생성일
                </label>
                <div className="text-sm text-gray-600">
                  {selectedItem.createdAt.toLocaleDateString('ko-KR')}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  수정일
                </label>
                <div className="text-sm text-gray-600">
                  {selectedItem.updatedAt.toLocaleDateString('ko-KR')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </SlidePanelContent>
      )}
    </SlidePanel>
  );
}; 