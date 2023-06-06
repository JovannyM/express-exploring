import { Router } from 'express';
import { injectable } from 'inversify';

import { ControllerRoute } from '../interfaces/controller-route';
import { LoggerService } from '../logger/logger.service';

import 'reflect-metadata';

@injectable()
export abstract class BaseController {
	private readonly _router: Router;
	get router() {
		return this._router;
	}

	constructor(private readonly logger: LoggerService) {
		this._router = Router();
	}

	protected bindRoutes(routes: ControllerRoute[]) {
		for (const route of routes) {
			this.logger.log(`[${route.method}] ${route.path}`);
			const middlewares = route.middlewares?.map((m) => m.execute.bind(m));
			const handler = route.function.bind(this);
			const pipeline = middlewares ? [...middlewares, handler] : handler;
			this.router[route.method](route.path, pipeline);
		}
	}
}
