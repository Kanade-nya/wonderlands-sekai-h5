<script setup>
import {ref} from "vue";
import UserProfileMain from "@/pages/User/Profile/UserProfileMain.vue";
import {ArrowLeft} from "@element-plus/icons-vue";
import UserProfileAvatar from "@/pages/User/Profile/UserProfileAvatar.vue";
import UserProfileMeta from "@/pages/User/Profile/UserProfileMeta.vue";
import {useRouter} from "vue-router";

const router = useRouter()

const activeName = ref('first');
const handleClick = () => {
	router.back()
}
</script>

<template>
	<div class="profile-container">
		<el-card>
			<template #header>
				<div class="header">
					<el-button class="back-button" :icon="ArrowLeft" text @click="handleClick"> 资料</el-button>
				</div>
			</template>
			<el-tabs v-model="activeName" class="demo-tabs">
				<el-tab-pane label="基本资料" name="first"><user-profile-main></user-profile-main></el-tab-pane>
				<el-tab-pane label="头像管理" name="second"><user-profile-avatar></user-profile-avatar></el-tab-pane>
				<el-tab-pane label="标签" name="third"><user-profile-meta></user-profile-meta></el-tab-pane>
				<el-tab-pane label="Task" name="fourth">Task</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<style scoped lang="scss">
.profile-container{
	.header {
		//padding: 16px 20px;
		display: flex;
		align-items: center;
		//margin: 0 20px;

		.back-button {
			font-size: 16px;
			color: #333;
			padding: 0;
			margin: 0;
			font-family: "Noto Serif SC", sans-serif !important;
		}
	}
	width: 80%;
	margin: 40px auto;
	min-height: calc(100vh - 80px - 58px);
	.demo-tabs{
		width: 100%;
	}
}
:deep(.el-tabs__content){
	min-height: 200px;
}
:deep(.el-card__header){
	padding-top: 0.5em;
	padding-bottom: 0.5em;
	//padding-bottom: 0;
}
</style>