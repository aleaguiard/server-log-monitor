import express from 'express';
import path from 'path';
import cors from 'cors';
import { LogRepositoryImpl } from '../infraestructure/repositories/log.repositoty.impl';
import { FileSystemDatasource } from '../infraestructure/datasources/file-system.datasource';
import { MongoLogDatasource } from '../infraestructure/datasources/mongo-log.datasource';
import { PostgresLogDatasource } from '../infraestructure/datasources/postgres-log.datasource';
import { LogEntity, LogSeverityLevel } from '../domain/entities/log.entity';
import { EmailService } from './email/email.service';
import cron from 'node-cron';

const app = express();
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(cors());

const emailService = new EmailService();

const logRepositories = {
	mongo: new LogRepositoryImpl(new MongoLogDatasource()),
	postgres: new LogRepositoryImpl(new PostgresLogDatasource()),
	filesystem: new LogRepositoryImpl(new FileSystemDatasource()),
};

function getLogRepository(logMethod: string) {
	if (logMethod === 'mongo') return logRepositories.mongo;
	if (logMethod === 'postgres') return logRepositories.postgres;
	if (logMethod === 'filesystem') return logRepositories.filesystem;

	throw new Error('Invalid log method');
}

function createCronJob(cronFrequency: string, url: string, logMethod: string, email: string) {
	let cronPattern;

	switch (cronFrequency) {
		case 'everyMinute':
			cronPattern = '* * * * *';
			break;
		case 'every5Minutes':
			cronPattern = '*/5 * * * *';
			break;
		case 'everyHour':
			cronPattern = '0 * * * *';
			break;
		default:
			return;
	}

	cron.schedule(cronPattern, async () => {
		await processLog(url, logMethod, email);
	});
}

async function processLog(url: string, logMethod: string, email: string) {
	try {
		let severity = LogSeverityLevel.high;

		try {
			const response = await fetch(url);
			severity = response.ok ? LogSeverityLevel.low : LogSeverityLevel.high;
		} catch {}

		const logRepository = getLogRepository(logMethod);
		const newLog = new LogEntity({
			level: severity,
			message: `Checked URL: ${url}`,
			origin: 'Frontend',
		});

		await logRepository.saveLog(newLog);

		const emailSent = await emailService.sendEmail({
			to: email,
			subject: 'Log Notification',
			htmlBody: `<p>Log saved for URL: ${url}</p>`,
		});

		if (!emailSent) {
			console.error('Error sending email notification');
		}
	} catch (error) {
		console.error('Error processing log:', error);

		await emailService.sendEmail({
			to: email,
			subject: 'Log Error',
			htmlBody: `<p>Failed to save log for URL: ${url}. Error: ${error}</p>`,
		});
	}
}

app.post('/log', async (req, res) => {
	const { url, logMethod, cronFrequency, email } = req.body;

	try {
		if (!url || !logMethod) {
			return res.status(400).send('URL or log method missing');
		}

		if (cronFrequency !== 'none') {
			createCronJob(cronFrequency, url, logMethod, email);
		} else {
			await processLog(url, logMethod, email);
		}

		return res.status(200).send(`Log request processed for ${url} with method ${logMethod}`);
	} catch (error) {
		return res.status(500).send(`Error processing log: ${error}`);
	}
});

export class Server {
	public static async start() {
		app.listen(3000);
	}
}
