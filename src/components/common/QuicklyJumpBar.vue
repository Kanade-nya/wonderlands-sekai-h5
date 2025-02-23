<template>
	<div class="navigation-bar">
		<div class="item" v-for="(item, index) in navigationItems" :key="index">
<!--			<div class="item-icon">{{ item.icon }}</div>-->
			<div class="item-text">{{ item.text }}</div>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		return {
			navigationItems: [
				{ icon: '🐤', text: '饰品指数', percentage: 0.01 },
				{ icon: '🔄', text: '租赁指数', percentage: 0.41 },
				{ icon: '🔫', text: '百元主战', percentage: -0.06 },
				{ icon: '🕵️', text: '探员指数', percentage: -0.07 },
				{ icon: '🐍', text: '原皮指数', percentage: -0.3 }
			]
		};
	}
};
</script>

<style scoped>
.navigation-bar {
	display: flex;
	justify-content: space-between;
	align-items: center;
	background-color: white;
	padding: 10px 0;
}

.item {
	display: flex;
	flex-direction: column;
	align-items: center;
	border-radius:12px;
	border: 1px solid #eee;
	transition: 0.2s ease-in ;
	width: 18%;
	height: fit-content;
	padding: 8px 0;
	cursor: pointer;
	&:hover{
		border: 1px solid skyblue;
	}
}

.item-icon {
	font-size: 24px;
	margin-bottom: 5px;
}

.item-text {
	font-size: 14px;
}

.item-percentage {
	font-size: 14px;
}

.positive {
	color: green;
}

.negative {
	color: red;
}
</style>