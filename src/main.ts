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
import { AWSService } from './aws-tasks/service/aws/aws.service';
import { AWSServiceImplementation } from './aws-tasks/service/aws/aws.service.implementation';
import { AWSController } from './aws-tasks/controller/aws.controller';
import { AWSControllerImplementation } from './aws-tasks/controller/aws.controller.implementation';
import { SQSService } from './aws-tasks/service/sqs.service';
import { S3Service } from './aws-tasks/service/s3.service';
import { DynamoDBService } from './aws-tasks/service/dynamoDB.service';

import Bind = interfaces.Bind;

const appModule = new ContainerModule((bind: Bind) => {
	bind<LoggerService>(TYPES.LoggerService).to(LoggerServiceImplementation).inSingletonScope();
	bind<ConfigService>(TYPES.ConfigService).to(ConfigServiceImplementation).inSingletonScope();
	bind<UserController>(TYPES.UserController).to(UserControllerImplementation).inSingletonScope();
	bind<ExceptionFilter>(TYPES.ExceptionFilter).to(ExceptionFilterImplementation).inSingletonScope();
	bind<UserService>(TYPES.UserService).to(UserServiceImplementation).inSingletonScope();
	bind<PrismaService>(TYPES.PrismaService).to(PrismaService).inSingletonScope();
	bind<UserRepository>(TYPES.UserRepository).to(UserRepositoryImplementation).inSingletonScope();
	bind<AWSService>(TYPES.AWSService).to(AWSServiceImplementation).inSingletonScope();
	bind<AWSController>(TYPES.AWSController).to(AWSControllerImplementation).inSingletonScope();
	bind<SQSService>(TYPES.SQSService).to(SQSService).inSingletonScope();
	bind<S3Service>(TYPES.S3Service).to(S3Service).inSingletonScope();
	bind<DynamoDBService>(TYPES.DynamoDBService).to(DynamoDBService).inSingletonScope();
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
