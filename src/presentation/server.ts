import { CronService } from './cron/cron-service';
import { CheckService } from '../domain/use-cases/checks/check-service';
import { LogRepositoryImpl } from '../infraestructure/repositories/log.repositoty.impl';
import { FileSystemDatasource } from '../infraestructure/datasources/file-system.datasource';

const fileSystemLogRepository = new LogRepositoryImpl(new FileSystemDatasource());

export class Server {
	public static start() {
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
