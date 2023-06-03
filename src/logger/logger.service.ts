import { Logger } from 'tslog';

export class LoggerService {
    private logger: Logger<string>;

    constructor() {
        this.logger = new Logger({
           hideLogPositionForProduction: true,
        });
    }

    public log(...args: unknown[]) {
        this.logger.info(...args);
    }

    public error(...args: unknown[]) {
        this.logger.error(...args);
    }

    public warn(...args: unknown[]) {
        this.logger.warn(...args);
    }
}