
export interface ApiResponse<T = any> {
  data?: T;
  error?: string | null;
  message?: string;
  success?: boolean;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  count: number;
  page: number;
  totalPages: number;
  hasMore: boolean;
}

export interface ApiError {
  message: string;
  code?: string | number;
  details?: Record<string, any>;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}

export interface AsyncState<T = any> extends LoadingState {
  data: T | null;
}
