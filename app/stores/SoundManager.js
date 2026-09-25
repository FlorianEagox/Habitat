import { defineStore } from 'pinia';
import { Howl } from 'howler'


const soundFiles = Object.entries(
    import.meta.glob("~/assets/sfx/**/*.mp3", {
        eager: true,
        query: '?url',
        import:  "default"
    })
).reduce((directory, [path, value]) => {
    const [category, filename] = path.split('sfx/')[1].split('/')
    directory[category] ??= {}
    directory[category][filename] = value
    return directory

}, {})

export const sfxStore = defineStore('sfx', {
    state: () => ({
        sounds: soundFiles,
        volume: 0.5,
        isMuted: false,
        playingCurrently: [],
    }),
    actions: {
        playSound(category, path) {
            if(self.isMuted) return
            if(typeof this.sounds[category][path] === "string")
                this.sounds[category][path] = new Howl({src: [this.sounds[category][path]], volume: this.volume})
            const id = this.sounds[category][path].play()
            
        },
        randomSfxFromCategory(category) {
            const options = Object.keys(this.sounds[category])
            this.playSound(category, options[(Math.random() * options.length) | 0])
        },
        chooseHabitSfx(habit, checked, degreeOfCompletion = 0) {
            console.log(console.log(checked, habit, degreeOfCompletion))
            if(checked) {
                if(habit.completeSfx)
                    this.playSound('CustomHabitSfx', habit.completeSfx)
                else if(habit.clonedFrom?.completeSfx)
                    this.playSound('CustomHabitSfx', habit.clonedFrom.completeSfx)
                else
                    if(!habit.negative)
                        sfxStore().randomSfxFromCategory('completeHabitPositive')
                    else
                        sfxStore().randomSfxFromCategory('completeHabitNegative')
            }
            if(!habit.negative && degreeOfCompletion && degreeOfCompletion >= habit.goal)
                    sfxStore().randomSfxFromCategory('hitGoal')
                else if(habit.negative && (degreeOfCompletion && degreeOfCompletion <= habit.goal))
                    sfxStore().randomSfxFromCategory('hitGoal')   
        }
    }

})