// middleware/jwt.middleware.js
require("dotenv").config()
const { expressjwt: jwt } = require("express-jwt");

// Function used to extract the JWT token from the request's 'Authorization' Headers
function getTokenFromHeaders(req) {
  if (
    req.headers.authorization &&
    req.headers.authorization.split(" ")[0] === "Bearer"
  ) {
    return req.headers.authorization.split(" ")[1];
  }
  return null;
}


// Instantiate the JWT token validation middleware
const isAuthenticated = jwt({
  secret: process.env.TOKEN_SECRET, // Make sure this is defined in .env
  algorithms: ["HS256"],
  requestProperty: "payload", // Will attach the decoded token as req.payload
  getToken: getTokenFromHeaders,
});

module.exports = {
  isAuthenticated,
};
