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
Object.defineProperty(exports, "__esModule", { value: true });
const queryHandler = (req, res, next) => {
    /* FILTERING & SEARCHING & SORTING & PAGINATION */
    var _a, _b, _c, _d, _e, _f, _g;
    // ### FILTERING ###
    const filter = typeof ((_a = req.query) === null || _a === void 0 ? void 0 : _a.filter) === 'object' ? req.query.filter : {};
    // ### SEARCHING ###
    const search = ((_b = req.query) === null || _b === void 0 ? void 0 : _b.search) ? { title: new RegExp((_c = req.query) === null || _c === void 0 ? void 0 : _c.search, 'i') } : {};
    // ### SORTING ###
    const sort = ((_d = req.query) === null || _d === void 0 ? void 0 : _d.sort) || {};
    // ### PAGINATION ###
    let limit = Number((_e = req.query) === null || _e === void 0 ? void 0 : _e.limit);
    limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 10);
    let page = Number((_f = req.query) === null || _f === void 0 ? void 0 : _f.page);
    page = page > 0 ? (page - 1) : 0;
    let skip = Number((_g = req.query) === null || _g === void 0 ? void 0 : _g.skip);
    skip = skip > 0 ? skip : (page * limit);
    /* FILTERING & SEARCHING & SORTING & PAGINATION */
    // Run for output:
    res.getModelList = (Model_1, ...args_1) => __awaiter(void 0, [Model_1, ...args_1], void 0, function* (Model, customFilter = {}, populate = null) {
        return yield Model.find(Object.assign(Object.assign(Object.assign({}, filter), search), customFilter)).sort(sort).skip(skip).limit(limit).populate(populate);
    });
    // Details:
    res.getModelListDetails = (Model_1, ...args_1) => __awaiter(void 0, [Model_1, ...args_1], void 0, function* (Model, customFilter = {}) {
        const data = yield Model.find(Object.assign(Object.assign(Object.assign({}, filter), search), customFilter));
        let details = {
            filter,
            search,
            sort,
            skip,
            limit,
            page,
            pages: {
                previous: (page > 0 ? page : false),
                current: page + 1,
                next: page + 2,
                total: Math.ceil(data.length / limit),
                totalRecords: data.length,
            },
            totalRecords: data.length,
        };
        details.pages.next = (typeof details.pages.next === 'number' && details.pages.next > details.pages.total ? false : details.pages.next);
        if (details.totalRecords <= limit) {
            details.pages = {
                totalRecords: details.totalRecords,
                previous: false,
                current: page + 1,
                next: false,
                total: details.pages.total
            };
        }
        return details;
    });
    next();
};
exports.default = queryHandler;
//# sourceMappingURL=queryHandler.js.map