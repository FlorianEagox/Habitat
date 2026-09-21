import { betterAuth } from "better-auth";
import { mongodbAdapter } from 'better-auth/adapters/mongodb'
import { MongoClient } from "mongodb";
import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)
const url = 'mongodb://localhost:27017/habitat';

export const auth = betterAuth({
	database: mongodbAdapter(new MongoClient(url).db()),
	telemetry: {enabled: false},
	user: {
		modelName: 'users',
		fields: {
			name: "username"
		},
		additionalFields: {
			friends: {type: 'string[]', required: false, default: []},
			avatar: {type: 'string', required: false, default: ''},
		}
	},
	advanced: {
		cookiePrefix: "habitat",
		database: {
			generateId: false
		}
	},
	emailAndPassword: {
		enabled: true,
		requireEmailVerification: false,
		sendResetPassword: async ({user, url, token}, request) => {
			await resend.emails.send({
				to: user.email,
				from: "habitat@tessapainter.com",
				subject: "Reset your Habitat Password",
				text: `Oh, ${user.name}, you're such a dumbydumb!\n Take this, it's dangerous to go alone!\n ${url}`,
			})
		}
	}
});
