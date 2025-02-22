"use strict";

import { Request, Response, NextFunction } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Response {
        getModelList: any;
        getModelListDetails: any;
    }
}

const queryHandler = (req: Request, res: Response, next: NextFunction) => {
    /* FILTERING & SEARCHING & SORTING & PAGINATION */

    // ### FILTERING ###
    const filter: object = typeof req.query?.filter === 'object' ? req.query.filter : {};

    // ### SEARCHING ###
    const search: any = req.query?.search ? { title: new RegExp(req.query?.search as string, 'i') } : {};

    // ### SORTING ###
    const sort = req.query?.sort || {};

    // ### PAGINATION ###
    let limit = Number(req.query?.limit);
    limit = limit > 0 ? limit : Number(process.env.PAGE_SIZE || 10);

    let page = Number(req.query?.page);
    page = page > 0 ? (page - 1) : 0;

    let skip = Number(req.query?.skip);
    skip = skip > 0 ? skip : (page * limit);

    /* FILTERING & SEARCHING & SORTING & PAGINATION */

    // Run for output:
    res.getModelList = async (Model: any, customFilter = {}, populate = null) => {
        return await Model.find({ ...filter, ...search, ...customFilter }).sort(sort).skip(skip).limit(limit).populate(populate);
    };

    // Details:
    res.getModelListDetails = async (Model: any, customFilter = {}) => {
        const data = await Model.find({ ...filter, ...search, ...customFilter });

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
                next: page + 2 as number | false,
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
    };

    next();
};

export default queryHandler;