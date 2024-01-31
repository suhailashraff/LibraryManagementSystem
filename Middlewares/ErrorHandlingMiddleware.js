const { AppError } = require("../ErrrorHandlers/AppError");
const app = require("../app");

const undefinedRoutes =
  ("*",
  (req, res, next) => {
    return next(
      new AppError(`Can't find ${req.originalUrl} on this server`, 401)
    );
  });

module.exports = undefinedRoutes;
