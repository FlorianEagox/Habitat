export default function useHabits(userId) {
    const habits = useState('habits', () => [])
    const owner = ref(null)
    const error = ref(null)
    const friend = ref(null)

    console.log("useHabits!")

    async function refreshHabits() {
        const fetchedHabits = (await GqlHabits({owner: userId}))
		habits.value = fetchedHabits.habits

		if(userId)
			friend.value = habits.value[0].owner
		else
			friend.value = {}
    }

    const displayHabits = computed(() => [...habits.value]
		.map((habit, i) => ({
			...habit,
			displayGoal: habit.type === "DURATION"
				? habit.goal?.toFixed(2).replace('.', ':')
				: habit.goal,
			order: habit.priority ?? i
		}))
		.sort((a, b) => a.order - b.order)
    )

    watch(() => toValue(userId), refreshHabits, {immediate: true})

    return {habits, refreshHabits, displayHabits}
}
