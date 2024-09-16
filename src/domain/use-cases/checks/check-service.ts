import { log } from 'console';
import { LogRepository } from '../../repository/log.repository';
import { LogEntity, LogSeverityLevel } from '../../entities/log.entity';
interface CheckServiceUseCase {
	execute(url: string): Promise<boolean>;
}

type SuccessCallback = () => void;
type ErrorCallback = (error: String) => void;

export class CheckService implements CheckServiceUseCase {
	constructor(
		private readonly LogRepository: LogRepository,
		private readonly successCallback: SuccessCallback,
		private readonly errorCallback: ErrorCallback
	) {}

	async execute(url: string): Promise<boolean> {
		try {
			const request = await fetch(url);
			if (!request.ok) {
				throw new Error('Request failed');
			}
			this.LogRepository.saveLog(new LogEntity(LogSeverityLevel.low, `${url} is up`));
			this.successCallback();
			return true;
		} catch (error) {
			this.LogRepository.saveLog(new LogEntity(LogSeverityLevel.high, `${url} is down`));
			this.errorCallback(`${error}`);
			return false;
		}
	}
}
