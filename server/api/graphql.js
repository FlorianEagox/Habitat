// import { Resolvers } from '#graphql/resolver';
import { typeDefs } from '#graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateH3Handler } from '@as-integrations/h3';
import { getHeaders } from 'h3';

import { getUser } from '../resolvers/users';
import { addHabit, getHabits, completeHabit, deleteHabit } from '../resolvers/habits';

import { auth } from '../auth';

const dummyUsers = [{
  id: "1234",
  username: "testuser",
  email: "test@example.com",
  friends: [],
  habits: []
}];

const resolvers = {
	Query: {
		user: (_, {id}) => getUser(id),
		habits: (_, __, context) => getHabits(context.user),
	},
	Mutation: {
		addHabit: (_, habit, context) => {console.log("hi i'm paul");  addHabit(context.user, habit)},
		completeHabit: (_, {habitId, date, degreeOfCompletion}, context) => completeHabit(habitId, date, degreeOfCompletion),
		deleteHabit: (_, {id}, context) => deleteHabit(context.user, id)
	},
	Habit: {
    	owner: (habit) => getUser(habit.owner) // <-- hydrate it here
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
