<template>
	<div id="container">
  		<Header />
		<slot />
		<GridGround /> 
		<Footer />
	</div>
</template>

<script setup>
definePageMeta({
	requireAuth: false
});
</script>

<style>
	#container {
		min-height: 100vh;
	}
	main {
		flex-grow: 0;
	}

</style>