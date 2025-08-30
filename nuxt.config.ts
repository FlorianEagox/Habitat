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
		documentPaths: ['./server', '../server', '../server/schema.graphql'],
		codegen: {
			avoidOptionals: true,
			silent: false,
		}
	},
	runtimeConfig: {
		public: {
			GQL_HOST: 'http://tessapainter.com:3000/api/graphql'
		}
	}
})