const sendError = require("../utils/sendError");
const { jwtVerify } = require("../utils/jwtService");

module.exports = (req, res, next) => {
    let token = req.headers.token;

    if (!token) return sendError(401, "Unauthenticated", res);

    if (token.startsWith("Bearer")) {
        token = token.slice(7);
    }

    const user = jwtVerify(token);

    if (!user) return sendError(401, "Token is not valid", res);

    req.user = user;

    next();
};
