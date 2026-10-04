<template>
	<Teleport to="body">
		<div id="shade">
			<div id="modal" class="glassy">
				<p id="modal-txt" v-text="text" />
				<div id="btns">
					<button class="action-button danger" v-if="confirmAction" @click="() => $emit('modalConfirm')">Confirm</button>
					<button class="action-button" @click="() => $emit('modalCancel')"> {{ confirmAction ? 'Cancel' : 'Gotcha'}}</button>
				</div>
			</div>
		</div>
	</Teleport>
</template>

<script setup>
	const props = defineProps({
		text: String,
		confirmAction: {type: Boolean, default: true}
	})
	const emit = defineEmits(['modalConfirm', 'modalCancel'])
</script>

<style scoped>
	#shade {
		position: fixed;
		top: 0;
		left: 0;
		z-index: 99;
		width: 100vw;
		height: 100vh;
		background: rgba(0, 0, 0, 0.7);
		display: flex;
		align-items: center;
		justify-content: center;
	}
	#modal {
		padding: 2em;
		text-align: center;
		background: var(--accent-gradient);
	}
	#btns {
		margin-top: 1.5em;
	}
	#btns button {
		margin: 0.5em;
	}
</style>