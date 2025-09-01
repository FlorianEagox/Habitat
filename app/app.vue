<script>
import { createAuthClient } from 'better-auth/vue';
export const authClient = createAuthClient({});

</script>


<template>
	<div>
		<NuxtRouteAnnouncer />
		<NuxtLayout>
			<NuxtPage />
		</NuxtLayout>
	</div>
</template>

<style>
	* {
		margin: 0;
		padding: 0;
		box-sizing: border-box;
	}
	:root {
		--white: 47deg, 98%, 95%;
		--citrus: 47deg, 95%, 52%;
		--orange: 23deg, 100%, 53%;
		--sanguine: 347deg, 100%, 61%;
		--pink: 346deg, 98%, 55%;
		--electro: 181deg, 79%, 54%;
		--purple: 261deg, 56%, 15%;
		--night: 261deg, 89%, 7%;
		--violet: 284deg, 80%, 20%;
		
		--sky-line: 7px;
		--sun-size: 50vh;
		--ground-size: 45vh;
		--ground-line: 23px;
		--ground-speed: 8s;
		
		--ratio-x: 0;
		--ratio-y: 0;
	}

	body {
		font-family: Arial, sans-serif;
		background-color: #0a0a0a;
		color: white;
		background-image: linear-gradient(to bottom, hsla(var(--white), .05) 1px, transparent 1px),
		linear-gradient(
			#0D0221 0%,
			#45125e 40%,
			#A22561 80%,
			#FF3864 100%
		);
		background-size: 1px var(--sky-line), auto;

		/* box-shadow:
		0 0 100px purple,
		0 0 200px purple; */
	}
	#container {
		display: flex;
		flex: 0 1 90%;
		flex-direction: column;
		align-items: center;

		position: relative;
		overflow-x: hidden;
		height: 100vh;
	  	width: 100vw;
		/* z-index: -2; */
	}
	.sun {
		position: relative;
		color: hsl(var(--electro));
		border-radius: 25px;
		overflow: visible; /* make sure content can overflow if needed */
		color: hsl(var(--electro));
		/* synthwave sun */
	}
	.sun::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(orange, gold, red, purple);
		clip-path: polygon(
  -50% 0%, 150% -20%, 150% 35%, -50% 35%,
  -50% 42%, 150% 42%, 150% 50%, 0 50%,
  -50% 55%, 150% 55%, 150% 60%, 0 60%,
  -50% 62%, 150% 62%, 150% 65%, 0 65%,
  -50% 67%, 150% 67%, 150% 70%, 0 70%,
  -50% 72%, 150% 72%, 150% 75%, 0 75%,
  -50% 76%, 150% 76%, 150% 150%, 0 150%
);
		border-radius: 25px;
		box-shadow: rgba(255,128,0,0.7) 0px 0 20px;
		z-index: 0;
	}
	.glowy-text {
		text-shadow: 0 0 5px hsla(var(--purple), 1);
		color: hsl(var(--electro));
	}
	li:hover,
	.selected,
	button:hover,
	input[type="radio"]:checked + label > h3 {	
		background: linear-gradient(-180deg, hsl(var(--electro)), hsl(var(--purple)));
		/* background-color: hsla(var(--electro), 0.5); */
	}
	footer {
		margin-top: auto;
	}
</style>