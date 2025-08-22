<template>
	<div id="ground" />
</template>

<script>
export default {

}
</script>

<style>
	#ground {
		height: calc(var(--ground-size) + 1vh);
		width: 120vw;

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

		border-top: solid 3px hsla(var(--electro), .5);
		background-color: hsl(var(--purple));
		background-image: radial-gradient(100% 60% at bottom, hsla(var(--electro), .1), hsla(var(--purple), 1));
		object-fit: contain;
		box-shadow:
		0 3px 10px 2px hsla(var(--white), .2),
		0 2px 20px 2px hsla(var(--electro), .3);
	}
	#ground::before {
		--alpha: .2;
		content: '';

		display: block;
		width: 100%;
		height: 100vh;

		position: absolute;
		top: 0;

		transform-origin: top center;
		transform: rotateX(76deg) translate3d(calc(var(--ratio-x) * 1vw), 0, 0);
		backface-visibility: hidden;

		background-image:
			linear-gradient(to bottom, hsla(var(--citrus), var(--alpha)) 1px, transparent 1px),
			linear-gradient(to right, hsla(var(--electro), var(--alpha)) 1px, transparent 1px);
		background-size: 1px var(--ground-line), calc(2 * var(--ground-line)) 1px;
		background-position: 0% 0%, center;
		mix-blend-mode: color-dodge;

		animation: ground-lines var(--ground-speed) linear infinite;
	}
	@keyframes ground-lines {
		0% {
			background-position: 0% 0%, center;
		}
		100% {
			background-position: 0% 50%, center;
		}	
	}
</style>