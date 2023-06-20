import { UploadedFile } from 'express-fileupload';

export interface AWSService {
	/**
		@return TaskID: string
	*/
	uploadFile(file: UploadedFile): Promise<string | undefined>;
	getTaskStatus(taskId: string): Promise<any>;
}
