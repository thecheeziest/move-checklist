import React from 'react';
import { useScheduleStore } from '../../../shared/stores/scheduleStore';
import type { ScheduleItem as ScheduleItemType } from '../../../shared/stores/scheduleStore';

interface ScheduleItemProps {
  item: ScheduleItemType;
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' });
};

const formatTime = (time: string) => {
  return new Date(`2000-01-01T${time}`).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' });
};

const getStatusColor = (status: string) => {
  return status === '완료' 
    ? 'bg-yellow-100 text-yellow-600' 
    : 'bg-yellow-100 text-yellow-600';
};

export const ScheduleItem: React.FC<ScheduleItemProps> = ({ item }) => {
  const { toggleItem, deleteItem, selectItem, openDetailPanel, openAddForm, updateScheduleForm } = useScheduleStore();
  
  // Get drag attributes and listeners from parent DraggableItem
  const dragProps = (window as any).__dragProps?.[item.id];

  const handleSelect = () => {
    selectItem(item);
    openDetailPanel();
  };

  const handleEdit = () => {
    // Set form data with selected item
    updateScheduleForm('date', item.date);
    updateScheduleForm('time', item.time || '');
    updateScheduleForm('status', item.status);
    updateScheduleForm('description', item.description);
    
    // Select item and open form
    selectItem(item);
    openAddForm();
  };

  const handleDelete = () => {
    if (window.confirm('일정을 삭제하시겠습니까?')) {
      deleteItem(item.id);
    }
  };

  return (
    <div className={`flex items-center gap-3 p-4 rounded-lg transition-all duration-300 group schedule-item ${
      item.completed ? 'bg-green-50 hover:bg-green-100' : 'bg-gray-50 hover:bg-gray-100'
    }`}>
      {/* Checkbox */}
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
          toggleItem(item.id);
        }}
        onMouseDown={(e) => {
          e.preventDefault();
          e.stopPropagation();
          e.nativeEvent.stopImmediatePropagation();
        }}
        onPointerDown={(e) => {
          e.stopPropagation();
        }}
        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all duration-300 flex-shrink-0 z-20 ${
          item.completed
            ? 'bg-green-500 border-green-500 text-white'
            : 'border-gray-300 hover:border-green-400'
        }`}
      >
        {item.completed && (
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )}
      </button>

      {/* Item Content */}
      <div
        className="flex-1 min-w-0 cursor-pointer"
        onClick={handleSelect}
        style={{ cursor: 'pointer' }}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            {/* Date, Time, and Status */}
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-600">
                {formatDate(item.date)}
              </span>
              {item.time && (
                <span className="text-sm text-gray-500">
                  {formatTime(item.time)}
                </span>
              )}
              <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium transition-all duration-300 ${
                item.completed 
                  ? 'bg-green-200 text-green-700' 
                  : getStatusColor(item.status)
              }`}>
                {item.status}
              </span>
            </div>
            
            {/* Content */}
            <div className={`text-lg font-medium line-clamp-2 transition-all duration-300 py-1 ${
              item.completed ? 'text-green-600' : 'text-gray-700'
            }`}>
              {item.description}
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-1 transition-opacity duration-200">
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleEdit();
          }}
          className="p-1.5 text-gray-500 hover:text-green-600 hover:bg-green-50 rounded-md transition-colors duration-200"
          title="수정"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleDelete();
          }}
          className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200"
          title="삭제"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
        {/* Drag Handle */}
        <div 
          {...dragProps?.attributes}
          {...dragProps?.listeners}
          className="p-1.5 text-gray-300 cursor-grab active:cursor-grabbing"
          onClick={(e) => e.stopPropagation()}
          onMouseDown={(e) => e.stopPropagation()}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8h16M4 16h16" />
          </svg>
        </div>
      </div>
    </div>
  );
}; 