<template>
	<label class="form-bool" :for="`chk-${props.text}`">
		<input type="checkbox" :id="`chk-${props.text}`" :name="`chk-${props.text}`" v-model="model" v-show="showCheckBox">
		<span class="label-text">
			<Icon :name="props.iconName" />
			{{  props.text }}
		</span>
	</label>
</template>

<script setup>
const model = defineModel({type: Boolean})


const props = defineProps({
	text: String,
	iconName: String,
	showCheckBox: {type: Boolean, default: true},
})
</script>

