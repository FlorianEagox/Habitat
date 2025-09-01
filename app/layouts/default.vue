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
import { session } from '~/app.vue';
if(!session.data)
	navigateTo('/');
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
		overflow: hidden;
		justify-content: space-evenly;
	}

	aside {
		flex-basis: 25%
	}
	#tracker {
		flex: 1;
	}
</style>