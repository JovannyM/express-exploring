import { NextFunction, Request, Response } from 'express';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { validate } from 'class-validator';
import { inject } from 'inversify';

import { ControllerMiddleware } from '../interfaces/controller-middleware';
import { LoggerService } from '../logger/logger.service';
import { TYPES } from '../types';

export class ValidateMiddleware implements ControllerMiddleware {
	constructor(
		private readonly classToValidate: ClassConstructor<object>,
		@inject(TYPES.LoggerService) private readonly loggerService?: LoggerService,
	) {}

	public async execute({ body }: Request, res: Response, next: NextFunction) {
		const instance = plainToInstance(this.classToValidate, body);
		const errors = await validate(instance);
		if (errors.length > 0) {
			this.loggerService?.error('Invalid data');
			res.status(422).send(errors);
			return;
		}
		next();
	}
}
