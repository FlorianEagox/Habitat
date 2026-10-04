<template>
	<div id="nfc">
		<h3 class="metal">
			BANG, you <span id="stat" v-text="!habit?.automaticTracking ? 'completed' : 'started'" />
		</h3>
		<h4 id="name" v-text="habit?.name" />
		<h5>Tap me real good!</h5>
		<h6 v-if="habit?.automaticTracking">
			<span id="elapsed" v-text="sinceStarted"/>
			Since you started
		</h6>
	</div>
</template>

<script setup>
	import { useRoute } from 'vue-router';
	const route = useRoute()
	const now = ref(Date.now())
	const sinceStarted = ref("")
	definePageMeta({
		key: (route) => route.fullPath
	})
	const habit = ref(null)
	onMounted(async () => {
		sfxStore().randomSfxFromCategory(route.query.sfx)
		habit.value = (await GqlHabit({id: route.query.habitId})).habit
		if((habit.value.automaticTracking || false)) {
			setInterval(() => {
				now.value = Date.now()
				const elapsed = (now.value - new Date(parseInt(habit.value.updatedAt))) / (1000 * 60 * 60)
				console.log(habit.value.datesCompleted, habit.value.datesCompleted[new Date().setUTCHours(0,0,0,0)])
				sinceStarted.value = formatFloatToDuration(habit.value.datesCompleted[new Date().setUTCHours(0,0,0,0)] + elapsed) + `:${Math.floor((elapsed * 3600) % 60).toString().padStart(2, '0')}`
			}, 500)
		}
	})
	
</script>

<style scoped>
	#nfc {
		text-align: center;
		font-size: 3em;
		display: flex;
		flex-direction: column;
	}
	#name {
		margin: 2em;
	}
</style>