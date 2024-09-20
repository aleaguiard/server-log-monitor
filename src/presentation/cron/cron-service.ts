import cron from 'node-cron';

export class CronJobScheduler {
	private static cronPatterns: { [key: string]: string } = {
		everyMinute: '* * * * *',
		every5Minutes: '*/5 * * * *',
		everyHour: '0 * * * *',
	};

	public static schedule(cronFrequency: string, job: () => void) {
		const cronPattern = this.cronPatterns[cronFrequency];

		if (!cronPattern) {
			throw new Error('Invalid cron frequency');
		}

		cron.schedule(cronPattern, job);
	}
}
