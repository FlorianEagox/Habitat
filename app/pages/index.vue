<template>
	<main>
		<article id="splash" class="glassy">
			<h2 class="metal">Conquer Yourself</h2>
			<div id="enticement">
				<section id="description">
					<p>All change starts from the bottom up. No matter your material circumstances, there are simple things you can do for yourself that make you more prepared to achieve difficult things. It's time to start becoming the person you want to be.</p>
					<p>Set goals, track your progress, and invite friends to keep eachother accountable. Stop pushing that boulder up the hill; roll it down the other side!</p>
					<button @click="triggerSignup"><span class="metal raised">Chase the Rising Sun</span></button>
				</section>
				<img src="~/assets/sexysisyphus.png" alt="Sisyphus is vibing and sexy today chilling in the vaporwave sunset. He's got this." />
			</div>
		</article>
		<!-- hidden div that looks like the sun to rise with register/auth -->
		
	</main>
</template>

<script>
definePageMeta({
  layout: 'logged-out'
})
export default {
	methods: {
		triggerSignup() {
			
		}
	}
}
</script>

<style>
	#splash {
		font-size: 1.5rem;
		text-align: center;
		width: 60%;
		padding: 2rem;
		margin: auto;
		margin-top: 4rem;
		padding-top: 0;
		position: relative;
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
	p {
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
	button, button:active {
		background: linear-gradient(-180deg, hsl(var(--violet)), hsl(var(--citrus)));
		box-shadow: 0 0 10px hsla(var(--violet), 0.7);
		border-radius: 7px;
		font-size: 2rem;
		border: none;
		padding: 0.3em 0.8em;
		margin-top: 1em;
		font-weight: bold;
		transition: all 0.1s ease;
	}
	button:hover {
		background: linear-gradient(-180deg, hsl(var(--citrus)), hsl(var(--violet)));
		box-shadow: 0 0 10px hsla(var(--citrus), 0.7);
		cursor: pointer;
	}

</style>