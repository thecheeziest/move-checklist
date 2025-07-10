import React from 'react';
import { TabButton } from '../shared/components/TabButton';
import { useTabStore, type TabType } from '../shared/stores/tabStore';

export const TabNavigation: React.FC = () => {
  const { activeTab, setActiveTab } = useTabStore();

  const tabs = [
    { id: 'purchase' as TabType, label: '구입', color: 'pink' as const },
    { id: 'schedule' as TabType, label: '일정', color: 'green' as const },
  ];

  return (
    <div className="flex justify-center mb-0">
      <div className="flex">
        {tabs.map((tab, index) => (
          <TabButton
            key={tab.id}
            isActive={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            color={tab.color}
            isLast={index === tabs.length - 1}
          >
            {tab.label}
          </TabButton>
        ))}
      </div>
    </div>
  );
}; 