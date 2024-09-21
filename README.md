# Server Log Monitor

**NOC App** is a server monitoring application designed to track the health and log the status of servers across multiple data sources such as MongoDB, PostgreSQL, and local filesystem. It includes email notifications for log alerts and supports cron-based scheduling for periodic checks.

## Features

-   **Multi-Source Logging**: Supports logging to MongoDB, PostgreSQL, and a local filesystem, ensuring flexibility and reliability.
-   **Email Notifications**: Get notified via email about log alerts and server status changes.
-   **Cron-Based Scheduling**: Schedule periodic checks for server health and log monitoring.

## Installation

1. Clone the repository:
    ```bash
    git clone https://github.com/aleaguiard/server-log-monitor.git
    cd server-log-monitor
    ```
2. Install dependencies:

    ```bash
    npm install
    ```

3. Create a `.env` file from the `.env.template` file:

    ```bash
    cp .env.template .env
    ```

4. Update the `.env` file with your MongoDB and PostgreSQL connection details, as well as your email service credentials.

5. Start the application:
    ```bash
    npm start
    ```

## Usage

### Configuration

The application requires the following configuration:

-   **MongoDB Connection**: Provide the connection details for your MongoDB database.
-   **PostgreSQL Connection**: Provide the connection details for your PostgreSQL database.
-   **Email Service**: Configure the email service provider (e.g., Gmail, SendGrid) and provide the necessary credentials.
-   **Email Notifications**: Specify the email addresses to receive notifications.
-   **Cron Scheduling**: Configure the cron job to run periodically.

### Email Notifications

To enable email notifications, update the `EMAIL_SERVICE` environment variable in the `.env` file to the desired service (e.g., Gmail). Add your `MAILER_EMAIL` and `MAILER_SECRET_KEY` to the `.env` file.

### Docker

To run the database services in Docker, use the provided `docker-compose.yml` file:

```bash
docker-compose up -d
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more information.

## Acknowledgments

-   [Node.js](https://nodejs.org/)
-   [Express.js](https://expressjs.com/)
-   [Mongoose](https://mongoosejs.com/)
-   [Nodemailer](https://nodemailer.com/)
-   [TypeScript](https://www.typescriptlang.org/)
-   [Prisma](https://prisma.io/)
-   [Node-cron](https://www.npmjs.com/package/node-cron)
