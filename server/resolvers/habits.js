import monk from 'monk';

const db = monk("mongodb://localhost/habitat");
const habits = db.get('habits');

export async function addHabit(user, habit) {
	if (!user) throw new Error('Not authenticated');
	const newHabit = {
		...habit,
		owner: user.id,
		createdAt: habit.id ? undefined : new Date(),
		updatedAt: new Date(),
	}
	delete newHabit.id;
	let query = { owner: user.id };
	if (habit.id != null) {
		newHabit._id = habit.id;
		query._id = habit.id;
	}
	
	console.log({newHabit});
	try {
		const habitRecord = await habits.update(
			query,
			{$set: newHabit },
			{ upsert: true }
		);
		return newHabit;
	} catch (err) {
		console.error("AHHHH", err);
		throw new Error('Error adding habit');
	}	
}

export async function getHabits(user) {
	if (!user)
		throw new Error('Not authenticated');
	console.log("letsa go!")
	try {
		const foundHabits = (await (habits.find({ owner: user.id })))
			.map(h => ({...h, id: h._id}));
		console.log("AWOOO", {foundHabits});
		return foundHabits || [];
	} catch (err) {
		console.error("Error fetching habits", err);
		throw new Error('Error fetching habits');
	}
}