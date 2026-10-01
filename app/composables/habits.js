export default function useHabits(userId) {
    const habits = userId ? ref([]) : useState('habits', () => [])
    const owner = ref(null)
    const error = ref(null)
    const friend = ref(null)

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

	const points = computed(() => {
		const pointsbyHabitByDay = []
		habits.value.filter(habit => !habit.negative).forEach(habit => {
			pointsbyHabitByDay.push({
				habit,
				totalPoints: Object.values(habit.datesCompleted)
					.reduce((total, dateValue) => total += Math.ceil(parseFloat(dateValue) / habit.goal) + 1 || 1, 0, 0)
			})
		})
		let streaks = habits.value.filter(habit => !habit.negative).map(habit => {
			const allTrackedDays = Object.keys(habit.datesCompleted)
			const allPossibleDays = []
			let currentStreak = 0;
			let maxStreak = 0;
			for(let currentDay = Math.min(...allTrackedDays); currentDay <= Math.max(...allTrackedDays); currentDay += 1000 * 24 * 60 * 60) {
				allPossibleDays.push({currentDay: habit.datesCompleted[currentDay]  || 0})
				if(currentDay in habit.datesCompleted) {
					currentStreak++
					if(currentStreak > maxStreak)
						maxStreak = currentStreak
				} else
					currentStreak = 0
			}
			return {habit, maxStreak, allTrackedDays, allPossibleDays}
		})
		const maxStreak = streaks.reduce((maxStreak, currentStreak) => currentStreak.maxStreak > maxStreak.maxStreak ? currentStreak : maxStreak, {maxStreak: 0})
		streaks = {allStreaks: [...streaks], maxStreak}
		
		console.log({streaks, pointsbyHabitByDay})
		const totalPoints = pointsbyHabitByDay.reduce((total, habitPoints) => total += habitPoints.totalPoints, 0, 0)
		const averagePpd = totalPoints / pointsbyHabitByDay.length

		return {totalPoints, averagePpd, pointsbyHabitByDay, streaks}
	})

    return {habits, refreshHabits, displayHabits, points}
}
