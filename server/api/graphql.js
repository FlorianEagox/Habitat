// import { Resolvers } from '#graphql/resolver';
import { typeDefs } from '#graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateH3Handler } from '@as-integrations/h3';
import { addHabit } from '../resolvers/habits';
import { auth } from '../api/auth';

const dummyUsers = [{
  id: "1234",
  username: "testuser",
  email: "test@example.com",
  friends: [],
  habits: []
}];

const resolvers = {
	Query: {
		user: (_, {id}) => dummyUsers[id]
	},
	Mutation: {
		addHabit: (_, habit, context) => addHabit(context.user, habit)
	}
};

const apollo = new ApolloServer({typeDefs, resolvers});

export default startServerAndCreateH3Handler(apollo, {
	context: async event => {	
		const session = await auth.api.getSession({headers: event.req.headers});
		return { user: session?.user ?? null, event }
	}
})
