<template>
	<div id="container">
  		<Header />
		<slot />
		<GridGround /> 
		<Footer />
	</div>
</template>

<script>
export default {

}
</script>

<style>
	#container {
		min-height: 100vh;
	}
	main {
		flex-grow: 0;
	}
	.glassy {
		background: rgba(200, 200, 255, 0.4);
		backdrop-filter: blur(15px) brightness(0.8);
		border: 1px solid rgba(0, 0, 0, 0.2);
		border-radius: 25px;
		box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
	}
	
</style>