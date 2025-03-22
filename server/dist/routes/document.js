"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const redoc_express_1 = __importDefault(require("redoc-express"));
const router = (0, express_1.Router)();
// Json
router.use('/json', (req, res) => {
    res.sendFile('/src/configs/swagger.json', { root: '.' });
});
// Swagger
router.use('/swagger', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(require('../configs/swagger.json'), { swaggerOptions: { persistAuthorization: true } }));
// Redoc
router.use('/redoc', (0, redoc_express_1.default)({ specUrl: '/documents/json', title: "BlogLy API" }));
exports.default = router;
//# sourceMappingURL=document.js.map