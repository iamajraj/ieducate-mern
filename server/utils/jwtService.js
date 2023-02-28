const jwt = require("jsonwebtoken");

const jwtSign = (payload) => {
    return jwt.sign(payload, process.env.JWT_SECRET);
};

const jwtVerify = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET);
};

module.exports = {
    jwtSign,
    jwtVerify,
};
