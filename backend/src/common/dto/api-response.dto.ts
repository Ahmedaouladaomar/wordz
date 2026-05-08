export class ApiResponseDto<T> {
  data?: T;
  message?: string;
  success: boolean = true;

  constructor(data: T, message: string = 'success') {
    this.data = data;
    this.message = message;
  }
}

/**
 * Type guard to check if an object follows the ApiResponse structure.
 * Use this instead of 'instanceof' in interceptors.
 */
export const isApiResponse = (obj: any): obj is ApiResponseDto<any> => {
  return obj && typeof obj === 'object' && 'success' in obj && 'message' in obj;
};
