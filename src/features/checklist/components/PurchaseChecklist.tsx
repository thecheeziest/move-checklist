import React, { useEffect } from 'react';
import { useChecklistStore } from '../../../shared/stores/checklistStore';
import { ChecklistItem } from './ChecklistItem';
import { AddItemButton } from './AddItemButton';
import { PurchaseFormPanel } from './PurchaseFormPanel';
import { DetailPanel } from './DetailPanel';
import { DraggableList } from '../../../shared/components/DraggableList';
import { DraggableItem } from '../../../shared/components/DraggableItem';
import { DropZone } from '../../../shared/components/DropZone';
import { LoadingSpinner } from '../../../shared/components/LoadingSpinner';

export const PurchaseChecklist: React.FC = () => {
  const {
    items,
    openAddForm,
    reorderItems,
    moveToCompleted,
    moveToPlanned,
    fetchItems,
    isLoading,
    error,
    selectItem,
    openDetailPanel,
    clearError,
  } = useChecklistStore();

  useEffect(() => {
    fetchItems().catch((e) => {
      window.alert('구입 리스트를 불러오는 중 오류가 발생했습니다: ' + e.message);
    });
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (error) {
      window.alert(error);
      clearError();
    }
  }, [error, clearError]);

  const handleItemClick = (item: any) => {
    selectItem(item);
    openDetailPanel();
    // 필요시 DETAIL API 호출 추가 가능
  };

  const purchasedItems = items.filter(item => item.isPurchased);
  const pendingItems = items.filter(item => !item.isPurchased);

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Add Button */}
      <AddItemButton onClick={openAddForm} />

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-full bg-white">
            <LoadingSpinner size="lg" />
          </div>
        ) : items.length > 0 ? (
          <DraggableList onReorder={reorderItems} onMoveToCompleted={moveToCompleted} onMoveToPlanned={moveToPlanned} items={items}>
            {/* Pending Items */}
            {pendingItems.length > 0 && (
              <div className="mr-[10px]">
                <DropZone id="pending" className="mt-6">
                  <h3 className="text-lg font-bold text-blue-200 mb-4" style={{fontWeight: 700}}>
                    구입 예정
                  </h3>
                  <div className="space-y-3">
                    {pendingItems.map((item) => (
                      <DraggableItem key={item.id} id={item.id}>
                        <div onClick={() => handleItemClick(item)}>
                          <ChecklistItem item={item} />
                        </div>
                      </DraggableItem>
                    ))}
                  </div>
                </DropZone>
              </div>
            )}

            {/* Purchased Items */}
            {purchasedItems.length > 0 && (
              <div className="mr-[10px]">
                <DropZone id="completed" className="mt-12">
                  <h3 className="text-lg font-bold text-blue-200 mb-4" style={{fontWeight: 700}}>
                    구입 완료
                  </h3>
                  <div className="space-y-3">
                    {purchasedItems.map((item) => (
                      <DraggableItem key={item.id} id={item.id}>
                        <div onClick={() => handleItemClick(item)}>
                          <ChecklistItem item={item} />
                        </div>
                      </DraggableItem>
                    ))}
                  </div>
                </DropZone>
              </div>
            )}
          </DraggableList>
        ) : (
          /* Empty State */
          <div className="flex flex-col items-center justify-center h-full">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg">
              뭘 사야 잘 샀다고 소문이 날까?
            </p>
            <button
              onClick={openAddForm}
              className="mt-4 px-6 py-2 bg-yellow-100 text-yellow-600 rounded-lg hover:bg-yellow-200 transition-colors duration-200"
            >
              첫 항목 추가하기
            </button>
          </div>
        )}
      </div>

      {/* Form Panel */}
      <PurchaseFormPanel />

      {/* Detail Panel */}
      <DetailPanel />
    </div>
  );
}; 