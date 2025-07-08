// Purchase Item Types
export interface CreatePurchaseRequest {
  category: string;
  brand?: string;
  title: string;
  price: string;
  purchasedDate?: string;
  isPurchased: boolean;
  option?: string;
  memo?: string;
  url?: string;
}

export interface UpdatePurchaseRequest extends Partial<CreatePurchaseRequest> {
  id: string;
}

export interface PurchaseResponse {
  id: string;
  category: string;
  brand?: string;
  title: string;
  price: string;
  purchasedDate?: string;
  isPurchased: boolean;
  option?: string;
  memo?: string;
  url?: string;
  createdAt: string;
  updatedAt: string;
}

// Schedule Item Types
export interface CreateScheduleRequest {
  date: string;
  time?: string;
  status: string;
  description: string;
}

export interface UpdateScheduleRequest extends Partial<CreateScheduleRequest> {
  id: string;
}

export interface ScheduleResponse {
  id: string;
  date: string;
  time?: string;
  status: string;
  description: string;
  completed: boolean;
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ApiListResponse<T> {
  success: boolean;
  data?: T[];
  error?: string;
} 