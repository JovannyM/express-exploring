import { inject, injectable } from 'inversify';
import {
	CreateBucketCommand,
	CreateBucketCommandOutput,
	HeadBucketCommand,
	HeadBucketCommandOutput,
	ListBucketsCommand,
	ListBucketsCommandOutput,
	PutObjectCommand,
	S3Client,
} from '@aws-sdk/client-s3';
import { UploadedFile } from 'express-fileupload';
import { v4 as uuidv4 } from 'uuid';

import {
	AWS_ACCESS_KEY,
	AWS_API_VERSION,
	AWS_BUCKET_NAME,
	AWS_REGION,
	AWS_SECRET_ACCESS_KEY,
} from '../../consts';
import { TYPES } from '../../types';
import { ConfigService } from '../../config/config.service';
import { LoggerService } from '../../logger/logger.service';
import { successfulRequest, unsuccessfulRequest } from '../../logger/logger.service.implementation';

import 'reflect-metadata';

@injectable()
export class S3Service {
	private readonly region: string;
	private readonly bucketName: string;
	private readonly s3Client: S3Client;

	constructor(
		@inject(TYPES.LoggerService) private readonly loggerService: LoggerService,
		@inject(TYPES.ConfigService) private readonly configService: ConfigService,
	) {
		this.region = this.configService.get(AWS_REGION);
		this.bucketName = this.configService.get(AWS_BUCKET_NAME);
		this.s3Client = this.configureS3Client();
	}

	public async putFile(file: UploadedFile): Promise<string | undefined> {
		const key = uuidv4();
		const putObjectCommand = new PutObjectCommand({
			Bucket: this.bucketName,
			Body: file.data,
			Key: key,
			ACL: 'public-read-write',
		});
		try {
			await this.s3Client.send(putObjectCommand);
			this.loggerService.log(successfulRequest('put file'));
			return key;
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('put file'), e);
			return undefined;
		}
	}

	public async getBucket(bucketName: string): Promise<HeadBucketCommandOutput | undefined> {
		const command = new HeadBucketCommand({
			Bucket: bucketName,
		});
		try {
			const bucket = await this.s3Client.send(command);
			this.loggerService.log(successfulRequest('get bucket'), bucket);
			return bucket;
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('get bucket'), e);
			return undefined;
		}
	}

	public async createBucket(bucketName: string): Promise<CreateBucketCommandOutput | undefined> {
		const command = new CreateBucketCommand({
			Bucket: bucketName,
			ACL: 'public-read-write',
			CreateBucketConfiguration: {
				LocationConstraint: this.region,
			},
			ObjectLockEnabledForBucket: false,
		});
		try {
			const result = await this.s3Client.send(command);
			this.loggerService.log(successfulRequest('create bucket'), result);
			return result;
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('create bucket'), e);
			return undefined;
		}
	}

	public async getBucketList(): Promise<ListBucketsCommandOutput | undefined> {
		const command = new ListBucketsCommand({});
		try {
			const bucketList: ListBucketsCommandOutput = await this.s3Client.send(command);
			this.loggerService.log(successfulRequest('bucket list'), bucketList);
			return bucketList;
		} catch (e) {
			this.loggerService.error(unsuccessfulRequest('bucket list'), e);
			return undefined;
		}
	}

	private configureS3Client(): S3Client {
		const apiVersion = this.configService.get(AWS_API_VERSION);
		const accessKeyId = this.configService.get(AWS_ACCESS_KEY);
		const secretAccessKey = this.configService.get(AWS_SECRET_ACCESS_KEY);
		return new S3Client({
			apiVersion,
			region: this.region,
			credentials: {
				accessKeyId,
				secretAccessKey,
			},
		});
	}
}
