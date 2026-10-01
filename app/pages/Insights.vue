<template>
	<div id="insights" class="raise">
		<h2 class="metal">Insights</h2>
		<section id="stats" class="glassy">
			<div class="stat stat-combined">
				<div class="stat-item">
					<span class="label glowy-text">Total Points</span>
					<span class="stat-value raise">{{ Math.round(metrics.totalPoints) }}</span>
				</div>
				<div class="stat-item">
					<span class="label glowy-text">Time Spent Intentionally (est.)</span>
					<span class="stat-value raise">{{ Math.floor(metrics.timeSpentMinutes / 60) }}h {{ Math.round(metrics.timeSpentMinutes % 60) }}m</span>
				</div>
			</div>
			<div class="stat">
				<span class="label glowy-text">Average Points Per Day</span>
				<span class="stat-value raise">{{ Math.round(metrics.averagePpd) }}</span>
			</div>
			<div class="stat">
				<span class="label glowy-text">Max Streak</span>
				<span class="stat-value raise">{{ metrics.streaks.maxStreak.maxStreak }} days</span>
				<span class="streak-habit">{{ metrics.streaks.maxStreak.habit?.name || 'No streak yet' }}</span>
			</div>
		</section>
		<section class="chart-grid">
			<ChartPanel
				title="Habit Priorities"
				type="pie"
				ring
				:options="priorityOptions"
				:series="priorityData.map(entry => entry.totalPoints)"
				empty-message="Complete a habit to see its points here."
			/>
			<ChartPanel
				title="Friend Point Totals"
				type="line"
				:options="friendOptions"
				:series="friendMetrics.length ? friendSeries : []"
				empty-message="Accept a friend to compare lifetime points."
			/>
			<ChartPanel
				title="Progress & Potential"
				type="donut"
				ring
				:options="potentialOptions"
				:series="potentialSeries"
				:setback="metrics.setbacks > 0"
				:badge="metrics.setbacks ? `${metrics.setbacks} setback${metrics.setbacks === 1 ? '' : 's'}` : ''"
				empty-message="Complete a habit to build your points potential."
			/>
		</section>
	</div>
</template>

<script setup>
import { computed, ref } from 'vue'
import { authClient } from '~/app.vue'
import useHabits from '~/composables/habits'
import { calculateHabitMetrics } from '~/utils/habitMetrics'

const { habits, points: metrics } = useHabits()
const friendMetrics = ref([])
const username = ref('You')
const colors = ['#48f5ff', '#ff4ccb', '#b8ff4d', '#ffc857', '#9b85ff', '#ff765e']

const session = await authClient.useSession(useFetch)
const signedInUser = session.data.value?.user

if (signedInUser?.id) {
	try {
		const { user } = await GqlUser({ id: signedInUser.id })
		username.value = user.username || signedInUser.name || 'You'
		const friends = (user.friends || []).filter(friend => friend.status === 'ACCEPTED')
		friendMetrics.value = (await Promise.all(friends.map(async ({ user: friend }) => {
			try {
				const { habits: friendHabits = [] } = await GqlHabits({ owner: friend.id })
				return { id: friend.id, name: friend.username, metrics: calculateHabitMetrics(friendHabits) }
			} catch {
				return null
			}
		}))).filter(Boolean)
	} catch (error) {
		console.error('Failed to load friend insights', error)
	}
}

function chartOptions(type, options = {}) {
	const { chart: chartOverrides = {}, ...overrides } = options
	return {
		chart: {
			type,
			background: 'transparent',
			foreColor: '#e7faff',
			fontFamily: '"Share Tech Mono", "Courier New", monospace',
			animations: { enabled: true, speed: 600 },
			toolbar: { show: false },
			...chartOverrides
		},
		colors,
		legend: { show: false },
		tooltip: { theme: 'dark' },
		...overrides
	}
}

const priorityData = computed(() => metrics.value.pointsbyHabitByDay.filter(entry => entry.totalPoints > 0))
const priorityOptions = computed(() => chartOptions('pie', {
	labels: priorityData.value.map(entry => entry.habit.name),
	plotOptions: { pie: { expandOnClick: true, dataLabels: { offset: -18, minAngleToShowLabel: 8 } } },
	stroke: { colors: ['#17152d'], width: 4 },
	dataLabels: {
		enabled: true,
		formatter: (_, options) => options.w.config.labels[options.seriesIndex],
		style: { fontSize: '11px', fontFamily: '"Share Tech Mono", "Courier New", monospace', fontWeight: 700, colors: ['#ffffff'] },
		dropShadow: { enabled: true, top: 1, left: 1, blur: 3, color: '#090817', opacity: 0.95 }
	},
	tooltip: { y: { formatter: value => `${value} points` } }
}))

const people = computed(() => [
	{ id: 'self', name: username.value, metrics: metrics.value },
	...friendMetrics.value
])
const friendSeries = computed(() => people.value.map((person, index) => ({
	name: person.name,
	color: colors[index % colors.length],
	data: person.metrics.dailySeries.reduce((series, day) => {
		const previousTotal = series.at(-1)?.y || 0
		series.push({ x: day.x, y: previousTotal + day.y })
		return series
	}, [])
})))
const friendOptions = computed(() => chartOptions('line', {
	colors: friendSeries.value.map(series => series.color),
	grid: { borderColor: 'rgba(136, 197, 220, 0.18)', strokeDashArray: 4, padding: { right: 82 } },
	xaxis: { type: 'datetime', tickAmount: 5, labels: { datetimeUTC: true, format: 'MMM d', style: { colors: '#b9d9e5', fontSize: '9px' } } },
	yaxis: { min: 0, title: { text: 'Points', style: { color: '#b9d9e5', fontSize: '10px' } }, labels: { formatter: value => Math.round(Number(value)).toLocaleString(), style: { colors: '#b9d9e5', fontSize: '9px' } } },
	stroke: { curve: 'smooth', width: 3 },
	markers: { size: 0, hover: { size: 4 } },
	annotations: { points: friendSeries.value.map(series => {
		const lastPoint = series.data.at(-1)
		return lastPoint ? {
			x: lastPoint.x,
			y: lastPoint.y,
			marker: { size: 0 },
			label: { text: series.name, borderColor: series.color, offsetX: 38, style: { background: series.color, color: '#120e28', fontSize: '9px' } }
		} : null
	}).filter(Boolean) },
	tooltip: { theme: 'dark', shared: true, intersect: false, x: { format: 'MMM d, yyyy' }, y: { formatter: value => `${Math.round(Number(value))} points` } }
}))

const potentialSeries = computed(() => metrics.value.totalCompletions
	|| metrics.value.setbacks
	? [metrics.value.totalPoints, metrics.value.pointsToPotential, metrics.value.setbackPotential]
	: [])
const potentialOptions = computed(() => chartOptions('donut', {
	labels: ['Points earned', 'Goal bonus available', 'Setback opportunity'],
	colors: [colors[0], '#433b63', '#ff526f'],
	plotOptions: { pie: { expandOnClick: false, dataLabels: { offset: -12, minAngleToShowLabel: 8 }, donut: { size: '68%', labels: { show: true, name: { show: false }, value: { show: false }, total: {
		show: true,
		label: 'POINTS / POTENTIAL',
		color: '#74f4ff',
		fontSize: '10px',
		formatter: () => `${metrics.value.totalPoints} / ${metrics.value.potentialPoints}`
	} } } } },
	stroke: { colors: ['#17152d', '#17152d', '#ff526f'], width: 4 },
	dataLabels: {
		enabled: true,
		formatter: (_, options) => options.w.globals.labels[options.seriesIndex],
		style: { fontSize: '9px', fontFamily: '"Share Tech Mono", "Courier New", monospace', fontWeight: 700, colors: ['#ffffff'] },
		dropShadow: { enabled: true, top: 1, left: 1, blur: 3, color: '#090817', opacity: 0.95 }
	},
	tooltip: { y: { formatter: value => `${Math.round(Number(value))} points potential` } }
}))
</script>

<style scoped lang="scss">
#insights {
	flex: 1;
	min-width: 0;
	padding: 1.25rem;
}

#insights h2 {
	position: relative;
	z-index: 3;
}

#stats {
	display: flex;
	justify-content: space-evenly;
	align-items: stretch;
	position: relative;
	z-index: 2;
	margin-top: 0.5em;
	padding: 0.5em;
	text-align: center;
}

.stat {
	display: flex;
	flex-direction: column;
	justify-content: space-evenly;
	align-items: center;
	gap: 0.25rem;
	flex: 1;
	min-width: 0;
	padding: 0.4em 0.6em;
	text-align: center;
	border-right: 1px solid white;
}

.stat:last-child {
	border-right: none;
}

.stat .label {
	position: relative;
	z-index: 2;
	color: #a4dfe8;
	font-size: 0.72rem;
}

.stat-value {
	color: hsl(var(--citrus)) !important;
	font-size: 1rem;
	font-weight: 800;
	font-variant-numeric: tabular-nums;
	text-shadow: 0 0 8px rgba(255, 198, 67, 0.42), 0 2px 0 rgba(0, 0, 0, 0.65);
}

.stat-value.raise {
	position: relative;
	z-index: 1;
}

.stat-combined {
	display: grid;
	grid-template-columns: minmax(0, 1fr);
	gap: 0.2rem;
}

.stat-item {
	display: flex;
	flex-direction: column;
	justify-content: center;
	gap: 0.2rem;
	min-width: 0;
}

.stat-combined .label {
	font-size: 0.62rem;
}

.stat-combined .stat-value {
	font-size: 0.9rem;
}

.streak-habit {
	color: #a4dfe8;
	font-size: 0.78rem;
}

.chart-grid {
	display: grid;
	grid-template-columns: repeat(2, minmax(0, 1fr));
	gap: 1.5rem;
	margin-top: 1.75rem;
}

@media (max-width: 900px) {
	.chart-grid {
		grid-template-columns: minmax(0, 1fr);
	}
	.stat .label {
		font-size: 0.65rem;
	}
}
</style>
