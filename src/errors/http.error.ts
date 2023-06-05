export class HttpError extends Error {
	public readonly statusCode: number;
	public readonly context?: string;

	constructor(statusCode: number, message: string, context?: string) {
		super(message);
		this.statusCode = statusCode;
		this.context = context;
	}
}
