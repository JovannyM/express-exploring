import { NextFunction, Request, Response } from 'express';
import { LoggerService } from '../logger/logger.service';
import { HttpError } from './http.error';

export class ExceptionFilter implements ExceptionFilter {
    constructor(private readonly logger: LoggerService) {
    }

    catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
        if (err instanceof HttpError) {
            this.logger.error(`[${err.context}] ErrorStatusCode: ${err.statusCode} - ${err.message}`)
            res.status(err.statusCode).send({err: err.message});
        } else {
            this.logger.error(`Unknown error: ${err.message}`)
            res.status(500).send({err: err.message});
        }
    }
}