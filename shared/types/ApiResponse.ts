export type Success<T> = {
  success: true
  data: T
}
export type SuccessResponse<T> = Success<T> & {
  meta?: {
    total: number
    lastPage: number
  }
}

export type ErrorResponse = {
  success: false
  error: string
}
export type ApiResponse<T> = SuccessResponse<T> | ErrorResponse
