<!-- src/components/useful/GridRow.vue -->
<!--水平的小点击按钮栏-->
<template>
	<div class="grid-row">
		<GridItem v-for="(item, index) in items" :key="index" :iconType="item.iconType" :label="item.label" :url="item.url" />
	</div>
</template>

<script setup>
import { defineProps } from 'vue';
import GridItem from "./GridItem.vue";

const props = defineProps({
	items: {
		type: Array,
		required: true
	}
});
</script>

<style scoped lang="scss">
.grid-row {
	display: flex;
	justify-content: space-around;
	padding:  16rpx;
	background-color: white;
	margin-bottom: 16rpx;
	margin-top: 16rpx;
	border-bottom: 1px solid #eee;
}
</style>
