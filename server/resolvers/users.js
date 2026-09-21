import { db, toPublic } from '../db';

const users = db.get('users');

export async function getUser(_id) {
    return toPublic(await users.findOne({ _id }));
}
export async function searchUsers(part) {
    console.log({part})
    return toPublic(await users.find({ username: new RegExp(part, 'i') }));
}

export async function addFriend(user, friendId, status) {
    const {friends} = await getUser(user)
    
    async function updateStatuses(senderStatus = "SENT", recipientStatus = status) {
        users.update({_id: friendId}, {$set: {[`friends.${user}.status`] : recipientStatus}})
        return toPublic(await users.update({_id: user}, {$set: {[`friends.${friendId}.status`] : senderStatus}}))
    }
    
    switch (status) {
        case "PENDING":
            updateStatuses()
            break;
        case "ACCEPTED":
            if (friends?.[friendId].status == "PENDING")
                updateStatuses("ACCEPTED", "ACCEPTED")
            break;     
    }
}
