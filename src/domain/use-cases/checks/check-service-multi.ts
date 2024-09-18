import { LogRepository } from '../../repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';

interface CheckServiceMultipleUseCase {
	execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: String) => void;

export class CheckServiceMultiple implements CheckServiceMultipleUseCase {
	constructor(
		private readonly LogRepository: LogRepository[],
		private readonly successCallback: SuccessCallback,
		private readonly errorCallback: ErrorCallback
	) {}

	private callLogs(log: LogEntity) {
		this.LogRepository.forEach((logRepository) => {
			logRepository.saveLog(log);
		});
	}

	async execute(url: string): Promise<boolean> {
		try {
			const request = await fetch(url);
			if (!request.ok) {
				throw new Error('Request failed');
			}
			this.callLogs(
				new LogEntity({
					level: LogSeverityLevel.low,
					message: `${url} is up`,
					origin: 'check-service',
				})
			);
			this.successCallback();
			return true;
		} catch (error) {
			this.callLogs(
				new LogEntity({
					level: LogSeverityLevel.high,
					message: `${url} is down`,
					origin: 'check-service',
				})
			);
			this.errorCallback(`${error}`);
			return false;
		}
	}
}
