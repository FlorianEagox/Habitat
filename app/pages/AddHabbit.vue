<template>
    <div>
        <h1>Habit Tracker</h1>
        <ul>
            <li v-for="habit in habits" :key="habit.id">
                {{ habit.name }} - {{ habit.frequency }}
            </li>
        </ul>
        <form @submit.prevent="addHabit">
            <input v-model="newHabit.name" placeholder="Habit name" required />
            <select v-model="newHabit.frequency">
                <option value="Daily">Daily</option>
                <option value="Weekly">Weekly</option>
            </select>
            <button type="submit">Add Habit</button>
        </form>
    </div>
</template>

<script setup>
import { ref } from 'vue'

// Example schema data for Tracker
const habits = ref([
    { id: 1, name: 'Drink Water', frequency: 'Daily' },
    { id: 2, name: 'Exercise', frequency: 'Daily' },
    { id: 3, name: 'Read a Book', frequency: 'Weekly' }
])

const newHabit = ref({
    name: '',
    frequency: 'Daily'
})

function addHabit() {
    if (newHabit.value.name.trim()) {
        habits.value.push({
            id: habits.value.length + 1,
            name: newHabit.value.name,
            frequency: newHabit.value.frequency
        })
        newHabit.value.name = ''
        newHabit.value.frequency = 'Daily'
    }
}
</script>