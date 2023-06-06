import { config, DotenvConfigOutput, DotenvParseOutput } from 'dotenv';
import { inject, injectable } from 'inversify';

import { LoggerService } from '../logger/logger.service';
import { TYPES } from '../types';

import { ConfigService } from './config.service';

@injectable()
export class ConfigServiceImplementation implements ConfigService {
	private readonly config!: DotenvParseOutput;

	constructor(@inject(TYPES.LoggerService) private readonly loggerService: LoggerService) {
		const result: DotenvConfigOutput = config();
		if (result.error) {
			this.loggerService.error('Incorrect .env file');
		} else {
			this.loggerService.log('Config was loaded');
			this.config = result.parsed as DotenvParseOutput;
		}
	}
	get(key: string): string {
		return this.config[key];
	}
}
