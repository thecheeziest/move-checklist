import React, { useEffect } from 'react';
import { useScheduleStore } from '../../../shared/stores/scheduleStore';
import { ScheduleItem as ScheduleItemComponent } from './ScheduleItem';
import { AddItemButton } from '../../checklist/components/AddItemButton';
import { ScheduleFormPanel } from './ScheduleFormPanel';
import { ScheduleDetailPanel } from './ScheduleDetailPanel';
import { DraggableList } from '../../../shared/components/DraggableList';
import { DraggableItem } from '../../../shared/components/DraggableItem';
import { DropZone } from '../../../shared/components/DropZone';
import type { ScheduleItem } from '../../../shared/stores/scheduleStore';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';

export const ScheduleChecklist: React.FC = () => {
  const {
    items,
    openAddForm,
    reorderItems,
    moveToCompleted,
    moveToPlanned,
    loadItems,
    loading,
    error,
    selectItem,
    openDetailPanel,
    clearError,
  } = useScheduleStore();

  useEffect(() => {
    loadItems().catch((e) => {
      window.alert('일정 리스트를 불러오는 중 오류가 발생했습니다: ' + e.message);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (error) {
      window.alert(error);
      clearError();
    }
  }, [error, clearError]);

  const handleItemClick = (item: ScheduleItem) => {
    selectItem(item);
    openDetailPanel();
    // 필요시 DETAIL API 호출 추가 가능
  };

  const completedItems = items.filter(item => item.status === '완료');
  const plannedItems = items.filter(item => item.status === '예정');

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Add Button */}
      <AddItemButton onClick={openAddForm} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner />
          </div>
        ) : items.length > 0 ? (
          <DraggableList onReorder={reorderItems} onMoveToCompleted={moveToCompleted} onMoveToPlanned={moveToPlanned} items={items}>
            {/* Planned Items */}
            {plannedItems.length > 0 && (
              <DropZone id="planned" className="mt-6">
                <h3 className="text-lg font-bold text-blue-200 mb-4" style={{fontWeight: 700}}>
                  예정된 일정
                </h3>
                <div className="space-y-3">
                  {plannedItems.map((item) => (
                    <DraggableItem key={item.id} id={item.id}>
                      <div onClick={() => handleItemClick(item)}>
                        <ScheduleItemComponent item={item} />
                      </div>
                    </DraggableItem>
                  ))}
                </div>
              </DropZone>
            )}

            {/* Completed Items */}
            {completedItems.length > 0 && (
              <DropZone id="completed" className="mt-12">
                <h3 className="text-lg font-bold text-blue-200 mb-4" style={{fontWeight: 700}}>
                  완료된 일정
                </h3>
                <div className="space-y-3">
                  {completedItems.map((item) => (
                    <DraggableItem key={item.id} id={item.id}>
                      <div onClick={() => handleItemClick(item)}>
                        <ScheduleItemComponent item={item} />
                      </div>
                    </DraggableItem>
                  ))}
                </div>
              </DropZone>
            )}
          </DraggableList>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              바쁘다 바빠! 이사 일정 계획하기
            </p>
            <button
              onClick={openAddForm}
              className="mt-4 px-6 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
            >
              첫 일정 추가하기
            </button>
          </div>
        )}
      </div>

      {/* Form Panel */}
      <ScheduleFormPanel />

      {/* Detail Panel */}
      <ScheduleDetailPanel />
    </div>
  );
}; 