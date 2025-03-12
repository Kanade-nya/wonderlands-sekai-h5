<!-- src/components/common/UserMenuPanel.vue -->
<script setup>
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";
import { useRouter,useRoute } from "vue-router";
import { ref, defineProps, defineEmits, watch, computed, onMounted, onActivated } from 'vue';
const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['close']);

const userInfoStore = useUserInfoStore();
const router = useRouter();
const route = useRoute();
const isLoading = ref(true);

// 默认头像地址
const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png';
// 使用计算属性获取用户头像，如果未登录或没有头像则使用默认头像
const userAvatar = computed(() => {
	return userInfoStore.getUserInfo.userAvatar || defaultAvatar;
});

// 判断用户是否登录
const isLoggedIn = computed(() => {
	return userInfoStore.getUserInfo.isLogin;
});

// 检查用户登录状态
const checkLoginStatus = () => {
	console.log('检测token');
	
	const token = localStorage.getItem('access_token');
	console.log(userInfoStore.getUserInfo);
	
	if (token && !userInfoStore.getUserInfo.isLogin) {
		// 如果有token但store中显示未登录，尝试重新获取用户信息
		userInfoStore.triggerRevalidation();
	}
};

// // 组件挂载时检查登录状态
// onMounted(() => {
	
// });
onMounted(()=>{
	console.log('检测加载');
	checkLoginStatus();
})

// 监听路由变化，每次路由变化时检查登录状态
watch(() => route.path, () => {
	checkLoginStatus();
});

// 监听visible属性变化，当面板显示时检查登录状态
watch(() => props.visible, (newVal) => {
	if (newVal) {
		console.log('检测visible');
		checkLoginStatus();
	}
});

const navigateToProfile = () => {
	router.push('/user/profile');
	emit('close');
};

const navigateToPosts = () => {
	router.push('/user/post-record');
	emit('close');
};

// 监听用户信息加载状态
watch(() => userInfoStore.getUserInfo.loadingSuccess, (newVal) => {
	if (newVal) {
		isLoading.value = false;
	}
});

const handleLogout = () => {
	userInfoStore.logout();
	// router.push('/user/login');
	emit('close');
};

// 跳转到登录页面
const goToLogin = () => {
	router.push('/user/login');
	emit('close');
};
</script>

<template>
	<div v-if="visible" class="user-menu-panel">
		<div class="panel-header">
			<el-avatar :size="50" :src="userAvatar" class="panel-avatar"></el-avatar>
			<div class="user-info">
				<div class="username">{{ userInfoStore.getUserInfo.userName || '未登录' }}</div>
				<div class="user-level" v-if="isLoggedIn">LV{{ userInfoStore.getUserInfo.userLevel || 1 }}</div>
			</div>
		</div>

		<div class="panel-content">
			<el-divider></el-divider>

			<!-- 已登录用户显示完整菜单 -->
			<template v-if="isLoggedIn">
				<div class="menu-item" @click="navigateToProfile">
					<el-icon><el-icon-user /></el-icon>
					<span>个人信息</span>
				</div>

				<div class="menu-item" @click="navigateToPosts">
					<el-icon><el-icon-document /></el-icon>
					<span>发表记录</span>
				</div>

				<el-divider></el-divider>

				<div class="menu-item logout" @click="handleLogout">
					<el-icon><el-icon-switch-button /></el-icon>
					<span>退出登录</span>
				</div>
			</template>

			<!-- 未登录用户只显示登录选项 -->
			<template v-else>
				<div class="menu-item login" @click="goToLogin">
					<el-icon><el-icon-key /></el-icon>
					<span>去登录</span>
				</div>
			</template>
		</div>
	</div>
</template>

<style lang="scss" scoped>
.user-menu-panel {
	position: absolute;
	top: 48px;
	right: 10px;
	width: 220px;
	background-color: white;
	border-radius: 8px;
	box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	overflow: hidden;
	z-index: 1000;
	transition: all 0.3s ease;

	.panel-header {
		display: flex;
		padding: 16px;
		align-items: center;

		.panel-avatar {
			margin-right: 12px;
		}

		.user-info {
			.username {
				font-weight: bold;
				font-size: 16px;
				margin-bottom: 4px;
			}

			.user-level {
				font-size: 12px;
				color: #909399;
				background-color: #f0f2f5;
				padding: 2px 6px;
				border-radius: 10px;
				display: inline-block;
			}
		}
	}

	.panel-content {
		padding: 0 16px 16px;

		.menu-item {
			display: flex;
			align-items: center;
			padding: 12px 0;
			cursor: pointer;
			transition: all 0.2s;
			border-radius: 4px;

			&:hover {
				background-color: #f5f7fa;
				padding-left: 8px;
			}

			.el-icon {
				margin-right: 8px;
				font-size: 18px;
				color: #909399;
			}

			span {
				font-size: 14px;
			}

			&.logout {
				color: #f56c6c;

				.el-icon {
					color: #f56c6c;
				}
			}

			&.login {
				color: #409EFF;

				.el-icon {
					color: #409EFF;
				}
			}
		}
	}
}
</style>