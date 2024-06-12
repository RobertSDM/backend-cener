import "dotenv/config"

export const HOST = process.env.HOST || "0.0.0.0"
export const PORT = Number(process.env.PORT) || 4550
export const SERVER_URL = process.env.SERVER_URL
export const HOME_URL = process.env.HOME_URL;
export const AUTH_APIS = process.env.AUTH_APIS;

