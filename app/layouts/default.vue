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
import useHabits from '~/composables/habits';
// import {Howler} from { Howler }

definePageMeta({
	requireAuth: true
});

let ndef = null;
let cancelReadController = null;

onMounted(async () => {
	if (!('NDEFReader' in window)) return


	window.addEventListener('click', preWarmAudio)
	window.addEventListener('touchstart', preWarmAudio)
	ndef = new window.NDEFReader()
	cancelReadController = new AbortController()
	await ndef.scan({ signal: cancelReadController.signal })

	ndef.onreading = async (event) => {
		for (const record of event.message.records) {
			if (record.recordType == 'url') {
				const scannedUrl = new TextDecoder().decode(record.data)
				if (scannedUrl.includes('api/automate')) {
					sfxStore().playBlob(
						await $fetch(scannedUrl, { responseType: 'blob', headers: {source: 'habitat' }})
					)
					useHabits().refreshHabits()
				}
			}
		}
	}
})

function preWarmAudio() {
	if (typeof Howler !== 'undefined' && Howler.ctx) {
		Howler.ctx.resume().then(() => {
			window.removeEventListener('click', preWarmAudio)
			window.removeEventListener('touchstart', preWarmAudio)
		})
	}
}
</script>

<style lang="scss">
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

.form-label {
	display: flex;
	flex-direction: column;
	font-weight: bold;
	color: hsl(var(--citrus));
	text-shadow: 0 0 5px hsla(var(--purple), 1);
}

.form-label-text {
	margin-bottom: 0.4em;
	font-size: 1.1em;
	text-align: center;
	display: block;
	width: 100%;
}

.form-control {
	color: var(--citrus);
	border: none;
	border-bottom: 3px dashed hsla(var(--electro), 0.7);
	background: none;
	border-radius: 5px;
	margin: auto;
	text-shadow: inherit;
	padding: 0.5em 1em;
	font-size: 1.1em;
}

select.form-control {
	display: block;
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