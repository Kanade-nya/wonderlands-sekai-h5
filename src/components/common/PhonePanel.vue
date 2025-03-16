<script setup>
import { useRouter } from "vue-router";
import { defineEmits } from "vue";
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";
import { computed } from 'vue';
import { ElMessage,ElLoading } from 'element-plus';

// interface MenuItem {
//   name: string;
//   path: string;
//   icon?: string;
// }

// 导航菜单配置
const navigationMenu = [
  { name: '主页', path: '/' },
  { name: '评论', path: '/comments' },
  { name: '关于', path: '/about' },
  { name: '合集', path: '/c/box' },
  { name: '文章', path: '/co/articles' },
  { name: '登录', path: '/user/login' }
];

// ... 其他 interface 和 navigationMenu 配置保持不变 ...
const userInfoStore = useUserInfoStore();

// 判断用户是否登录
const isLoggedIn = computed(() => {
  return userInfoStore.getUserInfo.isLogin;
});
// 功能菜单配置
const featureMenu = [
  { name: '个人信息', path: '/user/profile' },
  { name: '投稿', path: '/user/post-record' },
  { name: '退出登录', path: 'logout' }  // 添加退出登录选项
];

const router = useRouter();
const emits = defineEmits(['change-menu']);

// 统一的跳转处理函数
const handleNavigation = (path) => {
	if (path === 'logout') {
    handleLogout();
  } else {
    // 如果是跳转到投稿记录页面，显示 loading
    if (path === '/user/post-record') {
      const loading = ElLoading.service({
        text: '加载中...',
        background: 'rgba(255, 255, 255, 0.7)'
      });
      router.push(path).finally(() => {
        loading.close();
      });
    } else {
      router.push(path);
    }
    emits('change-menu', 'false');
  }
};

// 退出登录处理函数
const handleLogout = () => {
  // 清除 token
  localStorage.removeItem('access_token');
  // 重置用户状态
  userInfoStore.clearUserInfo();
  // 提示用户
  ElMessage.success('已退出登录');
  // 关闭菜单
  emits('change-menu', 'false');
  // 跳转到登录页
  router.push('/');
};
</script>

<template>
  <div class="phone-panel-layout">
    <!-- 导航菜单 -->
    <div class="grid-container">
      <div class="title">跳转</div>
      <el-link 
        v-for="item in navigationMenu" 
        :key="item.path"
        :underline="false" 
        @click="handleNavigation(item.path)" 
        class="link"
      >
        <div class="grid-item">
          <span>{{ item.name }}</span>
        </div>
      </el-link>
    </div>

    <!-- 功能菜单，只在用户登录时显示 -->
    <div v-if="isLoggedIn" class="grid-container">
      <div class="title">功能</div>
      <el-link 
        v-for="item in featureMenu" 
        :key="item.path"
        :underline="false" 
        @click="handleNavigation(item.path)" 
        class="link"
      >
        <div class="grid-item">
          <span>{{ item.name }}</span>
        </div>
      </el-link>
    </div>
  </div>
</template>

<style scoped lang="scss">
.phone-panel-layout {
  box-sizing: border-box;
  z-index: 1000;
  display: flex;
  padding: 20px 100px 0;
  flex-direction: column;
  width: 100%;
  height: calc(100vh - 48px);
  background: #ffffff;

  .grid-container {
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 20px;
    flex-wrap: wrap;
    margin-bottom: 24px;

    .link {
      width: 50%;
      font-size: 16px;
      padding: 8px 0;
      
      &:hover {
        .grid-item {
          color: #409EFF;
          background-color: #F2F6FC;
        }
      }
    }

    .title {
      width: 100%;
      text-align: center;
      font-size: 20px;
      font-weight: 500;
      color: #606266;
      margin-bottom: 16px;
    }

    .grid-item {
      padding: 8px 16px;
      border-radius: 4px;
      transition: all 0.3s ease;
    }
  }
}

@media screen and (max-width: 768px) {
  .phone-panel-layout {
    padding: 20px 20px 0;
  }
}
</style>