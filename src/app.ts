import { MongoDatabase } from './data/mongo/init';
import { LogModel } from './data/mongo/models/log.model';
import { Server } from './presentation/server';

(async () => {
	main();
})();

async function main() {
	const mongoUrl = process.env.MONGO_URL;
	const dbName = process.env.MONGO_DB_NAME;

	if (!mongoUrl || !dbName) {
		throw new Error('Environment variables MONGO_URL or MONGO_DB_NAME are missing');
	}

	await MongoDatabase.connect({
		mongoUrl,
		dbName,
	});

	Server.start();
}
