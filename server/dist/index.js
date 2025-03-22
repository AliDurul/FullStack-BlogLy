"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const dbConnection_1 = require("./configs/dbConnection");
const authentication_1 = __importDefault(require("./middlewares/authentication"));
// import logger from './middlewares/logger';
const queryHandler_1 = __importDefault(require("./middlewares/queryHandler"));
const routes_1 = __importDefault(require("./routes"));
const errorHandler_1 = require("./middlewares/errorHandler");
/* ------------------------------------------------------- */
//* Requireds:
const app = (0, express_1.default)();
// Load environment variables:
(0, dotenv_1.config)();
// Enable CORS:
app.use((0, cors_1.default)());
const HOST = ((_a = process.env) === null || _a === void 0 ? void 0 : _a.HOST) || '127.0.0.1';
const PORT = ((_b = process.env) === null || _b === void 0 ? void 0 : _b.PORT) || 8000;
// Catch async errors:
require("express-async-errors");
// Database Connection:
(0, dbConnection_1.dbConnection)();
/* ------------------------------------------------------- */
//* Middlewares:
// Parse JSON bodies:
app.use(express_1.default.json());
// Static files:
app.use('/uploads', express_1.default.static('uploads'));
// Authentication:
app.use(authentication_1.default);
// Logger:
// app.use(logger);
// Query Handler:
app.use(queryHandler_1.default);
/* ------------------------------------------------------- */
//* Routes:
// HomePath:
app.all('/', (req, res) => {
    res.send({
        error: false,
        message: 'Welcome to BlogLy API',
        documents: {
            swagger: '/documents/swagger',
            redoc: '/documents/redoc',
            json: '/documents/json',
        }
    });
});
// API Routes:
app.use('/api', routes_1.default);
// Not Found:
app.use('*', (req, res) => {
    res.status(404).send({
        error: true,
        message: 'Route Not Found',
    });
});
// Error Handler:
app.use(errorHandler_1.errorHandler);
app.listen(PORT, () => console.log(`Server runing at: http://localhost:${PORT}`));
//# sourceMappingURL=index.js.map