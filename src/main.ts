import { Container, ContainerModule, interfaces } from 'inversify';

import { App } from './app';
import { ExceptionFilterImplementation } from './errors/exception.filter';
import { LoggerServiceImplementation } from './logger/logger.service.implementation';
import { LoggerService } from './logger/logger.service';
import { TYPES } from './types';
import { ExceptionFilter } from './interfaces/exceptionFilter';
import { UserController } from './users/controller/user.controller';
import { UserControllerImplementation } from './users/controller/user.controller.implementation';
import { UserService } from './users/service/user.service';
import { UserServiceImplementation } from './users/service/user.service.implementation';
import { ConfigService } from './config/config.service';
import { ConfigServiceImplementation } from './config/config.service.implementation';
import { PrismaService } from './storage/prisma.service';
import { UserRepository } from './users/repository/user.repository';
import { UserRepositoryImplementation } from './users/repository/user.repository.implementation';

import Bind = interfaces.Bind;

const appModule = new ContainerModule((bind: Bind) => {
	bind<LoggerService>(TYPES.LoggerService).to(LoggerServiceImplementation).inSingletonScope();
	bind<ConfigService>(TYPES.ConfigService).to(ConfigServiceImplementation).inSingletonScope();
	bind<UserController>(TYPES.UserController).to(UserControllerImplementation).inSingletonScope();
	bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilterImplementation).inSingletonScope();
	bind<UserService>(TYPES.UserService).to(UserServiceImplementation).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImplementation).inSingletonScope();
	bind<App>(TYPES.Application).to(App).inSingletonScope();
});

export interface BootstrapReturnType {
	appContainer: Container;
	app: App;
}

const bootstrap = (): BootstrapReturnType => {
	const appContainer = new Container();
	appContainer.load(appModule);
	const app = appContainer.get<App>(TYPES.Application);
	app.init();
	return { appContainer, app };
};

export const { app, appContainer } = bootstrap();
