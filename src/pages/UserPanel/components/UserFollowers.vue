<template>
  <div class="user-followers">
    <div v-if="loading" class="loading-container">
      <el-skeleton :rows="5" animated />
    </div>
    
    <div v-else-if="followers.length === 0" class="empty-container">
      <el-empty description="暂无粉丝" />
    </div>
    
    <div v-else class="followers-list">
      <div v-for="user in followers" :key="user.id" class="follower-item" @click="navigateToUser(user.id)">
        <el-avatar :size="50" :src="user.avatar || defaultAvatar" />
        
        <div class="user-info">
          <div class="user-name">{{ user.userName }}</div>
          <div class="user-bio">{{ user.userDescription || '这个人很懒，什么都没有留下...' }}</div>
        </div>
        
        <div class="action-buttons">
          <el-button 
            size="small" 
            :type="user.isFollowing ? 'info' : 'primary'"
            @click.stop="toggleFollow(user)"
            :loading="user.loading"
          >
            {{ user.isFollowing ? '已关注' : '关注' }}
          </el-button>
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
import { ElMessage } from 'element-plus';
import axios from 'axios';
import { localUrl } from '@/utils/methods';
import { useUserInfoStore } from '@/stores/useUserInfoStore';

const props = defineProps({
  userId: {
    type: [String, Number],
    required: true
  }
});

const router = useRouter();
const userInfoStore = useUserInfoStore();
const defaultAvatar = '/public/images/default-avatar.png';

const followers = ref([]);
const loading = ref(true);
const currentPage = ref(1);
const pageSize = ref(10);
const total = ref(0);

// 获取用户粉丝列表
const fetchFollowers = async () => {
  loading.value = true;
  try {
    const response = await axios.get(`${localUrl}/user/followers/${props.userId}`, {
      params: {
        page: currentPage.value,
        size: pageSize.value
      },
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    if (response.status === 200) {
      followers.value = (response.data.items || []).map(user => ({
        ...user,
        loading: false
      }));
      total.value = response.data.total || 0;
    }
  } catch (error) {
    console.error('获取粉丝列表失败:', error);
  } finally {
    loading.value = false;
  }
};

// 切换关注状态
const toggleFollow = async (user) => {
  if (!userInfoStore.isLoggedIn) {
    ElMessage.warning('请先登录');
    router.push('/user/login');
    return;
  }
  
  user.loading = true;
  try {
    const url = user.isFollowing 
      ? `${localUrl}/user/unfollow/${user.id}`
      : `${localUrl}/user/follow/${user.id}`;
      
    const response = await axios.post(url, {}, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    
    if (response.status === 200) {
      user.isFollowing = !user.isFollowing;
      ElMessage.success(user.isFollowing ? '关注成功' : '已取消关注');
    }
  } catch (error) {
    console.error('操作失败:', error);
    ElMessage.error('操作失败，请稍后重试');
  } finally {
    user.loading = false;
  }
};

// 导航到用户主页
const navigateToUser = (userId) => {
  router.push(`/user-panel/${userId}`);
};

// 分页处理
const handleSizeChange = (size) => {
  pageSize.value = size;
  fetchFollowers();
};

const handleCurrentChange = (page) => {
  currentPage.value = page;
  fetchFollowers();
};

// 监听用户ID变化
watch(() => props.userId, () => {
  currentPage.value = 1;
  fetchFollowers();
});

onMounted(() => {
  fetchFollowers();
});
</script>

<style lang="scss" scoped>
.user-followers {
  min-height: 300px;
  
  .loading-container, .empty-container {
    padding: 20px 0;
  }
  
  .followers-list {
    .follower-item {
      display: flex;
      align-items: center;
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
      
      .user-info {
        flex: 1;
        margin-left: 15px;
        
        .user-name {
          font-size: 16px;
          font-weight: 500;
          color: #303133;
          margin-bottom: 5px;
        }
        
        .user-bio {
          color: #909399;
          font-size: 13px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 400px;
        }
      }
      
      .action-buttons {
        margin-left: 15px;
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
  .user-followers {
    .followers-list {
      .follower-item {
        .user-info {
          .user-bio {
            max-width: 200px;
          }
        }
      }
    }
  }
}
</style>