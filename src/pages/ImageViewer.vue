<template>
	<div class="image-viewer">
		<img :src="imageUrl" alt="Image" class="image" />
		<div class="image-info">
			<h2>{{ imageTitle }}</h2>
			<p>{{ imageDescription }}</p>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const imageUrl = ref('');
const imageTitle = ref('');
const imageDescription = ref('');

onMounted(() => {
	// 假设图片信息通过路由参数传递
	imageUrl.value = route.query.url;
	imageTitle.value = route.query.title;
	imageDescription.value = route.query.description;
});
</script>

<style scoped lang="scss">
.image-viewer {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: center;
	padding: 20px;
	text-align: center;

	.image {
		max-width: 100%;
		height: auto;
		margin-bottom: 20px;
	}

	.image-info {
		h2 {
			font-size: 24px;
			margin-bottom: 10px;
		}

		p {
			font-size: 16px;
			color: #666;
		}
	}
}
</style>
