<!-- src/components/common/UserMenuPanel.vue -->
<script setup>
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";
import { useRouter } from "vue-router";

const props = defineProps({
	visible: {
		type: Boolean,
		default: false
	}
});

const emit = defineEmits(['close']);

const userInfoStore = useUserInfoStore();
const router = useRouter();

const navigateToProfile = () => {
	router.push('/user/profile');
	emit('close');
};

const navigateToPosts = () => {
	router.push('/user/posts');
	emit('close');
};

const handleLogout = () => {
	userInfoStore.logout();
	router.push('/user/login');
	emit('close');
};
</script>

<template>
	<div v-if="visible" class="user-menu-panel">
		<div class="panel-header">
			<el-avatar :size="50" :src="userInfoStore.getUserInfo.userAvatar" class="panel-avatar"></el-avatar>
			<div class="user-info">
				<div class="username">{{ userInfoStore.getUserInfo.userName || '未登录' }}</div>
				<div class="user-level">LV{{ userInfoStore.getUserInfo.userLevel || 1 }}</div>
			</div>
		</div>

		<div class="panel-content">
			<el-divider></el-divider>

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
		}
	}
}
</style>