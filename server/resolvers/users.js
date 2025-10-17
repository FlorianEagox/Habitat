import { db, toPublic } from '../db';

const users = db.get('users');

export async function getUser(id) {
    return toPublic(await users.findOne({ _id: id }));
}
export async function searchUsers(part) {
    console.log({part})
    return toPublic(await users.find({ username: new RegExp(part, 'i') }));
}

export async function addFriend(user, friendId) {
    return toPublic(await users.update({_id: user}, {$push: {friends: `${friendId}?`}}))
}
