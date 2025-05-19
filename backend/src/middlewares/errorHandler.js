function errorHandler(err, req, res, next) {
  console.error(err.message);

  if (err.type === 'NotFoundError') {
    return res.status(404).json({ message: err.message });
  }

  if (err.type === 'ValidationError') {
    return res.status(400).json({ message: err.message });
  }

  return res.status(500).json({ 
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
}

module.exports = errorHandler;
