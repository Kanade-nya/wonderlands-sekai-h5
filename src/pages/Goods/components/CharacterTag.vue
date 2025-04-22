<script setup lang="ts">
import { type Contributor } from '../types/index';

defineProps({
	name: {
		type: String,
		required: true
	}
});
</script>

<template>
	<span class="character-tag">{{ name }}</span>
</template>

<style scoped lang="scss">
.character-tag {
	background-color: #f0f2f5;
	padding: 4px 8px;
	border-radius: 4px;
	font-size: 12px;
	color: #606266;
	display: inline-block;
	margin-right: 8px;
	margin-bottom: 8px;
}
</style>