<script setup>
import { useTemplateRef } from 'vue';

definePageMeta({
  layout: 'logged-out'
})
const showSun = ref(false)
</script>

<template>
	<main class="container">
		<article id="splash" class="glassy">
			<h2 class="metal">Conquer Yourself</h2>
			<div id="enticement">
				<section id="description">
					<p>All change starts from the bottom up. No matter your material circumstances, there are simple things you can do for yourself that make you more prepared to achieve difficult things. It's time to start becoming the person you want to be.</p>
					<p>Set goals, track your progress, and invite friends to keep eachother accountable. Stop pushing that boulder up the hill; roll it down the other side!</p>
		<ClientOnly>
					<button @click="showSun = true"><span class="metal raised">Chase the Rising Sun</span></button>
		</ClientOnly>
				</section>
				    <!-- <button @click="openInPopup('/auth/github')">Login with GitHub</button> -->
				<img src="~/assets/sexysisyphus.png" alt="Sisyphus is vibing and sexy today chilling in the vaporwave sunset. He's got this." />
			</div>
		</article>
			<Auth v-show="showSun"/>
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
</style>