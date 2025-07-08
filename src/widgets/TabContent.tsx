import React from 'react';
import { useTabStore } from '../shared/stores/tabStore';
import { PurchaseChecklist } from '../features/checklist/components/PurchaseChecklist';
import { ScheduleChecklist } from '../features/schedule/components/ScheduleChecklist';

export const TabContent: React.FC = () => {
  const { activeTab } = useTabStore();

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 border-t-0 flex-1 flex flex-col min-h-0 p-6">
      <div className="flex-1 flex flex-col min-h-0">
        {activeTab === 'purchase' && (
          <PurchaseChecklist />
        )}
        
        {activeTab === 'schedule' && (
          <ScheduleChecklist />
        )}
      </div>
    </div>
  );
}; 