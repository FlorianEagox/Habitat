<template>
	<div id="tracker" class="raise">
		<h2 class="metal raised">My Habits</h2>
		<hr>
		<div class="glowy-text" id="habbits-grid">
			<div id="headings">
				<span>Habbit</span>
				<span class="day-heading" v-for="date in listedDayHeadings" :key="date" v-text="date" />
			</div>
			<div v-for="habit in habits" :key="habit.name" class="habit">
				<h3 class="glowy-text">{{ habit.name }}</h3>
				<div v-for="date in listedDates" :key="date.toISOString()" class="habit-day">
						<input type="checkbox" v-model="habit.datesCompleted[date.toISOString()]"
							:checked="habit.datesCompleted[date.toISOString()] || false"
							@click="completeHabbit(habit)"/>
						<span class="optional-quantity" v-if="habit.datesCompleted[date.toISOString()]">
							<input type="number" v-model.number="habit.datesCompleted[date.toISOString()]"
								:placeholder="habit.goal" class="glassy"
								v-if="habit.type === 'duration'"/>
							<input type="number" v-model.number="habit.datesCompleted[date.toISOString()]"
								:placeholder="habit.goal" class="glassy"
								v-else-if="habit.type === 'quantity'"/>
						</span>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	export default {
		data() {
			const today = new Date();
			const daysToShow = 7;
			let listedDates = Array.from({length: daysToShow}, (day, i) =>
				new Date(new Date().setDate(today.getDate() - i)
			)
)
			return {
				habits: [
					{
						name: "Wake up time",
						type: "duration",
						datesCompleted: [],
						completedToday: false,
						degreeOfCompletion: 0.8,
						goal: 8
					},
					{
						name: "Play Piano",
						type: "duration",
						datesCompleted: [],
						completedToday: false,
						degreeOfCompletion: 0.5,
						goal: 30
					},
					{
						name: "Read Book",
						type: "quantity",
						datesCompleted: [],
						completedToday: false,
						degreeOfCompletion: 0.75,
						goal: 100
					},
					{
						name: "Exercise",
						type: "duration",
						datesCompleted: [],
						completedToday: false,
						degreeOfCompletion: 0.2,
						goal: 60
					},
					{
						name: "Meditate",
						type: "duration",
						datesCompleted: [],
						completedToday: false,
						degreeOfCompletion: 0.9,
						goal: 15
					},
					{
						name: "Take Medication",
						type: "boolean",
						datesCompleted: [],
						completedToday: false,
						degreeOfCompletion: 1,
					},
					{
						name: "Journal",
						type: "duration",
						datesCompleted: [],
						completedToday: false,
						degreeOfCompletion: 0.8,
						goal: 20
					},
				],
				listedDates
			};
		},
		computed: {
			listedDayHeadings() {
				return this.listedDates.map(date =>
					date.toLocaleDateString('en-US', { weekday: 'short' })
				);
			}
		},
		mounted() {
			// console.log("Tracker component mounted");
			// console.log(this.listedDayHeadings())
		},
		methods: {
			completeHabbit(event, habit) {
				const chk = event.target;
				console.log("COMPLETED", habit);
			}
		}
	}
</script>

<style>
	#tracker {
		width: 900px;
		height: 500px;
		position: relative;
		color: hsl(var(--electro));
		border-radius: 25px;
		overflow: visible; /* make sure content can overflow if needed */
	}

	#tracker::before {
		content: "";
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background-image: linear-gradient(orange, gold, red, purple);
		clip-path: polygon(
  -50% 0%, 150% -20%, 150% 35%, -50% 35%,
  -50% 42%, 150% 42%, 150% 50%, 0 50%,
  -50% 55%, 150% 55%, 150% 60%, 0 60%,
  -50% 62%, 150% 62%, 150% 65%, 0 65%,
  -50% 67%, 150% 67%, 150% 70%, 0 70%,
  -50% 72%, 150% 72%, 150% 75%, 0 75%,
  -50% 76%, 150% 76%, 150% 150%, 0 150%
);
		border-radius: 25px;
		box-shadow: rgba(255,128,0,0.7) 0px 0 20px;
		z-index: 0;
	}

	#tracker > * {
		position: relative;
		z-index: 1; /* ensure content sits above the background */
	}
	#habbits-grid {
		display: grid;
		grid-template-columns: 1.4fr repeat(7, 1fr);
		grid-template-rows: auto;
		gap: 15px;
		row-gap: 25px;
		padding: 20px;
		/* make elements be in center of grid cells */
		/* justify-items: center; */
		align-items: center;
	}
	#headings {
		font-weight: bold;
		text-align: center;
		display: contents;
	}
	#headings span {
		text-align: center;
	}
	h3 {
		white-space: nowrap;
	}
	.habit {
		display: contents;
	}
	.optional-quantity {
		display: inline;
	}
	input[type="checkbox"] {
		width: 20px;
		height: 20px;
		margin: 0 auto;
	}
	input[type="number"] {
		width: 80%;
		background-color: transparent;
		border: none;
		margin: 0 auto;
		border-bottom: 2px solid hsl(var(--electro));
		color: hsl(var(--electro));
		text-align: center;
		outline: invert;
		/* text-shadow: inherit; */
		font-size: 1.2em;
		text-shadow: 0 0 2px hsla(var(--purple), 1);
	}
</style>