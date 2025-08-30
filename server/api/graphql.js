// import { Resolvers } from '#graphql/resolver';
import { typeDefs } from '#graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateH3Handler } from '@as-integrations/h3';

const resolvers = {
	Query: {
		user: (id) => 'Hello world!'
	},
	Mutation: {
		register: (email, password) => 'Hello world!'
	}
};

const apollo = new ApolloServer({typeDefs, resolvers});

export default startServerAndCreateH3Handler(apollo, {
	context: (event) => ({ event })
})
