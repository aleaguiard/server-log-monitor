import nodemailer from 'nodemailer';
import { Attachment } from 'nodemailer/lib/mailer';

interface Attachement {
	filename: string;
	path: string;
}
interface sendEmailOptions {
	to: string | string[];
	subject: string;
	htmlBody: string;
	attachments?: Attachment[];
}

export class EmailService {
	private transporter = nodemailer.createTransport({
		service: process.env.EMAIL_SERVICE,
		auth: {
			user: process.env.MAILER_EMAIL,
			pass: process.env.MAILER_SECRET_KEY,
		},
	});

	async sendEmail(options: sendEmailOptions): Promise<boolean> {
		const { to, subject, htmlBody, attachments = [] } = options;

		try {
			const sentInformation = await this.transporter.sendMail({
				from: process.env.MAILER_EMAIL,
				to,
				subject,
				html: htmlBody,
				attachments: attachments,
			});

			console.log(sentInformation);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}

	sendEmailWithFileSystemLogs(to: string | string[]) {
		const subject = 'Logs server';
		const htmlBody = `<h1>Logs server info</h1>
			<p>See logs server here</p>`;
		const attachments: Attachement[] = [
			{ filename: 'logs-all.log', path: './logs/logs-all.log' },
			{ filename: 'logs-high.log', path: './logs/logs-high.log' },
		];

		return this.sendEmail({ to, subject, htmlBody, attachments });
	}
}
