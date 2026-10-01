const DAY_MS = 24 * 60 * 60 * 1000
const POINTS_PER_COMPLETION = 10
const BONUS_FOR_GOAL = 10

function utcDay(timestamp) {
	const date = new Date(Number(timestamp))
	if (Number.isNaN(date.getTime())) return null
	return Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate())
}

function completionsFor(habit) {
	return Object.entries(habit.datesCompleted || {})
		.map(([timestamp, value]) => ({ day: utcDay(timestamp), value }))
		.filter(entry => entry.day !== null && entry.value !== false && entry.value !== null && entry.value !== undefined)
}

function goalProgress(habit, value) {
	if (habit.type === 'BOOLEAN') return 1
	const goal = Number(habit.goal)
	return goal > 0 ? Math.min(Math.max(Number(value) / goal, 0), 1) : 0
}

function completionPoints(habit, value) {
	return POINTS_PER_COMPLETION + Math.round(BONUS_FOR_GOAL * goalProgress(habit, value))
}

function intentionalMinutes(habit, value) {
	return habit.type === 'DURATION' ? Math.round(Number(value) * 60) : 5
}

function longestStreak(habit, completions) {
	const days = completions.map(completion => completion.day).sort((a, b) => a - b)
	let streak = 0
	let maxStreak = 0
	let previousDay = null

	for (const day of days) {
		streak = previousDay !== null && day - previousDay === DAY_MS ? streak + 1 : 1
		maxStreak = Math.max(maxStreak, streak)
		previousDay = day
	}

	return { habit, maxStreak }
}

export function calculateHabitMetrics(habits = [], now = new Date()) {
	const today = utcDay(now.getTime())
	const dailyPoints = new Map()
	const streaks = []
	const pointsByHabit = []
	let totalPoints = 0
	let totalCompletions = 0
	let goalsMet = 0
	let setbacks = 0
	let timeSpentMinutes = 0
	let firstActiveDay = null

	for (const habit of habits) {
		const completions = completionsFor(habit)
		if (habit.negative) {
			setbacks += completions.length
			continue
		}

		let habitTotal = 0

		for (const completion of completions) {
			const points = completionPoints(habit, completion.value)
			habitTotal += points
			totalPoints += points
			totalCompletions++
			timeSpentMinutes += intentionalMinutes(habit, completion.value)
			if (completion.day < today + DAY_MS) {
				dailyPoints.set(completion.day, (dailyPoints.get(completion.day) || 0) + points)
				firstActiveDay = firstActiveDay === null ? completion.day : Math.min(firstActiveDay, completion.day)
			}

			if (goalProgress(habit, completion.value) === 1) goalsMet++
		}

		pointsByHabit.push({ habit, totalPoints: habitTotal })
		streaks.push(longestStreak(habit, completions))
	}

	const daysTracked = firstActiveDay === null ? 0 : Math.floor((today - firstActiveDay) / DAY_MS) + 1
	const dailySeries = []
	if (daysTracked) {
		for (let day = firstActiveDay; day <= today; day += DAY_MS) {
			dailySeries.push({ x: day, y: dailyPoints.get(day) || 0 })
		}
	}

	pointsByHabit.sort((left, right) => right.totalPoints - left.totalPoints)
	const maxStreak = streaks.reduce((best, current) => current.maxStreak > best.maxStreak ? current : best, { maxStreak: 0 })
	const potentialPoints = totalCompletions * (POINTS_PER_COMPLETION + BONUS_FOR_GOAL)
	const pointsToPotential = Math.max(potentialPoints - totalPoints, 0)
	const setbackPotential = setbacks * (POINTS_PER_COMPLETION + BONUS_FOR_GOAL)

	return {
		totalPoints,
		averagePpd: daysTracked ? totalPoints / daysTracked : 0,
		pointsbyHabitByDay: pointsByHabit,
		dailySeries,
		goalsMet,
		totalCompletions,
		potentialPoints,
		pointsToPotential,
		setbackPotential,
		timeSpentMinutes,
		setbacks,
		streaks: { allStreaks: streaks, maxStreak }
	}
}
