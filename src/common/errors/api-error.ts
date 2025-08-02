export class ApiError extends Error {
  status: number;
  message: string;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.message = message;
  }

  static BadRequest(message: string) {
    return new ApiError(400, message);
  }

  static Unauthorized(message: string) {
    return new ApiError(401, message);
  }

  static Forbidden(message: string) {
    return new ApiError(403, message);
  }

  static Internal(message: string) {
    return new ApiError(500, message);
  }
}
