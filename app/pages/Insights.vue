<template>
    <article id="insights" class="raise">
        <h2 class="metal">Insights</h2>
        <section id="stats" class="glassy">
            <div class="stat">
                <span class="label glowy-text">Total Points</span>
                <span id="total-points" class="stat-value raise" v-text="points.totalPoints"/>
            </div>
            <div class="stat">
                <span class="label glowy-text">Average Points Per Day</span>
                <span id="average-points" class="stat-value raise" v-text="points.averagePpd"/>
            </div>
            <div class="stat">
                <span class="label glowy-text">Longest Streak</span>
                <span id="longest-streak-name"  class="stat-value raise" v-text="points.streaks.maxStreak?.habit?.name"></span>
                <span id="longest-streak-value" class="stat-value raise" v-text="points.streaks.maxStreak.maxStreak"></span>
            </div>
        </section>
    </article>
</template>

<script setup>
import useHabits from '~/composables/habits';


const { habits, points } = useHabits()


</script>

<style scoped lang="scss">
h2 {
    z-index: 3;
}
#stats {
    display: flex;
    justify-content: space-evenly;
    margin-top: 0.5em;
    padding: 1em;
    text-align: center;
    position: relative;
}
.stat {
    display: flex;
    flex-direction: column-reverse;
    border-right: 1px solid white;
    padding: 1em;
    justify-content: space-between;
}
.stat:last-child  {
    border-right: none;
}
.stat-value {
    color: hsla(var(--citrus)) !important;
}
#longest-streak-name {
    margin: 0.25em 0;
}
</style>