import { BaseController } from '../common/base.controller';
import { LoggerService } from '../logger/logger.service';
import { NextFunction, Request, Response } from 'express';
import { HttpError } from '../errors/http.error';

export class UserController extends BaseController {
    private readonly _logger: LoggerService;

    constructor(logger: LoggerService) {
        super(logger);
        this._logger = logger;
        this.bindRoutes([
            {
                method: 'post',
                path: '/login',
                function: this.login
            },
            {
                method: 'post',
                path: '/registration',
                function: this.register
            }
        ])
    }

    private login(req: Request, res: Response, next: NextFunction) {
        this._logger.log('Login');
        res.send('Login success');
    }

    private register(req: Request, res: Response, next: NextFunction) {
        this._logger.log('Registration');
        // res.send('Registration success');
        next(new HttpError(402, 'VASYA YAY'));
    }
}