import { authClient } from '~/app.vue';


export default defineNuxtRouteMiddleware(async to => {
	const { data: session } = await authClient.useSession(useFetch);
	console.log({...to.meta}, session.value, to.meta.layout == 'default' && !session.value)
	if (to.meta.layout != "logged-out" && !session.value) return navigateTo('/')

	if (to.meta.layout == "logged-out" && session.value) return navigateTo('/tracker')
});