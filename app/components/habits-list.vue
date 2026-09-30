<template>
	<div class="habits-list glassy">
		<IconCheckbox id="chk-toggle-grid" class="action-button" :icon-name="toggleGrid ? 'ri:layout-grid-fill' : 'material-symbols:lists'" v-model="toggleGrid" :showCheckBox="false" />
		<h3 class="metal">Current Habits</h3>
		<ul v-bind:class="{'habits-grid-view': toggleGrid}">
			<li
			v-for="habit in displayHabits"
			:key="habit.id"
			class="habit-item glassy"
			v-bind:class="{'danger': habit?.negative, 'swappable': habit.id == currentSwap?.id}"
			draggable="true"
			@dragstart="dragging = habit"
			@dragover.prevent="currentSwap = habit"
			@dragenter.prevent
			@drop="swapHabitPriorities">
				<Icon :name="privacyStatus(habit?.private)" class="habit-privacy"/>
				<div class="habit-info">
					<span class="habit-name">{{ habit.name }}</span>
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
</template>

<script setup>
import { ref, computed } from 'vue'
import useHabits from '~/composables/habits'

const toggleGrid = ref(false)
const currentSwap = ref(null)
const dragging = ref(null)
const {habits, displayHabits, refreshHabits} = useHabits()

const emit = defineEmits(['edit', 'remove'])


function privacyStatus(isPrivate) {
	return !isPrivate ? 'material-symbols:undereye-rounded' : 'streamline:invisible-1-solid'
}

function negativityStatus(isNegative) {
	return !isNegative ? ['Goal', 'icon-park-outline:positive-dynamics'] : ['Maximum Goal', 'pixelarticons:debug-off']
}

function populateForm(habit) {
	emit('edit', habit)
}

function removeHabit(id) {
	emit('remove', id)
}
async function swapHabitPriorities(habit) {
	const draggingIndex = displayHabits.value.findIndex(e => e.id == dragging.value.id)
	const dropIndex = displayHabits.value.findIndex(e => e.id == currentSwap.value.id);
	GqlSwapPriorities({
		firstHabit: currentSwap.value.id, firstPriority: draggingIndex, 
		secondHabit: dragging.value.id, secondPriority: dropIndex
	});
	currentSwap.value = null;
	sfxStore().randomSfxFromCategory('sortHabit')
	await refreshHabits()
}
</script>

<style>
.habits-list {
	padding: 2em;
	margin-top: 2em;
	position: relative;
}
#chk-toggle-grid {
	position: absolute;
	right: 1em;
	top: 1.3em;
	/* margin: 1em; */
	padding: 0.3em;
	border: 2px solid hsla(var(--electro));
}
.habits-list-grid {
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
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
.habits-grid-view {
	grid-template-columns: repeat(3, 1fr);
}
.habits-grid-view .habit-item {
	display: grid;
	gap: 0.3em;
	justify-items: center;
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
	cursor: grab;
}
.swappable {
	margin: 1em;
	border: 4px solid green;
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

</style>