<!-- src/Unit/GridItem.vue -->
<template>
	<view class="grid-item" @click="handleClick">
		<uni-icons :type="iconType" size="24" color="#999"></uni-icons>
		<text class="label">{{ label }}</text>
	</view>
</template>

<script setup>
import { defineProps } from 'vue';
import uniIcons from '@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue';

const props = defineProps({
	iconType: {
		type: String,
		required: true
	},
	label: {
		type: String,
		required: true
	},
	url: {
		type: String,
		required: true
	}
});

const handleClick = () => {
	uni.navigateTo({
		url: props.url
	});
};
</script>

<style scoped lang="scss">
.grid-item {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 16rpx;
	cursor: pointer;

	.label {
		margin-top: 8rpx;
		font-size: 24rpx;
		color: #333;
	}
}
</style>
