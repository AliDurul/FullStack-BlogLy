"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logout = exports.refresh = exports.register = exports.login = void 0;
const user_1 = __importDefault(require("../models/user"));
const utils_1 = require("../helpers/utils");
const passwordEncrypt_1 = __importDefault(require("../helpers/passwordEncrypt"));
const utils_2 = require("../helpers/utils");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("express-async-errors");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Login"
        #swagger.description = 'Login with username (or email) and password for get Token and JWT.'
        #swagger.parameters["body"] = {
            in: "body",
            required: true,
            schema: {
                "username": "test",
                "password": "1234",
            }
        }
    */
    const { email, password } = req.body;
    if (!(email && password))
        throw new utils_1.CustomError('Please enter username/email and password.', 401);
    const user = yield user_1.default.findOne({ 'personal_info.email': email }).lean();
    if (!user)
        throw new utils_1.CustomError('User not found.', 404);
    if ((user === null || user === void 0 ? void 0 : user.personal_info.password) !== (0, passwordEncrypt_1.default)(password))
        throw new utils_1.CustomError('Wrong username/email or password.', 401);
    res.status(200).send((0, utils_2.SetToken)(user));
});
exports.login = login;
const register = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Create User"
        #swagger.description = `
            Password Format Type: It must has min.1 lowercase, min.1 uppercase, min.1 number and min.1 specialChars.
        `
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                "username": "test",
                "password": "1234",
                "email": "test@site.com",
                "firstName": "test",
                "lastName": "test",
            }
        }
    */
    const { fullname, email, password } = req.body;
    let user;
    if (req.body.sub) {
        const { sub, fullname, email, picture, } = req.body;
        user = yield user_1.default.findOne({ user_id: sub });
        if (user)
            return;
        user = yield user_1.default.create({ user_id: sub, OAuth: true, personal_info: { fullname, email, profile_img: picture, username: yield (0, utils_2.generateUsername)(email) } });
    }
    else {
        if (!(fullname && email && password))
            throw new utils_1.CustomError('Please fill all fields.', 400);
        if (!/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,20}$/.test(password))
            throw new utils_1.CustomError('Password must be between 6 to 20 characters and include at least one numeric digit, one uppercase and one lowercase letter.', 400);
        const username = yield (0, utils_2.generateUsername)(email);
        user = yield user_1.default.create({ personal_info: { fullname, email, password: (0, passwordEncrypt_1.default)(password), username } });
    }
    res.status(201).send((0, utils_2.SetToken)(user));
});
exports.register = register;
const refresh = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ['Authentication']
        #swagger.summary = 'JWT: Refresh'
        #swagger.description = 'Refresh access-token by refresh-token.'
        #swagger.parameters['body'] = {
            in: 'body',
            required: true,
            schema: {
                bearer: {
                    refresh: '___refreshToken___'
                }
            }
        }
    */
    var _a;
    const refreshToken = (_a = req.body) === null || _a === void 0 ? void 0 : _a.refresh;
    if (!refreshToken)
        throw new utils_1.CustomError('Please enter token.refresh', 401);
    const refreshKey = process.env.REFRESH_KEY;
    if (!refreshKey)
        throw new utils_1.CustomError('Refresh key is not defined.', 422);
    jsonwebtoken_1.default.verify(refreshToken, refreshKey, function (err, userData) {
        return __awaiter(this, void 0, void 0, function* () {
            if (err) {
                throw err;
            }
            else {
                const { user_id } = userData;
                if (!user_id)
                    throw new utils_1.CustomError('In token user_id  not found.', 404);
                const user = yield user_1.default.findOne({ user_id }).lean();
                if (!user)
                    throw new utils_1.CustomError('User not found.', 404);
                res.status(200).send((0, utils_2.SetToken)(user, true));
            }
        });
    });
});
exports.refresh = refresh;
const logout = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Authentication"]
        #swagger.summary = "Token: Logout"
        #swagger.description = 'Delete token-key.'
    */
    res.send({
        error: false,
        message: 'Logout success.',
    });
});
exports.logout = logout;
//# sourceMappingURL=auth.js.map