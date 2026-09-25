<template>
	<div class="habits-page glassy">
		<h2 class="metal">Manage Your Habits</h2>
		<hr>
		<form class="habit-form glowy-text" @submit.prevent="addHabit" novalidate>
			<label>
				<span class="label-text">Habit Name</span>
				<input v-model="form.name" class="glassy" placeholder="e.g. Take Walk" required />
			</label>
			<div id="suggest">
				<input type="checkbox" id="btn-suggest" v-model="showSuggestions" />
				<label for="btn-suggest">
					<Icon name="material-symbols:dropdown-menu"/>
					Show Suggestions
				</label>
				<select v-show="showSuggestions" v-model="selectedHabit" name="selected-habit" id="select-habit">
					<option
					v-for="habit in selectableHabits"
					:key="habit.name"
					:value="habit"
					v-text="habit.name"
					/>
				</select>
			</div>
			<label>
				<span class="label-text">Type</span>
				<hr />
				<select v-model="form.type" class="glassy">
					<option value="DURATION">Duration/Time</option>
					<option value="QUANTITY">Quantity</option>
					<option value="BOOLEAN" selected="selected">Boolean</option>
				</select>
			</label>
			<label v-if="form.type !== 'BOOLEAN'">
				<span class="label-text" v-text:text="negativityStatus(form.negative)[0]" />
				<input v-if="form.type == 'QUANTITY'" type='number' v-model="form.goal" min="1" class="glassy" />
				<input v-else type="text"  v-model="form.goal" step="300" pattern="[0-9]{1,2}:[0-9]{2}" placeholder="HH:MM" class="glassy"/>
			</label>
			<label v-if="form.type == 'QUANTITY'">
				<span class="label-text">Unit</span>
				<input placeholder="pages, laps" v-model="form.unit" min="1" class="glassy" />
			</label>
			<label id="private" class="form-bool" for="chk-private">
				<input type="checkbox" name="chk-private" id="chk-private" v-model="form['private']">
				<span>
					<Icon :name="privacyStatus(form['private'])" />
					Make Private
				</span>
			</label>
			<label id="negative" class="form-bool" for="chk-negative">
				<input type="checkbox" name="chk-negative" id="chk-negative" v-model="form['negative']">
				<span>
					<Icon :name="negativityStatus(form['negative'])[1]" />
					Negative Habit
				</span>
			</label>
			<div class="actions">
				<button class="glassy" type="submit">{{ isEditing ? 'Save' : 'Add Habit' }}</button>
				<button class="glassy" type="button" @click="resetForm" v-if="isEditing">Cancel</button>
			</div>
		</form>
		<div class="habits-list">
			<h3 class="metal">Current Habits</h3>
			<ul>
				<li v-for="habit in displayHabits" :key="habit.id" class="habit-item glassy" v-bind:class="{'danger': habit.negative}">
					<Icon :name="privacyStatus(habit?.private)" class="habit-privacy"/>
					<div class="habit-info">
						<span class="habit-name">{{ habit.name }}</span>
						<span class="habit-type">{{ habit.type }}</span>
						<span v-if="habit.goal" class="habit-goal">{{ negativityStatus(habit.negative)[0] }} {{ habit.displayGoal }} {{ habit.unit }}</span>
					</div>
					<div class="habit-actions">
						<button class="action-button glassy" @click="populateForm(habit)">
							<Icon name="material-symbols:box-edit-outline"/>
							Edit
						</button>
						<button class="glassy action-button danger" @click="removeHabit(habit.id)">
							<Icon name="material-symbols:delete-outline"/>
							Delete
						</button>
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
import globalHabits from '~/assets/selectableHabits'
import { formatFloatToDuration, parseDurationToFloat } from '~/utils/textRendering'

const form = reactive({
	_id: null,
	name: '',
	type: 'BOOLEAN',
	goal: null,
	unit: null,
	clonedFrom: null,
	'private': false,
	negative: false,
})
const isEditing = ref(false)
const showSuggestions = ref(false);
const selectableHabits = useState('selectableHabits', () =>  [])// globalHabits)
const selectedHabit = ref({})

watch(selectedHabit, (newHabit) => {
	resetForm()
	Object.assign(form, selectedHabit.value)
	if(showSuggestions)
		form.clonedFrom = selectedHabit.value.id
	form.id = null
	if(selectedHabit.value.type == "DURATION")
		form.goal = formatFloatToDuration(selectedHabit.value?.goal)
})


function resetForm() {
	form._id = null
	form.name = ''
	form.type = 'BOOLEAN'
	form.goal = null,
	form['private'] = false,
	isEditing.value = false
}

async function addHabit() {
	console.log({form})
	if (!form.name.trim()) return
	try {
		let goal = form.goal
		console.log(form.goal)
		if(typeof goal == "string")
			goal = parseFloat(form.goal.replace(':', '.'))
		const { data, status } = await GqlAddHabit({
			id: form.id,
			name: form.name,
			type: HabitTypes[form.type.toUpperCase()],
			goal,
			unit: form.unit,
			clonedFrom: form?.clonedFrom?.id || form?.clonedFrom,
			'private': form?.['private'],
			'negative': form?.['negative']
		})
		console.log(status, data)
		await refreshHabits();
		resetForm()
		sfxStore().randomSfxFromCategory('addHabit')
	} catch (error) {
		console.error('Error adding/editing habit:', error)
		return
	}
}

const habits = useState('habits', () => [])


async function refreshHabits() {
	habits.value = (await GqlHabits()).habits
	selectableHabits.value = (await GqlSelectableHabits()).selectableHabits
}

onMounted(async () => await refreshHabits());

function populateForm(h) {
	h.goal = formatFloatToDuration(h.goal)
	Object.assign(form, h)
	isEditing.value = true
}

async function removeHabit(id) {
	await GqlDeleteHabit({id})
	await refreshHabits()
}

const displayHabits = computed(() =>
	habits.value.map(habit => ({
		...habit,
		displayGoal: habit.type === "DURATION"
			? habit.goal?.toFixed(2).replace('.', ':')
			: habit.goal
	}))
)
const privacyStatus = computed(() => {
	return (isPrivate) => !isPrivate ? 'material-symbols:undereye-rounded' : 'streamline:invisible-1-solid'
})
const negativityStatus = computed(() => {
	return (isNegative) => !isNegative ? ['Goal', 'icon-park-outline:positive-dynamics'] : ['Maximum Goal', 'pixelarticons:debug-off']
})


const dummyHabits = [
{ _id: 1, name: 'Wake up time', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.8, goal: 8 },
{ _id: 2, name: 'Play Piano', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.5, goal: 30 },
{ _id: 3, name: 'Read Book', type: 'quantity', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.75, goal: 100 },
{ _id: 4, name: 'Exercise', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.2, goal: 60 },
{ _id: 5, name: 'Meditate', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.9, goal: 15 },
{ _id: 6, name: 'Take Medication', type: 'boolean', datesCompleted: {}, completedToday: false, degreeOfCompletion: 1 },
{ _id: 7, name: 'Journal', type: 'duration', datesCompleted: {}, completedToday: false, degreeOfCompletion: 0.8, goal: 20 },
]

</script>

<style>
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
#suggest input {
	display: none;
}
#suggest label {
	display: block;
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
	margin: auto;
}
.form-bool {
	display: inline-block !important;
	/* justify-items: flex-start; */
}
.form-bool > * {
	/* display: inline; */
	
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
.habit-privacy {
	flex: 0 0 10%;
}
.habit-type, .habit-goal, .habit-progress {
	font-size: 0.95em;
	color: hsl(var(--electro));
}
.habit-actions {
	display: flex;
	gap: 0.7em;
}

.empty-text {
	margin-top: 2em;
	color: hsl(var(--electro));
	font-size: 1.1em;
	text-align: center;
	opacity: 0.7;
}


@media (max-width: 768px) {
	.habits-page {
		padding: 0.5em;
		width: 90%;
	}
	.habit-form {
		min-width: 0;
		max-width: 100%;
		font-size: 0.9rem;
		margin-top: 1em;
	}
	.habit-form input, .habit-form label, button {
		width: 90%;
		box-sizing: border-box;
		font-size: 0.8rem;
	}
	.habit-item {
		padding: 0.3em;
	}
	.habit-actions {
		display: block;
		flex-basis: 20%;
	}
	.habit-actions button {
		white-space: nowrap;
	}
}
</style>
