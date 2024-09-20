import path from 'path';
import { FileSystemDatasource } from '../infraestructure/datasources/file-system.datasource';
import { MongoLogDatasource } from '../infraestructure/datasources/mongo-log.datasource';
import { PostgresLogDatasource } from '../infraestructure/datasources/postgres-log.datasource';
import { LogRepositoryImpl } from '../infraestructure/repositories/log.repositoty.impl';
import { CronJobScheduler } from './cron/cron-service';
import { EmailService } from './email/email.service';
import { LogService } from './log/log.service';
import express from 'express';
import cors from 'cors';

export class Server {
	app = express();
	private emailService = new EmailService();
	private logRepositories = {
		mongo: new LogRepositoryImpl(new MongoLogDatasource()),
		postgres: new LogRepositoryImpl(new PostgresLogDatasource()),
		filesystem: new LogRepositoryImpl(new FileSystemDatasource()),
	};

	constructor() {
		this.configureMiddleware();
		this.setupRoutes();
	}

	private configureMiddleware() {
		this.app.use(express.static(path.join(__dirname, '../../public')));
		this.app.use(express.json());
		this.app.use(cors());
	}

	private setupRoutes() {
		this.app.post('/log', this.handleLogRequest.bind(this));
	}

	private async handleLogRequest(req: express.Request, res: express.Response) {
		const { url, logMethod, cronFrequency, email } = req.body;

		try {
			if (!url || !logMethod) {
				return res.status(400).send('URL or log method missing');
			}

			const logService = new LogService(this.getLogRepository(logMethod), this.emailService);

			if (cronFrequency !== 'none') {
				CronJobScheduler.schedule(cronFrequency, () => logService.processLog(url, email));
			} else {
				await logService.processLog(url, email);
			}

			return res
				.status(200)
				.send(`Log request processed for ${url} with method ${logMethod}`);
		} catch (error) {
			return res.status(500).send(`Error processing log: ${error}`);
		}
	}

	private getLogRepository(logMethod: string) {
		if (logMethod === 'mongo') return this.logRepositories.mongo;
		if (logMethod === 'postgres') return this.logRepositories.postgres;
		if (logMethod === 'filesystem') return this.logRepositories.filesystem;

		throw new Error('Invalid log method');
	}

	public static async start() {
		const serverInstance = new Server();
		serverInstance.app.listen(3000, () => {
			console.log('Server running on port 3000');
		});
	}
}
