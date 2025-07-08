import { 
  CreateScheduleRequest, 
  UpdateScheduleRequest, 
  ApiResponse, 
  ApiListResponse, 
  ScheduleResponse 
} from '@/types/api';

const API_BASE_URL = '/api/schedule';

// 모든 일정 조회
export const fetchScheduleItems = async (): Promise<ScheduleResponse[]> => {
  const response = await fetch(API_BASE_URL);
  const result: ApiListResponse<ScheduleResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch schedule items');
  }
  
  return result.data || [];
};

// 특정 일정 조회
export const fetchScheduleItem = async (id: string): Promise<ScheduleResponse> => {
  const response = await fetch(`${API_BASE_URL}/${id}`);
  const result: ApiResponse<ScheduleResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to fetch schedule item');
  }
  
  return result.data!;
};

// 새로운 일정 생성
export const createScheduleItem = async (data: CreateScheduleRequest): Promise<ScheduleResponse> => {
  const response = await fetch(API_BASE_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result: ApiResponse<ScheduleResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to create schedule item');
  }
  
  return result.data!;
};

// 일정 수정
export const updateScheduleItem = async (id: string, data: UpdateScheduleRequest): Promise<ScheduleResponse> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });
  
  const result: ApiResponse<ScheduleResponse> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to update schedule item');
  }
  
  return result.data!;
};

// 일정 삭제
export const deleteScheduleItem = async (id: string): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/${id}`, {
    method: 'DELETE',
  });
  
  const result: ApiResponse<void> = await response.json();
  
  if (!result.success) {
    throw new Error(result.error || 'Failed to delete schedule item');
  }
}; 