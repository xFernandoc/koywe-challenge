export interface ErrorMessageApi {
  description: string;
  code: number;
  message: string;
}

export interface DataErrorResponseApi {
  timestamp: string;
  path: string;
  requestId: string;
  error: ErrorMessageApi;
}
