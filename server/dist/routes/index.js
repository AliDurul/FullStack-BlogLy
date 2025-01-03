"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const upload_1 = __importDefault(require("./upload"));
const router = (0, express_1.Router)();
/* ------------------------------------------------------- */
router.use('/auth', auth_1.default);
router.use('/users', user_1.default);
router.use('/upload-url', upload_1.default);
// document:
// router.use('/documents', documentRoutes);
/* ------------------------------------------------------- */
exports.default = router;
