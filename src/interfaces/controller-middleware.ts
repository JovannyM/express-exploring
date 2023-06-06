import { NextFunction, Request, Response } from 'express';

export interface ControllerMiddleware {
	execute: (req: Request, res: Response, next: NextFunction) => void;
}
