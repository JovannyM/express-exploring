import { App } from './app';
import { ExceptionFilterImplementation } from './errors/exception.filter';
import { LoggerServiceImplementation } from './logger/logger.service';
import { Container, ContainerModule, interfaces } from 'inversify';
import { LoggerService } from './logger/logger.interface';
import { TYPES } from './types';
import { ExceptionFilter } from './interfaces/exceptionFilter';
import Bind = interfaces.Bind;
import { UserController } from './users/user.controller.interface';
import { UserControllerImplementation } from './users/user.controller';

const appModule = new ContainerModule((bind: Bind) => {
    bind<LoggerService>(TYPES.LoggerService).to(LoggerServiceImplementation);
    bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilterImplementation);
    bind<UserController>(TYPES.UserController).to(UserControllerImplementation);
    bind<App>(TYPES.Application).to(App);
});

const bootstrap = () => {
    const appContainer = new Container();
    appContainer.load(appModule);
    const app = appContainer.get<App>(TYPES.Application);
    app.init();
}

bootstrap();


