import { inject, injectable } from 'inversify';
import { v4 as uuidv4 } from 'uuid';
import { UploadedFile } from 'express-fileupload';
import { AttributeValue } from '@aws-sdk/client-dynamodb';

import { TYPES } from '../../../types';
import { ConfigService } from '../../../config/config.service';
import { S3Service } from '../s3.service';
import { DynamoDBService } from '../dynamoDB.service';
import { SQSService } from '../sqs.service';

import { AWSService } from './aws.service';

import 'reflect-metadata';

@injectable()
export class AWSServiceImplementation implements AWSService {
	constructor(
		@inject(TYPES.ConfigService) private readonly configService: ConfigService,
		@inject(TYPES.S3Service) private readonly s3Service: S3Service,
		@inject(TYPES.DynamoDBService) private readonly dynamoDBService: DynamoDBService,
		@inject(TYPES.SQSService) private readonly sqsService: SQSService,
	) {}

	public async uploadFile(file: UploadedFile): Promise<string | undefined> {
		const taskId = uuidv4();
		const filePathKey = await this.s3Service.putFile(file);
		if (!filePathKey) {
			return undefined;
		}
		const task: Record<string, AttributeValue> = {
			TaskID: {
				S: taskId,
			},
			FileName: {
				S: file.name,
			},
			FilePath: {
				S: filePathKey,
			},
			State: {
				S: 'Created',
			},
		};
		const isPutSuccess = await this.dynamoDBService.putItem(task);
		if (!isPutSuccess) {
			return undefined;
		}
		const message = {
			TaskID: taskId,
		};
		const isSendMessageSuccess = await this.sqsService.sendMessageInToQueue(message);
		if (!isSendMessageSuccess) {
			return undefined;
		}
		return taskId;
	}

	public async getTaskStatus(taskId: string) {
		return await this.dynamoDBService.getTaskStatus(taskId);
	}
}
