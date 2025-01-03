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
exports.deletee = exports.update = exports.read = exports.list = void 0;
const user_1 = __importDefault(require("../models/user"));
const list = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "List Users"
        #swagger.description = `
            You can use <u>filter[] & search[] & sort[] & page & limit</u> queries with endpoint.
            <ul> Examples:
                <li>URL/?<b>filter[field1]=value1&filter[field2]=value2</b></li>
                <li>URL/?<b>search[field1]=value1&search[field2]=value2</b></li>
                <li>URL/?<b>sort[field1]=asc&sort[field2]=desc</b></li>
                <li>URL/?<b>limit=10&page=1</b></li>
            </ul>
        `
    */
    const data = yield res.getModelList(user_1.default);
    res.status(200).send({
        error: false,
        details: yield res.getModelListDetails(user_1.default),
        data
    });
});
exports.list = list;
const read = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Get Single User"
    */
    // Admin olmayan başkasınıın kaydına erişemez:
    req.params.id = req.user.isAdmin ? req.params.id : req.user._id;
    const data = yield user_1.default.findOne({ _id: req.params.id });
    res.status(200).send({
        error: false,
        data
    });
});
exports.read = read;
const update = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Update User"
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
    // Admin olmayan başkasınıın kaydına erişemez:
    req.params.id = req.user.isAdmin ? req.params.id : req.user._id;
    // const data = await User.updateOne({ _id: req.params.id }, req.body, { runValidators: true })
    const data = yield user_1.default.updateOne({ _id: req.params.id }, req.body, { runValidators: true });
    res.status(202).send({
        error: false,
        data,
        new: yield user_1.default.findOne({ _id: req.params.id })
    });
});
exports.update = update;
const deletee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    /*
        #swagger.tags = ["Users"]
        #swagger.summary = "Delete User"
    */
    const data = yield user_1.default.deleteOne({ _id: req.params.id });
    res.status(data.deletedCount ? 204 : 404).send({
        error: !data.deletedCount,
        data
    });
});
exports.deletee = deletee;
