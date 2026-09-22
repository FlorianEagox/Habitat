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
		'@vite-pwa/nuxt'
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
	},
	pwa: {
		registerType: 'autoUpdate',
		manifest: {
			name: 'Habitat',
			theme_color: '#bb0bb',
			icons: [{
				src: 'assets/sisyphus.png',
				type: 'image/png'
			}]
		},
		devOptions: {
			enabled: true,
			type: "module"
		}
	}
})