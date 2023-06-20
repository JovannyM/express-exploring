import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { sign } from 'jsonwebtoken';

import { BaseController } from '../../common/base.controller';
import { LoggerService } from '../../logger/logger.service';
import { TYPES } from '../../types';
import { HttpError } from '../../errors/http.error';
import { ValidateMiddleware } from '../../middlewares/validate.middleware';
import { UserLoginDto } from '../dto/user-login.dto';
import { UserRegisterDto } from '../dto/user-register.dto';
import { UserService } from '../service/user.service';
import { ConfigService } from '../../config/config.service';
import { AuthGuard } from '../../middlewares/auth.guard';

import { UserController } from './user.controller';

import 'reflect-metadata';

@injectable()
export class UserControllerImplementation extends BaseController implements UserController {
	constructor(
		@inject(TYPES.LoggerService) private readonly loggerService: LoggerService,
		@inject(TYPES.UserService) private readonly userService: UserService,
		@inject(TYPES.ConfigService) private readonly configService: ConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'get',
				path: '/info',
				function: this.get,
				middlewares: [new AuthGuard()],
			},
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

	public async get({ user }: Request, res: Response, next: NextFunction) {
		// const existedUser = await this.userService.get(user);
		// if (existedUser) {
		// 	return res.send({ name: existedUser.name, id: existedUser.id });
		// }
		res.status(404).send('User not found');
	}

	public async info({ user }: Request, res: Response, next: NextFunction) {
		// const isUserExists = await this.userService.validate({ email: user, password: '' });
		// if (isUserExists) {
		// 	return res.send('Info success');
		// }
		res.status(401).send('User not found');
	}

	public async login(req: Request<{}, {}, UserLoginDto>, res: Response, next: NextFunction) {
		// const isUserExists = await this.userService.validate(req.body);
		// if (isUserExists) {
		// 	this.loggerService.log(`Login success with ${req.body}`);
		// 	const secret = this.configService.get('SECRET');
		// 	const jwt = await this.signJWT(req.body.email, secret);
		// 	return res.send({ token: jwt });
		// }
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
		// const result = await this.userService.create(body);
		// if (result) {
		// 	const text = `Registration success: { email: ${result.email}; id: ${result.id} }`;
		// 	this.loggerService.log(text);
		// 	return res.send(text);
		// }
		const error_test = 'User already exists';
		this.loggerService.error(error_test);
		return next(new HttpError(422, error_test));
	}

	private async signJWT(email: string, secret: string): Promise<string> {
		return new Promise((res, rej) => {
			sign(
				{
					email,
					iat: Math.floor(Date.now() / 1000),
				},
				secret,
				{
					algorithm: 'HS256',
				},
				(err, token) => {
					if (err) {
						rej(err);
					}
					res(token as string);
				},
			);
		});
	}
}
