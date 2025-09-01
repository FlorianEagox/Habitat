<script setup>
import { ref, onMounted, useTemplateRef } from 'vue';
import { authClient } from '../app.vue'

const tab = ref('register');

// refs for registration
const txtUsername = ref(null);
const registerUsername = ref('');
const registerEmail = ref('');
const registerPassword = ref('');

const loginUser = ref('');
const loginPassword = ref('');


async function handleRegister(e) {
	e.preventDefault();
	const {data, error} = await authClient.signUp.email({
		email: registerEmail.value,
		name: registerUsername.value, 
		password: registerPassword.value
	}, {
		onSuccess: () => navigateTo('/tracker')
	})
}
async function handleLogin(e) {
	e.preventDefault()
	const {data, error} = await authClient.signIn.email(
		{ email: loginUser.value, password: loginPassword.value }, 
		{ onSuccess: () => navigateTo('/tracker') }
	);
}
onMounted(() => {
	txtUsername.value.focus()
	txtUsername.value.scrollIntoView({behavior: 'smooth'})
});
</script>

<template>
	<div id="auth" class="sun glowy-text">
		<div class="tabs glassy">
			<input type="radio" name="tabSelection" id="tabRegister" value="register" v-model="tab" hidden selected>
			<label for="tabRegister"><h3>Get Tracking!</h3></label>

			<input type="radio" name="tabSelection" id="tabLogin" value="login" v-model="tab" hidden>
			<label for="tabLogin"><h3>Log In</h3></label>
		</div>
		<form v-if="tab == 'register'" action="">
			<label for="username" class="cheese">Choose a username</label>
			<input type="text" id="username" class="glassy" v-model="registerUsername" name="username" ref="txtUsername" required/>
			<label for="email">Email:</label>
			<input type="email" id="email" class="glassy" v-model="registerEmail" name="email" required />
			<label for="password">Password:</label>
			<input type="password" id="password" class="glassy" v-model="registerPassword" required />
			<button class="glassy" @click="handleRegister">Letsa go</button>
		</form>
		<form v-else action="">
			<label for="loginUser">Email/Username:</label>
			<input type="email" id="loginUser" class="glassy"  v-model="loginUser" name="user" required />
			<label for="loginPassword">Password:</label>
			<input type="password" id="loginPassword" class="glassy"  v-model="loginPassword" required />
			<button class="glassy" @click="handleLogin">Letsa go</button>
			<a href="#">Forgot username/password?</a>
		</form>
	</div>
</template>

<style lang="scss">

	#auth {
		text-align: center;
		margin-top: 2em;
		margin: auto;
		display: inline-block;
		padding: 1em;
		width: auto;
		height: auto;
		// clip-path: polygon(
		// 0% 0%, 100% 0%, 100% 35%, 0% 35%,
		// 0% 45%, 100% 45%, 100% 52%, 0% 52%,
		// 0% 58%, 100% 58%, 100% 63%, 0% 63%,
		// 0% 68%, 100% 68%, 100% 73%, 0% 73%,
		// 0% 78%, 100% 78%, 100% 100%, 0% 100%
		// );
		clip-path: none;
	}
	.tabs {
		display: flex;
		justify-content: center;
		border-bottom: 3px dashed hsla(var(--electro), 0.9) !important;
		padding: 0.5em;
	}
	.tabs label {
		width: 100%;
	}
	.tabs h3 {
		padding: 0.4em;
		border-radius: 15px;
		margin: auto;
		display: inline-block;
	}
	.tabs > label:first-of-type {
		border-right: 3px dashed hsl(var(--electro)); // hsl(var(--electro));
	}

	form {
		display: flex;
		flex-direction: column;
		width: 90%;
		display: grid;
		grid-template-columns: auto 1fr;
		grid-gap: 0.3em;
		padding: 0.5em;
	}
	
	form label {
		white-space: nowrap;
		margin: 0.3em;
		text-align: left;
		font-weight: bolder;
	}

	form input {
		color: var(--citrus);
		border: none;
		border-bottom: 3px dashed hsla(var(--electro), 0.7) !important;
		background: none;
		border-radius: 5px;
		// width: 90%;
		margin: auto;
		text-shadow: inherit;
		// outline: none;
		// inset: none;
		padding: 0.5em 1em;
	}

	form button {
		margin: 0.3em;
		padding: 0.5em;
		border: 3px dashed hsla(var(--electro), 0.9) !important;
		// background: hsla(var(--electro), 0.2);
		margin: 0.25em;
		color: inherit;
		background: none;
		text-shadow: inherit;
		font-weight: bold;
		grid-column: 2;
		justify-self: center;
		width: 70%;
	}
	form a {
		grid-column: span 2;
		color: inherit;
		margin: 0.2em;
	}
</style>