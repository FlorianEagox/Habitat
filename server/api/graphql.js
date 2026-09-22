// import { Resolvers } from '#graphql/resolver';
import { typeDefs } from '#graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateH3Handler } from '@as-integrations/h3';
import { getHeaders } from 'h3';

import { addFriend, getUser, searchUsers } from '../resolvers/users';
import { addHabit, getHabits, completeHabit, deleteHabit } from '../resolvers/habits';

import { auth } from '../auth';

const resolvers = {
	Query: {
		user: (_, {id}, context) => getUser(id || context.user.id),
		habits: (_, {owner}, context) => getHabits(context.user, owner),
		searchUsers: (_, {part}, context) => searchUsers(part)
	},
	Mutation: {
		addHabit: (_, habit, context) => {console.log("hi i'm paul");  addHabit(context.user, habit)},
		completeHabit: (_, {habitId, date, degreeOfCompletion}, context) => completeHabit(context.user.id, habitId, date, degreeOfCompletion),
		deleteHabit: (_, {id}, context) => deleteHabit(context.user, id).then(a => console.log(a)),
		addFriend: (_, {friendId, status}, context) => addFriend(context.user.id, friendId, status)
	},
	Habit: {
    	owner: (habit) => getUser(habit.owner) // <-- hydrate it here
  	},
	User: {
		friends: (parent) => {
			if(!parent.friends) return [];
			return Object.entries(parent.friends).map(([id, status]) => ({
				user: getUser(id),
				status: status.status
			}));
		}
	}
};

const apollo = new ApolloServer({typeDefs, resolvers});
// const app = express();
// app.use(morgan())
export default startServerAndCreateH3Handler(apollo, {
	context: async ({event}) => {
		const headers = getHeaders(event);
		const {user} = await auth.api.getSession({ headers });
		return { user, event }
	}
})
// apollo.ApplyMidleware({ app });
