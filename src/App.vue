<script setup>
import HelloWorld from './components/HelloWorld.vue'
// import NavBar from "./components/NavBar.vue";
import NavBar from "@/components/common/NavBar.vue";
import Home from "@/pages/Home.vue";
import FooterBar from "@/components/common/FooterBar.vue";
import Token from "@/pages/Token.vue";
import { computed,ref } from "vue";

import { useRoute } from "vue-router";
const route = useRoute();

import { onMounted, watch } from "vue";
import { useGetIpStore } from "@/stores/useGetIpStore.js";
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";

import axios from "axios";
import { ElMessage } from "element-plus";
import { localUrl } from "@/utils/methods.js";

const getIpStore = useGetIpStore();
const useUserInfo = useUserInfoStore();

// 验证用户token的函数
const validateUserToken = async () => {
	const token = localStorage.getItem('access_token')
	if (!token) {
		console.log('没有token，去登录')
		return false
	}

	try {
		const response = await axios.get(`${localUrl}/protected`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		})

		if (response.status === 200) {
			ElMessage.success(`欢迎回来，${response.data.user_info.username}`)
			useUserInfo.setUserInfo(response.data.user_info)
			return true
		} else {
			return false
		}
	} catch (error) {
		console.error('验证token失败', error)
		return false
	}
}


onMounted(() => {
	getIpStore.setIp()
	console.log(`Location: ${getIpStore.getIp()}`)
	validateUserToken()
})

// 监听userInfoStore中loadingSuccess的变化，当它变为false时重新验证
watch(() => useUserInfo.getUserInfo.loadingSuccess, (newValue) => {
	if (newValue === false) {
		validateUserToken()
	}
})

const currentRoute = computed(() => {
	return route.path.startsWith('/user')
})
const currentRouteIsCo = computed(() => {
	return route.path.startsWith('/co')
})

// 添加投稿分类数据
const contributionCategories = ref([
	{ id: 1, name: '全部', icon: 'Menu' },
	{ id: 2, name: '原创', icon: 'Edit' },
	{ id: 3, name: '翻译', icon: 'Document' },
	{ id: 4, name: '转载', icon: 'CopyDocument' },
	{ id: 5, name: '资源', icon: 'Folder' }
]);

const activeCategory = ref(1);

const handleCategoryChange = (id) => {
	activeCategory.value = id;
};

</script>

<template>
<!-- 用户登录 -->
	<div v-if="currentRoute">
		<div class="full-main-body">
			<div class="full-main-page-bg">
				<div class="main-page-layout">
					<router-view :key="route.fullPath"></router-view>
				</div>
			</div>
			<FooterBar></FooterBar>
		</div>
	</div>
	<!-- bbs -->
	<div v-else class="contribution-layout">
		<NavBar></NavBar>
		<div class="contribution-container">
			<div class="contribution-content">
				<router-view :key="route.fullPath"></router-view>
			</div>
		</div>
		<FooterBar></FooterBar>
	</div>
	<!-- 首页展示 -->
	<!-- <div class="main-body" v-else>
		<NavBar></NavBar>
		<div class="main-page-bg">
			<div class="main-page-layout">
				<router-view :key="route.fullPath"></router-view>
			</div>
		</div>
		<FooterBar></FooterBar>
	</div>
 -->


	<!--  <div>-->
	<!--    <a href="https://vite.dev" target="_blank">-->
	<!--      <img src="/vite.svg" class="logo" alt="Vite logo" />-->
	<!--    </a>-->
	<!--    <a href="https://vuejs.org/" target="_blank">-->
	<!--      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />-->
	<!--    </a>-->
	<!--  </div>-->
	<!--  <HelloWorld msg="Vite + Vue" />-->
</template>

<style scoped lang="scss">
.full-main-body {}

.main-body {
	overflow: visible;
}

.main-page-bg {
	width: 100%;
	background: #eee;
	min-height: 100vh;
	display: flex;
	padding-bottom: 20px;

	.main-page-layout {
		box-sizing: border-box;
		width: 1140px;
		padding: 12px 16px;
		margin: 20px auto 0;
		background: white;
		min-height: 100vh;
		border-radius: 2px;
		//border: 1px solid black;
	}
}

// 投稿页面样式
.contribution-layout {

  background-color: #f5f7fa;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.contribution-container {
  max-width: 1200px;
  min-height: calc(100vh - 40px - 38px);
  margin: 0 auto;
  padding: 24px;
  width: 100%;
  box-sizing: border-box;
}

.contribution-header {
  margin-bottom: 24px;
  
  .page-title {
    font-size: 28px;
    font-weight: 600;
    color: #303133;
    margin-bottom: 8px;
  }
  
  .page-description {
    font-size: 16px;
    color: #606266;
    margin-bottom: 24px;
  }
  
  .category-nav {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 16px;
    background-color: #fff;
    border-radius: 8px;
    padding: 16px 24px;
    box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
    
    .custom-tabs {
      flex: 1;
      
      :deep(.el-tabs__item) {
        display: flex;
        align-items: center;
        height: 40px;
        
        .el-icon {
          margin-right: 6px;
        }
      }
    }
    
    .submit-btn {
      margin-left: 16px;
      display: flex;
      align-items: center;
      
      .el-icon {
        margin-right: 4px;
      }
    }
  }
}

.contribution-content {
  background-color: #fff;
  border-radius: 8px;
  padding: 24px;
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
  min-height: 600px;
}

// 响应式设计
@media screen and (max-width: 768px) {
  .contribution-container {
    padding: 16px;
  }
  
  .contribution-header {
    .page-title {
      font-size: 24px;
    }
    
    .category-nav {
      flex-direction: column;
      padding: 12px 16px;
      
      .custom-tabs {
        width: 100%;
        margin-bottom: 16px;
      }
      
      .submit-btn {
        width: 100%;
        margin-left: 0;
      }
    }
  }
  
  .contribution-content {
    padding: 16px;
  }
}


@media screen and (max-width: 768px) {
	.main-page-bg {
		width: 100%;
		padding: 0;

		.main-page-layout {
			box-sizing: border-box;
			width: 100%;
			padding: 12px 6px;
			margin-top: 0;
		}
	}
}
</style>
