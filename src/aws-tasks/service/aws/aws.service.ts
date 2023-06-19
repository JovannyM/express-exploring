import { UploadedFile } from 'express-fileupload';

export interface AWSService {
	/**
		@return TaskID: string
	*/
	uploadFile(file: UploadedFile): Promise<string | undefined>;
	getMessagesFromQueue(): Promise<void>;
	getTaskStatus(taskId: string): Promise<any>;
}
