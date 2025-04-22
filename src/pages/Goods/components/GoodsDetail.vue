<template>
  <div class="goods-detail-container">
    <div class="goods-detail">
      <div class="breadcrumb">
        <router-link to="/goods">周边展示</router-link> / <span>{{ goods.name }}</span>
      </div>
      
      <div class="detail-content">
        <!-- 左侧图片区域 -->
        <div class="detail-gallery">
          <div class="main-image">
            <img :src="currentImage" :alt="goods.name">
          </div>
          <div class="thumbnail-list">
            <div 
              v-for="(image, index) in goods.images" 
              :key="index" 
              class="thumbnail"
              :class="{ active: currentImage === image }"
              @click="currentImage = image"
            >
              <img :src="image" :alt="`${goods.name} - 图片 ${index + 1}`">
            </div>
          </div>
        </div>
        
        <!-- 右侧信息区域 -->
        <div class="detail-info">
          <h1>{{ goods.name }}</h1>
          
          <div class="info-tags">
            <span class="tag type-tag">{{ goods.type }}</span>
            <span 
              v-for="(character, index) in goods.characters" 
              :key="index" 
              class="tag character-tag"
            >
              {{ character }}
            </span>
          </div>
          
          <div class="price-section">
            <span class="price">{{ formatPrice(goods.price) }}</span>
            <span class="collection-status">收藏品</span>
          </div>
          
          <div class="divider"></div>
          
          <div class="info-section">
            <div v-if="goods.source" class="info-item">
              <span class="info-label">来源:</span>
              <a :href="goods.source" target="_blank" class="info-value source-link">{{ goods.source }}</a>
            </div>
            
            <div v-if="goods.productionDate" class="info-item">
              <span class="info-label">出厂日期:</span>
              <span class="info-value">{{ formatDate(goods.productionDate) }}</span>
            </div>
          </div>
          
          <!-- 贡献者信息 -->
          <div class="contributors-section">
            <h3>贡献者信息</h3>
            <div v-if="goods.contributors && goods.contributors.length > 0" class="contributors-list">
              <div 
                v-for="(contributor, index) in goods.contributors" 
                :key="index" 
                class="contributor"
              >
                <div class="contributor-avatar">
                  <img v-if="contributor.avatar" :src="contributor.avatar" :alt="contributor.name">
                  <div v-else class="avatar-placeholder">{{ contributor.name.charAt(0) }}</div>
                </div>
                <span class="contributor-name">{{ contributor.name }}</span>
              </div>
            </div>
            <div v-else class="no-contributors">
              暂无贡献者信息
            </div>
            
            <button class="btn contribute-btn" @click="showContributeForm = true">
              添加贡献信息
            </button>
          </div>
        </div>
      </div>
      
      <!-- 商品详情区域 -->
      <div class="product-description">
        <h2>商品详情</h2>
        <div class="description-content">
          <p>这是一款精美的{{ goods.type }}，以{{ goods.characters.join('、') }}为主题设计。</p>
          <p>采用高品质材料制作，做工精细，是粉丝收藏的理想选择。</p>
          <div class="description-images">
            <img v-for="(image, index) in goods.images" :key="index" :src="image" :alt="`${goods.name} 详情图 ${index + 1}`">
          </div>
        </div>
      </div>
      
      <!-- 贡献表单 -->
      <div v-if="showContributeForm" class="contribute-form-overlay">
        <div class="contribute-form">
          <h3>添加贡献信息</h3>
          <div class="form-group">
            <label for="contributorName">您的名字</label>
            <input 
              type="text" 
              id="contributorName" 
              v-model="newContributor.name" 
              placeholder="请输入您的名字"
            >
          </div>
          
          <div class="form-group">
            <label for="contributorAvatar">头像链接 (可选)</label>
            <input 
              type="text" 
              id="contributorAvatar" 
              v-model="newContributor.avatar" 
              placeholder="请输入头像图片链接"
            >
          </div>
          
          <div class="form-group">
            <label for="contributionInfo">贡献内容</label>
            <textarea 
              id="contributionInfo" 
              v-model="contributionInfo" 
              placeholder="请描述您的贡献内容，如提供新图片、更新信息等"
              rows="4"
            ></textarea>
          </div>
          
          <div class="form-actions">
            <button class="btn cancel-btn" @click="showContributeForm = false">取消</button>
            <button class="btn submit-btn" @click="submitContribution">提交</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { GoodsItem, Contributor } from '../types';
import { sampleData } from '../data';
import { formatPrice, formatDate } from '../utils';

const route = useRoute();
const router = useRouter();
const goods = sampleData.find(item => item.id === route.params.id as string) as GoodsItem;

// 如果商品不存在，重定向到商品列表页
if (!goods) {
  router.push('/goods');
}

// 当前显示的图片
const currentImage = ref(goods?.images[0] || '');

// 贡献表单相关
const showContributeForm = ref(false);
const newContributor = ref<Contributor>({
  name: '',
  avatar: ''
});
const contributionInfo = ref('');

// 提交贡献信息
const submitContribution = () => {
  if (!newContributor.value.name) {
    alert('请输入您的名字');
    return;
  }
  
  if (!contributionInfo.value) {
    alert('请描述您的贡献内容');
    return;
  }
  
  // 这里应该是将贡献信息提交到后端
  // 由于这是前端展示，我们只是模拟添加到当前数据
  if (!goods.contributors) {
    goods.contributors = [];
  }
  
  goods.contributors.push({
    name: newContributor.value.name,
    avatar: newContributor.value.avatar || undefined
  });
  
  // 重置表单
  newContributor.value = { name: '', avatar: '' };
  contributionInfo.value = '';
  showContributeForm.value = false;
  
  alert('感谢您的贡献！信息已提交。');
};
</script>

<style scoped lang="scss">
.goods-detail-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.breadcrumb {
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
  
  a {
    color: #2575fc;
    text-decoration: none;
    
    &:hover {
      text-decoration: underline;
    }
  }
}

.detail-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 40px;
  margin-bottom: 40px;
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
}

.detail-gallery {
  .main-image {
    height: 400px;
    border-radius: 12px;
    overflow: hidden;
    margin-bottom: 16px;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .thumbnail-list {
    display: flex;
    gap: 12px;
    overflow-x: auto;
    padding-bottom: 8px;
    
    &::-webkit-scrollbar {
      height: 6px;
    }
    
    &::-webkit-scrollbar-track {
      background: #f1f1f1;
      border-radius: 10px;
    }
    
    &::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 10px;
    }
  }
  
  .thumbnail {
    width: 80px;
    height: 80px;
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    border: 2px solid transparent;
    transition: border-color 0.2s ease;
    flex-shrink: 0;
    
    &.active {
      border-color: #2575fc;
    }
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
}

.detail-info {
  h1 {
    font-size: 1.8rem;
    font-weight: 700;
    margin-bottom: 16px;
    color: #333;
  }
  
  .info-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-bottom: 20px;
    
    .tag {
      padding: 5px 12px;
      border-radius: 20px;
      font-size: 0.8rem;
      font-weight: 500;
    }
    
    .type-tag {
      background-color: #f0f7ff;
      color: #2575fc;
    }
    
    .character-tag {
      background-color: #f5f5f5;
      color: #666;
    }
  }
  
  .price-section {
    display: flex;
    align-items: center;
    margin-bottom: 20px;
    
    .price {
      font-size: 1.8rem;
      font-weight: 700;
      color: #f56c6c;
      margin-right: 12px;
    }
    
    .collection-status {
      font-size: 0.9rem;
      color: #2575fc;
      background-color: rgba(37, 117, 252, 0.1);
      padding: 3px 8px;
      border-radius: 4px;
    }
  }
  
  .divider {
    height: 1px;
    background-color: #eee;
    margin: 20px 0;
  }
  
  .info-section {
    margin-bottom: 20px;
    
    .info-item {
      display: flex;
      margin-bottom: 10px;
      
      .info-label {
        width: 80px;
        color: #666;
      }
      
      .info-value {
        color: #333;
      }
      
      .source-link {
        color: #2575fc;
        text-decoration: none;
        
        &:hover {
          text-decoration: underline;
        }
      }
    }
  }
  
  .contributors-section {
    margin-top: 20px;
    
    h3 {
      font-size: 1.1rem;
      font-weight: 600;
      margin-bottom: 12px;
      color: #333;
    }
    
    .contributors-list {
      display: flex;
      flex-wrap: wrap;
      gap: 16px;
      margin-bottom: 16px;
      
      .contributor {
        display: flex;
        align-items: center;
        
        .contributor-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          margin-right: 8px;
          
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          
          .avatar-placeholder {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            background-color: #e6e8eb;
            color: #606266;
            font-weight: bold;
          }
        }
        
        .contributor-name {
          font-size: 0.9rem;
          color: #333;
        }
      }
    }
    
    .no-contributors {
      color: #999;
      font-style: italic;
      margin-bottom: 16px;
    }
    
    .contribute-btn {
      background-color: #2575fc;
      color: white;
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.9rem;
      border: none;
      cursor: pointer;
      transition: background-color 0.2s ease;
      
      &:hover {
        background-color: darken(#2575fc, 5%);
      }
    }
  }
}

.product-description {
  background-color: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.05);
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 20px;
    color: #333;
    position: relative;
    padding-bottom: 10px;
    
    &:after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 50px;
      height: 3px;
      background: linear-gradient(90deg, #6a11cb, #2575fc);
      border-radius: 2px;
    }
  }
  
  .description-content {
    p {
      font-size: 1rem;
      line-height: 1.6;
      color: #555;
      margin-bottom: 16px;
    }
    
    .description-images {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 16px;
      margin-top: 24px;
      
      img {
        width: 100%;
        border-radius: 8px;
        box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
      }
    }
  }
}

.contribute-form-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.contribute-form {
  background-color: white;
  border-radius: 12px;
  padding: 24px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  
  h3 {
    font-size: 1.3rem;
    font-weight: 600;
    margin-bottom: 20px;
    color: #333;
  }
  
  .form-group {
    margin-bottom: 16px;
    
    label {
      display: block;
      margin-bottom: 6px;
      font-size: 0.9rem;
      color: #666;
    }
    
    input, textarea {
      width: 100%;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.95rem;
      
      &:focus {
        outline: none;
        border-color: #2575fc;
      }
    }
  }
  
  .form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 20px;
    
    .btn {
      padding: 8px 16px;
      border-radius: 6px;
      font-size: 0.9rem;
      cursor: pointer;
      border: none;
      transition: all 0.2s ease;
    }
    
    .cancel-btn {
      background-color: #f5f5f5;
      color: #666;
      
      &:hover {
        background-color: darken(#f5f5f5, 5%);
      }
    }
    
    .submit-btn {
      background-color: #2575fc;
      color: white;
      
      &:hover {
        background-color: darken(#2575fc, 5%);
      }
    }
  }
}
</style>