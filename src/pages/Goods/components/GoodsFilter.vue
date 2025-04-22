<script setup lang="ts">
import { ref } from 'vue';

const types = ref(['全部', '徽章', '亚克力', '其他']);
const selectedType = ref('全部');
const priceRange = ref([0, 1000]);

const emit = defineEmits(['filter']);

const applyFilter = () => {
  emit('filter', {
    type: selectedType.value === '全部' ? null : selectedType.value,
    priceRange: priceRange.value
  });
};
</script>

<template>
  <div class="goods-filter">
    <h3 class="text-lg font-bold mb-2">筛选</h3>
    
    <div class="filter-section">
      <h4 class="text-md font-medium mb-2">商品类型</h4>
      <div class="flex flex-wrap gap-2">
        <span 
          v-for="type in types" 
          :key="type" 
          class="filter-tag" 
          :class="{ active: selectedType === type }"
          @click="selectedType = type"
        >
          {{ type }}
        </span>
      </div>
    </div>
    
    <div class="filter-section">
      <h4 class="text-md font-medium mb-2">价格范围</h4>
      <div class="flex items-center gap-2">
        <input 
          type="number" 
          v-model="priceRange[0]" 
          class="price-input" 
          min="0"
        />
        <span>-</span>
        <input 
          type="number" 
          v-model="priceRange[1]" 
          class="price-input" 
          min="0"
        />
      </div>
    </div>
    
    <button class="btn btn-primary mt-4" @click="applyFilter">应用筛选</button>
  </div>
</template>

<style scoped lang="scss">
@import '../style/main.scss';

.goods-filter {
  padding: 16px;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  margin-bottom: 20px;
}

.filter-section {
  margin-bottom: 16px;
}

.filter-tag {
  padding: 4px 8px;
  border-radius: 4px;
  background-color: #f0f2f5;
  cursor: pointer;
  
  &.active {
    background-color: #409eff;
    color: white;
  }
}

.price-input {
  width: 80px;
  padding: 4px 8px;
  border: 1px solid #dcdfe6;
  border-radius: 4px;
}
</style>