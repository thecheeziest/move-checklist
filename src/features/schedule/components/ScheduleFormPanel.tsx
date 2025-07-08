import React from 'react';
import { useScheduleStore } from '../../../shared/stores/scheduleStore';
import { SlidePanel } from '../../../shared/components/SlidePanel';
import { SlidePanelContent } from '../../../shared/components/SlidePanelContent';
import type { ScheduleStatus } from '../../../shared/stores/scheduleStore';

const STATUS_OPTIONS: ScheduleStatus[] = ['예정', '완료'];

export const ScheduleFormPanel: React.FC = () => {
  const {
    isAddFormOpen,
    selectedItem,
    scheduleForm,
    closeAddForm,
    updateScheduleForm,
    addItem,
    updateItem,
  } = useScheduleStore();

  const isEditMode = !!selectedItem;
  const title = isEditMode ? '일정 수정' : '일정 추가';

  const handleSave = () => {
    if (scheduleForm.date && scheduleForm.description?.trim()) {
      if (isEditMode && selectedItem) {
        updateItem(selectedItem.id, scheduleForm);
      } else {
        addItem(scheduleForm);
      }
    }
  };

  return (
    <SlidePanel
      isOpen={isAddFormOpen}
      onClose={closeAddForm}
      title={title}
    >
      <SlidePanelContent
        showActions
        onSave={handleSave}
        saveText={isEditMode ? "수정하기" : "추가하기"}
        isSaveDisabled={!scheduleForm.date || !scheduleForm.description?.trim()}
      >
        <div>
          {/* 1. Date */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              날짜 <span className="text-yellow-500 font-bold">*</span>
            </label>
            <input
              type="date"
              value={scheduleForm.date}
              onChange={(e) => updateScheduleForm('date', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
              required
            />
          </div>

          {/* 2. Time */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              시간
            </label>
            <input
              type="time"
              value={scheduleForm.time}
              onChange={(e) => updateScheduleForm('time', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
            />
          </div>

          {/* 3. Status */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              상태 <span className="text-yellow-500 font-bold">*</span>
            </label>
            <div className="flex gap-2">
              {STATUS_OPTIONS.map((status) => (
                <button
                  key={status}
                  type="button"
                  onClick={() => updateScheduleForm('status', status)}
                  className={`flex-1 px-4 py-2 rounded-lg border-2 transition-all duration-200 font-medium text-sm ${
                    scheduleForm.status === status
                      ? status === '완료'
                        ? 'border-green-500 bg-green-500 text-white'
                        : 'border-blue-500 bg-blue-500 text-white'
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* 4. Content */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              일정 내용 <span className="text-yellow-500 font-bold">*</span>
            </label>
            <textarea
              value={scheduleForm.description}
              onChange={(e) => updateScheduleForm('description', e.target.value)}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-transparent resize-none"
              placeholder="일정 내용을 입력하세요"
              required
            />
          </div>
        </div>
      </SlidePanelContent>
    </SlidePanel>
  );
}; 