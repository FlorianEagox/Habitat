import { calculateHabitMetrics } from '~/utils/habitMetrics'

export default function useHabits(userId) {
	const habits = userId ? ref([]) : useState('habits', () => [])

	async function refreshHabits() {
		const fetchedHabits = await GqlHabits({ owner: toValue(userId) })
		habits.value = fetchedHabits.habits || []
	}

	const displayHabits = computed(() => [...habits.value]
		.map((habit, index) => ({
			...habit,
			displayGoal: habit.type === "DURATION"
				? habit.goal?.toFixed(2).replace('.', ':')
				: habit.goal,
			order: habit.priority ?? index
		}))
		.sort((a, b) => a.order - b.order)
	)

	watch(() => toValue(userId), refreshHabits, { immediate: true })
	const points = computed(() => calculateHabitMetrics(habits.value))

	return { habits, refreshHabits, displayHabits, points }
}
