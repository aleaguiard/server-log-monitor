import mongoose from 'mongoose';
import { PrismaClient } from '@prisma/client';

export class DatabaseManager {
	private static prismaClient = new PrismaClient();

	static async initializeMongo() {
		const mongoUrl = process.env.MONGO_URL;
		const dbName = process.env.MONGO_DB_NAME;

		if (mongoUrl && dbName) {
			try {
				await mongoose.connect(mongoUrl, { dbName });
				console.log('Connected to MongoDB');
			} catch (error) {
				throw new Error(`MongoDB connection error: ${error}`);
			}
		}
	}

	static async initializePostgres() {
		try {
			await this.prismaClient.$connect();
			console.log('Connected to PostgreSQL');
		} catch (error) {
			throw new Error(`PostgreSQL connection error: ${error}`);
		}
	}
}
