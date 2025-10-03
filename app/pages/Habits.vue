<template>
	<div class="habits-page glassy glowy-text">
		<h2 class="metal raised">Manage Your Habits</h2>
		<hr>
		<form class="habit-form" @submit.prevent="addHabit">
			<label>
				<span class="label-text">Habit Name</span>
				<input v-model="form.name" class="glassy" placeholder="e.g. Take Walk" required />
			</label>
			<label>
				<span class="label-text">Type</span>
				<select v-model="form.type" class="glassy">
					<option value="duration">Duration (minutes)</option>
					<option value="quantity">Quantity</option>
					<option value="boolean">Boolean</option>
				</select>
			</label>
			<label v-if="form.type !== 'boolean'">
				<span class="label-text">Goal</span>
				<input type="number" v-model.number="form.goal" min="1" class="glassy" />
			</label>
			<label v-if="form.type == 'quantity'">
				<span class="label-text">Unit</span>
				<input placeholder="pages, laps" v-model="form.unit" min="1" class="glassy" />
			</label>
			<div class="actions">
				<button class="glassy" type="submit">{{ isEditing ? 'Save' : 'Add Habit' }}</button>
				<button class="glassy" type="button" @click="resetForm" v-if="isEditing">Cancel</button>
			</div>
		</form>
		<div class="habits-list">
			<h3 class="metal">Current Habits</h3>
			<ul>
				<li v-for="habit in habits" :key="habit.id" class="habit-item glassy">
					<div class="habit-info">
						<span class="habit-name">{{ habit.name }}</span>
						<span class="habit-type">{{ habit.type }}</span>
						<span v-if="habit.goal" class="habit-goal">Goal: {{ habit.goal }}</span>
					</div>
					<div class="habit-actions">
						<button class="glassy" @click="populateForm(habit)">Edit</button>
						<button class="glassy danger" @click="removeHabit(habit._id)">Delete</button>
					</div>
				</li>
			</ul>
			<p v-if="habits.length === 0" class="empty-text">No habits added yet. You're life, cast adift in the black sea, clinging to the splintering raft that is your crumbling foundation. <br> Add a habit above!</p>
		</div>
	</div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useState } from '#app'
import { HabitTypes } from '#gql/default'


const form = reactive({
	_id: null,
	name: '',
	type: 'duration',
	goal: null,
	unit: null,
})
const isEditing = ref(false)

function resetForm() {
	form._id = null
	form.name = ''
	form.type = 'duration'
	form.goal = null
	isEditing.value = false
}

async function addHabit() {
	if (!form.name.trim()) return
	try {
		// console.log("mrawrf", HabitTypes)
		const { data, status } = await GqlAddHabit({
			id: form._id,
			name: form.name,
			type: HabitTypes[form.type.toUpperCase()],
			goal: form.goal,
			unit: form.unit,
		})
		console.log(status, data)
	} catch (error) {
		console.error('Error adding/editing habit:', error)
		return
	}
	// resetForm()
}

const dummyHabits = [
{ _id: 1, name: 'Wake up time', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.8, goal: 8 },
{ _id: 2, name: 'Play Piano', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.5, goal: 30 },
{ _id: 3, name: 'Read Book', type: 'quantity', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.75, goal: 100 },
{ _id: 4, name: 'Exercise', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.2, goal: 60 },
{ _id: 5, name: 'Meditate', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.9, goal: 15 },
{ _id: 6, name: 'Take Medication', type: 'boolean', datesCompleted: {}, completedToday: false, degreeOfCompletion: 1 },
{ _id: 7, name: 'Journal', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.8, goal: 20 },
]

const habits = useState('habits', () => [])
const {data: fetchedHabits, status} = await useLazyAsyncData(
	"gqlHabits",
	() => GqlHabits().data.habits || [],
	{watch: [habits], server: false}
)
// const currentHabits = computed(() => fetchedHabits.value || habits.value || dummyHabits)

function populateForm(h) {
	Object.assign(form, h)
	isEditing.value = true
}

function removeHabit(id) {
	const idx = habits.value.findIndex(h => h._id === id)
	if (idx !== -1) habits.value.splice(idx, 1)
	if (isEditing.value && form._id === id) resetForm()
}
</script>

<style scoped>
.habits-page {
	margin: 2em auto;
	padding: 2em;
	z-index: 1;
}
.habit-form {
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 1em 2em;
	margin-bottom: 2em;
	align-items: end;
}
.habit-form label {
	display: flex;
	flex-direction: column;
	font-weight: bold;
	color: hsl(var(--citrus));
	text-shadow: 0 0 5px hsla(var(--purple), 1);
}
.label-text {
	margin-bottom: 0.3em;
	font-size: 1.1em;
}
.habit-form input,
.habit-form select {
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
.actions {
	grid-column: span 2;
	display: flex;
	justify-content: center;
	gap: 1em;
	margin-top: 1em;
}
.habits-list {
	margin-top: 2em;
}
.habits-list h3 {
	margin-bottom: 1em;
	font-family: "Fredoka One", Arial, sans-serif;
	color: hsl(var(--electro));
	text-shadow: 0 0 8px var(--citrus);
}
.habits-list ul {
	list-style: none;
	padding: 0;
	margin: 0;
	display: grid;
	gap: 1em;
}
.habit-item {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background: rgba(200, 200, 255, 0.08);
	border-radius: 15px;
	padding: 1em 1.5em;
	box-shadow: 0 2px 12px rgba(0,0,0,0.08);
	font-size: 1.1em;
}
.habit-info {
	display: flex;
	flex-direction: column;
	gap: 0.2em;
}
.habit-name {
	font-weight: bold;
	color: hsl(var(--citrus));
	font-size: 1.2em;
	text-shadow: 0 0 5px hsla(var(--purple), 1);
}
.habit-type, .habit-goal, .habit-progress {
	font-size: 0.95em;
	color: hsl(var(--electro));
}
.habit-actions {
	display: flex;
	gap: 0.7em;
}
.habit-actions .glassy {
	padding: 0.4em 1em;
	border-radius: 8px;
	font-weight: bold;
	background: none;
	border: 2px dashed hsla(var(--electro), 0.7);
	color: hsl(var(--citrus));
	cursor: pointer;
	transition: background 0.2s, color 0.2s;
}
.habit-actions .danger {
	border-color: hsl(var(--sanguine));
	color: hsl(var(--sanguine));
}
.habit-actions .glassy:hover {
	background: linear-gradient(-180deg, hsl(var(--electro)), hsl(var(--purple)));
	color: hsl(var(--citrus));
}
.empty-text {
	margin-top: 2em;
	color: hsl(var(--electro));
	font-size: 1.1em;
	text-align: center;
	opacity: 0.7;
}
</style>