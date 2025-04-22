<!-- src/Unit/MenuPanel.vue -->
<template>
	<div class="menu-panel" v-if="isVisible">
		<div class="menu-item" @click="selectOption('2DMV')">2DMV</div>
		<div class="menu-item" @click="selectOption('其他')">其他</div>
		<div class="menu-item" @click="selectOption('贺图')">贺图</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

const isVisible = ref(false);

const selectOption = (option) => {
	// 在这里处理选项点击事件，例如发送事件给父组件
	// console.log(`Selected option: ${option}`);
	// 隐藏面板
	isVisible.value = false;
};
</script>

<style scoped>
.menu-panel {
	position: absolute;
	top: 40px;
	right: 4px;
	background-color: white;
	border: 1px solid #ccc;
	border-radius: 4px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	padding: 10px;
	z-index: 1000;
	display: flex;
	flex-direction: column;
	gap: 8px;
}

.menu-item {
	cursor: pointer;
	padding: 8px 12px;
	border-radius: 4px;
	transition: background-color 0.2s ease;
}

.menu-item:hover {
	background-color: #f0f0f0;
}
</style>
