import { create } from 'zustand';
import {
  fetchScheduleItems,
  createScheduleItem,
  updateScheduleItem,
  deleteScheduleItem,
  updateScheduleOrder
} from '../api/schedule';
import type { CreateScheduleRequest, UpdateScheduleRequest } from '@/types/api';

export type ScheduleStatus = '예정' | '완료';

export interface ScheduleItem {
  id: string;
  date: string;
  time?: string;
  status: ScheduleStatus;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
  order: number;
}

interface ScheduleFormState {
  date: string;
  time: string;
  status: ScheduleStatus;
  description: string;
}

interface ScheduleStore {
  items: ScheduleItem[];
  selectedItem: ScheduleItem | null;
  isDetailPanelOpen: boolean;
  isAddFormOpen: boolean;
  scheduleForm: ScheduleFormState;
  loading: boolean;
  error: string | null;

  // Actions
  loadItems: () => Promise<void>;
  addItem: (formData: ScheduleFormState) => Promise<void>;
  updateItem: (id: string, formData: ScheduleFormState) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  selectItem: (item: ScheduleItem | null) => void;
  openDetailPanel: () => void;
  closeDetailPanel: () => void;
  openAddForm: () => void;
  closeAddForm: () => void;
  updateScheduleForm: (field: keyof ScheduleFormState, value: string) => void;
  resetScheduleForm: () => void;
  reorderItems: (oldIndex: number, newIndex: number) => void;
  moveToCompleted: (id: string) => Promise<void>;
  moveToPlanned: (id: string) => Promise<void>;
  clearError: () => void;
}

const initialScheduleForm: ScheduleFormState = {
  date: new Date().toISOString().split('T')[0],
  time: '',
  status: '예정',
  description: '',
};

export const useScheduleStore = create<ScheduleStore>((set, get) => ({
  items: [],
  selectedItem: null,
  isDetailPanelOpen: false,
  isAddFormOpen: false,
  scheduleForm: initialScheduleForm,
  loading: false,
  error: null,

  loadItems: async () => {
    set({ loading: true, error: null });
    try {
      const items = (await fetchScheduleItems())
        .map((item) => ({
          ...item,
          status: item.status as ScheduleStatus,
          completed: item.status === '완료',
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
        .sort((a, b) => a.order - b.order); // order 기준 정렬 보장
      set({ items, loading: false });
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다', loading: false });
    }
  },

  addItem: async (formData: ScheduleFormState) => {
    set({ loading: true, error: null });
    try {
      const req: CreateScheduleRequest = {
        date: formData.date,
        time: formData.time,
        status: formData.status,
        description: formData.description,
      };
      const newItemRaw = await createScheduleItem(req);
      const newItem: ScheduleItem = {
        ...newItemRaw,
        status: newItemRaw.status as ScheduleStatus,
        completed: newItemRaw.status === '완료',
        createdAt: new Date(newItemRaw.createdAt),
        updatedAt: new Date(newItemRaw.updatedAt),
        order: 0,
      };
      set((state) => ({
        items: [newItem, ...state.items.map(i => ({ ...i, order: i.order + 1 }))], // 항상 맨 위로
        loading: false,
      }));
      get().resetScheduleForm();
      get().closeAddForm();
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다', loading: false });
    }
  },

  updateItem: async (id: string, formData: ScheduleFormState) => {
    set({ loading: true, error: null });
    try {
      const req: UpdateScheduleRequest = {
        id,
        date: formData.date,
        time: formData.time,
        status: formData.status,
        description: formData.description,
      };
      const updatedRaw = await updateScheduleItem(id, req);
      const updated: ScheduleItem = {
        ...updatedRaw,
        status: updatedRaw.status as ScheduleStatus,
        completed: updatedRaw.status === '완료',
        createdAt: new Date(updatedRaw.createdAt),
        updatedAt: new Date(updatedRaw.updatedAt),
      };
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updated : item)),
        loading: false,
        isAddFormOpen: false,
        isDetailPanelOpen: false,
        selectedItem: null,
      }));
      window.alert('일정을 수정했어요 ! !');
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('400')) {
        window.alert('잘못 입력햇다 햇짠아 ! ! !');
      } else if (e instanceof Error && e.message.includes('500')) {
        window.alert('서버가 주것습니다 -- ;;');
      } else {
        window.alert('먼지 모를 오류라네요');
      }
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다', loading: false });
    }
  },

  deleteItem: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await deleteScheduleItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        loading: false,
      }));
    } catch (e: unknown) {
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다', loading: false });
    }
  },

  toggleItem: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    const newStatus: ScheduleStatus = item.status === '예정' ? '완료' : '예정';
    await get().updateItem(id, {
      date: item.date,
      time: item.time || '',
      status: newStatus,
      description: item.description,
    });
  },

  selectItem: (item: ScheduleItem | null) => {
    set({ selectedItem: item });
  },

  openDetailPanel: () => {
    set({ isDetailPanelOpen: true });
  },

  closeDetailPanel: () => {
    set({ isDetailPanelOpen: false, selectedItem: null });
  },

  openAddForm: () => {
    set({ isAddFormOpen: true });
  },

  closeAddForm: () => {
    set({ isAddFormOpen: false, selectedItem: null });
    get().resetScheduleForm();
  },

  updateScheduleForm: (field: keyof ScheduleFormState, value: string) => {
    set((state) => ({
      scheduleForm: {
        ...state.scheduleForm,
        [field]: value,
      },
    }));
  },

  resetScheduleForm: () => {
    set({ scheduleForm: initialScheduleForm });
  },

  reorderItems: async (oldIndex: number, newIndex: number) => {
    set((state) => {
      const newItems = [...state.items];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      // order 필드 재정렬
      newItems.forEach((item, idx) => (item.order = idx));
      // 서버에 순서 반영
      updateScheduleOrder(newItems.map(item => item.id));
      return { items: newItems };
    });
  },

  moveToCompleted: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    await get().updateItem(id, {
      date: item.date,
      time: item.time || '',
      status: '완료',
      description: item.description,
    });
  },

  moveToPlanned: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    await get().updateItem(id, {
      date: item.date,
      time: item.time || '',
      status: '예정',
      description: item.description,
    });
  },

  clearError: () => {
    set({ error: null });
  },
})); 