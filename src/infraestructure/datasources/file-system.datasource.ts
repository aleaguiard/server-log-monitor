import { LogDatasource } from '../../domain/datasources/log.datasource';
import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import * as fs from 'fs';

export class FileSystemDatasource implements LogDatasource {
	private readonly logPath: string = 'logs/';
	private readonly allLogsPath: string = 'logs/logs-all.log';
	private readonly lowLogsPath: string = 'logs/logs-low.log';
	private readonly mediumLogsPath: string = 'logs/logs-medium.log';
	private readonly highLogsPath: string = 'logs/logs-high.log';

	constructor() {
		this.createLogsFiles();
	}

	private createLogsFiles(): void {
		if (!fs.existsSync(this.logPath)) {
			fs.mkdirSync(this.logPath);
		}
		[this.allLogsPath, this.mediumLogsPath, this.highLogsPath, this.lowLogsPath].forEach(
			(path) => {
				if (!fs.existsSync(path)) {
					fs.writeFileSync(path, '');
				}
			}
		);
	}

	async saveLog(newlog: LogEntity): Promise<void> {
		const logAsJson = `${JSON.stringify(newlog)}\n`;

		fs.appendFileSync(this.allLogsPath, logAsJson);

		if (newlog.level === LogSeverityLevel.low) {
			fs.appendFileSync(this.lowLogsPath, logAsJson);
			return;
		}

		if (newlog.level === LogSeverityLevel.medium) {
			fs.appendFileSync(this.mediumLogsPath, logAsJson);
			return;
		}

		if (newlog.level === LogSeverityLevel.high) {
			fs.appendFileSync(this.highLogsPath, logAsJson);
			return;
		}
	}

	private getLogsFromFile(path: string): LogEntity[] {
		const content = fs.readFileSync(path, 'utf8');
		const logs = content.split('\n').map(LogEntity.fromJson);

		return logs;
	}

	async getLog(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
		switch (severityLevel) {
			case LogSeverityLevel.low:
				return this.getLogsFromFile(this.allLogsPath);
			case LogSeverityLevel.medium:
				return this.getLogsFromFile(this.mediumLogsPath);
			case LogSeverityLevel.high:
				return this.getLogsFromFile(this.highLogsPath);
			default:
				throw new Error('Invalid severity level');
		}
	}
}
