// server/api/automate/[habitId]/[automationKey].get.ts
import { automateCompleteHabit } from "~~/server/resolvers/habits"
import { sendStream, setHeaders, getHeader, createError } from 'h3'
import fs from 'node:fs'
import path from 'node:path'

export default defineEventHandler(async (event) => {
	const { habitId, automationKey } = event.context.params
	const source = getHeader(event, 'source') || ''

	const trackedHabit = await automateCompleteHabit(habitId, automationKey)
	const sfxCategory = trackedHabit.negative ? 'completeHabitNegative' :
		parseFloat(Object.values(trackedHabit.datesCompleted).pop() || 0) >= (trackedHabit.goal || 0) ? 'hitGoal' : 'completeHabitPositive' 
	const sfxCategoryDir = path.resolve(process.cwd(), `app/assets/sfx/${sfxCategory}`)
	const possibleFiles = fs.readdirSync(sfxCategoryDir)

	const randomFile = possibleFiles[(Math.random() * possibleFiles.length) | 0]
	const filePath = path.join(sfxCategoryDir, randomFile)

	setHeaders(event, {'Content-Type': 'audio/mpeg'})
	if(source == 'habitat')
		return sendStream(event, fs.createReadStream(filePath))
	else
		return sendRedirect(event, `/nfc?habitId=${trackedHabit._id}&sfx=${sfxCategory}`)
})
