<template>
	<div id="tracker" class="raise">
		<h2 class="metal raised">My Habits</h2>
		<hr>
		<div class="glowy-text" id="habbits-grid">
			<div id="headings">
				<span>Habbit</span>
				<span class="day-heading" v-for="date in listedDayHeadings" :key="date" v-text="date"></span>
			</div>
			<div v-for="habit in habits" :key="habit.name" class="habit" v-if="habits.length > 0">
				<h3 class="glowy-text">{{ habit.name }}</h3>
				<div v-for="date in listedDates" :key="date.getTime()" class="habit-day">
					<input type="checkbox"
					@change="completeHabbit($event, habit, date.getTime())"
					:checked="habit.datesCompleted[date.getTime()]"/>
					<span class="optional-quantity" v-if="habit.datesCompleted[date.getTime()]">
						<input type="time" 
						:placeholder="habit.goal" class="glassy"
						v-model="habit.datesCompleted[date.getTime()]"
						v-if="habit.type === 'DURATION'"
						@change="completeHabbit($event, habit, date.getTime(), $event.target.value)"
						/>
						<input type="number" 
						:placeholder="habit.goal" class="glassy"
						v-model="habit.datesCompleted[date.getTime()]"
						@change="completeHabbit($event, habit, date.getTime(), $event.target.value)"
						v-else-if="habit.type === 'QUANTITY'"
						/>
					</span>
				</div>
			</div>
			<h3 v-else="" id="no-habits" class="glowy-text">
				No habbits to track, add one from the <nuxt-link to="/habits">Habits Panel</nuxt-link>
			</h3>
		</div>
	</div>
</template>

<script setup>
	import { ref, computed, onMounted } from 'vue'
	import { useState } from '#app' // Nuxt composables
// import { date } from 'better-auth'

	// --- Data / refs ---
	const today = new Date()
	const daysToShow = 7
	const listedDates = Array.from({ length: daysToShow }, (_, i) =>  {
		const d =new Date(new Date().setDate(today.getDate() - i))
		d.setUTCHours(0,0,0,0)
		return d
	}
	)

	const dummyHabits = [
	{ name: "Wake up time", type: "duration", datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.8, goal: 8 },
	{ name: "Play Piano", type: "duration", datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.5, goal: 30 },
	{ name: "Read Book", type: "quantity", datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.75, goal: 100 },
	{ name: "Exercise", type: "duration", datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.2, goal: 60 },
	{ name: "Meditate", type: "duration", datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.9, goal: 15 },
	{ name: "Take Medication", type: "boolean", datesCompleted: {}, completedToday: false, degreeOfCompletion: 1 },
	{ name: "Journal", type: "duration", datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.8, goal: 20 },
	]

	const habits = ref([])

	const listedDayHeadings = computed(() => 
		listedDates.map(date =>
			date.toLocaleDateString('en-US', { weekday: 'short' })
		)
	)

	function completeHabbit(event, habit, completionDate, degreeOfCompletion) {
		const checked = event.target.checked
		let val = checked
		if(degreeOfCompletion)
			val = degreeOfCompletion
		else
			habit.datesCompleted[completionDate] = val
		console.log({degreeOfCompletion, val, checked})
		// habit.datesCompleted = { ...habit.datesCompleted, [completionDate]: checked }
		GqlCompleteHabit({habitId: habit.id, date: completionDate, degreeOfCompletion: val})
	}

	onMounted(async () => {
		const fetchedHabits = (await GqlHabits()).habits
		habits.value = fetchedHabits
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
	#habbits-grid {
		display: grid;
		grid-template-columns: 1.4fr repeat(7, 1fr);
		grid-template-rows: auto;
		gap: 15px;
		row-gap: 25px;
		padding: 20px;
		/* make elements be in center of grid cells */
		/* justify-items: center; */
		align-items: center;
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
	}
	input[type="checkbox"] {
		width: 20px;
		height: 20px;
		margin: 0 auto;
		padding: 30px;
		cursor: pointer;
	}
	input[type="number"] {
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
	}
</style>