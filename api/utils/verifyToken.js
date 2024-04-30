const jwt  = require('jsonwebtoken');
const { errorHandler } = require('./error');
const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(errorHandler("Unauthorized", 401));
    }
    jwt.verify(token, process.env.KEY, (err, user) => {
        if (err) {
            return next(errorHandler("Unauthorized", 401));
        }
        req.user = user;
    });
    next();
}

module.exports = verifyToken;