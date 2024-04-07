class ErrorHandler extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  let modifiedErr = err; // Create a new variable to hold the modified error object

  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
    modifiedErr = new ErrorHandler(message, 400);
  }
  if (err.name === "JsonWebTokenError") {
    const message = `Json Web Token is invalid, Try again!`;
    modifiedErr = new ErrorHandler(message, 400);
  }
  if (err.name === "TokenExpiredError") {
    const message = `Json Web Token is expired, Try again!`;
    modifiedErr = new ErrorHandler(message, 400);
  }
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    modifiedErr = new ErrorHandler(message, 400);
  }

  const errorMessage = modifiedErr.errors
    ? Object.values(modifiedErr.errors)
        .map((error) => error.message)
        .join(" ")
    : modifiedErr.message;

  return res.status(modifiedErr.statusCode).json({
    success: false,
    message: errorMessage,
  });
};

export default ErrorHandler;
