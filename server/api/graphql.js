// import { Resolvers } from '#graphql/resolver';
import { typeDefs } from '#graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateH3Handler } from '@as-integrations/h3';

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
		register: (_, {username, email, password}) => {
			let id = dummyUsers.length
			dummyUsers.push({
				id,
				username,
				email,
				password
			})
			return dummyUsers[id]
		}
	}
};

const apollo = new ApolloServer({typeDefs, resolvers});

export default startServerAndCreateH3Handler(apollo, {
	context: (event) => ({ event })
})
