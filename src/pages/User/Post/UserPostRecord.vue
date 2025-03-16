<template>
	<div class="publication-container">
		<el-card class="publication-card">

			<template #header>
				<div class="header">
					<el-button class="back-button" :icon="ArrowLeft" text @click="handleClick">投稿记录管理</el-button>
				</div>
			</template>


			<el-tabs v-model="activeTab" class="publication-tabs">
				<el-tab-pane label="新建投稿" name="new">

					<UserPostNewPublication @publication-submitted="handlePublicationSubmitted"
					                        ref="newPublicationRef"/>
				</el-tab-pane>

				<el-tab-pane label="历史投稿" name="history">
					<!--					<UserPostPublicationHistory @edit-publication="handleEditPublication" ref="publicationHistoryRef" />-->
					<later-open></later-open>
				</el-tab-pane>
			</el-tabs>
		</el-card>
	</div>
</template>

<script setup>
import {ref} from 'vue';
import UserPostNewPublication from "@/pages/User/Post/UserPostNewPublication.vue";
import UserPostPublicationHistory from "@/pages/User/Post/UserPostPublicationHistory.vue";
import LaterOpen from "@/components/common/LaterOpen.vue";
import {ArrowLeft} from "@element-plus/icons-vue";
import {useRouter} from "vue-router";
const router = useRouter()


const activeTab = ref('new');
const newPublicationRef = ref(null);
const publicationHistoryRef = ref(null);

// 处理新文章提交
const handlePublicationSubmitted = (newPublication) => {
	// publicationHistoryRef.value.addNewPublication(newPublication);
	// activeTab.value = 'history';
};

// 处理编辑文章
const handleEditPublication = (publication) => {
	newPublicationRef.value.setPublicationData(publication);
	activeTab.value = 'new';
};

const handleClick = () => {
	router.back()
}

</script>

<style lang="scss">
.publication-container {
	max-width: 1200px;
	margin: 20px auto;

	.publication-card {
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			h2 {
				margin: 0;
				font-size: 20px;
				color: #333;
			}
		}

		.publication-tabs {
			margin-top: 10px;
		}
	}
}
</style>