import { db, toPublic } from '../db';
import { getUser } from './users';
import monk from 'monk';
import selectableHabits from '@/assets/selectableHabits.js'
import { parseDurationToFloat, formatFloatToDuration } from '@/utils/textRendering'
import crypto from 'crypto'

const habits = db.get('habits');

export const resolvers = {
	Query: {
		habits: (_, {owner}, context) => getHabits(context.user, owner),
		selectableHabits: () => getSelectableHabits()
	},
	Mutation: {
		addHabit: (_, habit, context) => {console.log("hi i'm paul"); return addHabit(context.user, habit)},
		completeHabit: (_, {habitId, date, degreeOfCompletion}, context) => completeHabit(context.user.id, habitId, date, degreeOfCompletion),
		deleteHabit: (_, {id}, context) => deleteHabit(context.user, id).then(a => console.log(a)),				
		swapPriorities: (_, habitPriorities, {user}) => swapPriorities(user.id, ...Object.values(habitPriorities)),
		requestAutomationUrl: ((_, {habitId}, {user}) => generateHabitAutomationKey(user.id, habitId))
	},
	Habit: {
		owner: (habit) => {
			if(!habit.owner) return null
			return getUser(habit.owner) // <-- hydrate it here
		},
		clonedFrom: (habit, {habitId, friendId}, context) => {
			if(!habit.clonedFrom) return null;
			return getHabit(habit.clonedFrom, context.user, habit?.owner)
		} 
  	},
}

export async function addHabit(user, habit) {
	console.log("Adding", {habit})
	if (!user) throw new Error('Not authenticated');
	const newHabit = {
		...habit,
		owner: user.id,
		createdAt: habit.id ? undefined : new Date(),
		updatedAt: new Date(),
		_id: habit.id ? habit.id : new monk.id(),
	}
	const query = {_id: newHabit._id};
	delete newHabit.id;
	try {
		const habitRecord = await habits.update(
			query,
			{
				$set: newHabit,
				$setOnInsert: { datesCompleted: {}}
			},
			{ upsert: true }
		);
		return toPublic(newHabit);
	} catch (err) {
		console.error("AHHHH", err);
		throw new Error('Error adding habit');
	}
}


export async function getHabit(habitId, userId = null, friendId = null) {
	const habit = await habits.findOne({_id: habitId})
	if(
		habit && habit?.selectable||
		habit?.owner == userId || 
		(!habit?.private && friendId && (await getUser(userId))?.friends?.[friendId].status == "ACCEPTED")
	)
		return toPublic(habit)
	else
		throw new Error("You don't have access to this habit >~<")
}
export async function getHabits(user, friendId) {
	console.log({friendId, user}, await getUser(user))
	if (!user)
		throw new Error('Not authenticated');
	try {
		if(!friendId)
			return toPublic(await habits.find({ owner: user.id })) || [];
		else if(user?.friends?.[friendId].status == "ACCEPTED")
			return toPublic(await habits.find({ owner: friendId, private: {$ne: true} })) || [];
	} catch (err) {
		throw new Error('Error fetching habits');
	}
}

export async function completeHabit(userId, id, date, degreeOfCompletion) {
  const habit = await habits.findOne({ _id: id });
  if (!habit) throw new Error('Habit not found');
  if (habit.owner != userId) throw new Error("That's not your habit");

  const datesCompleted = habit.datesCompleted || {};

  if (degreeOfCompletion === null || degreeOfCompletion === false || degreeOfCompletion === undefined)
	delete datesCompleted[date];
  else
	datesCompleted[date] = degreeOfCompletion;
  
  const updatedHabit = await habits.findOneAndUpdate(
	{ _id: id },
	{ $set: { datesCompleted, updatedAt: new Date(), automaticTracking: false } },
	{ returnOriginal: false }
  );
  
  return toPublic(updatedHabit);
}
export async function automateCompleteHabit(habitId, automationKey) {
	try {
		const habit = await habits.findOne({_id: habitId, automationKey})
		if(!habit) return "Unauthorized Bucko"
		
		const today = new Date().setUTCHours(0,0,0,0)
		const datesCompleted = habit.datesCompleted || {};
		// False, they scanned for the first time today
		let automaticTrackingInProgress = habit.automaticTracking || false

		switch(habit.type) {
			case "QUANTITY":
				datesCompleted[today] = (datesCompleted[today] || 0) + 1
				break;
			case "DURATION":
				if(automaticTrackingInProgress) {
					const elapsedHours = (new Date() - new Date(habit.updatedAt)) / (1000 * 60 * 60)
					if (elapsedHours >= 3) // user forgot to stop tracking
						automaticTrackingInProgress = true // resetting this as a new session
					else {
						datesCompleted[today] += elapsedHours
						automaticTrackingInProgress = false // Stop tracking
					}
				} else {
					automaticTrackingInProgress = true // Start tracking
					datesCompleted[today] = (datesCompleted[today] || 0) + 0.016
				}
				break;
			default:
				datesCompleted[today] = true
		}
		return await habits.findOneAndUpdate(
			{ _id: habitId },
			{ $set: { datesCompleted, updatedAt: new Date(), automaticTracking: automaticTrackingInProgress } },
			{ returnOriginal: false }
		);
	} catch(e) {
		return e
	}
}

export async function updateSelectableHabits() {
	console.log("syncing selectable habits")
	try {
	const updatedHabits = await habits.bulkWrite(selectableHabits.map(habit => ({
		updateOne: {
			filter: {name: habit.name, owner: {$exists: false}},
			update: {
				$set: {
					...habit,
					goal: habit.type == "DURATION" ? parseDurationToFloat(habit?.goal) : parseFloat(habit?.goal)  || 0,
					// timeScaler: parseDurationToFloat(habit?.timeScaler),
				},
				$setOnInsert: {
					_id: new monk.id(),
					selectable: true
				}
			},
			upsert: true
		}
	})))
	console.log({updatedHabits}, updatedHabits.upserted)
	} catch(e) {console.log(e)}
}
export async function getSelectableHabits() {
	console.log("SELECTABLE HABITS")
	return toPublic(await habits.find({selectable: true}))
}

export async function deleteHabit(user, habitId) {
	return {'Habit': toPublic(await habits.findOneAndDelete({_id: habitId, owner: user.id}))}
}

export async function swapPriorities(userId, firstHabit, firstPriority, secondHabit, secondPriority) {
	return toPublic([
		await habits.findOneAndUpdate({_id: firstHabit, owner: userId}, {$set: {priority: firstPriority}}),
		await habits.findOneAndUpdate({_id: secondHabit, owner: userId}, {$set: {priority: secondPriority}})
	])
}

export async function generateHabitAutomationKey(user, habitId) {
	const habit = (await habits.findOneAndUpdate(
		{_id: habitId, owner: user},
		[
			{
				$set: {
					automationKey: {
						$ifNull: ['$automationKey', crypto.randomBytes(16).toString('base64url')]
					}
				}
			}
		],
		{returnNewDocument: true}
	));
	console.log({habit, user, habitId})
	return habit.automationKey
}