import { Server } from 'http';

import express, { Express } from 'express';
import { inject, injectable } from 'inversify';
import { json } from 'body-parser';

import { LoggerService } from './logger/logger.interface';
import { TYPES } from './types';
import { ExceptionFilter } from './interfaces/exceptionFilter';
import { UserController } from './users/user.controller.interface';

import 'reflect-metadata';

@injectable()
export class App {
	public port: number;
	public app: Express;
	public server!: Server;

	constructor(
		@inject(TYPES.LoggerService) private readonly loggerService: LoggerService,
		@inject(TYPES.UserController) private readonly userController: UserController,
		@inject(TYPES.ExceptionFilter) private readonly exceptionFilter: ExceptionFilter,
	) {
		this.port = 8000;
		this.app = express();
	}

	public async init() {
		this.useMiddleware();
		this.useRoutes();
		this.useExceptionFilters();
		this.server = this.app.listen(this.port, () => {
			this.loggerService.log(`Server started on http://localhost:${this.port}`);
		});
	}

	private useRoutes() {
		this.app.use('/users', this.userController.router);
	}

	private useMiddleware() {
		this.app.use(json());
	}

	private useExceptionFilters() {
		this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
	}
}
