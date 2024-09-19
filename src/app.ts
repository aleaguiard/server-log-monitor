import { DatabaseManager } from './config/database';
import { Server } from './presentation/server';

(async () => {
	try {
		await DatabaseManager.initializeMongo();
		await DatabaseManager.initializePostgres();
		await Server.start();
	} catch (error) {
		console.error(`Failed to start server: ${error}`);
		process.exit(1);
	}
})();
