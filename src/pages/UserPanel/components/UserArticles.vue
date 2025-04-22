<template>
  <div class="user-articles">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else-if="articles.length === 0" class="empty-container">
      <el-empty description="暂无文章" />
    </div>
    
    <div v-else class="articles-list">
      <div v-for="article in articles" :key="article.id" class="article-item" @click="navigateToArticle(article.id)">
        <div class="article-cover" v-if="article.cover">
          <img :src="article.cover" :alt="article.title" />
        </div>
        
        <div class="article-content">
          <h3 class="article-title">{{ article.title }}</h3>
          <p class="article-summary">{{ article.summary }}</p>
          
          <div class="article-meta">
            <span class="publish-time">
              <el-icon><Clock /></el-icon>
              {{ formatTime(article.publishTime) }}
            </span>
            <span class="view-count">
              <el-icon><View /></el-icon>
              {{ article.viewCount || 0 }}
            </span>
            <span class="comment-count">
              <el-icon><ChatDotRound /></el-icon>
              {{ article.commentCount || 0 }}
            </span>
            <span class="like-count">
              <el-icon><Star /></el-icon>
              {{ article.likeCount || 0 }}
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
import { Clock, View, ChatDotRound, Star } from '@element-plus/icons-vue';
import axios from 'axios';
import { localUrl } from '@/utils/methods';

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
});

const router = useRouter();
const articles = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取用户文章
const fetchArticles = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${localUrl}/user/articles/${props.userId}`, {
      params: {
        page: currentPage.value,
        size: pageSize.value
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    if (response.status === 200) {
      articles.value = response.data.items || [];
      total.value = response.data.total || 0;
    }
  } catch (error) {
    console.error('获取用户文章失败:', error);
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
  fetchArticles();
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchArticles();
};

// 监听用户ID变化
watch(() => props.userId, () => {
  currentPage.value = 1;
  fetchArticles();
});

onMounted(() => {
  fetchArticles();
});
</script>

<style lang="scss" scoped>
.user-articles {
  min-height: 300px;
  
  .loading-container, .empty-container {
    padding: 20px 0;
  }
  
  .articles-list {
    .article-item {
      display: flex;
      padding: 20px 0;
      border-bottom: 1px solid #f0f0f0;
      cursor: pointer;
      transition: background-color 0.3s;
      
      &:hover {
        background-color: #f9f9f9;
      }
      
      &:last-child {
        border-bottom: none;
      }
      
      .article-cover {
        width: 180px;
        height: 120px;
        margin-right: 20px;
        border-radius: 4px;
        overflow: hidden;
        
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
      
      .article-content {
        flex: 1;
        
        .article-title {
          font-size: 18px;
          font-weight: 600;
          margin: 0 0 10px;
          color: #303133;
          
          &:hover {
            color: #409EFF;
          }
        }
        
        .article-summary {
          color: #606266;
          font-size: 14px;
          line-height: 1.5;
          margin-bottom: 15px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .article-meta {
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

@media (max-width: 768px) {
  .user-articles {
    .articles-list {
      .article-item {
        flex-direction: column;
        
        .article-cover {
          width: 100%;
          height: 180px;
          margin-right: 0;
          margin-bottom: 15px;
        }
      }
    }
  }
}
</style>