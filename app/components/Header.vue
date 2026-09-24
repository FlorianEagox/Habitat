<template>
	<header>
		<img src="~/assets/sisyphus.png" alt="Vaporwave Sysaphus" />
		<div id="heading">
			<h1 id="title" class="metal raise">Habitat</h1>
			<span id="splash-text" v-text="splashText"/>
		</div>
		<img src="~/assets/sisyphus.png" alt="Vaporwave Sysaphus" />
		<!-- <nav>
			<ul>
				<li><a href="/">Home</a></li>
				<li><a href="/about">About</a></li>
				<li><a href="/contact">Contact</a></li>
			</ul>
		</nav> -->
		<div v-if="session.data" id="user" class="glassy">
			<span>{{ session.data.user.name }}</span>
			<button id="logout" class="danger" @click="triggerLogout">
				<Icon name="material-symbols:power-settings-circle-rounded" />
				Log Out
			</button>
		</div>
	</header>
</template>

<script setup>
import { authClient } from '~/app.vue';
import { computed } from 'vue';

const splashTexts = [
	"Become your best self",
	"Big Bestie is watching",
	"You are not alone",
	"Surviving in capitalism",
	"Thriving in squalor",
	"Malco Paradiso",
	"The best is yet to come",
	"It's gotta be done!",
	"Better than nothing",
	"Life happens wherever you go",
	"Gimmie a dollar maine",
	"Couldn't have done it w/o you",
	"The clock is ticking",
	"Are you satisfied?",
	"Just ONE more video?",
	"That will be all",
	"You filthy... CLODS",
	"The sun does shine for you",
	"You're gonna die one day :)",
	"Hai Lizzy :3 ^w^",
	"Surveillance is better with friends",
	"Get off the internet!",
	"Today's Yesterday's Tomorrow",
	"Your future self will thank you",
	"Make it count",
	"It is what it is",
	"I'm not depressed, you're depressed!",
	"WTF is Minecraft?",
	"Thinking of you",
	"999",
	"Just keep swimming",
	"Vaporware in training",
	"You're the poison and the antitode",
	"That's my purse, Idk u!!!",
	"u like jazz?",
	"Streaking in the summertime",
	"YOLO",
	"You can do it, we can help",
	"It gets easier, but ya gotta do it every day",
	"It's not you, it's me",
	"It's dangerous to go alone, take this!",
	"Marco? Polo!",
	"#VapeNation",
	"Go Piss, Girl!"
];
const splashText = computed(() => {
	return splashTexts[Math.floor(Math.random() * splashTexts.length)];
});
function triggerLogout() {
	authClient.signOut({fetchOptions: {
		onSuccess: () => navigateTo('/'),
		onError: console.log
	}})
}
const session = authClient.useSession();
</script>

<style>
	@font-face {
		font-family: 'alvera';
		src: url('/fonts/alvera.otf') format('opentype');
	}

	@font-face {
		font-family: "Caveat";
		src: url("https://fonts.gstatic.com/s/caveat/v22/WnznHAc5bAfYB2QRah7pcpNvOx-pjfJ9eIWpYQ.woff2") format("woff2");
		font-weight: 400;
		font-display: swap;
	}
	header {
		display: flex;
		justify-content: center;
		align-items: center;
		position: relative;
		width: 100%;
		margin-top: 1em;
	}
	#heading {
		position: relative;
	}
	h1 {
		font-size: 8em;
		margin: 0;
		font-family: 'alvera';
		/* font-family: "Fredoka One"; */
		font-weight: bold;
	  	background-clip: text;
	}
	#splash-text {
		position: absolute;
		transform:  rotate(-20deg);
		font-size: 1.75em;
		color: #ff00ff;
		top: 25px;
		right: 0;
		font-family: Caveat;
		text-shadow: -1px -2px hsl(53, 100%, 81%), 3px 3px hsl(240, 90%, 61%);
	}
	img {
		max-width: 100px;
		object-fit: scale-down;
	}
	img:last-of-type {
		transform: rotateY(180deg);
	}

	.metal {
		background: linear-gradient(
			hsl(239, 50%, 30%) 15%,
			hsl(239, 50%, 40%) 25%,
			hsl(200, 60%, 50%) 35%,
			hsl(100, 70%, 80%) 45%,
			hsl(60, 100%, 98%) 50%,
			hsl(240, 0%, 0%) 52%,
			hsl(240, 10%, 10%) 60%,
			hsl(240, 50%, 30%) 70%,
			hsl(220, 70%, 60%) 80%,
			hsl(212, 92%, 76%) 85%
		);
		color: transparent;
		background-clip: text;
		-webkit-text-stroke: 1px hsla(200, 65%, 80%, 0.5);
	}
	.raise {
		filter: drop-shadow(1px 3px 0px hsl(242, 54%, 10%))
		drop-shadow(1px 3px 0px hsl(242, 54%, 15%))
		drop-shadow(1px 3px 0px hsl(242, 54%, 20%))
		drop-shadow(1px 3px 0px hsl(242, 54%, 25%))
		drop-shadow(1px 3px 0px hsl(242, 54%, 30%))
		drop-shadow(0px 0px 10px rgba(16, 16, 16, 0.4));
	}
	
	#user {
		position: absolute;
		display: inline-block;
		padding: 0.75em;
		right: 2em;
	}
	#user > * {
		margin: 0.25em;
	}
	#logout {
		border-radius: 15px;
		padding: 0.5em;
		border: none;
		background: #ffffffaa;
		display: flex;
	}

	@media (max-width: 768px) {
		#splash-text {
			top: 10px;
			right: -35px;
			z-index: 2;
			font-size: 1rem;
			transform: rotate(20deg);
		}
		h1 {
			font-size: 2.9rem;
		}
		img {
			max-width: 70px;
		}
		#user {
			position: fixed;
			top: 0.5em;
			right: 0.5em;
			left: auto;
			z-index: 2;
			display: flex;
			flex-direction: column;
			align-items: center;
			gap: 0.5em;
			padding: 0.3em 0.5em;
			border-radius: 15px;
			box-shadow: 0 0 10px hsla(var(--electro), 0.5);
		}
		#user span {
			font-size: 0.6rem;
			white-space: nowrap;
			overflow: hidden;
			max-width: 10vw;
		}
		#logout {
			display: flex;
			align-items: center;
			justify-content: center;
			gap: 0.3em;
			padding: 0.4em 0.6em;
			border-radius: 26px;
			border: 2px solid hsla(var(--electro));
			box-shadow: 0 0 10px hsla(var(--electro), 0.5);
			background: none;
			color: hsl(var(--electro));
			font-size: 0.6rem;
			white-space: nowrap;
		}
	}
</style>