<template>
	<aside>
		<nav>
			<ul class="glassy">
				<li><nuxt-link to="/tracker" class="glowy-text" active-class="selected"><Icon name="hugeicons:notebook-02"/> Tracker</nuxt-link></li>
				<li><nuxt-link to="/habits" class="glowy-text" active-class="selected"><Icon name="material-symbols:list-alt-check-outline-sharp"/> My Habits</nuxt-link></li>
				<li><nuxt-link to="/friends" class="glowy-text" active-class="selected"><Icon name="game-icons:three-friends"/> Friends</nuxt-link></li>
				<li><a href="#contact" class="glowy-text"><Icon name="material-symbols:insights"/> Insights</a></li>
			</ul>
		</nav>
	</aside>
</template>

<style scoped>
	nav ul {
		padding: 1em;
		box-shadow: 2px 0 5px rgba(0, 0, 0, 0.5);
		list-style-type: none;
	}

	nav ul li {
		margin: 15px 0;
	}
	
	a {
		color: hsl(var(--electro));
		display: block;
		padding: 10px 20px;
		text-decoration: none;
		border: 2px solid hsla(var(--electro));
		border-radius: 5px;
		box-shadow: 0 0 10px hsla(var(--electro), 0.5);
	}
	a:hover {
		background-color: hsla(var(--electro), 0.1);
		color: hsl(var(--citrus));
	}
	nav ul li a:hover {
		text-decoration: underline;
	}
	
</style>