import express, { Express } from 'express';
import { Server } from 'http';
import { LoggerService } from './logger/logger.service';
import { UserController } from './users/user.controller';
import { ExceptionFilter } from './errors/exception.filter';

export class App {
    public port: number;
    public app: Express;
    public server!: Server;
    public logger: LoggerService;
    public userController: UserController;
    public exceptionFilter: ExceptionFilter;

    constructor(
        logger: LoggerService,
        userController: UserController,
        exceptionFilter: ExceptionFilter
    ) {
        this.port = 8080;
        this.app = express();
        this.logger = new LoggerService();
        this.userController = new UserController(logger);
        this.exceptionFilter = exceptionFilter;
    }

    public async init() {
        this.useRoutes();
        this.useExceptionFilters();
        this.server = this.app.listen(this.port, () => {
            this.logger.log(`Server started on http://localhost:${this.port}`)
        });
    }

    private useRoutes() {
        this.app.use('/users', this.userController.router);
    }

    private useExceptionFilters() {
        this.app.use(this.exceptionFilter.catch.bind(this.exceptionFilter));
    }

}