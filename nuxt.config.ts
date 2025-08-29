// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2025-07-15',
	ssr: true,
	devtools: { enabled: true },
	// set the host to the a domain
	devServer: {
		host: 'tessapainter.com',
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
			avoidOptionals: true
		}
	},
	runtimeConfig: {
		public: {
			// GQL_HOST: "/api/graphql",
			// GQL_HOST: 'https://api.spacex.land/graphql' // overwritten by process.env.GQL_HOST
			GQL_HOST: 'http://tessapainter.com:3000/api/query'
		}
	}
})