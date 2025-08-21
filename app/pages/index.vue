<template>
	<div id="container">
		<Header />
		<main>
			<Sidebar />
			<Tracker />
		</main>
		<div id="ground" />
		<Footer />
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
		background: linear-gradient(
			#0D0221 0%,
			#45125e 40%,
			#A22561 80%,
			#FF3864 100%
		);
		box-shadow:
		0 0 100px purple,
		0 0 200px purple;
	}
	#container {
		display: flex;
		flex-direction: column;
		min-height: 100vh;
		align-items: center;
		overflow-x: hidden;
	}
	main {
		display: flex;
		flex: 1;
		width: 100%;
		padding: 0 20px;
		
		justify-content: space-evenly;
	}
	aside {
		flex-basis: 25%
	}
	#tracker {
		flex: 1;
	}
	footer {
		margin-top: auto;
	}

	#ground {
		height: 40%;
		width: 120vw;
		overflow: hidden;
		position: absolute;
		left: -10vw;
		bottom: -1vh;
		z-index: -1;
		
		perspective: var(--ground-size);
		perspective-origin: top center;
		transform-style: preserve-3d;
		transform:
			translate(calc(var(--ratio-x) * 1vw), calc(var(--ratio-y) * 1vh))
			rotateZ(calc(var(--ratio-x) * -0.5deg));
		
		border-top: solid 3px hsla(var(--electro), .6);
		background-color: hsl(var(--purple));
		background-image: radial-gradient(100% 60% at bottom, hsla(var(--electro), .1), hsla(var(--purple), 1));
		box-shadow:
			0 3px 10px 2px hsla(var(--white), .2),
			0 2px 20px 2px hsla(var(--electro), .3);
	}
	#ground::before {
		--alpha: .2;
		content: '';
		
		display: block;
		width: 100%;
		height: 100%;
		overflow: hidden;
		position: absolute;
		top: 0;
		
		transform-origin: top center;
		transform: rotateX(76deg) translate3d(calc(var(--ratio-x) * 1vw), 0, 0);
		backface-visibility: hidden;

		background-image:
		linear-gradient(to bottom, hsla(var(--electro), var(--alpha)) 1px, transparent 1px),
		linear-gradient(to right, hsla(var(--citrus), var(--alpha)) 1px, transparent 1px);
		background-size: 1px var(--ground-line), calc(2 * var(--ground-line)) 1px;
		background-position: 0% 0%, center;
		mix-blend-mode: color-dodge;
		
		animation: ground-lines var(--ground-speed) linear infinite;
		z-index: -1;
	}
	@keyframes ground-lines {
		0% {
			background-position: 0% 0%, center;
		}
		100% {
			background-position: 0% 50%, center;
		}
	}
	.glowy-text {
		text-shadow: 0 0 5px hsla(var(--purple), 1);
		color: hsl(var(--electro));
	}
</style>