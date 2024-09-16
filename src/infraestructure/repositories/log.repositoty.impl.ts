import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import { LogRepository } from '../../domain/repository/log.repository';
import { LogDatasource } from '../../domain/datasources/log.datasource';

export class LogRepositoryImpl implements LogRepository {
	constructor(private readonly logDatasource: LogDatasource) {}

	async saveLog(log: LogEntity): Promise<void> {
		return this.logDatasource.saveLog(log);
	}
	async getLog(severityLevel: LogSeverityLevel): Promise<LogEntity[]> {
		return this.logDatasource.getLog(severityLevel);
	}
}
