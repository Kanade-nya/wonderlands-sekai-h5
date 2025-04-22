<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { sampleData } from './data';
import { formatPrice } from './utils';
import type { GoodsItem } from './types';

const router = useRouter();
const goodsList = ref<GoodsItem[]>(sampleData);
const featuredItems = ref<GoodsItem[]>([]);

onMounted(() => {
  // 获取最新的3个商品作为特色商品
  featuredItems.value = [...goodsList.value].slice(0, 3);
});

const viewDetails = (id: string) => {
  router.push(`/goods/${id}`);
};
</script>

<template>
  <div class="goods-page">
    <!-- 周边展示区域 -->
    <section class="collection-section">
      <h2 class="section-title">精选周边展示</h2>
      <p class="section-description">这里展示了各种精美的动漫周边收藏品，点击查看详情</p>
      
      <div class="featured-grid">
        <div 
          v-for="item in featuredItems" 
          :key="item.id" 
          class="featured-item"
          @click="viewDetails(item.id)"
        >
          <div class="featured-image">
            <img :src="item.images[0]" :alt="item.name" loading="lazy">
          </div>
          <div class="featured-info">
            <h3>{{ item.name }}</h3>
            <div class="featured-meta">
              <span class="featured-type">{{ item.type }}</span>
              <span class="featured-price">{{ formatPrice(item.price) }}</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- 所有周边列表 -->
    <section class="all-products">
      <h2 class="section-title">全部周边</h2>
      <div class="products-grid">
        <div 
          v-for="item in goodsList" 
          :key="item.id" 
          class="product-card"
          @click="viewDetails(item.id)"
        >
          <div class="product-image">
            <img :src="item.images[0]" :alt="item.name" loading="lazy">
          </div>
          <div class="product-info">
            <h3>{{ item.name }}</h3>
            <span class="product-type">{{ item.type }}</span>
            <div class="product-characters">
              <span v-for="(character, idx) in item.characters" :key="idx">{{ character }}</span>
            </div>
            <div class="product-price">{{ formatPrice(item.price) }}</div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="scss">
.goods-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 12px;
  position: relative;
  padding-bottom: 10px;
  
  &:after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 60px;
    height: 4px;
    background: linear-gradient(90deg, #6a11cb, #2575fc);
    border-radius: 2px;
  }
}

.section-description {
  color: #666;
  margin-bottom: 24px;
  font-size: 1rem;
}

.collection-section {
  margin-bottom: 60px;
}

.featured-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.featured-item {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  background: white;
  
  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
}

.featured-image {
  height: 220px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.featured-info {
  padding: 16px;
  
  h3 {
    font-size: 1.2rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
  }
}

.featured-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.featured-type {
  background-color: #f0f7ff;
  color: #2575fc;
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 500;
}

.featured-price {
  font-size: 1.1rem;
  font-weight: 700;
  color: #f56c6c;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: repeat(3, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
}

.product-card {
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.03);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  cursor: pointer;
  background: white;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
  }
}

.product-image {
  height: 180px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.5s ease;
  }
  
  &:hover img {
    transform: scale(1.05);
  }
}

.product-info {
  padding: 15px;
  
  h3 {
    font-size: 1rem;
    font-weight: 600;
    margin-bottom: 8px;
    color: #333;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.product-type {
  display: inline-block;
  background-color: #f0f7ff;
  color: #2575fc;
  padding: 3px 8px;
  border-radius: 20px;
  font-size: 0.7rem;
  font-weight: 500;
  margin-bottom: 8px;
}

.product-characters {
  display: flex;
  flex-wrap: wrap;
  gap: 5px;
  margin-bottom: 8px;
  
  span {
    background-color: #f5f5f5;
    color: #666;
    padding: 2px 6px;
    border-radius: 4px;
    font-size: 0.7rem;
  }
}

.product-price {
  font-size: 1rem;
  font-weight: 700;
  color: #f56c6c;
}

.all-products {
  margin-bottom: 60px;
}
</style>