import { db, toPublic } from '../db';

const users = db.get('users');

export async function getUser(id) {
    return toPublic(await users.findOne({ _id: id }));
}
