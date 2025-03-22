"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isLogin = void 0;
const utils_1 = require("../helpers/utils");
const isLogin = (req, res, next) => {
    const user = req.user;
    if (process.env.NODE_ENV === 'production' && !user) {
        throw new utils_1.CustomError('You are not authorized to access this resource', 401);
    }
    next();
};
exports.isLogin = isLogin;
//# sourceMappingURL=permissions.js.map