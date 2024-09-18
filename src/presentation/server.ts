import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { LogRepositoryImpl } from '../infraestructure/repositories/log.repositoty.impl';
import { FileSystemDatasource } from '../infraestructure/datasources/file-system.datasource';
import { EmailService } from './email/email.service';
import { SendEmailLogs } from '../domain/use-cases/email/send-email-logs';
import { MongoLogDatasource } from '../infraestructure/datasources/mongo-log.datasource';
import { PostgresLogDatasource } from '../infraestructure/datasources/postgres-log.datasource';
import { CheckServiceMultiple } from '../domain/use-cases/checks/check-service-multi';

const monoLogRepository = new LogRepositoryImpl(
	//new FileSystemDatasource()
	//new MongoLogDatasource()
	new PostgresLogDatasource()
);

// multi-datasource
const fslogRepository = new LogRepositoryImpl(new FileSystemDatasource());
const mongoRepository = new LogRepositoryImpl(new MongoLogDatasource());
const postgresRepository = new LogRepositoryImpl(new PostgresLogDatasource());

const emailService = new EmailService();

export class Server {
	public static start() {
		/* Send email with logs when server is down **/
		// new SendEmailLogs(emailService, fileSystemLogRepository).execute('lorem@ipsum.com');

		/* Check if server is up every 5 minutes **/

		CronService.createJob('*/5 * * * * *', () => {
			const url = 'http://localhost:3000';
			new CheckServiceMultiple(
				[fslogRepository, mongoRepository, postgresRepository],
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
