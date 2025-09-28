import { monk } from 'monk';

const db = monk("mongodb://localhost/habitat");
const habits = db.get('habits');

export async function addHabit(user, habit) {
    if (!user)
        throw new Error('Not authenticated');
    habits.update({ userId: user, _id: habit._id }, habit, { upsert: true });
}
