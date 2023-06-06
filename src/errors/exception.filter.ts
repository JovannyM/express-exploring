import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { LoggerService } from '../logger/logger.interface';
import { ExceptionFilter } from '../interfaces/exceptionFilter';
import { TYPES } from '../types';

import { HttpError } from './http.error';

@injectable()
export class ExceptionFilterImplementation implements ExceptionFilter {
	constructor(@inject(TYPES.LoggerService) private readonly logger: LoggerService) {}

	catch(err: Error | HttpError, req: Request, res: Response, next: NextFunction) {
		if (err instanceof HttpError) {
			this.logger.error(`[${err.context}] ErrorStatusCode: ${err.statusCode} - ${err.message}`);
			res.status(err.statusCode).send({ err: err.message });
		} else {
			this.logger.error(`Unknown error: ${err.message}`);
			res.status(500).send({ err: err.message });
		}
	}
}
