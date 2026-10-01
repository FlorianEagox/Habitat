<script setup>
definePageMeta({
  layout: 'logged-out'
})
</script>

<template>
	<main class="container">
		<article id="splash" class="glassy">
			<h2 class="metal">Conquer Yourself</h2>
			<div id="enticement">
				<section id="description">
					<p>All change starts from the bottom up. No matter your material circumstances, there are simple things you can do for yourself that make you more prepared to achieve difficult things. It's time to start becoming the person you want to be.</p>
					<p>Set goals, track your progress, and invite friends to keep eachother accountable. Stop pushing that boulder up the hill; roll it down the other side!</p>
					<button type="button" onclick="const panel=document.getElementById('auth-panel');panel.hidden=false;requestAnimationFrame(()=>{panel.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'center'});panel.querySelector('input:not([type=hidden])')?.focus({preventScroll:true})})"><span class="metal raised">Chase the Rising Sun</span></button>
				</section>
				    <!-- <button @click="openInPopup('/auth/github')">Login with GitHub</button> -->
				<img src="~/assets/sexysisyphus.png" alt="Sisyphus is vibing and sexy today chilling in the vaporwave sunset. He's got this." />
			</div>
		</article>
		<div id="auth-panel" hidden>
			<Auth />
		</div>
	</main>
</template>

<style>
	main {
		display: flex;
		flex-direction: column;
	}
	#splash {
		font-size: 1.5rem;
		text-align: center;
		width: 60%;
		padding: 2rem;
		margin: auto;
		margin-top: 4rem;
		padding-top: 0;
		position: relative;
		margin-bottom: 1em;
	}
	h2 {
		/* text-align: center; */
		color: hsl(var(--electro));
		margin: 0.4em;
		font-family: "Fredoka One";
		text-align: center;
		position: absolute;
		top: -2.5rem;
		font-size: 3.5rem;
		margin: auto;
		width: 100%;
	}
	#enticement {
		margin-top: 3rem;
		display: flex;
	}
	#enticement p {
		padding: 0.5rem;
		line-height: 1.4;
	}
	#splash img {
		/* display: inline-block; */
		max-width: 300px;
		height: 250px;
		/* float: right; */
		border-radius: 25px;
		box-shadow: 0 0 20px hsla(var(--purple), 0.7);
		object-fit: cover;
	}
	#enticement button, #enticement button:active {
		background: linear-gradient(
			-180deg,
			hsl(var(--violet)) 33%,
			hsl(var(--citrus)) 66%,
			hsl(var(--violet)) 100%
		);
		background-size: 100% 200%;
		background-position: 0 33%;
		
		box-shadow: 0 0 10px hsla(var(--violet), 0.7);
		border-radius: 7px;
		font-size: 2rem;
		border: none;
		padding: 0.3em 0.8em;
		margin-top: 1em;
		font-weight: bold;
		transition: all 2s cubic-bezier(0.4, 2, .6, 1);
	}
	#enticement button:hover {
		background-position: 0 95%;
		box-shadow: 0 0 10px hsla(var(--citrus), 0.7);
		cursor: pointer;
	}
	#auth {
		margin: 4em auto;
	}
	#auth-panel {
		display: flex;
		justify-content: center;
		width: 100%;
	}
	#auth-panel[hidden] {
		display: none;
	}
	#auth-panel:not([hidden]) {
		animation: auth-rise 500ms cubic-bezier(0.2, 0.8, 0.2, 1) both;
	}
	@keyframes auth-rise {
		from {
			opacity: 0;
			transform: translateY(45vh);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
	@media (prefers-reduced-motion: reduce) {
		#auth-panel:not([hidden]) {
			animation: none;
		}
	}

	@media (max-width: 768px) {
		#title {
			/* font-size: 2rem; */
		}
		h2 {
			font-size: 1.6rem;
			top: -1rem;
			white-space: nowrap;
		}
		#splash {
			padding: 0.1em;
			width: 80%;
			margin-top: 2em;
		}
		#enticement {
			font-size: 0.7rem;
			position: relative;
			padding: 0;
			margin:  0;
			display: block;
		}
		#description {
			margin-top: 2em;
			text-shadow: -2px 2px 3px #333;
		}
		#enticement button, #enticement button:active {
			font-size: 1.1rem;
			padding: 0.5em 0.4em;
			white-space: nowrap;
			margin: 1em;
		}
		#enticement img {
			z-index: -1;
			position: absolute;
			top: 0;
			left: 0;
			width: 100%;
			height: 100%;
			max-width: none;
			max-height: none;
			object-fit: cover;
			margin: 0;
			filter: blur(1px);
		}
		.love {
			text-align: center;
			margin: 0.5em;
		}
		.love a {
			display: block;
		}
	}
</style>