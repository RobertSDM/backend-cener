import "dotenv/config";


const HOST = process.env.HOST || "0.0.0.0";
const PORT = Number(process.env.PORT) || 4550;
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:4550';
const HOME_URL = process.env.HOME_URL || "http://localhost:4500";
const VITE_AUTH_TOKEN = process.env.VITE_AUTH_TOKEN;


export { HOST, PORT, SERVER_URL, HOME_URL, VITE_AUTH_TOKEN };