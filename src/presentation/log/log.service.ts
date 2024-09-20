import { LogEntity, LogSeverityLevel } from '../../domain/entities/log.entity';
import { LogRepositoryImpl } from '../../infraestructure/repositories/log.repositoty.impl';
import { EmailService } from '../email/email.service';

export class LogService {
	constructor(private logRepository: LogRepositoryImpl, private emailService: EmailService) {}

	public async processLog(url: string, email: string) {
		const severity = await this.checkUrlSeverity(url);
		await this.saveLog(url, severity);
		await this.sendNotificationEmail(url, severity, email);
	}

	private async checkUrlSeverity(url: string): Promise<LogSeverityLevel> {
		try {
			const response = await fetch(url);
			return response.ok ? LogSeverityLevel.low : LogSeverityLevel.high;
		} catch {
			return LogSeverityLevel.high;
		}
	}

	private async saveLog(url: string, severity: LogSeverityLevel) {
		const log = new LogEntity({
			level: severity,
			message: `Checked URL: ${url}`,
			origin: 'Frontend',
		});

		await this.logRepository.saveLog(log);
	}

	private async sendNotificationEmail(url: string, severity: LogSeverityLevel, email: string) {
		const emailSent = await this.emailService.sendEmail({
			to: email,
			subject: 'Log Notification',
			htmlBody: `<p>Log saved for URL: ${url}</p>
					   <p>Severity: ${severity}</p>
					   <p>Website is ${severity === LogSeverityLevel.low ? 'up' : 'down'}</p>`,
		});

		if (!emailSent) {
			console.error('Error sending email notification');
		}
	}
}
