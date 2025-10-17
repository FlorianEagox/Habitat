<script setup>
import { authClient } from '~/app.vue';
const userId = (await authClient.useSession(useFetch)).data.value.user.id
const userInfo = GqlUser({id: userId})
const queryName = ref('')
const friendSearch = ref('');
const foundFriends = ref([])
const friends = ref([])

async function searchFriends(event) {
    foundFriends.value = (await GqlSearchUsers({part: queryName.value})).searchUsers   
}
async function sendFriendRequest(event, friendId) {
    await GqlAddFriend({friendId})
}
</script>

<template>
    <div id="friends">
        <input type="text" id="txt-add-friend" class="glassy" v-model="queryName" @change="searchFriends">
        <ul id="found-friends">
            <li v-for="friend in foundFriends" :key="friend.id">
                <img :src="friend.avatar || 'https://png.pngtree.com/png-clipart/20210912/ourmid/pngtree-mysterious-female-silhouette-png-image_3917003.jpg'">
                <h3 v-text="friend.username" />
                <button @click="sendFriendRequest($event, friend.id)"><Icon name="material-symbols:add-reaction-outline"/>Add Friend</button>
            </li>
        </ul>
        <ul id="friends-list">

        </ul>
        <div id="friendless">
            You haven't a friend in the world :-(
        </div>
    </div>
</template>
<style>
    #txt-add-friend {
        width: 100%;
    }
    #found-friends li {
        display: flex;

    }
</style>