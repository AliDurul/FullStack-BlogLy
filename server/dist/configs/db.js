"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = void 0;
exports.disconnectDB = disconnectDB;
const mongoose_1 = __importDefault(require("mongoose"));
const env_1 = require("./env");
// import "../models/user.model"; // Import all models here
mongoose_1.default.Promise = global.Promise; // Use ES6 promises
let isConnected = false;
const connectDB = async () => {
    if (isConnected) {
        console.log("⚠️ Already connected to MongoDB.");
        return;
    }
    try {
        await mongoose_1.default.connect(env_1.ENV.mongoDbUri, {
            maxPoolSize: 10,
            serverSelectionTimeoutMS: 5000,
        });
        isConnected = true;
        console.log("✅ Connected to MongoDB");
    }
    catch (err) {
        if (err instanceof Error)
            console.error(err.message);
        throw new Error("MongoDB connection failed.");
    }
};
exports.connectDB = connectDB;
async function disconnectDB() {
    if (!isConnected)
        return;
    try {
        await mongoose_1.default.disconnect();
        isConnected = false;
        console.log("🛑 Disconnected from MongoDB");
    }
    catch (err) {
        console.error("❌ Error during MongoDB disconnection:", err);
    }
}
;
//# sourceMappingURL=db.js.map