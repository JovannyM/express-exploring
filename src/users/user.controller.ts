import { BaseController } from '../common/base.controller';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';
import { LoggerService } from '../logger/logger.interface';
import { inject, injectable } from 'inversify';
import { TYPES } from '../types';
import { UserController } from './user.controller.interface';

import 'reflect-metadata';

@injectable()
export class UserControllerImplementation extends BaseController implements UserController {
	constructor(@inject(TYPES.LoggerService) private readonly loggerService: LoggerService) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'post',
				path: '/login',
				function: this.login,
			},
			{
				method: 'post',
				path: '/registration',
				function: this.register,
			},
		]);
	}

	public login(req: Request, res: Response, next: NextFunction) {
		this.loggerService.log('Login');
		res.send('Login success');
	}

	public register(req: Request, res: Response, next: NextFunction) {
		this.loggerService.log('Registration');
		// res.send('Registration success');
		next(new HttpError(402, 'VASYA YAY'));
	}
}
