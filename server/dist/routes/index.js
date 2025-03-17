"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const document_1 = __importDefault(require("./document"));
const auth_1 = __importDefault(require("./auth"));
const user_1 = __importDefault(require("./user"));
const router = (0, express_1.Router)();
/* ------------------------------------------------------- */
router.use('/auth', auth_1.default);
router.use('/users', user_1.default);
// document:
router.use('/documents', document_1.default);
/* ------------------------------------------------------- */
exports.default = router;
