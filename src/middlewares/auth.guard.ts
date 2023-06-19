import e from 'express';

import { ControllerMiddleware } from '../interfaces/controller-middleware';

export class AuthGuard implements ControllerMiddleware {
	public execute(req: e.Request, res: e.Response, next: e.NextFunction): void {
		if (req.user) {
			return next();
		}
		res.status(401).send({ error: 'Unauthorised user' });
	}
}
