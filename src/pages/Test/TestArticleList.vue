<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
// import Mock from 'mockjs';
import axios from "axios";
import { localUrl, formatDate, formatDate2 } from "@/utils/methods.js";
import { defaultAvatar } from "@/utils/user.js"
import Default from "@tinymce/tinymce-vue";
import { CaretTop, Top } from "@element-plus/icons-vue";
const router = useRouter();

// 格式化内容，去除markdown标识符
const formatContent = (content) => {
	if (!content) return '';

	// 去除markdown标识符
	return content
		.replace(/#{1,6}\s/g, '') // 标题
		.replace(/\*\*(.*?)\*\*/g, '$1') // 粗体
		.replace(/\*(.*?)\*/g, '$1') // 斜体
		.replace(/\[(.*?)\]\((.*?)\)/g, '$1') // 链接
		.replace(/!\[(.*?)\]\((.*?)\)/g, '') // 图片
		.replace(/`{1,3}(.*?)`{1,3}/g, '$1') // 代码
		.replace(/~~(.*?)~~/g, '$1') // 删除线
		.replace(/>\s(.*?)(\n|$)/g, '$1$2') // 引用
		.replace(/\n\s*[-+*]\s/g, ' ') // 无序列表
		.replace(/\n\s*\d+\.\s/g, ' ') // 有序列表
		.replace(/\n/g, ' '); // 换行替换为空格
};




// Fetch mock articles
const articles = ref([]);
const topArt = ref({
			"id": 7,
			"author_name": "Saya",
			"author_id": 4,
			"author_avatar": "https://user-1304757492.cos.ap-guangzhou.myqcloud.com/images/1741436372019_0807a192206dc23a09873aa2d63fb524ef6c77db.jpg",
			"content": "<h2>文章发布指南 0.0.1（?）</h2><p>上传图片之后时候可以控制图片大小，建议居中 50%,观看效果更佳</p><h3>做这个功能的目的：</h3><p>可以上传一些除了单纯的插画之外的东西，例如小漫画，官方其他投稿，图片等等</p><h3>现有功能：</h3><p>除了喜闻乐见的注册登录上传功能之外，评论功能也是可以正常使用的，编辑功能正在开发中。</p><p>添加了一个小功能，可以给自己加TAG，会在评论的同时显示出来</p><h3>限制：</h3><p>没有，正常使用即可</p><h3>插件库：</h3><p>vue3 + scss + element-ui / wangEditor / fastapi</p>",
			"content_preview": "<h2>文章发布指南 0.0.1（?）</h2><h3>做这个功能的目的：</h3><p>可以上传一些除了单纯的插画之外的东西，例如小漫画，官方其他投稿，图片等等</p><h3>现有功能：</h3><...",
			"title": "文章发布指南（?）",
			"theme": "发布指南",
			"create_date": "2025-03-13T07:09:26"
		});
const loading = ref(false);
const showTopArt = ref(false)


const fetchArticles = async () => {
	// setupMockData();
	const loadingInstance = ElLoading.service({
		text: '加载文章列表中...',
		background: 'rgba(255, 255, 255, 0.7)'
	});
	loading.value = true;

	try {
		const response = await axios.get(localUrl + '/articles/articles');
		// console.log('response: ', response)
		if (response.data && response.data.length > 0) {
			showTopArt.value = true;
			articles.value = response.data.map(article => {
			// Generate random images only for some articles
			if (article.image > 3) {
				article.image = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/120`;
			} else {
				article.image = '';
			}
			return article;
		});
		}
		
	} catch (error) {
		// 如果没有数据，清空置顶文章
		// topArt.value = null;
		articles.value = [];
		console.error('Error fetching articles:', error);
	} finally {
		loading.value = false;
		loadingInstance.close();
	}
};

// Navigate to article detail
const goToArticle = (id) => {
	router.push({
		name: 'articleDetail', params: { id }
	});
};

onMounted(() => {
	fetchArticles();
});
</script>


<template>
	<div class="article-list-container">
		<div class="article-grid" v-if="!loading && showTopArt" >
			<div class="article-item" @click="goToArticle(topArt.id)">
				<div class="article-content">
					<div class="article-info">
						<h3 class="article-title">{{ topArt.title }}</h3>
						<div class="article-meta">
							<div class="author-info">
								<img :src="topArt.author_avatar || defaultAvatar" class="author-avatar"
									alt="author avatar">
								<span class="author">{{ topArt.author_name }}</span>
							</div>
							<div class="article-stats">
								<span class="stat-item">{{ formatDate2(topArt.create_date) }}</span>
								<!-- 添加置顶标识 -->
								<span class="pin-icon">
									<el-icon>
										<CaretTop />
									</el-icon>
									<!-- <span>置顶</span> -->
								</span>
							</div>
						</div>
						<p class="article-summary">{{ formatContent(topArt.content_preview) }}</p>
					</div>
				</div>

			</div>


			<div v-for="article in articles" :key="article.id" class="article-item" @click="goToArticle(article.id)">
				<div class="article-content">
					<div class="article-info">
						<h3 class="article-title">{{ article.title }}</h3>
						<div class="article-meta">
							<div class="author-info">
								<img :src="article.author_avatar || defaultAvatar" class="author-avatar"
									alt="author avatar">
								<span class="author">{{ article.author_name }}</span>
							</div>
							<div class="article-stats">
								<span class="stat-item">{{ formatDate2(article.create_date) }}</span>
							</div>
						</div>
						<p class="article-summary">{{ formatContent(article.content_preview) }}</p>
					</div>
				</div>
			</div>

			<!-- 无数据显示 -->
		<div v-if="!loading && !topArt && articles.length === 0" class="no-data">
			暂无文章
		</div>
		</div>
	</div>
</template>


<style lang="scss" scoped>
.article-list-container {
	min-height: calc(100vh - 98px);
	max-width: 1200px;
	margin: 0 auto;
	padding: 24px;
	// font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;


	/* 添加无数据样式 */
	.no-data {
		text-align: center;
		padding: 40px 0;
		color: #909399;
		font-size: 14px;
	}

	.article-grid {
		display: flex;
		flex-wrap: wrap;
		gap: 10px;
		// margin-bottom: 30px;
	}

	.article-item {
		width: calc(25% - 10px); // 减去间距的一半
		padding: 16px;
		border-radius: 12px;
		background-color: white;
		box-shadow: 0 4px 1px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition: all 0.3s ease;
		border: 1px solid rgba(0, 0, 0, 0.03);
		display: flex;
		flex-direction: column;
		min-height: 160px;
		box-sizing: border-box;

		&:hover {
			transform: translateY(-4px);
			box-shadow: 0 4px 2px rgba(0, 0, 0, 0.06), 0 4px 8px rgba(0, 0, 0, 0.08);
			border-color: rgba(0, 0, 0, 0.08);
		}

		.article-content {
			flex: 1;
			display: flex;
			flex-direction: column;

			.article-info {
				width: 100%;
				flex: 1;
				display: flex;
				flex-direction: column;

				.article-title {
					margin: 0 0 20px 0;
					font-size: 18px;
					font-weight: 600;
					line-height: 1.5;
					color: #2c3e50;
					transition: color 0.2s;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;

					&:hover {
						color: #3498db;
					}
				}

				.article-meta {
					display: flex;
					justify-content: space-between;
					align-items: center;
					margin-bottom: 16px;

					.pin-icon {
						display: inline-flex;
						align-items: center;
						gap: 4px;
						font-size: 12px;
						color: #e74c3c;
						padding: 3px 6px;
						border-radius: 4px;
						background-color: rgba(231, 76, 60, 0.1);
						flex-direction: column;
						justify-content: center;

						.el-icon {
							font-size: 12px;
						}
					}

					.author-info {
						display: flex;
						align-items: center;
						gap: 8px;

						.author-avatar {
							width: 24px;
							height: 24px;
							border-radius: 50%;
							object-fit: cover;
							border: 2px solid #fff;
							box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
						}

						.author {
							font-size: 14px;
							font-weight: 500;
							color: #555;
						}
					}

					.article-stats {
						display: flex;
						gap: 12px;

						.stat-item {
							font-size: 12px;
							color: #8492a6;
							background-color: #f5f7fa;
							padding: 3px 6px;
							border-radius: 4px;
						}
					}
				}

				.article-summary {
					margin: 0;
					font-size: 14px;
					line-height: 1.8;
					color: #5e6d82;
					display: -webkit-box;
					-webkit-line-clamp: 3;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
					flex: 1;
				}
			}
		}
	}
}

// 调整响应式布局断点
@media screen and (max-width: 1200px) {
	.article-list-container {
		.article-item {
			width: calc(33.33% - 14px); // 三列布局
		}
	}
}

@media screen and (max-width: 992px) {
	.article-list-container {
		.article-item {
			width: calc(50% - 10px); // 两列布局
		}
	}
}

@media screen and (max-width: 768px) {
	.article-list-container {
		padding: 16px;

		.article-grid {
			gap: 15px;
		}

		.article-item {
			padding: 16px;
			width: 100%; // 单列布局

			.article-content {
				.article-info {
					.article-title {
						font-size: 16px;
						margin-bottom: 10px;
					}

					.article-meta {
						flex-direction: column;
						align-items: flex-start;
						gap: 6px;
						margin-bottom: 10px;



						.author-info {
							.author-avatar {
								width: 24px;
								height: 24px;
							}

							.author {
								font-size: 13px;
							}
						}



					}

					.article-summary {
						font-size: 13px;
						-webkit-line-clamp: 2;
					}
				}
			}
		}
	}
}
</style>