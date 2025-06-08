function asyncHandler(cb) {
  return async (req, res, next) => {
    try {
      await cb(req, res, next);
    } catch (error) {
      return res.status(500).json({
        message: "Internal Server Error",
        error: process.env.NODE_ENV == "development" ? error.message : "",
      });
    }
  };
}

export default asyncHandler;
