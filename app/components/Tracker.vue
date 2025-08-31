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
					<span v-if="habit.type === 'boolean'">
						<input type="checkbox" v-model="habit.datesCompleted[date.toISOString()]"
							:checked="habit.datesCompleted[date.toISOString()] || false" />
					</span>
					<span v-else-if="habit.type === 'duration'">
						<input type="number" v-model.number="habit.datesCompleted[date.toISOString()]"
							:placeholder="habit.goal" />
					</span>
					<span v-else-if="habit.type === 'quantity'">
						<input type="number" v-model.number="habit.datesCompleted[date.toISOString()]"
							:placeholder="habit.goal" />
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
		}
	}
</script>

<style>
	#tracker, .sun {
		width: 900px;
		height: 500px;
		color: hsl(var(--electro));
		/* synthwave sun */
		border-radius: 25px;
		background-image: linear-gradient(orange,gold, red, purple),linear-gradient(black,white);
		clip-path: polygon(-50% 0px,150% -50%,150% 55%,-50% 55%,
		-50% 62%,150% 62%,150% 70%,0 70%,
		-50% 75%,150% 75%,150% 80%,0 80%,
		-50% 82%,150% 82%,150% 85%,0 85%,
		-50% 87%,150% 87%,150% 90%,0 90%,
		-50% 92%,150% 92%,150% 95%,0 95%,
		-50% 96%,150% 96%,150% 150%,0 150%);
		box-shadow: rgba(255,128,0,0.7) 0px 0 20px;
	}
	#habbits-grid {
		display: grid;
		grid-template-columns: 1.4fr repeat(7, 1fr);
		grid-template-rows: auto;
		gap: 10px;
		padding: 20px;
	}
	#headings {
		font-weight: bold;
		text-align: center;
		display: contents;
	}
	#headings span {
		text-align: center;
	}
	.habit {
		display: contents;
	}
	input[type="checkbox"] {
		width: 20px;
		height: 20px;
		margin: 0 auto;
		display: block;
	}
	input[type="number"] {
		width: 65%;
		background-color: transparent;
		border: none;
		display: block;
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