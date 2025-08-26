// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
				compatibilityDate: '2025-07-15',
				devtools: { enabled: true },
				// set the host to the a domain
				devServer: {
								host: 'tessapainter.com',
				},
				modules: ['@nuxt/fonts', '@nuxt/icon', // 'nuxt-graphql-server'
				'@nuxt/eslint', 'nuxt-auth-utils']
})