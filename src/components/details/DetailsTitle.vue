<template>
	<div class="page-container">
		<!-- 标题区域 -->
		<div class="title-section">
			<h1 class="title">{{ title }}    <span style='margin-right: 20px'></span> {{character}}</h1>
			<div class="meta-info">
				<span>{{ date }}</span>
<!--				<span>•</span>-->
				<span>{{ type }}</span>
<!--				<span>•</span>-->
<!--				<span>{{ views }}</span>-->
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref } from 'vue';

// const title = ref('[会员][画集][天球堂 (椎名優)]Edel Farben[25P]');
// const date = ref('2024年12月25日 21:39');
// const category = ref('同人&小画集');
// const views = ref('阅读 363');

const props = defineProps({
	title: String,
	character: String,
	date: String,
	type: String,
});

</script>

<style scoped lang="scss">
.page-container {
	width: 100%;
	//box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.20);
}

.title-section {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 8px;
	.title {
		font-size: 24px;
		margin-bottom: 10px;
	}

	.meta-info {
		display: flex;
		align-items: center;

		span {
			margin-right: 10px;
			color: #888;
		}

		span:not(:last-child)::after {
			content: '•';
			margin-left: 10px;
		}
	}
}
</style>
