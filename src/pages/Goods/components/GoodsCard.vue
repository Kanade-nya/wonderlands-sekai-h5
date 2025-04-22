<template>
	<div class="goods-card">
		<img :src="item.images[0]" alt="商品封面" loading="lazy">
		<div class="p-4">
			<h2 class="text-lg font-bold">{{ item.name }}</h2>
			<span class="tag">{{ item.type }}</span>
			<p class="text-price-color">{{ formatPrice(item.price) }}</p>
			<div class="flex flex-wrap gap-2">
				<CharacterTag v-for="character in item.characters" :key="character" :name="character" />
			</div>
		</div>
	</div>
</template>

<script lang="ts" setup>
import CharacterTag from './CharacterTag.vue';
import type { GoodsItem } from '../types';
import { formatPrice } from '../utils';

defineProps<{
	item: GoodsItem
}>();
</script>

<style scoped lang="scss">
@import '../style/main.scss';

.goods-card {
	border: 1px solid #e2e8f0;
	border-radius: 8px;
	overflow: hidden;
	transition: transform 0.3s ease;

	&:hover {
		transform: translateY(-5px);
	}

	img {
		width: 100%;
		height: auto;
	}
}
</style>