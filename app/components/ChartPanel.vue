<template>
	<article class="chart-panel">
		<div class="chart-panel-heading">
			<h3 class="chart-heading">{{ title }}</h3>
			<span v-if="badge" class="chart-badge">{{ badge }}</span>
		</div>
		<div v-if="series.length" class="chart-visual" :class="{ 'chart-visual-ring': ring, 'chart-visual-setback': setback }">
			<ClientOnly>
				<apexchart
					width="100%"
					height="100%"
					:type="type"
					:options="options"
					:series="series"
				/>
			</ClientOnly>
		</div>
		<p v-else class="chart-empty">{{ emptyMessage }}</p>
	</article>
</template>

<script setup>
defineProps({
	title: { type: String, required: true },
	type: { type: String, default: 'line' },
	options: { type: Object, required: true },
	series: { type: Array, default: () => [] },
	ring: Boolean,
	setback: Boolean,
	badge: { type: String, default: '' },
	emptyMessage: { type: String, default: 'Not enough data for this chart yet.' }
})
</script>

<style scoped lang="scss">
.chart-panel {
	--chart-cyan: rgba(88, 219, 255, 0.72);
	--chart-pink: rgba(255, 58, 192, 0.24);
	position: relative;
	isolation: isolate;
	min-width: 0;
	padding: 1.1rem;
	border: 1px solid rgba(125, 241, 255, 0.78);
	border-radius: 18px;
	background: linear-gradient(145deg, #39365a, #1a1a37 38%, #100d25);
	box-shadow: inset 0 2px 0 rgba(255, 255, 255, 0.28), inset 0 -7px 15px rgba(0, 0, 0, 0.72), 0 0 0 4px #0f0c22, 0 3px 0 5px #090817, 0 14px 24px rgba(0, 0, 0, 0.48), 0 0 28px rgba(49, 231, 255, 0.28), 0 0 48px var(--chart-pink);
}

.chart-panel::before {
	position: absolute;
	inset: 1px;
	z-index: 2;
	border-radius: inherit;
	background: repeating-linear-gradient(to bottom, rgba(200, 248, 255, 0.045) 0 1px, transparent 1px 5px);
	content: '';
	pointer-events: none;
}

.chart-panel > * {
	position: relative;
	z-index: 1;
}

.chart-panel-heading {
	display: flex;
	align-items: center;
	justify-content: center;
	gap: 0.6rem;
	margin-bottom: 0.8rem;
}

.chart-heading {
	max-width: 100%;
	margin: 0;
	padding: 0.42rem 0.9rem;
	border: 1px solid rgba(125, 241, 255, 0.85);
	border-radius: 999px;
	background: linear-gradient(180deg, rgba(100, 232, 255, 0.2), rgba(23, 19, 51, 0.95));
	color: #fff3bd;
	font-size: 0.95rem;
	text-align: center;
	text-shadow: 0 2px 0 #211533, 0 0 12px rgba(255, 80, 199, 0.38);
	box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.35), 0 0 10px var(--chart-cyan), 0 0 18px var(--chart-pink);
}

.chart-badge {
	color: #ff9cab;
	font-size: 0.72rem;
	white-space: nowrap;
}

.chart-visual {
	position: relative;
	width: 100%;
	height: 260px;
	min-width: 0;
	border: 1px solid rgba(125, 241, 255, 0.48);
	border-radius: 10px;
	background: radial-gradient(ellipse at 35% 25%, rgba(91, 105, 151, 0.38), rgba(7, 10, 26, 0.86) 76%);
	box-shadow: inset 0 3px 8px rgba(255, 255, 255, 0.12), inset 0 -8px 16px rgba(0, 0, 0, 0.55), 0 0 14px rgba(74, 233, 255, 0.16);
}

.chart-visual-ring {
	width: min(100%, 320px);
	height: auto;
	aspect-ratio: 1;
	margin: 0 auto;
	border-radius: 50%;
	background: radial-gradient(circle at 36% 27%, rgba(91, 105, 151, 0.92), rgba(31, 30, 65, 0.98) 44%, rgba(7, 10, 26, 1) 72%);
	box-shadow: inset 0 4px 7px rgba(255, 255, 255, 0.3), inset 0 -14px 24px rgba(0, 0, 0, 0.8), 0 0 0 5px #17142d, 0 0 0 7px var(--chart-cyan), 0 0 0 10px #100d24, 0 0 24px rgba(74, 233, 255, 0.72), 0 0 48px rgba(255, 68, 193, 0.4);
}

.chart-visual-ring::before {
	position: absolute;
	inset: 9px;
	border: 1px solid rgba(255, 255, 255, 0.25);
	border-radius: 50%;
	content: '';
	pointer-events: none;
}

.chart-visual-setback {
	outline: 2px solid #ff526f;
	outline-offset: 7px;
	filter: drop-shadow(0 0 9px rgba(255, 52, 91, 0.6));
}

.chart-visual :deep(.apexcharts-canvas),
.chart-visual :deep(.apexcharts-svg) {
	background: transparent !important;
	overflow: visible;
}

.chart-visual :deep(.apexcharts-legend) {
	display: none !important;
}

.chart-visual :deep(.apexcharts-pie-series path) {
	filter: drop-shadow(0 0 3px rgba(91, 245, 255, 0.88)) drop-shadow(0 0 12px rgba(255, 67, 198, 0.48));
	transition: filter 180ms ease;
}

.chart-visual :deep(.apexcharts-pie-series path:hover) {
	filter: brightness(1.18) saturate(1.3) drop-shadow(0 0 6px rgba(255, 255, 255, 0.95)) drop-shadow(0 0 17px rgba(77, 239, 255, 0.82));
}

.chart-visual :deep(.apexcharts-tooltip) {
	border: 1px solid rgba(97, 240, 255, 0.8) !important;
	background: rgba(9, 12, 30, 0.96) !important;
	box-shadow: 0 0 18px rgba(60, 231, 255, 0.3), 0 0 25px rgba(255, 61, 192, 0.2);
}

.chart-visual :deep(.apexcharts-tooltip * ) {
	color: #f1fbff !important;
}

.chart-visual :deep(.apexcharts-tooltip-title) {
	border-color: rgba(97, 240, 255, 0.35) !important;
	background: rgba(21, 18, 46, 0.98) !important;
}

.chart-empty {
	display: grid;
	place-items: center;
	min-height: 220px;
	padding: 1rem;
	border: 1px dashed rgba(112, 234, 255, 0.45);
	border-radius: 10px;
	color: #a4dfe8;
	font-family: 'Share Tech Mono', 'Courier New', monospace;
	text-align: center;
}

@media (max-width: 520px) {
	.chart-panel {
		padding: 0.9rem;
	}
	.chart-visual {
		height: 230px;
	}
	.chart-visual-ring {
		height: auto;
	}
}
</style>
