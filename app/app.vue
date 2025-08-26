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
		overflow: hidden;
		height: 100vh;
	  	width: 100vw;
		/* z-index: -2; */
	}
	footer {
		margin-top: auto;
	}
</style>