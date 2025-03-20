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
					<span class="stat-item">{{ formatDate(article.create_date) }}</span>
				</div>
			</div>

			<div class="article-divider"></div>
		</div>

		<!-- <MarkdownContent :content="article.content"></MarkdownContent> -->
		<div class="article-content">
			<div v-html="article.content"></div>
		</div>
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
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from 'element-plus';
import UserComments from "@/pages/User/UserComments.vue";
import axios from "axios";
import { localUrl, formatDate } from "@/utils/methods.js";
import { defaultAvatar } from "@/utils/user.js";
import MarkdownContent from "./MarkdownContent.vue";

const route = useRoute();
const article = ref(null);

// 检测是否为PC设备
const isPC = computed(() => {
  return window.innerWidth >= 768; // 通常768px是移动设备和PC设备的分界点
});

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
				// 替换换行符
				let content = article.value.content.replace(/\n/g, '<br>');

				// 为所有图片添加懒加载属性
				const imgReg = /<img(.*?)src=["'](.*?)["'](.*?)>/gi;
				content = content.replace(imgReg, (match) => {
					// 检查是否已经有 v-lazy 属性
					if (match.includes('v-lazy')) {
						return match;
					}
					// 提取 src 属性
					const srcMatch = match.match(/src=["'](.*?)["']/i);
					if (srcMatch && srcMatch[1]) {
						const src = srcMatch[1];
						// 根据设备类型设置图片宽度
						const imgWidth = isPC.value ? 'width: 50%; margin: 8px auto; display: block;' : 'width: 100%;margin: 0 auto; display: block;';
						// 替换 src 为 v-lazy 并添加样式
						return match.replace(/src=["'](.*?)["']/i, `src="${src}" loading="lazy" element-loading-text="加载中" style="${imgWidth}"`);
					}

					return match;
				});

				article.value.content = content;
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
		// margin-bottom: 30px;
		padding: 0 10px;

		:deep(img) {
			max-width: 100%;
			height: auto;
			border-radius: 8px;
			margin: 1.5em 0;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
			transition: transform 0.3s ease;

			&:hover {
				transform: scale(1.01);
			}
		}

		:deep(p) {
			margin-bottom: 20px;
			letter-spacing: 0.5px;
		}

		:deep(h1),
		:deep(h2),
		:deep(h3),
		:deep(h4),
		:deep(h5),
		:deep(h6) {
			font-weight: 600;
			margin: 1.5em 0 0.8em;
			color: #222;
			line-height: 1.4;
		}

		:deep(h1) {
			font-size: 1.8em;
			border-bottom: 1px solid #eee;
			padding-bottom: 0.3em;
		}

		:deep(h2) {
			font-size: 1.5em;
			border-bottom: 1px solid #f0f0f0;
			padding-bottom: 0.3em;
		}

		:deep(h3) {
			font-size: 1.3em;
		}

		:deep(a) {
			color: #0366d6;
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: #0056b3;
				text-decoration: underline;
			}
		}

		:deep(blockquote) {
			border-left: 4px solid #dfe2e5;
			padding: 0 1em;
			color: #6a737d;
			margin: 1.5em 0;
			background-color: #f8f9fa;
			border-radius: 0 4px 4px 0;

			p {
				margin: 1em 0;
			}
		}

		:deep(ul),
		:deep(ol) {
			padding-left: 2em;
			margin: 1em 0;
		}

		:deep(li) {
			margin-bottom: 0.5em;
		}

		:deep(code) {
			font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
			background-color: rgba(27, 31, 35, 0.05);
			padding: 0.2em 0.4em;
			border-radius: 3px;
			font-size: 0.9em;
		}

		:deep(pre) {
			background-color: #f6f8fa;
			border-radius: 6px;
			padding: 16px;
			overflow: auto;
			margin: 1.5em 0;

			code {
				background-color: transparent;
				padding: 0;
				white-space: pre;
				font-size: 0.9em;
				line-height: 1.5;
				display: block;
			}
		}

		:deep(table) {
			border-collapse: collapse;
			width: 100%;
			margin: 1.5em 0;
			overflow: auto;

			th,
			td {
				border: 1px solid #dfe2e5;
				padding: 8px 12px;
			}

			th {
				background-color: #f6f8fa;
				font-weight: 600;
			}

			tr:nth-child(even) {
				background-color: #f8f9fa;
			}

			tr:hover {
				background-color: #f1f4f7;
			}
		}

		:deep(hr) {
			height: 1px;
			background-color: #eaeaea;
			border: none;
			margin: 2em 0;
		}

		:deep(.content-image) {
			width: 100%;
			margin: 20px 0;
			border-radius: 8px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
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