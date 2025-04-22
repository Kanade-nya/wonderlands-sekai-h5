<template>
	<div class="page-container">
		<!-- 标题区域 -->
		<div class="title-section">
			<h1 class="title">{{ title }}    <span style='margin-right: 20px'></span> {{character}}</h1>
			<div class="meta-info">
				<span>{{ formatDate(date) }}</span>
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
import {formatDate} from "@/utils/methods.js";
// const title = ref('[会员][画集][天球堂 (椎名優)]Edel Farben[25P]');
// const date = ref('2024年12月25日 21:39');
// const category = ref('同人&小画集');
// const views = ref('阅读 363');

const props = defineProps({
	title: String,
	date: String,
	type: {
		type: String,
		default: ''
	},
	character: {
		type: String,
		default: ''
	}
});

</script>

<style scoped lang="scss">
.page-container {
	// width: 100%;
	//box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.20);
}

.title-section {
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	padding: 8px 20px;
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
	
	// 添加移动端适配样式
	@media screen and (max-width: 768px) {
		padding: 8px 10px;
		
		.title {
			font-size: 20px;
			line-height: 1.3;
			margin-bottom: 8px;
			word-break: break-word;
			
			// 调整标题和角色名之间的间距
			span {
				margin-right: 10px !important;
			}
		}
		
		.meta-info {
			flex-wrap: wrap;
			
			span {
				font-size: 13px;
				margin-bottom: 4px;
			}
		}
	}
	
	// 更小屏幕的适配
	@media screen and (max-width: 480px) {
		.title {
			font-size: 18px;
		}
	}
}
</style>
