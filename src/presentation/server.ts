import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { LogRepositoryImpl } from '../infraestructure/repositories/log.repositoty.impl';
import { FileSystemDatasource } from '../infraestructure/datasources/file-system.datasource';
import { EmailService } from './email/email.service';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { MongoLogDatasource } from '../infraestructure/datasources/mongo-log.datasource';

const logRepository = new LogRepositoryImpl(
	//new FileSystemDatasource()
	new MongoLogDatasource()
);
const emailService = new EmailService();

export class Server {
	public static start() {
		/* Send email with logs when server is down **/
		// new SendEmailLogs(emailService, fileSystemLogRepository).execute('lorem@ipsum.com');
		/* Check if server is up every 5 minutes **/
		// CronService.createJob('*/5 * * * * *', () => {
		// 	const url = 'http://localhost:3000';
		// 	new CheckService(
		// 		logRepository,
		// 		() => {
		// 			console.log(`${url} is up!`);
		// 		},
		// 		(error) => {
		// 			console.log(`${url} is down!`);
		// 		}
		// 	).execute(url);
		// });
	}
}
