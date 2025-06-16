"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.queryHandler = exports.authenticate = exports.isValidated = exports.notFound = void 0;
exports.errorHandler = errorHandler;
exports.logger = logger;
const email_templates_1 = require("../utils/email.templates");
const common_1 = require("../utils/common");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../configs/env");
const node_path_1 = __importDefault(require("node:path"));
const morgan_1 = __importDefault(require("morgan"));
const node_fs_1 = __importDefault(require("node:fs"));
// ===============================
// 1. 404 NOT FOUND MIDDLEWARE
// ===============================
const notFound = (req, res, next) => {
    const error = new common_1.CustomError(`Not Found - ${req.originalUrl}`, 404, true);
    next(error);
};
exports.notFound = notFound;
// ===============================
// 2. ERROR HANDLER MIDDLEWARE
// ===============================
async function errorHandler(err, req, res, next) {
    let error = { ...err };
    error.message = err.message || "Something went wrong";
    error.statusCode = err.statusCode || 500;
    error.cause = err.cause || null;
    error.isOperational = err.isOperational || false;
    error.stack = err.stack || null;
    // Mongoose bad ObjectId error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new Error(message);
        error.statusCode = 404;
    }
    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // Get the field name dynamically
        const value = err.keyValue[field]; // Get the corresponding value
        const message = `Duplicate field value entered: ${field} (${value})`;
        error = new Error(message);
        error.statusCode = 400;
    }
    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val) => val.message).join(", ");
        error = new Error(message);
        error.statusCode = 400;
    }
    // isTrusted error
    if (!(err instanceof common_1.CustomError && error.isOperational)) {
        await (0, common_1.sendMail)({ to: 'alidrl26@gmail.com', subject: 'Error Occurred', tempFn: email_templates_1.errorEmailTemp, data: error });
        // process.exit(1);
        // console.log('untrusted error: ', error);
    }
    // console.log('Error Handler: ', error);
    res.status(error.statusCode).send({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
        cause: error.cause || null,
    });
}
// ===============================
// 3. ZOD VALIDATION MIDDLEWARE
// ===============================
const isValidated = (schema, target = "body") => {
    if (!schema)
        throw new common_1.CustomError("Schema is required", 500);
    return (req, res, next) => {
        const data = req[target];
        const parseResult = schema.safeParse(data);
        if (!parseResult.success) {
            const errors = parseResult.error.errors
                .map(error => `"${error.path.join(".")}": ${error.message}`)
                .join(", ");
            return next(new common_1.CustomError(errors, 400, true));
        }
        // req[target] = data; //! 'Cannot set property query of #<IncomingMessage> which has only a getter'
        next();
    };
};
exports.isValidated = isValidated;
// ===============================
// 4. MORGAN LOGGER MIDDLEWARE
// ===============================
function logger() {
    const logsDir = node_path_1.default.join(process.cwd(), "logs");
    if (!node_fs_1.default.existsSync(logsDir)) {
        console.log("Logs folder has been created at root directory");
        node_fs_1.default.mkdirSync(logsDir, { recursive: true });
    }
    const customFormat = 'TIME=":date[iso]" - URL=":url" - Method=":method" - IP=":remote-addr" - Ref=":referrer" - Status=":status" - Sign=":user-agent" (:response-time[digits] ms)';
    const today = new Date().toISOString().split('T')[0];
    return (0, morgan_1.default)(customFormat, {
        stream: node_fs_1.default.createWriteStream(node_path_1.default.join(logsDir, `${today}.log`), { flags: "a+" }),
    });
}
;
const authenticate = async (req, res, next) => {
    const auth = req.headers?.authorization;
    const tokenParts = auth?.split(" ") || [];
    req.user = null;
    if (tokenParts[0] === "Bearer" && tokenParts[1]) {
        jsonwebtoken_1.default.verify(tokenParts[1], env_1.ENV.jwtSecret, (err, userData) => {
            if (err) {
                return next(new common_1.CustomError("Invalid or expired token, Plesase login again.", 401, true));
            }
            req.user = userData;
        });
    }
    next();
};
exports.authenticate = authenticate;
const queryHandler = (req, res, next) => {
    // URL?filter[key1]=value1&filter[key2]=value2
    const filter = req.query?.filter || {};
    // URL?search[key1]=value1&search[key2]=value2
    // const search = (req.query?.search as Record<string, any>) || {};
    // for (let key in search as Record<string, any>) {
    //     if (typeof search[key] === "string") {
    //         search[key] = { $regex: search[key], $options: "i" };
    //     }
    // };
    const search = req.query?.search ? { title: new RegExp(req.query?.search, 'i') } : {};
    // URL?sort[key1]=asc&sort[key2]=desc
    const rawSort = req.query?.sort || {};
    const sort = {};
    if (typeof rawSort === "object" && !Array.isArray(rawSort)) {
        for (const key in rawSort) {
            const value = rawSort[key];
            if (value === "asc" || value === "desc") {
                sort[key] = value;
            }
        }
    }
    // URL?page=3&limit=10
    let limit = parseInt(req.query?.limit);
    limit = limit > 0 ? limit : parseInt((process.env.PAGE_SIZE || "20"));
    let page = parseInt(req.query?.page);
    page = page > 0 ? (page - 1) : 0;
    let skip = parseInt(req.query?.skip);
    skip = skip > 0 ? skip : (page * limit);
    // List
    res.getModelList = async (Model, customFilter = {}, populate = null) => {
        const query = {
            ...(typeof filter === "object" && filter),
            ...(typeof search === "object" && search),
            ...(typeof customFilter === "object" && customFilter),
        };
        return await Model.find(query).sort(sort).skip(skip).limit(limit).populate(populate).exec();
    };
    // Details:
    res.getModelListDetails = async (Model, customFilter = {}) => {
        const query = {
            ...(typeof filter === "object" && filter),
            ...(typeof search === "object" && search),
            ...(typeof customFilter === "object" && customFilter),
        };
        const count = await Model.countDocuments(query).lean();
        return {
            filter,
            search,
            sort,
            skip,
            limit,
            page,
            totolRecords: count,
            pages: count <= limit
                ? false
                : {
                    previous: page > 1 ? page - 1 : false,
                    current: page,
                    next: page < Math.ceil(count / limit) ? page + 1 : false,
                    total: Math.ceil(count / limit),
                },
        };
    };
    next();
};
exports.queryHandler = queryHandler;
//# sourceMappingURL=common.js.map