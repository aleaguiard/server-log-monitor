import express from 'express';
import path from 'path';
import { LogRepositoryImpl } from '../infraestructure/repositories/log.repositoty.impl';
import { FileSystemDatasource } from '../infraestructure/datasources/file-system.datasource';
import { MongoLogDatasource } from '../infraestructure/datasources/mongo-log.datasource';
import { PostgresLogDatasource } from '../infraestructure/datasources/postgres-log.datasource';
import { LogEntity, LogSeverityLevel } from '../domain/entities/log.entity';
import cors from 'cors';

const app = express();
app.use(express.static(path.join(__dirname, '../../public')));
app.use(express.json());
app.use(cors());

const logRepositories = {
	mongo: new LogRepositoryImpl(new MongoLogDatasource()),
	postgres: new LogRepositoryImpl(new PostgresLogDatasource()),
	filesystem: new LogRepositoryImpl(new FileSystemDatasource()),
};

function getLogRepository(logMethod: string) {
	if (logMethod === 'mongo') return logRepositories.mongo;
	if (logMethod === 'postgres') return logRepositories.postgres;
	if (logMethod === 'filesystem') return logRepositories.filesystem;

	throw new Error('Método de log inválido');
}

app.post('/log', async (req, res) => {
	const { url, logMethod } = req.body;

	try {
		if (!url || !logMethod) {
			return res.status(400).send('URL o método de log faltante');
		}

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

		return res.status(200).send(`Log guardado correctamente en ${logMethod}`);
	} catch (error) {
		return res.status(500).send(`Error al procesar la URL: ${error}`);
	}
});

export class Server {
	public static async start() {
		app.listen(3000);
	}
}
