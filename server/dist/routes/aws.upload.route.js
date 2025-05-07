"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const aws_upload_1 = require("../utils/aws.upload");
const common_1 = require("../utils/common");
const router = (0, express_1.Router)();
// URL: /upload-url
router.get('/', async (req, res) => {
    const url = await (0, aws_upload_1.generateUploadUrl)();
    if (!url)
        throw new common_1.CustomError('Error while generating upload URL.', 500, true);
    res.status(200).json({ uploadURL: url });
});
exports.default = router;
//# sourceMappingURL=aws.upload.route.js.map