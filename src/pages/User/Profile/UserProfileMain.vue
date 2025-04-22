<template>
	<div class="profile-container-main">
		<!-- Profile form -->
		<div class="profile-form">
			<!-- Nickname -->
			<div class="form-item">
				<div class="label">昵称</div>
				<el-input v-model="profile.nickname" placeholder="取一个好听的名字" class="form-input" />
			</div>
			<!-- Website -->
			<div class="form-item">
				<div class="label">网址</div>
				<el-input v-model="profile.website" placeholder="或许这里是你的个人网站地址" class="form-input" />
			</div>
			<!-- Introduction -->
			<div class="form-item">
				<div class="label">简介</div>
				<el-input
					v-model="profile.introduction"
					type="textarea"
					placeholder="自己的个人简介.txt"
					class="form-textarea"
					:rows="4"
				/>
			</div>
			<!-- Save button -->
			<div class="save-container">
				<el-button type="primary" class="save-button" @click="saveProfile" :loading="loading">保存资料</el-button>
				<el-button @click="goToSubmitPage">提交新数据</el-button>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";
import { ElMessage } from 'element-plus';
import requests from "@/utils/requests.js";
import { localUrl } from "@/utils/methods.js";
import { useRouter } from 'vue-router';

const router = useRouter();
const userInfoStore = useUserInfoStore();
const loading = ref(false);

const profile = ref({
	nickname: 'miiro',
	website: '',
	introduction: ''
});

onMounted(() => {
	profile.value.nickname = userInfoStore.getUserInfo.userName;
	profile.value.website = userInfoStore.getUserInfo.userBlog;
	profile.value.introduction = userInfoStore.getUserInfo.userDescription;
	console.log(profile.value)
});

// 保存用户资料
const saveProfile = async () => {
	try {
		loading.value = true;
		const response = await requests.post(
			`${localUrl}/user/update-profile`,
			{
				description: profile.value.introduction,
				blog: profile.value.website
			},
			{
				headers: {
					'Authorization': `Bearer ${localStorage.getItem('access_token')}`
				}
			}
		);
		
		if (response.status === 200) {
			ElMessage.success('资料更新成功');
			// 更新本地存储的用户信息
			userInfoStore.updateUserInfo({
				userBlog: profile.value.website,
				userDescription: profile.value.introduction
			});
		} else {
			ElMessage.error('资料更新失败');
		}
	} catch (error) {
		console.error('更新资料出错:', error);
		ElMessage.error('更新资料时发生错误');
	} finally {
		loading.value = false;
	}
};

// 跳转到提交新数据页面
const goToSubmitPage = () => {
	router.push('/user/profile/submit');
};
</script>

<style lang="scss" scoped>
.profile-container-main {
	width: 100%;
	margin: 0 auto;
	padding-bottom: 40px;
}

.profile-form {
	margin: 20px;
	border-radius: 4px;
}

.form-item {
	margin-bottom: 20px;

	.label {
		font-size: 14px;
		color: #606266;
		margin-bottom: 10px;
	}

	.form-input, .form-textarea {
		width: 100%;
		font-size: 14px;
	}
}

.save-container {
	display: flex;
	justify-content: flex-end;
	margin-top: 30px;
	gap: 10px;

	.save-button {
		padding: 10px 25px;
		font-size: 14px;
		background-color: #00b7ff;
		border-color: #00b7ff;

		&:hover {
			background-color: #33c6ff;
			border-color: #33c6ff;
		}
	}
}
</style>