import { LoggerService } from '../logger/logger.service';
import { Router } from 'express';
import { ControllerRoute } from '../interfaces/route';

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
            const handler = route.function.bind(this);
            this.router[route.method](route.path, handler);
        }
    }
}