import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { TYPES } from '../types';
import { HttpError } from '../errors/http.error';

import { UserLoginDto } from './dto/user-login.dto';
import { UserController } from './user.controller';
import { UserRegisterDto } from './dto/user-register.dto';
import { UserService } from './user.service';
import 'reflect-metadata';

@injectable()
export class UserControllerImplementation extends BaseController implements UserController {
	constructor(
		@inject(TYPES.LoggerService) private readonly loggerService: LoggerService,
		@inject(TYPES.UserService) private readonly userService: UserService,
	) {
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

	public async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	) {
		const result = await this.userService.create(body);
		if (result) {
			const text = `Registration success: ${result.email}`;
			this.loggerService.log(text);
			res.send(text);
			return;
		}
		const error_test = 'User already exists';
		this.loggerService.error(error_test);
		return next(new HttpError(422, error_test));
	}
}
