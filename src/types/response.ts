export enum ResponseCode {
  SUCCESS = 0,
  ERROR = 1,
}

export interface ApiResponse<T> {
  code: ResponseCode;
  message: string;
  data: T;
} 