<template>
	<div class="habits-page">
		<h2 class="metal">Manage Your Habits</h2>
		<hr>
		<form class="habit-form glassy glowy-text" @submit.prevent="addHabit" novalidate>
			<label class="form-label area-name">
				<span class="form-label-text">Habit Name</span>
				<input v-model="form.name" class="form-control glassy" placeholder="e.g. Take Walk" required />
			</label>
			<div id="suggest" class="area-suggest">
				<IconCheckbox v-model="showSuggestions" class="form-label-text" text="Show Suggestions" icon-name="material-symbols:dropdown-menu" :showCheckBox="false"/>
				<select v-show="showSuggestions" v-model="selectedHabit" name="selected-habit" id="select-habit" class="form-control">
					<option v-for="habit in selectableHabits" :key="habit.name" :value="habit" v-text="habit.name" />
				</select>
			</div>

			<label class="form-label area-type">
				<span class="form-label-text">Type</span>
				<hr />
				<select v-model="form.type" class="form-control glassy">
					<option value="DURATION">Duration/Time</option>
					<option value="QUANTITY">Quantity</option>
					<option value="BOOLEAN" selected="selected">Boolean</option>
				</select>
			</label>

			<label class="form-label area-goal" v-if="form.type !== 'BOOLEAN'">
				<span class="form-label-text" v-text:text="negativityStatus(form.negative)[0]" />
				<input v-if="form.type == 'QUANTITY'" type='number' v-model="form.goal" min="1" class="form-control glassy" />
				<input v-else type="text" v-model="form.goal" step="300" pattern="[0-9]{1,2}:[0-9]{2}" placeholder="HH:MM" class="form-control glassy"/>
			</label>
			<label class="form-label area-unit" v-if="form.type == 'QUANTITY'">
				<span class="form-label-text">Unit</span>
				<input placeholder="pages, laps" v-model="form.unit" min="1" class="form-control glassy" />
			</label>

			<div class="area-bools">
				<IconCheckbox id="private" v-model="form.private" text="Make Private" :icon-name="privacyStatus(form.private)" />
				<IconCheckbox id="negative" v-model="form.negative" text="Negative Habit" :icon-name="negativityStatus(form.negative)[1]" />
			</div>

			<div class="actions">
				<button class="glassy" type="submit">{{ isEditing ? 'Save' : 'Add Habit' }}</button>
				<button class="glassy" type="button" @click="resetForm" v-if="isEditing">Cancel</button>
			</div>
		</form>
		
		<habits-list @edit="populateForm" @remove="removeHabit"/>
	</div>
</template>

<script setup>
import { reactive, ref, computed } from 'vue'
import { useState } from '#app'
import { HabitTypes } from '#gql/default'
import globalHabits from '~/assets/selectableHabits'
import { formatFloatToDuration, parseDurationToFloat } from '~/utils/textRendering'
import useHabits from '~/composables/habits'

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

const selectableHabits = (await GqlSelectableHabits()).selectableHabits
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
		await useHabits().refreshHabits()
		resetForm()
		sfxStore().randomSfxFromCategory('addHabit')
	} catch (error) {
		console.error('Error adding/editing habit:', error)
		return
	}
}

function populateForm(h) {
	h.goal = formatFloatToDuration(h.goal)
	Object.assign(form, h)
	isEditing.value = true
}

async function removeHabit(id) {
	await GqlDeleteHabit({id})
	await useHabits().refreshHabits()
}


function privacyStatus(isPrivate) {
	return !isPrivate ? 'material-symbols:undereye-rounded' : 'streamline:invisible-1-solid'	
}

function negativityStatus(isNegative) {
	return !isNegative ? ['Goal', 'icon-park-outline:positive-dynamics'] : ['Maximum Goal', 'pixelarticons:debug-off']	
}

</script>

<style scoped>
.habits-page {
	margin: 2em auto;
	z-index: 1;
	position: relative;
}
h2 {
	position: absolute;
	top: reset;
	z-index: 2;
}

.habit-form {
	padding: 2em;
	display: grid;
	grid-template-columns: 1fr 1fr;
	grid-template-areas:
		"name    suggest"
		"type    type"
		"goal    unit"
		"bools   bools"
		"actions actions";
	gap: 1em 2em;
	margin-bottom: 2em;
	align-items: end;
}

.area-name    { grid-area: name; }
.area-suggest { grid-area: suggest; align-self: end; }
.area-type    { grid-area: type; }
.area-goal    { grid-area: goal; }
.area-unit    { grid-area: unit; }
.area-bools   { grid-area: bools; }

.area-bools {
	display: grid;
	grid-auto-flow: column;
	grid-auto-columns: max-content;
	gap: 2em;
	align-items: center;
}

.habit-form .form-bool {
	color: hsl(var(--citrus));
	text-shadow: 0 0 5px hsla(var(--purple), 1);
}

#suggest input {
	display: none;
}
#suggest label {
	display: block;
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
	grid-area: actions;
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
