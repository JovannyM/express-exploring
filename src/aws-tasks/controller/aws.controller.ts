import { NextFunction, Request, Response, Router } from 'express';

export interface AWSController {
	router: Router;
	uploadFile: (req: Request, res: Response, next: NextFunction) => Promise<void>;
	getTaskStatus: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
