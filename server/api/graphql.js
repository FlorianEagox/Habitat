
const { users: usersCollection, bcrypt } = require('./db')
const habits = []

module.exports = {
	Query: {
		me(_parent, _args, context) {
		return context.user || null
		},
		user(_parent, { id }) {
		return users.find(u => u.id === id) || null
		},
		users() {
		return users
		},
		habit(_parent, { id }) {
		return habits.find(h => h.id === id) || null
		},
		habits() {
		return habits
		}
	},
	Mutation: {
			async signup(_parent, { username, email, password }) {
				// Check if user exists
				const existing = await usersCollection.findOne({ email })
				if (existing) throw new Error('Email already registered')
				const hash = await bcrypt.hash(password, 10)
				const user = {
					username,
					email,
					password: hash,
					friends: [],
					habits: []
				}
				const inserted = await usersCollection.insert(user)
				// Remove password before returning
				delete inserted.password
				return inserted
			},
		login(_parent, { email, password }) {
		// Add real password check and session/token logic
		const user = users.find(u => u.email === email)
		if (!user) throw new Error('User not found')
		return 'mock-token'
		},
		addHabit(_parent, { name, description }, context) {
		if (!context.user) throw new Error('Not authenticated')
		const habit = { id: String(habits.length+1), name, description, createdAt: new Date().toISOString(), completedDates: [], owner: context.user }
		habits.push(habit)
		context.user.habits.push(habit)
		return habit
		},
		completeHabit(_parent, { habitId, date }, context) {
		if (!context.user) throw new Error('Not authenticated')
		const habit = habits.find(h => h.id === habitId && h.owner.id === context.user.id)
		if (!habit) throw new Error('Habit not found')
		habit.completedDates.push(date)
		return habit
		},
		addFriend(_parent, { friendId }, context) {
		if (!context.user) throw new Error('Not authenticated')
		const friend = users.find(u => u.id === friendId)
		if (!friend) throw new Error('Friend not found')
		context.user.friends.push(friend)
		return context.user
		}
	},
	User: {
		friends(user) {
		return user.friends || []
		},
		habits(user) {
		return user.habits || []
		}
	},
	Habit: {
		owner(habit) {
		return habit.owner
		}
	}
}
