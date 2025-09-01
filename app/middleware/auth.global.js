import { authClient } from '~/app.vue';


export default defineNuxtRouteMiddleware(async to => {
	const { data: session } = await authClient.useSession(useFetch);
	if (to.meta.layout == 'default' && !session.value) return navigateTo('/')

	if (to.meta.layout == "loggedOut" && session.value) return navigateTo('/tracker')
});