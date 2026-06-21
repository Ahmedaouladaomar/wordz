export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export enum SortOrder {
  ASC = "ASC",
  DESC = "DESC",
}
