// server/api/automate/[habitId]/[automationKey].get.ts
import { automateCompleteHabit } from "~~/server/resolvers/habits"
import { sendStream, setHeaders, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
    const { habitId, automationKey } = event.context.params
    
    const trackedHabit = await automateCompleteHabit(habitId, automationKey)
    const sfxCategory = trackedHabit.negative ? 'completeHabitNegative' :
        Object.values(trackedHabit.datesCompleted).pop() >= (trackedHabit.goal || 0) ? 'hitGoal' : 'completeHabitPositive' 
    const sfxCategoryDir = path.resolve(process.cwd(), `app/assets/sfx/${sfxCategory}`)

    const files = fs.readdirSync(sfxCategoryDir)

    const randomFile = files[(Math.random() * files.length) | 0]
    const filePath = path.join(sfxCategoryDir, randomFile)

    // 4. Declare that this route outputs an MP3 binary
    setHeaders(event, {
        'Content-Type': 'audio/mpeg'
    })

    return sendStream(event, fs.createReadStream(filePath))
})
