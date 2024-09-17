import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { LogRepositoryImpl } from '../infraestructure/repositories/log.repositoty.impl';
import { FileSystemDatasource } from '../infraestructure/datasources/file-system.datasource';
import { EmailService } from './email/email.service';

const fileSystemLogRepository = new LogRepositoryImpl(new FileSystemDatasource());

export class Server {
	public static start() {
		const emailService = new EmailService();
		const emailOptions = {
			to: 'lorem@ipsum.com',
			subject: 'Logs server',
			htmlBody: `<h1>Logs server info</h1>
			<p>See logs server here</p>`,
		};
		emailService.sendEmailWithFileSystemLogs(emailOptions.to);

		console.log('Server running...');
		CronService.createJob('*/5 * * * * *', () => {
			const url = 'http://localhost:3000';
			new CheckService(
				fileSystemLogRepository,
				() => {
					console.log(`${url} is up!`);
				},

				(error) => {
					console.log(`${url} is down!`);
				}
			).execute(url);
		});
	}
}
