<template>
    <div id="container">
        <Header />
        <main id="dashboard">
            <Sidebar />
            <slot />
        </main>
        <GridGround />
        <Footer />
    </div>
</template>

<script setup>
definePageMeta({
	requireAuth: true
});
</script>
<style>
	#dashboard {
		display: flex;
		flex-direction: row;
		flex: 1;
		width: 90%;
		margin-top: 1em;
		padding: 0 20px;
		max-width: 100%;
		margin-top: 3em;
		justify-content: space-evenly;
	}

	aside {
		flex-basis: 25%
	}
	#tracker {
		flex: 1;
	}
	/* button {
		display: flex;
		align-items: center;
		text-align: center;
	} */
	.action-button {
		padding: 0.4em 1em;
		border-radius: 8px;
		font-weight: bold;
		background: none;
		border: 2px dashed hsla(var(--electro), 0.7);
		color: hsl(var(--citrus));
		cursor: pointer;
		transition: background 0.2s, color 0.2s;
	}
	.danger {
		border-color: hsl(var(--sanguine));
		color: hsl(var(--sanguine));
	}
	.danger:hover {
		background: linear-gradient(-180deg, red, hsl(var(--purple))) !important;
	}
	.action-button:hover {
		background: linear-gradient(-180deg, hsl(var(--electro)), hsl(var(--purple)));
		color: hsl(var(--citrus));
	}
	
	@media (max-width: 768px) {
		#dashboard {
			display: block;
			width: 100%;
			padding: 0 0;
			position: relative;
			margin-top: 2em;
		}
	}
</style>