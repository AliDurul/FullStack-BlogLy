import { Request, Response, NextFunction, RequestHandler } from "express";
import { Model, Document, RootFilterQuery, SortOrder } from "mongoose";
import { ZodSchema } from "zod";
import { CustomError, sendMail } from "../utils/common";
import { errorEmailTemp } from "../utils/emailTemplates";
import morgan from "morgan";
import fs from "node:fs";
import path from "node:path";
import jwt, { JwtPayload } from "jsonwebtoken";
import { IUserPayload } from "../types/user";
import { ENV } from "../configs/env";


// ===============================
// 1. 404 NOT FOUND MIDDLEWARE
// ===============================
export const notFound: RequestHandler = (req, res, next) => {
    const error = new CustomError(`Not Found - ${req.originalUrl}`, 404, true);
    next(error);
};


// ===============================
// 2. ERROR HANDLER MIDDLEWARE
// ===============================
export async function errorHandler(err: any, req: Request, res: Response, next: NextFunction): Promise<void> {
    let error: any = { ...err };
    error.message = err.message || "Something went wrong";
    error.statusCode = err.statusCode || 500;
    error.cause = err.cause || null;
    error.isOperational = err.isOperational || false;
    error.stack = err.stack || null;

    // Mongoose bad ObjectId error
    if (err.name === "CastError") {
        const message = `Resource not found. Invalid: ${err.path}`;
        error = new Error(message);
        error.statusCode = 404;
    }

    // Mongoose duplicate key error
    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0]; // Get the field name dynamically
        const value = err.keyValue[field]; // Get the corresponding value
        const message = `Duplicate field value entered: ${field} (${value})`;
        error = new Error(message);
        error.statusCode = 400;
    }

    // Mongoose validation error
    if (err.name === "ValidationError") {
        const message = Object.values(err.errors).map((val: any) => val.message).join(", ");
        error = new Error(message);
        error.statusCode = 400;
    }

    // isTrusted error
    if (!(err instanceof CustomError && error.isOperational)) {
        await sendMail({ to: 'alidrl26@gmail.com', subject: 'Error Occurred', tempFn: errorEmailTemp, data: error });

        process.exit(1);
    }

    console.log('Error Handler: ', error);

    res.status(error.statusCode).send({
        success: false,
        message: error.message,
        stack: process.env.NODE_ENV === "production" ? null : error.stack,
        cause: error.cause || null,
    });
}


// ===============================
// 3. ZOD VALIDATION MIDDLEWARE
// ===============================
export const isValidated = (schema: ZodSchema, target: "body" | "query" = "body"): RequestHandler => {
    if (!schema) throw new CustomError("Schema is required", 500);

    return (req, res, next) => {
        const data = req[target];
        const parseResult = schema.safeParse(data);

        if (!parseResult.success) {
            const errors = parseResult.error.errors
                .map(error => `"${error.path.join(".")}": ${error.message}`)
                .join(", ");
            return next(new CustomError(errors, 400, true));
        }

        req[target] = parseResult.data;
        next();
    };
};



// ===============================
// 4. MORGAN LOGGER MIDDLEWARE
// ===============================
export function logger(): RequestHandler {
    const logsDir = path.join(process.cwd(), "logs");

    if (!fs.existsSync(logsDir)) {
        console.log("Logs folder has been created at root directory");
        fs.mkdirSync(logsDir, { recursive: true });
    }

    const customFormat = 'TIME=":date[iso]" - URL=":url" - Method=":method" - IP=":remote-addr" - Ref=":referrer" - Status=":status" - Sign=":user-agent" (:response-time[digits] ms)';
    const today = new Date().toISOString().split('T')[0];

    return morgan(customFormat, {
        stream: fs.createWriteStream(path.join(logsDir, `${today}.log`), { flags: "a+" }),
    });
};

// ===============================
// 5. AUTH CHECK MIDDLEWARE (JWT)
// ===============================
declare module "express-serve-static-core" {
    interface Request {
        user?: null | (JwtPayload & IUserPayload);
    }
}

export const authenticate: RequestHandler = async (req, res, next) => {
    const auth = req.headers?.authorization;
    const tokenParts = auth?.split(" ") || [];

    req.user = null;

    if (tokenParts[0] === "Bearer" && tokenParts[1]) {

        jwt.verify(tokenParts[1], ENV.jwtSecret, (err: jwt.VerifyErrors | null, userData: JwtPayload & IUserPayload | undefined) => {
            if (err) {
                return next(new CustomError("Invalid or expired token", 401, true));
            }
            req.user = userData;
        });
    }
    next();
};



// ===============================
// 6. QUERY PARAMS HANDLER MIDDLEWARE
// ===============================

declare module "express-serve-static-core" {
    interface Response {
        getModelList: <T extends Document>(
            Model: Model<T>,
            customFilter?: Record<string, any>,
            populate?: string | null
        ) => Promise<T[]>;
        getModelListDetails: <T extends Document>(
            Model: Model<T>,
            customFilter?: Record<string, any>
        ) => Promise<{
            filter: Record<string, any>;
            search: Record<string, any>;
            sort: Record<string, any>;
            skip: number;
            limit: number;
            page: number;
            totolRecords: number;
            pages: false | {
                previous: number | false;
                current: number;
                next: number | false;
                total: number;
            };
        }>;
    }
}

export const queryHandler: RequestHandler = (req, res, next) => {

    // URL?filter[key1]=value1&filter[key2]=value2
    const filter = (req.query?.filter as Record<string, any>) || {};

    // URL?search[key1]=value1&search[key2]=value2
    const search = (req.query?.search as Record<string, any>) || {};
    for (const key in search as Record<string, any>) {
        if (typeof search[key] === "string") {
            search[key] = { $regex: search[key], $options: "i" };
        }
    };

    // URL?sort[key1]=asc&sort[key2]=desc
    const rawSort = req.query?.sort || {};
    const sort: { [key: string]: SortOrder } = {};

    if (typeof rawSort === "object" && !Array.isArray(rawSort)) {
        for (const key in rawSort) {
            const value = rawSort[key];
            if (value === "asc" || value === "desc") {
                sort[key] = value;
            }
        }
    }

    // URL?page=3&limit=10
    let limit: number = parseInt(req.query?.limit as string);
    limit = limit > 0 ? limit : parseInt((process.env.PAGE_SIZE || "20"));

    let page = parseInt(req.query?.page as string);
    page = page > 0 ? (page - 1) : 0;

    let skip = parseInt(req.query?.skip as string);
    skip = skip > 0 ? skip : (page * limit);

    // List
    res.getModelList = async <T extends Document>(Model: Model<T>, customFilter = {}, populate: string | null = null): Promise<T[]> => {

        const query: RootFilterQuery<T> = {
            ...(typeof filter === "object" && filter),
            ...(typeof search === "object" && search),
            ...(typeof customFilter === "object" && customFilter),
        } as RootFilterQuery<T>;

        return await Model.find(query).sort(sort).skip(skip).limit(limit).populate(populate).exec();
    };

    // Details:
    res.getModelListDetails = async <T extends Document>(Model: Model<T>, customFilter = {}): Promise<{
        filter: Record<string, any>;
        search: Record<string, any>;
        sort: Record<string, any>;
        skip: number;
        limit: number;
        page: number;
        totolRecords: number;
        pages: false | {
            previous: number | false;
            current: number;
            next: number | false;
            total: number;
        };
    }> => {

        const query: RootFilterQuery<T> = {
            ...(typeof filter === "object" && filter),
            ...(typeof search === "object" && search),
            ...(typeof customFilter === "object" && customFilter),
        } as RootFilterQuery<T>;

        const count = await Model.countDocuments(query).lean();

        return {
            filter,
            search,
            sort,
            skip,
            limit,
            page,
            totolRecords: count,
            pages: count <= limit
                ? false
                : {
                    previous: page > 1 ? page - 1 : false,
                    current: page,
                    next: page < Math.ceil(count / limit) ? page + 1 : false,
                    total: Math.ceil(count / limit),
                },
        };
    };
    next();
};








