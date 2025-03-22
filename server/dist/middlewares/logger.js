"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const morgan_1 = __importDefault(require("morgan"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const now = new Date();
const today = now.toISOString().split('T')[0];
const rootDirectory = node_path_1.default.resolve(__dirname, "../..");
const logDirectory = node_path_1.default.join(rootDirectory, "logs");
if (!node_fs_1.default.existsSync(logDirectory)) {
    console.log("Logs folder has been created ");
    node_fs_1.default.mkdirSync(logDirectory, { recursive: true });
}
else {
    console.log("Logs folder exists");
}
const logStream = node_fs_1.default.createWriteStream(node_path_1.default.join(logDirectory, `${today}.log`), { flags: "a+" });
exports.default = (0, morgan_1.default)("combined", {
    stream: logStream,
});
//# sourceMappingURL=logger.js.map