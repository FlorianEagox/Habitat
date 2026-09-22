<script setup>
import { router } from 'better-auth/api';
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
    <div id="friends" class="glassy">
        <h2 class="metal">Friends</h2>
        <div id="friend-search">
            <h3>Find a Friend</h3>
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
            <h3>Your Friends</h3>
            <li class="friend" v-for="friend in friends">
               <h3 v-text="friend.user.username"/>
               <button class="btn-accept-friend" v-if="friend.status == 'PENDING'" @click="acceptFriendRequest($event, friend.user.id)">Accept</button>
               <button class="btn-view-graph" v-else-if="friend.status == 'ACCEPTED'" @click="navigateTo({path: '/tracker', query: {friend: friend.user.id}})">View Habits</button>
               <p class="friend-pending" v-else>Awaiting Friend Request</p>
            </li>
        </ul>
        
    </div>
</template>
<style>
    #friends {
        margin: 2em auto;
        padding: 1em;
    }
    #friend-search {
        margin: 2em;
    }
    #txt-add-friend {
        width: 100%;
    }
    #friends li {
        display: flex;
        justify-content: space-around;
    }
</style>