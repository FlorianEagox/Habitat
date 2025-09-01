import { betterAuth } from "better-auth";
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from "mongodb";

const url = 'mongodb://localhost:27017/habitat';

export const auth = betterAuth({
	database: mongodbAdapter(new MongoClient(url).db()),
	telemetry: {enabled: false},
	user: {
		modelName: 'users',
	},
	advanced: {
		cookiePrefix: "habitat",
		database: {
			generateId: false
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false
	}
});