<script setup>
import { authClient } from '~/app.vue';
const userId = (await authClient.useSession(useFetch)).data.value.user.id
const userInfo = (await GqlUser({id: userId})).user
const friends = userInfo.friends
const queryName = ref('')
const friendSearch = ref('');
const foundFriends = ref([])

async function searchFriends(event) {
    foundFriends.value = (await GqlSearchUsers({part: queryName.value})).searchUsers
}
async function sendFriendRequest(event, friendId) {
    await GqlAddFriend({friendId: friendId, status: "PENDING"})
}
async function acceptFriendRequest(event, friendId) {
    await GqlAddFriend({friendId: friendId, status: "ACCEPTED"})
}
</script>

<template>
    <div id="friends">
        <div id="friend-search">
            <h2>Find a Friend</h2>
            <input type="text" id="txt-add-friend" class="glassy" v-model="queryName" @change="searchFriends">
            <ul id="found-friends">
                <li v-for="friend in foundFriends" :key="friend.id">
                    <img :src="friend.avatar || 'https://png.pngtree.com/png-clipart/20210912/ourmid/pngtree-mysterious-female-silhouette-png-image_3917003.jpg'">
                    <h3 v-text="friend.username" />
                    <button @click="sendFriendRequest($event, friend.id)"><Icon name="material-symbols:add-reaction-outline"/>Add Friend</button>
                </li>
            </ul>
            <hr>
        </div>
        <div v-if="friends?.length == 0" id="friendless">
            You haven't a friend in the world :-( \n Try adding tessa!
        </div>
        <ul id="friends-list" v-else>
            <h2>Your Friends</h2>
            <li class="friend" v-for="friend in friends">
               <h3 v-text="friend.user.username"/>
               <button id="accept-friend" v-if="friend.status == 'PENDING'" @click="acceptFriendRequest($event, friend.user.id)">Accept</button>
               <button id="grapah" v-else-if="friend.status == 'ACCEPTED'">View Habits</button>
               <p v-else>Awaiting Friend Request</p>
            </li>
        </ul>
        
    </div>
</template>
<style>
    #txt-add-friend {
        width: 100%;
    }
    #friends li {
        display: flex;
        justify-content: space-around;
    }
</style>