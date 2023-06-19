import { inject, injectable } from 'inversify';
import {
	AttributeValue,
	CreateTableCommand,
	DynamoDB,
	PutItemCommand,
} from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

import { TYPES } from '../../types';
import { LoggerService } from '../../logger/logger.service';
import { ConfigService } from '../../config/config.service';
import {
	AWS_ACCESS_KEY,
	AWS_API_VERSION,
	AWS_REGION,
	AWS_SECRET_ACCESS_KEY,
	AWS_DYNAMO_DB_TABLE_NAME,
	AWS_BUCKET_NAME,
} from '../../consts';
import { successfulRequest, unsuccessfulRequest } from '../../logger/logger.service.implementation';

import 'reflect-metadata';

@injectable()
export class DynamoDBService {
	private readonly region: string;
	private readonly tableName: string;
	private readonly dynamoDBClient: DynamoDB;

	constructor(
		@inject(TYPES.LoggerService) private readonly loggerService: LoggerService,
		@inject(TYPES.ConfigService) private readonly configService: ConfigService,
	) {
		this.region = this.configService.get(AWS_REGION);
		this.tableName = this.configService.get(AWS_DYNAMO_DB_TABLE_NAME);
		this.dynamoDBClient = this.configureDynamoDBClient();
	}

	public async getTaskStatus(taskId: string) {
		const itemDescription = {
			TableName: this.tableName,
			Key: {
				TaskID: { S: taskId },
			},
		};
		try {
			const task = await this.dynamoDBClient.getItem(itemDescription);
			if (task.Item) {
				const bucketName = this.configService.get(AWS_BUCKET_NAME);
				this.loggerService.log(successfulRequest('get task status'));
				const object = unmarshall(task.Item);
				object.OriginalFileKey = object.FilePath;
				object.FilePath = `https://s3.${this.region}.amazonaws.com/${bucketName}/${object.FilePath}`;
				if (object.ProcessedFilePath) {
					object.ProcessedFileKey = object.ProcessedFilePath;
					object.ProcessedFilePath = `https://s3.${this.region}.amazonaws.com/${bucketName}/${object.ProcessedFilePath}`;
				}
				return object;
			}
			this.loggerService.log(successfulRequest('get task status'));
			return undefined;
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('get task status'), e);
			return undefined;
		}
	}

	public async putItem(item: Record<string, AttributeValue>): Promise<boolean> {
		const putItemCommand = new PutItemCommand({
			TableName: this.tableName,
			Item: item,
		});
		try {
			await this.dynamoDBClient.send(putItemCommand);
			this.loggerService.log(successfulRequest('put item in dynamo db'));
			return true;
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('put item in dynamo db'), e);
			return false;
		}
	}

	public async createTable() {
		const table = {
			TableName: this.tableName,
			KeySchema: [
				{
					AttributeName: 'TaskID',
					KeyType: 'HASH',
				},
			],
			AttributeDefinitions: [
				{
					AttributeName: 'TaskID',
					AttributeType: 'S',
				},
			],
			ProvisionedThroughput: {
				ReadCapacityUnits: 1,
				WriteCapacityUnits: 1,
			},
		};
		const command = new CreateTableCommand(table);
		try {
			await this.dynamoDBClient.send(command);
			this.loggerService.log(successfulRequest('create table'));
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('create table'), e);
		}
	}

	private configureDynamoDBClient() {
		const apiVersion = this.configService.get(AWS_API_VERSION);
		const accessKeyId = this.configService.get(AWS_ACCESS_KEY);
		const secretAccessKey = this.configService.get(AWS_SECRET_ACCESS_KEY);
		return new DynamoDB({
			apiVersion,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
			region: this.region,
		});
		// return new DynamoDBClient({
		// 	apiVersion,
		// 	credentials: {
		// 		accessKeyId,
		// 		secretAccessKey,
		// 	},
		// 	region: this.region,
		// });
	}
}
