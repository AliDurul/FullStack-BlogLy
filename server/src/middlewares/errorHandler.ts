import { Request, Response, NextFunction } from 'express-serve-static-core';

declare module 'express-serve-static-core' {
    interface Response {
        errorStatusCode?: number;
    }
}

interface CustomError extends Error {
    statusCode?: number;
    cause?: string;
}

interface CustomResponse extends Response {
    errorStatusCode?: number;
}

interface ErrorHandler {
    (err: CustomError, req: Request, res: CustomResponse, next: NextFunction): void;
}

const errorHandler: ErrorHandler = (err, req, res, next) => {
    console.log('from error handler', err);

    return res.status(err?.statusCode || res.errorStatusCode || 500).send({
        error: true,
        message: err.message,
        cause: err.cause,
        body: req.body,
        stack: err.stack
    });
};

export default errorHandler;
