import { NextFunction, Request, Response } from 'express';

export interface UserController {
    login: (req: Request, res: Response, next: NextFunction) => void;
    register: (req: Request, res: Response, next: NextFunction) => void;
}