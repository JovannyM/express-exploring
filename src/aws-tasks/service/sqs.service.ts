import { inject, injectable } from 'inversify';
import { CreateQueueCommand, SendMessageCommand, SQSClient } from '@aws-sdk/client-sqs';

import { TYPES } from '../../types';
import { ConfigService } from '../../config/config.service';
import { LoggerService } from '../../logger/logger.service';
import {
	AWS_ACCESS_KEY,
	AWS_API_VERSION,
	AWS_REGION,
	AWS_SECRET_ACCESS_KEY,
	AWS_SQS_QUEUE_NAME,
	AWS_SQS_QUEUE_URL,
} from '../../consts';
import { successfulRequest, unsuccessfulRequest } from '../../logger/logger.service.implementation';

import 'reflect-metadata';

@injectable()
export class SQSService {
	private readonly region: string;
	private readonly queueURL: string;
	private readonly queueName: string;
	private readonly sqsClient: SQSClient;

	constructor(
		@inject(TYPES.ConfigService) private readonly configService: ConfigService,
		@inject(TYPES.LoggerService) private readonly loggerService: LoggerService,
	) {
		this.region = this.configService.get(AWS_REGION);
		this.queueURL = this.configService.get(AWS_SQS_QUEUE_URL);
		this.queueName = this.configService.get(AWS_SQS_QUEUE_NAME);

		this.sqsClient = this.createSQSClient();
	}

	public async sendMessageInToQueue(messageBody: Record<string, string>): Promise<boolean> {
		let body: string;
		try {
			body = JSON.stringify(messageBody);
		} catch (e) {
			this.loggerService.error('Cannot stringify message body for message into queue');
			return false;
		}
		const command = new SendMessageCommand({
			QueueUrl: this.queueURL,
			MessageBody: body,
		});
		try {
			await this.sqsClient.send(command);
			this.loggerService.log(successfulRequest('send message into queue'));
			return true;
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('send message into queue'), e);
			return false;
		}
	}

	public async createSQSQueue(): Promise<string | undefined> {
		const command = new CreateQueueCommand({
			QueueName: this.queueName,
			Attributes: {
				DelaySeconds: '10',
			},
		});
		try {
			const { QueueUrl } = await this.sqsClient.send(command);
			this.loggerService.log(successfulRequest('create SQS queue'));
			return QueueUrl;
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('create SQS queue'), e);
			return undefined;
		}
	}

	private createSQSClient() {
		const apiVersion = this.configService.get(AWS_API_VERSION);
		const accessKeyId = this.configService.get(AWS_ACCESS_KEY);
		const secretAccessKey = this.configService.get(AWS_SECRET_ACCESS_KEY);
		return new SQSClient({
			apiVersion,
			region: this.region,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});
	}
}
