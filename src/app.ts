import { DatabaseManager } from './config/database';
import { Server } from './presentation/server';

(async () => {
	try {
		await DatabaseManager.initializeMongo();
	} catch (error) {
		console.error(`Failed to connect to MongoDB: ${error}`);
	}

	try {
		await DatabaseManager.initializePostgres();
	} catch (error) {
		console.error(`Failed to connect to PostgreSQL: ${error}`);
	}

	try {
		await Server.start();
	} catch (error) {
		console.error(`Failed to start server: ${error}`);
		process.exit(1);
	}
})();
