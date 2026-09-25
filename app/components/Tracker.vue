<template>
	<div id="tracker" class="raise">
		<h2 class="metal">
			<span v-text="friend?.username ? `${friend.username}'s` : 'My'"/> Habits
		</h2>
		<hr>
		<div class="glowy-text" id="habits-grid">
			<div id="headings">
				<span>Habbit</span>
				<span class="day-heading" v-for="date in listedDayHeadings" :key="date" v-text="date"></span>
			</div>
			<div v-for="habit in habits" :key="habit.name" class="habit" v-if="habits.length > 0" draggable="true">
				<h3 class="glowy-text">{{ habit.name }}</h3>
				<div v-for="date in listedDates" :key="date.getTime()" class="habit-day">
					<input type="checkbox"
					@change="completeHabit($event, habit, date.getTime())"
					:checked="date.getTime() in habit.datesCompleted"
					:disabled="props.friendId"/>
					<span class="optional-quantity" v-if="date.getTime() in habit.datesCompleted">
						<input type="text" 
						class="glassy"
						:placeholder="formatFloatToDuration(habit.goal)"
						:value="formatFloatToDuration(habit.datesCompleted[date.getTime()])"
						pattern="[0-9]{1,3}:[0-9]{2}"
						title="Hours:Minutes (e.g., 1:30)"
						v-if="habit.type === 'DURATION'"
						@change="completeHabit($event, habit, date.getTime(), $event.target.value)"
						:readonly="props.friendId"
						/>
						<input type="number" 
						:placeholder="habit.goal" class="glassy"
						v-model="habit.datesCompleted[date.getTime()]"
						@change="completeHabit($event, habit, date.getTime(), $event.target.value)"
						v-else-if="habit.type === 'QUANTITY'"
						:readonly="props.friendId"
						>
					</span>
				</div>
			</div>
			<h3 v-else="" id="no-habits" class="glowy-text">
				No habits to track, add one from the <nuxt-link to="/habits">Habits Panel</nuxt-link>
			</h3>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted, watch } from 'vue'
	import { sfxStore } from '~/stores/SoundManager'
	import { parseDurationToFloat, formatFloatToDuration } from '~/utils/textRendering'

	const props = defineProps({
		friendId: String
	})
	const friend = ref({})
	const today = new Date()
	const daysToShow = 7
	const listedDates = Array.from({ length: daysToShow }, (_, i) =>  {
		const d = new Date(new Date().setDate(today.getDate() - i))
		d.setUTCHours(0,0,0,0)
		return d
	})

	const habits = ref([])

	const listedDayHeadings = computed(() => 
		listedDates.map(date =>
			date.toLocaleDateString('en-US', { weekday: 'short', timeZone: 'UTC'})
		)
	)

	async function completeHabit(event, habit, completionDate, degreeOfCompletion) {
		const checked = event.target.checked
		let val = checked
 
		if (degreeOfCompletion !== undefined) {
			val = degreeOfCompletion
			if (habit.type === "DURATION")
				val = parseDurationToFloat(degreeOfCompletion)
			else if (habit.type === "QUANTITY")
				val = degreeOfCompletion === "" ? "" : parseFloat(degreeOfCompletion)
			habit.datesCompleted[completionDate] = val
		} else if (checked) {
			val = ""
			habit.datesCompleted[completionDate] = val
		} else {
			delete habit.datesCompleted[completionDate]
			val = null
		}
		
		try {
			await GqlCompleteHabit({ habitId: habit.id, date: completionDate, degreeOfCompletion: val })
			sfxStore().chooseHabitSfx(habit, checked, parseDurationToFloat(degreeOfCompletion))
		} catch (err) {
			console.error('Failed to save habit completion', err)
			// roll back the optimistic update so the UI matches what's actually saved
			if (checked) delete habit.datesCompleted[completionDate]
			else habit.datesCompleted[completionDate] = ''
		}
	}


	async function hydrateHabitData() {
		const fetchedHabits = (await GqlHabits({owner: props?.friendId}))
		habits.value = fetchedHabits.habits
		if(props.friendId)
			friend.value = habits.value[0].owner
		else {
			friend.value = {}
		}
	}


	onMounted(async () => {
		hydrateHabitData();
		
	})

	watch(() => props.friendId, () => {
		hydrateHabitData();
	})
</script>

<style scoped>
	#tracker {
		width: 900px;
		height: 500px;
		position: relative;
		color: hsl(var(--electro));
		border-radius: 25px;
		overflow: visible; /* make sure content can overflow if needed */
	}
	#tracker h2 {
		/* text-align: center; */
		padding: 0.25em;
		margin: 0.25em;
	}
	#tracker::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(orange, gold, red, purple);
		clip-path: polygon(
		-50% 0%, 150% -20%, 150% 35%, -50% 35%,
		-50% 42%, 150% 42%, 150% 50%, 0 50%,
		-50% 55%, 150% 55%, 150% 60%, 0 60%,
		-50% 62%, 150% 62%, 150% 65%, 0 65%,
		-50% 67%, 150% 67%, 150% 70%, 0 70%,
		-50% 72%, 150% 72%, 150% 75%, 0 75%,
		-50% 76%, 150% 76%, 150% 150%, 0 150%
		);
		border-radius: 25px;
		box-shadow: rgba(255,128,0,0.7) 0px 0 20px;
		z-index: 0;
	}

	#tracker > * {
		position: relative;
		z-index: 1; /* ensure content sits above the background */
	}
	#habits-grid {
		display: grid;
		grid-template-columns: auto repeat(7, 1fr);
		grid-template-rows: auto;
		gap: 15px;
		row-gap: 25px;
		padding: 20px;
		/* make elements be in center of grid cells */
		/* justify-items: center; */
		/* align-items: center; */
		
	}
	#headings {
		font-weight: bold;
		text-align: center;
		display: contents;
	}
	#headings span {
		text-align: center;
	}
	h3 {
		white-space: nowrap;
	}
	#no-habits {
		grid-column: 1 / -1;
		text-align: center;
	}
	.habit {
		display: contents;
	}
	.habit-day {
		display: flex;
	}
	.optional-quantity {
		display: inline;
		min-width: 0;
	}
	input[type="checkbox"] {
		width: 20px;
		height: 20px;
		margin: 0 auto;
		padding: 30px;
		cursor: pointer;
	}
	input[type="checkbox"]:disabled {
		pointer-events: none; /* Prevents mouse clicks entirely */
	}
	input[type="number"],
	input[type="time"],
	input[type="text"] {
		width: 80%;
		background-color: transparent;
		border: none;
		margin: 0 auto;
		border-bottom: 2px solid hsl(var(--electro));
		color: hsl(var(--electro));
		text-align: center;
		outline: invert;
		/* text-shadow: inherit; */
		font-size: 1.2em;
		text-shadow: 0 0 2px hsla(var(--purple), 1);
		min-width: 45px;
	}
	input[type="text"] {
		width:100%;
		font-size: 0.8em;
	}
	input:read-only {
		flex: 1 0 auto;
		width: 100%;
	}
	@media (max-width: 768px) {
		#tracker {
			width: 90%;
			max-height: 70vh;
			margin: auto;
		}
		#habits-grid {
			padding: 10px;
			gap: 8px;
		}
		#headings {
			font-weight: initial;
		}
		h3 {
			white-space: initial;
		}
		.habit-day {
			display: block;
		}
		.habit-day > * {
			display: block;
		}
	}
</style>