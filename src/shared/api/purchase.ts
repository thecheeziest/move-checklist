import { 
  CreatePurchaseRequest, 
  UpdatePurchaseRequest, 
  ApiResponse, 
  ApiListResponse, 
  PurchaseResponse 
} from '@/types/api';

const API_BASE_URL = '/api/purchase';

// 모든 구입 항목 조회
export const fetchPurchaseItems = async (): Promise<PurchaseResponse[]> => {
  const response = await fetch(API_BASE_URL);
  const result: ApiListResponse<PurchaseResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch purchase items');
  }
  
  return result.data || [];
};

// 특정 구입 항목 조회
export const fetchPurchaseItem = async (id: string): Promise<PurchaseResponse> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const result: ApiResponse<PurchaseResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch purchase item');
  }
  
  return result.data!;
};

// 새로운 구입 항목 생성
export const createPurchaseItem = async (data: CreatePurchaseRequest): Promise<PurchaseResponse> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result: ApiResponse<PurchaseResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create purchase item');
  }
  
  return result.data!;
};

// 구입 항목 수정
export const updatePurchaseItem = async (id: string, data: UpdatePurchaseRequest): Promise<PurchaseResponse> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result: ApiResponse<PurchaseResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update purchase item');
  }
  
  return result.data!;
};

// 구입 항목 삭제
export const deletePurchaseItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  
  const result: ApiResponse<void> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete purchase item');
  }
}; 