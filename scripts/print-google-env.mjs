import { readFileSync } from 'fs';
import { resolve } from 'path';

const file = process.argv[2] || 'google-service-account.json';
const raw = readFileSync(resolve(process.cwd(), file), 'utf8');
const json = JSON.stringify(JSON.parse(raw));
console.log(`GOOGLE_SERVICE_ACCOUNT_JSON=${json}`);
