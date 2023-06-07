import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';

import { BaseController } from '../../common/base.controller';
import { LoggerService } from '../../logger/logger.service';
import { TYPES } from '../../types';
import { HttpError } from '../../errors/http.error';
import { ValidateMiddleware } from '../../common/validate.middleware';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserService } from '../service/user.service';

import { UserController } from './user.controller';
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
				middlewares: [new ValidateMiddleware(UserLoginDto)],
			},
			{
				method: 'post',
				path: '/registration',
				function: this.register,
				middlewares: [new ValidateMiddleware(UserRegisterDto)],
			},
		]);
	}

	public async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
		const isUserExists = await this.userService.validate(req.body);
		if (isUserExists) {
			this.loggerService.log(`Login success with ${req.body}`);
			console.log(req.body);
			res.send('Login success');
			return;
		}
		const error_text = 'User not found';
		this.loggerService.error(error_text);
		console.log(req.body);
		return next(new HttpError(422, error_text));
	}

	public async register(
		{ body }: Request<{}, {}, UserRegisterDto>,
		res: Response,
		next: NextFunction,
	) {
		const result = await this.userService.create(body);
		if (result) {
			const text = `Registration success: { email: ${result.email}; id: ${result.id} }`;
			this.loggerService.log(text);
			res.send(text);
			return;
		}
		const error_test = 'User already exists';
		this.loggerService.error(error_test);
		return next(new HttpError(422, error_test));
	}
}
