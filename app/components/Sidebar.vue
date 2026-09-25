<template>
	<aside>
		<nav>
			<ul class="glassy">
				<li><nuxt-link to="/" class="glowy-text" active-class="selected"><Icon name="hugeicons:notebook-02"/> Tracker</nuxt-link></li>
				<li><nuxt-link to="/habits" class="glowy-text" active-class="selected"><Icon name="material-symbols:list-alt-check-outline-sharp"/> My Habits</nuxt-link></li>
				<li><nuxt-link to="/friends" class="glowy-text" active-class="selected"><Icon name="game-icons:three-friends"/> Friends</nuxt-link></li>
				<li><nuxt-link to="/insights" class="glowy-text"  active-class="selected"><Icon name="material-symbols:insights"/> Insights</nuxt-link></li>
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
	@media (max-width: 768px) {
		nav {
			position: fixed;
			bottom: 5px;
			z-index: 1;
			width: 100%;
		}
		nav ul {
			display: flex;
			padding: 0;
			justify-content: space-around;
		}
		nav ul li {
			/* display: inline-block; */
			margin: 0 0.2em;
			padding: 0;
			height: 100%;
			width: 20%;
			text-align: center;
			border-radius: 26px;
		}
		a {
			display: inline-block;
			padding: 0px 0px;
			margin: 0 0;
			width: 100%;
			height: 100%;
			white-space: nowrap;
			border-radius: 26px;
		}
		a span {
			margin: auto;
			display: block;
		}
	}
</style>