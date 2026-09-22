<script setup>
	const friendId = useRoute().query?.friend || null
</script>

<template>
	<Tracker :friendId="friendId"/>
</template>
