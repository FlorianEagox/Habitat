// import { Resolvers } from '#graphql/resolver';
import { typeDefs } from '#graphql/schema';
import { ApolloServer } from '@apollo/server';
import { startServerAndCreateH3Handler } from '@as-integrations/h3';
import { getHeaders } from 'h3';

import { addFriend, getUser, searchUsers } from '../resolvers/users';
import { resolvers as habitResolvers, updateSelectableHabits } from '../resolvers/habits';

import { auth } from '../auth';
import { resolveObjMapThunk } from 'graphql';

const resolvers = {
	Query: {
		user: (_, {id}, context) => getUser(id || context.user.id),
		searchUsers: (_, {part}, context) => searchUsers(part),
	},
	Mutation: {
		addFriend: (_, {friendId, status}, context) => addFriend(context.user.id, friendId, status)
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
console.log({resolvers})

const apollo = new ApolloServer({typeDefs, resolvers: [resolvers, habitResolvers]});
// const app = express();
// app.use(morgan())
export default startServerAndCreateH3Handler(apollo, {
	context: async ({event}) => {
		await updateSelectableHabits()
		const headers = getHeaders(event);
		const {user} = await auth.api.getSession({ headers });
		return { user, event }
	}
})
// apollo.ApplyMidleware({ app });
