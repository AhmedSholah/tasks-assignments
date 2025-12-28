class AppError extends Error {
  statusCode?: number;
  statusText?: string;

  constructor() {
    super();
  }

  create(message: string, statusCode: number, statusText: string): AppError {
    this.message = message;
    this.statusCode = statusCode;
    this.statusText = statusText;
    return this;
  }
}

export default new AppError();
