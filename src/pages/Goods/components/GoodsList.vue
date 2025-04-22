<script setup lang="ts">
import { ref } from 'vue';
import GoodsCard from './GoodsCard.vue';
import type { GoodsItem } from '../types';
import { sampleData } from '../data';

const goodsList = ref<GoodsItem[]>(sampleData);
</script>

<template>
  <div class="goods-list">
    <h1 class="text-2xl font-bold mb-4">商品列表</h1>
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      <GoodsCard v-for="item in goodsList" :key="item.id" :item="item" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.goods-list {
  padding: 20px;
}
</style>