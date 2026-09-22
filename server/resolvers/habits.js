import { db, toPublic } from '../db';
import { getUser } from './users';
import monk from 'monk';

const habits = db.get('habits');

export async function addHabit(user, habit) {
	if (!user) throw new Error('Not authenticated');
	const newHabit = {
		...habit,
		owner: user.id,
		createdAt: habit.id ? undefined : new Date(),
		updatedAt: new Date(),
		datesCompleted: habit.datesCompleted || {},
		_id: habit.id ? habit.id : new monk.id(),
	}
	console.log({habit})
	const query = {_id: newHabit._id};
	delete newHabit.id;
	try {
		const habitRecord = await habits.update(
			query,
			{  $set: newHabit },
			{ upsert: true }
		);
		return newHabit;
	} catch (err) {
		console.error("AHHHH", err);
		throw new Error('Error adding habit');
	}
}

export async function getHabits(user, friendId) {
	console.log({friendId, user}, await getUser(user))
	if (!user)
		throw new Error('Not authenticated');
	try {
		if(!friendId)
			return toPublic(await habits.find({ owner: user.id })) || [];
		else if(user?.friends?.[friendId].status == "ACCEPTED")
			return toPublic(await habits.find({ owner: friendId })) || [];
	} catch (err) {
		throw new Error('Error fetching habits');
	}
}

export async function completeHabit(userId, id, date, degreeOfCompletion) {  // fetch the existing habit
  const habit = await habits.findOne({ _id: id });
  if (!habit) throw new Error('Habit not found');

  if (habit.owner != userId) throw new Error("That's not your habit")
  // make sure datesCompleted exists
  const datesCompleted = habit.datesCompleted || {};

  // mark this date as completed
  datesCompleted[date] = degreeOfCompletion;

  // update in DB
  await habits.update(
    { _id: id },
    { $set: { datesCompleted, updatedAt: new Date() } }
  );
  return {"Habit": { ...habit, id: habit.id, datesCompleted, updatedAt: new Date() }};
}

export async function deleteHabit(user, habitId) {
	return {'Habit': toPublic(await habits.findOneAndDelete({_id: habitId, owner: user.id}))}
}
