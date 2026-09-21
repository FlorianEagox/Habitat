// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	ssr: true,
	devtools: { enabled: true },
	// set the host to the a domain
	devServer: {
		host: 'localhost',
		port: 8848
	},
	modules: [
		'@nuxt/fonts',
		'@nuxt/icon',
		'nuxt-auth-utils',
		'@nuxt/eslint',
		'nuxt-graphql-client',
		'nuxt-graphql-server',
		'nuxt-auth-utils',
	],
	"graphql-client": {
		codegen: {
			avoidOptionals: true,
			silent: false,
		},
		clients: {
			default: {
				host: 'https://habitat.tessapainter.com/api/graphql',
				schema: '../server/schema.graphql',
			}
		}
	},
	runtimeConfig: {
		public: {
		}
	},
	vite: {
		server: {
			allowedHosts: ["habitat.tessapainter.com"]
		}
	}
})
