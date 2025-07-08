'use client';
import React from 'react';
import { TabNavigation } from '../widgets/TabNavigation';
import { TabContent } from '../widgets/TabContent';

export const MainPage: React.FC = () => {
  return (
    <div className="h-full bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col">
      {/* Header */}
      <div className="text-center py-4 flex-shrink-0 my-2 relative z-0">
        <h1 className="text-3xl font-black text-blue-200 cursor-default select-none">
          ⊹⁺⸜ C H E C K L I S T ⸝⁺⊹
        </h1>
      </div>

      {/* Content Card with Tabs */}
      <div className="flex-1 px-4 pb-4 flex flex-col min-h-0">
        <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col min-h-0">
          {/* Tab Navigation - positioned to overlap the card */}
          <div className="relative z-10 flex-shrink-0">
            <TabNavigation />
          </div>
          
          {/* Tab Content Card */}
          <div className="relative z-10 flex-1 flex flex-col min-h-0">
            <TabContent />
          </div>
        </div>
      </div>
    </div>
  );
}; 