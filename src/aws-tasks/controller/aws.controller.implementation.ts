import { NextFunction, Request, Response } from 'express';
import { inject, injectable } from 'inversify';
import { UploadedFile } from 'express-fileupload';

import { TYPES } from '../../types';
import { LoggerService } from '../../logger/logger.service';
import { AWSService } from '../service/aws/aws.service';
import { BaseController } from '../../common/base.controller';
import { ConfigService } from '../../config/config.service';
import { AWS_REGION } from '../../consts';

import { AWSController } from './aws.controller';
import 'reflect-metadata';

@injectable()
export class AWSControllerImplementation extends BaseController implements AWSController {
	constructor(
		@inject(TYPES.LoggerService) private readonly loggerService: LoggerService,
		@inject(TYPES.AWSService) private readonly awsService: AWSService,
		@inject(TYPES.ConfigService) private readonly configService: ConfigService,
	) {
		super(loggerService);
		this.bindRoutes([
			{
				method: 'post',
				path: '/upload',
				function: this.uploadFile,
			},
			{
				method: 'get',
				path: '/status',
				function: this.getTaskStatus,
			},
		]);
	}

	async uploadFile({ files }: Request, res: Response, next: NextFunction) {
		if (files?.[Object.keys(files)[0]]) {
			const obj = files?.[Object.keys(files)[0]] as UploadedFile;
			const awsRegion = this.configService.get(AWS_REGION);
			const taskId = await this.awsService.uploadFile(obj);
			if (taskId) {
				res.send({
					TaskID: taskId,
					AwsRegion: awsRegion,
				});
				return;
			}
			res.status(401).send('Upload file error. See logs.');
			return;
		}
		res.status(400).send('File not found');
	}

	async getTaskStatus(req: Request, res: Response, next: NextFunction): Promise<void> {
		const taskId = req.query.taskId as string;
		if (!taskId) {
			res.status(401).send('TaskID in query param not found');
			return;
		}
		const result = await this.awsService.getTaskStatus(taskId);
		res.send(result);
	}
}
