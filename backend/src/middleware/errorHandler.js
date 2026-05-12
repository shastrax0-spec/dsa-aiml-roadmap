export const errorHandler = (err, req, res, _next) => {
  console.error('🔥', err);
  res.status(err.status || 500).json({
    message: err.message || 'Server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
