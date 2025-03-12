<template>
	<div class="article-list-container">
		<div class="article-grid">
			<div v-for="article in articles" :key="article.id" class="article-item" @click="goToArticle(article.id)">
				<div class="article-content">
					<div class="article-info">
						<h3 class="article-title">{{ article.title }}</h3>
						<div class="article-meta">
							<div class="author-info">
								<img :src="article.authorAvatar" class="author-avatar" alt="author avatar">
								<span class="author">{{ article.author_name }}</span>
							</div>
							<div class="article-stats">
								<span class="stat-item">{{ article.create_date }}</span>
							</div>
						</div>
						<p class="article-summary">{{ article.content }}</p>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import Mock from 'mockjs';
import axios from "axios";
import {localUrl} from "@/utils/methods.js";

const router = useRouter();

// Setup mock data
const setupMockData = () => {
	Mock.mock('/api/articles', 'get', {
		'articles|8': [{
			'id|+1': 1,
			'title': function() {
				const prefixes = ['【gal随笔', '【池赞向】', '【掌机咸鱼の日志', '恋爱喜剧的转型', '与鲨鱼共度的七日间'];
				return `${prefixes[this.id % 5]}${this.id}】 ${Mock.Random.ctitle(5, 15)}`;
			},
			'author': '@cname',
			'authorAvatar': function() {
				return `https://picsum.photos/id/${this.id + 20}/100/100`;
			},
			'articleCount': '@integer(5, 50)',
			'readCount': '@integer(1000, 10000)',
			'time': '@integer(1, 30)天前',
			'summary': '@cparagraph(1, 3)',
			'image|1-10': 1,  // Random to determine if there's an image
		}]
	});
};

// Fetch mock articles
const articles = ref([]);
const fetchArticles = async () => {
	setupMockData();
	try {
		const response = await axios.get(localUrl + '/articles/articles');
		console.log('response: ',response)
		articles.value = response.data.map(article => {
			// Generate random images only for some articles
			if (article.image > 3) {
				article.image = `https://picsum.photos/id/${Math.floor(Math.random() * 100)}/200/120`;
			} else {
				article.image = '';
			}
			return article;
		});
	} catch (error) {
		console.error('Error fetching articles:', error);
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

<style lang="scss" scoped>
.article-list-container {
	min-height: calc(100vh - 98px);
	max-width: 1200px;
	margin: 0 auto;
	padding: 16px;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

	.article-grid {
		display: grid;
		grid-template-columns: repeat(2, 1fr);
		gap: 20px;
	}

	.article-item {
		padding: 20px;
		border-radius: 12px;
		background-color: white;
		box-shadow: 0 4px 1px rgba(0, 0, 0, 0.03), 0 1px 3px rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition: all 0.3s ease;
		border: 1px solid rgba(0, 0, 0, 0.03);
		height: 100%;
		display: flex;
		flex-direction: column;

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
					margin: 0 0 16px 0;
					font-size: 18px;
					font-weight: 600;
					line-height: 1.4;
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
					margin-bottom: 12px;

					.author-info {
						display: flex;
						align-items: center;
						gap: 8px;

						.author-avatar {
							width: 28px;
							height: 28px;
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
					line-height: 1.6;
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

@media screen and (max-width: 992px) {
	.article-list-container {
		.article-grid {
			grid-template-columns: 1fr;
		}
	}
}

@media screen and (max-width: 768px) {
	.article-list-container {
		padding: 12px;
		
		.article-item {
			padding: 16px;
			
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