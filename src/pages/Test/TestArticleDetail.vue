<template>
	<div class="article-detail-container" v-if="article">
		<div class="article-header">
			<h1 class="article-title">{{ article.title }}</h1>

			<div class="article-meta">
				<div class="author-info">
					<img :src="article.author_avatar || defaultAvatar" class="author-avatar" alt="author avatar">
					<span class="author-name">{{ article.author_name }}</span>
				</div>
				<div class="article-stats">
					<span class="stat-item">{{ article.create_date }}</span>
				</div>
			</div>

			<div class="article-divider"></div>
		</div>

		<div class="article-content" v-html="article.content"></div>

		<div class="article-tags" v-if="article.tags && article.tags.length">
			<span class="tag-item" v-for="(tag, index) in article.tags" :key="index">{{ tag }}</span>
		</div>
		<UserComments></UserComments>
	</div>
	<div v-else class="loading-container">
		<el-skeleton :rows="10" animated />
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import UserComments from "@/pages/User/UserComments.vue";
import axios from "axios";
import { localUrl } from "@/utils/methods.js";
import { defaultAvatar } from "@/utils/user.js";

const route = useRoute();
const article = ref(null);

// 获取文章详情
const fetchArticleDetail = async () => {
	try {
		const articleId = route.params.id;
		if (!articleId) {
			ElMessage.error('文章ID不存在');
			return;
		}
		
		const response = await axios.get(`${localUrl}/articles/articles/${articleId}`);
		if (response.data) {
			article.value = response.data;
			// 处理文章内容，如果需要的话
			if (article.value.content) {
				// 可以在这里对内容进行额外处理，例如添加样式或格式化
				article.value.content = article.value.content.replace(/\n/g, '<br>');
			}
		} else {
			ElMessage.error('获取文章详情失败');
		}
	} catch (error) {
		console.error('获取文章详情出错:', error);
		ElMessage.error('获取文章详情出错');
	}
};

onMounted(() => {
	fetchArticleDetail();
});
</script>

<style lang="scss" scoped>
.loading-container {
	padding: 20px;
}

.article-detail-container {
	margin: 0 auto;
	padding: 20px;
	background-color: white;
	border-radius: 8px;

	.article-header {
		margin-bottom: 30px;

		.article-title {
			font-size: 28px;
			font-weight: bold;
			color: #333;
			margin-bottom: 20px;
		}

		.article-meta {
			display: flex;
			justify-content: space-between;
			align-items: center;
			margin-bottom: 20px;

			.author-info {
				display: flex;
				align-items: center;
				gap: 10px;

				.author-avatar {
					width: 40px;
					height: 40px;
					border-radius: 50%;
					object-fit: cover;
				}

				.author-name {
					font-size: 14px;
					color: #333;
				}
			}

			.article-stats {
				display: flex;
				gap: 15px;

				.stat-item {
					font-size: 14px;
					color: #666;
					background-color: #f5f7fa;
					padding: 3px 8px;
					border-radius: 4px;
				}
			}
		}

		.article-divider {
			height: 1px;
			background-color: #eaeaea;
			margin: 10px 0 20px;
		}
	}

	.article-content {
		font-size: 16px;
		line-height: 1.8;
		color: #333;
		margin-bottom: 30px;

		p {
			margin-bottom: 20px;
		}

		.divider {
			height: 1px;
			background-color: #eaeaea;
			margin: 20px 0;
		}

		.content-image {
			width: 100%;
			margin: 20px 0;
			border-radius: 8px;
		}
	}

	.article-tags {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		margin-bottom: 30px;

		.tag-item {
			padding: 6px 12px;
			background-color: #f0f2f5;
			border-radius: 4px;
			font-size: 12px;
			color: #666;
		}
	}
}

@media screen and (max-width: 768px) {
	.article-detail-container {
		padding: 15px;

		.article-header {
			.article-title {
				font-size: 22px;
			}

			.article-meta {
				flex-direction: column;
				align-items: flex-start;
				gap: 10px;

				.article-stats {
					flex-wrap: wrap;
				}
			}
		}
	}
}
</style>