const jwt = require("jsonwebtoken");
const logger = require("./logger");

const requestLogger = (request, _response, next) => {
  logger.info("Method:", request.method);
  logger.info("Path:  ", request.path);
  logger.info("Body:  ", request.body);
  logger.info("---");
  next();
};

const unknownEndpoint = (_request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const errorHandler = (error, _request, response, next) => {
  logger.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
  if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message });
  }
  if (error.name === "JsonWebTokenError") {
    return response.status(401).json({
      error: "invalid token",
    });
  }
  if (error.name === "TokenExpiredError") {
    return response.status(401).json({
      error: "token expired",
    });
  }

  return next(error);
};

function getJwtFromHeader(request, response, next) {
  const authorizationHeader = request.get("authorization");
  if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
    request.token = authorizationHeader.replace("Bearer ", "");
  }
  return next();
}

function userExtractor(request, response, next) {
  try {
    const decodedToken = jwt.verify(request.token, process.env.JWT_SECRET);
    if (!decodedToken.id) {
      return response.status(401).json({ error: "token invalid" });
    }
    request.user = decodedToken;
    return next();
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler,
  getJwtFromHeader,
  userExtractor,
};
