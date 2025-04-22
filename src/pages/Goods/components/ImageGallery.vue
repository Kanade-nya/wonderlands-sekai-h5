<template>
	<div class="image-gallery">
		<img v-for="(image, index) in images" :key="index" :src="image" alt="商品图片" loading="lazy">
	</div>
</template>

<script lang="ts" setup>
defineProps<{
	images: string[]
}>();
</script>

<style scoped lang="scss">
.image-gallery {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
}

img {
	max-width: 100%;
	height: auto;
}
</style>