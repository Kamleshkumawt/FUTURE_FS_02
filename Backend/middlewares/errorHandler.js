import { AppError } from "../utils/appError.js";

export const notFound = (req, res, next) => {
  next(new AppError(`Route not found - ${req.originalUrl}`, 404, "ROUTE_NOT_FOUND"));
};


export const errorHandler = (err, req, res, next) => {
  if (process.env.NODE_ENV !== "production") {
    console.error("🚨 Error:", err);
  }


  const statusCode = err.statusCode && !isNaN(err.statusCode) ? err.statusCode : 500;
  const errorCode = err.errorCode || "SERVER_ERROR";
  const message =
    err instanceof AppError
      ? err.message
      : statusCode === 500
      ? "Internal Server Error. Please try again later."
      : err.message || "An unexpected error occurred.";

  const errorResponse = {
    success: false,
    statusCode,
    errorCode,
    message,
    path: req.originalUrl,
    method: req.method,
    timestamp: new Date().toISOString(),
  };

  if (process.env.NODE_ENV !== "production" && err.stack) {
    errorResponse.stack = err.stack;
  }

  res.status(statusCode).json(errorResponse);
};


export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
