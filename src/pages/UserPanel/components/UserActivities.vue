<template>
  <div class="user-activities">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else-if="activities.length === 0" class="empty-container">
      <el-empty description="暂无动态" />
    </div>
    
    <div v-else class="activities-list">
      <div v-for="activity in activities" :key="activity.id" class="activity-item">
        <div class="activity-icon">
          <el-icon v-if="activity.type === 'post'"><Document /></el-icon>
          <el-icon v-else-if="activity.type === 'comment'"><ChatDotRound /></el-icon>
          <el-icon v-else-if="activity.type === 'like'"><Star /></el-icon>
          <el-icon v-else><Bell /></el-icon>
        </div>
        
        <div class="activity-content">
          <div class="activity-header">
            <span class="activity-type">
              {{ getActivityTypeText(activity.type) }}
            </span>
            <span class="activity-time">{{ formatTime(activity.createTime) }}</span>
          </div>
          
          <div class="activity-body">
            <div class="activity-title" @click="navigateToContent(activity)">
              {{ activity.title || '无标题内容' }}
            </div>
            <div class="activity-description" v-if="activity.description">
              {{ activity.description }}
            </div>
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
import { Document, ChatDotRound, Star, Bell } from '@element-plus/icons-vue';
import axios from 'axios';
import { localUrl } from '@/utils/methods';

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
});

const router = useRouter();
const activities = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取用户动态
const fetchActivities = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${localUrl}/user/activities/${props.userId}`, {
      params: {
        page: currentPage.value,
        size: pageSize.value
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    if (response.status === 200) {
      activities.value = response.data.items || [];
      total.value = response.data.total || 0;
    }
  } catch (error) {
    console.error('获取用户动态失败:', error);
  } finally {
    loading.value = false;
  }
};

// 获取动态类型文本
const getActivityTypeText = (type) => {
  const typeMap = {
    'post': '发布了文章',
    'comment': '发表了评论',
    'like': '点赞了文章',
    'follow': '关注了用户',
    'collection': '收藏了文章'
  };
  
  return typeMap[type] || '有了新动态';
};

// 格式化时间
const formatTime = (timeString) => {
  if (!timeString) return '';
  
  const date = new Date(timeString);
  const now = new Date();
  const diff = now - date;
  
  // 小于1分钟
  if (diff < 60 * 1000) {
    return '刚刚';
  }
  
  // 小于1小时
  if (diff < 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 1000))}分钟前`;
  }
  
  // 小于1天
  if (diff < 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (60 * 60 * 1000))}小时前`;
  }
  
  // 小于1周
  if (diff < 7 * 24 * 60 * 60 * 1000) {
    return `${Math.floor(diff / (24 * 60 * 60 * 1000))}天前`;
  }
  
  // 其他情况显示具体日期
  return date.toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' });
};

// 导航到内容
const navigateToContent = (activity) => {
  if (activity.type === 'post' && activity.contentId) {
    router.push(`/article/${activity.contentId}`);
  } else if (activity.type === 'comment' && activity.contentId) {
    router.push(`/article/${activity.contentId}#comment-${activity.id}`);
  }
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchActivities();
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchActivities();
};

// 监听用户ID变化
watch(() => props.userId, () => {
  currentPage.value = 1;
  fetchActivities();
});

onMounted(() => {
  fetchActivities();
});
</script>

<style lang="scss" scoped>
.user-activities {
  min-height: 300px;
  
  .loading-container, .empty-container {
    padding: 20px 0;
  }
  
  .activities-list {
    .activity-item {
      display: flex;
      padding: 15px 0;
      border-bottom: 1px solid #f0f0f0;
      
      &:last-child {
        border-bottom: none;
      }
      
      .activity-icon {
        width: 40px;
        height: 40px;
        background-color: #f2f6fc;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 15px;
        color: #409EFF;
      }
      
      .activity-content {
        flex: 1;
        
        .activity-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
          
          .activity-type {
            font-weight: 500;
            color: #303133;
          }
          
          .activity-time {
            color: #909399;
            font-size: 13px;
          }
        }
        
        .activity-body {
          .activity-title {
            font-size: 16px;
            margin-bottom: 5px;
            color: #409EFF;
            cursor: pointer;
            
            &:hover {
              text-decoration: underline;
            }
          }
          
          .activity-description {
            color: #606266;
            font-size: 14px;
            line-height: 1.5;
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