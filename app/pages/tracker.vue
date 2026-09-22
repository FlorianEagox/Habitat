<script setup>
	import { useRoute } from 'vue-router';
	const route = useRoute()
	definePageMeta({
		key: (route) => route.fullPath
	})
	const friendId = computed(() => route.query.friendId)
</script>

<template>
	<Tracker :friendId="friendId"/>
</template>
