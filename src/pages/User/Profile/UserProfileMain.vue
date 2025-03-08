<template>
	<div class="profile-container-main">

			<!-- Profile form -->
			<div class="profile-form">
				<!-- Nickname -->
				<div class="form-item">
					<div class="label">昵称</div>
					<el-input v-model="profile.nickname" placeholder="取一个好听的名字" class="form-input" />
				</div>

<!--				&lt;!&ndash; Gender &ndash;&gt;-->
<!--				<div class="form-item">-->
<!--					<div class="label">性别</div>-->
<!--					<div class="gender-options">-->
<!--						<el-radio v-model="profile.gender" label="unknown" class="gender-radio">未知</el-radio>-->
<!--						<el-radio v-model="profile.gender" label="male" class="gender-radio">男</el-radio>-->
<!--						<el-radio v-model="profile.gender" label="female" class="gender-radio">女</el-radio>-->
<!--					</div>-->
<!--				</div>-->

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
						placeholder="吐友自己的个人简介.txt"
						class="form-textarea"
						:rows="4"
					/>
				</div>

				<!-- Save button -->
				<div class="save-container">
					<el-button type="primary" class="save-button">保存资料</el-button>
				</div>
			</div>

		<!-- Header with back button -->





	</div>
</template>

<script setup>
import { ref ,onMounted} from 'vue';
import {ArrowLeft} from "@element-plus/icons-vue";
import {useUserInfoStore} from "@/stores/useUserInfoStore.js";

const userInfoStore = useUserInfoStore();

const profile = ref({
	nickname: 'miiro',
	// gender: 'unknown',
	website: '',
	introduction: ''
});
onMounted(()=>{
	profile.value.nickname = userInfoStore.getUserInfo.userName;
	profile.value.website = userInfoStore.getUserInfo.userBlog;
	profile.value.introduction = userInfoStore.getUserInfo.description;
})


</script>

<style lang="scss" scoped>
.profile-container-main {
	width: 100%;
	//max-width: 1200px;
	margin: 0 auto;
	//background-color: #f5f7fa;
	padding-bottom: 40px;
}



.tabs-container {
	background-color: white;
	padding: 0 20px;
	border-bottom: 1px solid #e4e7ed;
}

.tabs {
	display: flex;
	gap: 20px;

	.tab {
		padding: 16px 0;
		font-size: 14px;
		cursor: pointer;
		position: relative;
		color: #606266;

		&.active {
			color: #409eff;
			font-weight: 500;

			&::after {
				content: '';
				position: absolute;
				bottom: 0;
				left: 0;
				right: 0;
				height: 2px;
				background-color: #409eff;
			}
		}
	}
}

.profile-form {
	//background-color: white;
	margin: 20px;
	border-radius: 4px;
	//padding: 20px;
	//box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.05);
}

.form-item {
	margin-bottom: 20px;

	.label {
		font-size: 14px;
		color: #606266;
		margin-bottom: 10px;
	}

	.form-input {
		width: 100%;
		font-size: 14px;
	}

	.form-textarea {
		width: 100%;
		font-size: 14px;
	}

	.gender-options {
		display: flex;
		gap: 20px;
	}

	.gender-radio {
		margin-right: 0;
	}
}

.save-container {
	display: flex;
	justify-content: flex-end;
	margin-top: 30px;

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