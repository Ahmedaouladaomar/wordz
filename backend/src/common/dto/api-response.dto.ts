export class ApiResponseDto<T> {
  data: T;
  message: string;

  constructor(data: T, message: string = 'success') {
    this.data = data;
    this.message = message;
  }
}
