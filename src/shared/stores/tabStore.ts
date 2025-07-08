import { create } from 'zustand';

export type TabType = 'purchase' | 'schedule';

interface TabState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useTabStore = create<TabState>((set) => ({
  activeTab: 'purchase',
  setActiveTab: (tab) => set({ activeTab: tab }),
})); 