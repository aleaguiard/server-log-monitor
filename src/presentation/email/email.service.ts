import nodemailer from 'nodemailer';

interface sendEmailOptions {
	to: string;
	subject: string;
	htmlBody: string;
	//todo: add attachments
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
		const { to, subject, htmlBody } = options;

		try {
			const sentInformation = await this.transporter.sendMail({
				from: process.env.MAILER_EMAIL,
				to,
				subject,
				html: htmlBody,
			});

			console.log(sentInformation);
			return true;
		} catch (error) {
			console.log(error);
			return false;
		}
	}
}
