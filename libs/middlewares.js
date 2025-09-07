import mongoose from "mongoose";

const checkDBConnection = (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({
      success: false,
      message: "Database connection error. Please try again later.",
    });
  }
  next();
};



const isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }

  if (req.originalUrl.startsWith("/api")) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  res.redirect("/");
};

const asyncHandler = (fn) => {
    return (req, res, next) => {
        return Promise
            .resolve(fn(req, res, next))
            .catch(next)
    }
}

export {
    asyncHandler,
    isLoggedIn,
    checkDBConnection
}