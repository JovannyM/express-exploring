import { NextFunction, Request, Response, Router } from 'express';

import { ControllerMiddleware } from './controller-middleware';

export interface ControllerRoute {
	path: string;
	function: (req: Request, res: Response, next: NextFunction) => void;
	method: keyof Pick<Router, 'get' | 'post' | 'delete' | 'patch' | 'put'>;
	middlewares?: ControllerMiddleware[];
}
