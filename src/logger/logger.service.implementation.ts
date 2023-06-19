import { Logger } from 'tslog';
import { injectable } from 'inversify';

import { LoggerService } from './logger.service';
import 'reflect-metadata';

export const successfulRequest = (text: string): string => `Successful ${text} request`;
export const unsuccessfulRequest = (text: string): string => `Unsuccessful ${text} request`;

@injectable()
export class LoggerServiceImplementation implements LoggerService {
	public logger: Logger<string>;

	constructor() {
		this.logger = new Logger({
			hideLogPositionForProduction: true,
		});
	}

	public log(...args: unknown[]) {
		this.logger.info(...args);
	}

	public error(...args: unknown[]) {
		this.logger.error(...args);
	}

	public warn(...args: unknown[]) {
		this.logger.warn(...args);
	}
}
