import { inject, injectable } from 'inversify';
import { PrismaClient } from '@prisma/client';

import { TYPES } from '../types';
import { LoggerService } from '../logger/logger.service';

import 'reflect-metadata';

@injectable()
export class PrismaService {
	client: PrismaClient;

	constructor(@inject(TYPES.LoggerService) private readonly loggerService: LoggerService) {
		this.client = new PrismaClient();
	}

	async connect() {
		try {
			await this.client.$connect();
			this.loggerService.log('[Prisma] DB connect success');
		} catch (e) {
			if (e instanceof Error) {
				this.loggerService.error(`[Prisma] Connection error: ${e.message}`);
			}
		}
	}

	async disconnect() {
		await this.client.$disconnect();
		this.loggerService.log('[Prisma] DB disconnect success');
	}
}
