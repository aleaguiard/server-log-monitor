import { Server } from './presentation/server';
import * as dotenv from 'dotenv';

dotenv.config();

(async () => {
	main();
})();

function main() {
	Server.start();
}
