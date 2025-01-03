"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
const { list, read, update, deletee } = require('../controllers/user');
// URL: /users
router.route('/')
    .get(list);
router.route('/:id')
    .get(read)
    .put(update)
    .patch(update)
    .delete(deletee);
exports.default = router;
