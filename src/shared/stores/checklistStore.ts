import { create } from 'zustand';
import { 
  fetchPurchaseItems, 
  createPurchaseItem, 
  updatePurchaseItem, 
  deletePurchaseItem, 
  updatePurchaseOrder // 추가
} from '../api/purchase';
import type { CreatePurchaseRequest, UpdatePurchaseRequest } from '@/types/api';

export type PurchaseCategory = '가구' | '가전' | '소품' | '정리' | '식기' | '렌트' | '기타';

export interface ChecklistItem {
  id: string;
  category: PurchaseCategory;
  brand?: string;
  title: string;
  price: string;
  purchasedDate?: string;
  isPurchased: boolean;
  option?: string;
  memo?: string;
  url?: string;
  createdAt: Date;
  updatedAt: Date;
  order: number; // 추가
}

interface PurchaseFormState {
  category: PurchaseCategory;
  brand: string;
  title: string;
  price: string;
  purchasedDate: string;
  isPurchased: boolean;
  option: string;
  memo: string;
  url: string;
}

// 천 단위 쉼표 추가 함수
const formatPrice = (price: string | number): string => {
  const numPrice = typeof price === 'string' ? parseInt(price.replace(/,/g, '')) : price;
  return numPrice.toLocaleString();
};

interface ChecklistStore {
  items: ChecklistItem[];
  selectedItem: ChecklistItem | null;
  isDetailPanelOpen: boolean;
  isAddFormOpen: boolean;
  purchaseForm: PurchaseFormState;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchItems: () => Promise<void>;
  addItem: (formData: PurchaseFormState) => Promise<void>;
  updateItem: (id: string, item: Partial<Record<string, unknown>>, showAlert: boolean) => Promise<void>;
  deleteItem: (id: string) => Promise<void>;
  toggleItem: (id: string) => Promise<void>;
  selectItem: (item: ChecklistItem | null) => void;
  openDetailPanel: () => void;
  closeDetailPanel: () => void;
  openAddForm: () => void;
  closeAddForm: () => void;
  updatePurchaseForm: (field: keyof PurchaseFormState, value: string | boolean) => void;
  resetPurchaseForm: () => void;
  reorderItems: (oldIndex: number, newIndex: number) => void;
  moveToCompleted: (id: string) => Promise<void>;
  moveToPlanned: (id: string) => Promise<void>;
  clearError: () => void;
}

const initialPurchaseForm: PurchaseFormState = {
  category: '기타',
  brand: '',
  title: '',
  price: '',
  purchasedDate: '',
  isPurchased: false,
  option: '',
  memo: '',
  url: '',
};

export const useChecklistStore = create<ChecklistStore>((set, get) => ({
  items: [],
  selectedItem: null,
  isDetailPanelOpen: false,
  isAddFormOpen: false,
  purchaseForm: initialPurchaseForm,
  isLoading: false,
  error: null,

  fetchItems: async () => {
    set({ isLoading: true, error: null });
    try {
      const items = (await fetchPurchaseItems())
        .map((item) => ({
          ...item,
          category: item.category as PurchaseCategory,
          price: formatPrice(item.price),
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }))
        .sort((a, b) => a.order - b.order); // order 기준 정렬 보장
      set({ items, isLoading: false });
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('500')) {
        window.alert('서버가 주것습니다 -- ;;');
      } else {
        window.alert(e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다');
      }
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다', isLoading: false });
    }
  },

  addItem: async (formData: PurchaseFormState) => {
    set({ isLoading: true, error: null });
    try {
      const req: CreatePurchaseRequest = {
        category: formData.category,
        brand: formData.brand || undefined,
        title: formData.title,
        price: formData.price.replace(/,/g, ''),
        purchasedDate: formData.purchasedDate || undefined,
        isPurchased: formData.isPurchased,
        option: formData.option || undefined,
        memo: formData.memo || undefined,
        url: formData.url || undefined,
      };
      const newItemRaw = await createPurchaseItem(req);
      const newItem: ChecklistItem = {
        ...newItemRaw,
        category: newItemRaw.category as PurchaseCategory,
        price: formatPrice(newItemRaw.price),
        createdAt: new Date(newItemRaw.createdAt),
        updatedAt: new Date(newItemRaw.updatedAt),
      };
      set((state) => ({
        items: [newItem, ...state.items.map(i => ({ ...i, order: i.order + 1 }))], // 항상 맨 위로
        isLoading: false,
        isAddFormOpen: false,
        isDetailPanelOpen: false,
        selectedItem: null,
      }));
      window.alert('항목을 추가했어요 ! !');
      get().resetPurchaseForm();
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('400')) {
        window.alert('잘못 입력햇다 햇짠아 ! ! !');
      } else if (e instanceof Error && e.message.includes('500')) {
        window.alert('서버가 주것습니다 -- ;;');
      } else {
        window.alert('알 수 없는 오류가 발생했습니다');
      }
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다', isLoading: false });
    }
  },

  updateItem: async (id: string, item: Partial<Record<string, unknown>>, showAlert: boolean = true) => {
    set({ isLoading: true, error: null });
    try {
      // undefined 값들을 제거하고 실제 값만 포함
      const updateData: Partial<Record<string, unknown>> = {};
      if (item.category !== undefined) updateData.category = item.category;
      if (item.brand !== undefined) updateData.brand = item.brand;
      if (item.title !== undefined) updateData.title = item.title;
      if (item.price !== undefined) {
        const priceValue = String(item.price);
        updateData.price = priceValue.replace(/,/g, '');
      }
      if (item.purchasedDate !== undefined) updateData.purchasedDate = item.purchasedDate;
      if (item.isPurchased !== undefined) updateData.isPurchased = item.isPurchased;
      if (item.option !== undefined) updateData.option = item.option;
      if (item.memo !== undefined) updateData.memo = item.memo;
      if (item.url !== undefined) updateData.url = item.url;
      // purchasedDate가 undefined인 경우 명시적으로 null로 설정
      if (item.purchasedDate === undefined && item.isPurchased === false) {
        updateData.purchasedDate = null;
      }
      const req: UpdatePurchaseRequest = {
        id,
        ...updateData,
      };
      const updatedRaw = await updatePurchaseItem(id, req);
      const updated: ChecklistItem = {
        ...updatedRaw,
        category: updatedRaw.category as PurchaseCategory,
        price: formatPrice(updatedRaw.price), // 천 단위 쉼표 추가
        createdAt: new Date(updatedRaw.createdAt),
        updatedAt: new Date(updatedRaw.updatedAt),
      };
      set((state) => ({
        items: state.items.map((item) => (item.id === id ? updated : item)),
        isLoading: false,
        isAddFormOpen: false,
        isDetailPanelOpen: false,
        selectedItem: null,
      }));
      if (showAlert) window.alert('항목을 수정했어요 ! !');
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('400')) {
        window.alert('잘못 입력햇다 햇짠아 ! ! !');
      } else if (e instanceof Error && e.message.includes('500')) {
        window.alert('서버가 주것습니다 -- ;;');
      } else {
        window.alert('알 수 없는 오류가 발생했습니다');
      }
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다', isLoading: false });
    }
  },

  deleteItem: async (id: string) => {
    set({ isLoading: true, error: null });
    try {
      await deletePurchaseItem(id);
      set((state) => ({
        items: state.items.filter((item) => item.id !== id),
        isLoading: false,
        isAddFormOpen: false,
        isDetailPanelOpen: false,
        selectedItem: null,
      }));
      window.alert('항목을 삭제했어요.. 안녕 ~ ~');
    } catch (e: unknown) {
      if (e instanceof Error && e.message.includes('400')) {
        window.alert('잘못 입력햇다 햇짠아 ! ! !');
      } else if (e instanceof Error && e.message.includes('500')) {
        window.alert('서버가 주것습니다 -- ;;');
      } else {
        window.alert('알 수 없는 오류가 발생했습니다');
      }
      set({ error: e instanceof Error ? e.message : '알 수 없는 오류가 발생했습니다', isLoading: false });
    }
  },

  toggleItem: async (id: string) => {
    const currentItem = get().items.find(i => i.id === id);
    if (!currentItem) return;

    const newIsPurchased = !currentItem.isPurchased;
    let newPurchasedDate = currentItem.purchasedDate;

    // 체크박스가 해제되어 있는 아이템을 선택할 경우 (false -> true)
    if (newIsPurchased && !currentItem.purchasedDate) {
      // 오늘 날짜로 자동 설정
      const today = new Date().toISOString().split('T')[0];
      newPurchasedDate = today;
    }

    // 체크박스가 선택되어 있는 아이템을 해제할 경우 (true -> false)
    // purchasedDate는 그대로 유지 (삭제하지 않음)

    // isPurchased와 purchasedDate만 업데이트
    const updateData: Partial<Record<string, unknown>> = {
      isPurchased: newIsPurchased,
    };

    // purchasedDate가 변경된 경우에만 포함
    if (newPurchasedDate !== currentItem.purchasedDate) {
      updateData.purchasedDate = newPurchasedDate;
    }

    await get().updateItem(id, updateData, false); // 성공 alert 띄우지 않음
  },

  selectItem: (item: ChecklistItem | null) => {
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
    set({ isAddFormOpen: false });
    get().resetPurchaseForm();
  },

  updatePurchaseForm: (field: keyof PurchaseFormState, value: string | boolean) => {
    set((state) => ({
      purchaseForm: { ...state.purchaseForm, [field]: value },
    }));
  },

  resetPurchaseForm: () => {
    set({ purchaseForm: initialPurchaseForm });
  },

  reorderItems: async (oldIndex: number, newIndex: number) => {
    set((state) => {
      const newItems = [...state.items];
      const [removed] = newItems.splice(oldIndex, 1);
      newItems.splice(newIndex, 0, removed);
      // order 필드 재정렬
      newItems.forEach((item, idx) => (item.order = idx));
      // 서버에 순서 반영
      updatePurchaseOrder(newItems.map(item => item.id));
      return { items: newItems };
    });
  },

  moveToCompleted: async (id: string) => {
    const item = get().items.find((i) => i.id === id);
    if (!item) return;
    
    const today = new Date().toISOString().split('T')[0];
    await get().updateItem(id, {
      isPurchased: true,
      purchasedDate: today,
    }, true);
  },

  moveToPlanned: async (id: string) => {
    await get().updateItem(id, {
      isPurchased: false,
      purchasedDate: undefined,
    }, true);
  },

  clearError: () => {
    set({ error: null });
  },
})); 