<template>
  <div class="user-collections">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else-if="collections.length === 0" class="empty-container">
      <el-empty description="暂无收藏" />
    </div>
    
    <div v-else class="collections-list">
      <div v-for="collection in collections" :key="collection.id" class="collection-item" @click="navigateToArticle(collection.articleId)">
        <div class="collection-content">
          <h3 class="collection-title">{{ collection.title }}</h3>
          <p class="collection-summary">{{ collection.summary }}</p>
          
          <div class="collection-meta">
            <span class="author">
              <el-icon><User /></el-icon>
              {{ collection.authorName }}
            </span>
            <span class="collect-time">
              <el-icon><Clock /></el-icon>
              收藏于 {{ formatTime(collection.collectTime) }}
            </span>
          </div>
        </div>
      </div>
      
      <div class="pagination-container">
        <el-pagination
          v-model:current-page="currentPage"
          v-model:page-size="pageSize"
          :page-sizes="[10, 20, 30, 50]"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { User, Clock } from '@element-plus/icons-vue';
import axios from 'axios';
import { localUrl } from '@/utils/methods';

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
});

const router = useRouter();
const collections = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取用户收藏
const fetchCollections = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${localUrl}/user/collections/${props.userId}`, {
      params: {
        page: currentPage.value,
        size: pageSize.value
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    if (response.status === 200) {
      collections.value = response.data.items || [];
      total.value = response.data.total || 0;
    }
  } catch (error) {
    console.error('获取用户收藏失败:', error);
  } finally {
    loading.value = false;
  }
};

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const date = new Date(timeString);
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

// 导航到文章详情
const navigateToArticle = (articleId) => {
  router.push(`/article/${articleId}`);
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchCollections();
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchCollections();
};

// 监听用户ID变化
watch(() => props.userId, () => {
  currentPage.value = 1;
  fetchCollections();
});

onMounted(() => {
  fetchCollections();
});
</script>

<style lang="scss" scoped>
.user-collections {
  min-height: 300px;
  
  .loading-container, .empty-container {
    padding: 20px 0;
  }
  
  .collections-list {
    .collection-item {
      padding: 15px;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #f9f9f9;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .collection-content {
        .collection-title {
          font-size: 16px;
          font-weight: 600;
          margin: 0 0 10px;
          color: #303133;
          
          &:hover {
            color: #409EFF;
          }
        }
        
        .collection-summary {
          color: #606266;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 10px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .collection-meta {
          display: flex;
          gap: 15px;
          color: #909399;
          font-size: 13px;
          
          span {
            display: flex;
            align-items: center;
            gap: 4px;
          }
        }
      }
    }
    
    .pagination-container {
      margin-top: 20px;
      display: flex;
      justify-content: center;
    }
  }
}
</style>