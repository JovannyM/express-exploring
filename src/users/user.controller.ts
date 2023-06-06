import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../common/base.controller';
import { HttpError } from '../errors/http.error';
import { LoggerService } from '../logger/logger.interface';
import { TYPES } from '../types';

import { UserLoginDto } from './dto/user-login.dto';
import { UserController } from './user.controller.interface';
import { UserRegisterDto } from './dto/user-register.dto';
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

	public login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
		this.loggerService.log(`Login success with ${req.body}`);
		console.log(req.body);
		res.send('Login success');
	}

	public register(req: Request<{}, {}, UserRegisterDto>, res: Response, next: NextFunction) {
		this.loggerService.log('Registration');
		// res.send('Registration success');
		next(new HttpError(402, 'VASYA YAY'));
	}
}
