<template>
	<div class="article-list-container">
		<div v-for="article in articles" :key="article.id" class="article-item" @click="goToArticle(article.id)">
			<!-- Article with image on left -->
			<div class="article-content">
<!--				<div class="article-image" v-if="article.image">-->
<!--					<img :src="article.image" :alt="article.title">-->
<!--				</div>-->
				<div class="article-info" :class="{ 'full-width': !article.image }">
					<h3 class="article-title">{{ article.title }}</h3>
					<div class="article-meta">
						<div class="author-info">
							<img :src="article.authorAvatar" class="author-avatar" alt="author avatar">
							<span class="author">{{ article.author }}</span>
						</div>
						<div class="article-stats">
							<span class="stat-item">文章数: {{ article.articleCount }}</span>
							<span class="stat-item">阅读: {{ article.readCount }}</span>
							<span class="stat-item">{{ article.time }}</span>
						</div>
					</div>
					<p class="article-summary">{{ article.summary }}</p>
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
		const response = await axios.get('/api/articles');
		console.log('response: ',response)
		articles.value = response.data.articles.map(article => {
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
	router.push({ name: 'ArticleDetail', params: { id } });
};

onMounted(() => {
	fetchArticles();
});
</script>

<style lang="scss" scoped>
.article-list-container {
	max-width: 1200px;
	margin: 0 auto;
	padding: 20px;
	font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;

	.article-item {
		padding: 20px;
		margin-bottom: 20px;
		border-radius: 8px;
		background-color: white;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
		cursor: pointer;
		transition: transform 0.2s, box-shadow 0.2s;

		&:hover {
			transform: translateY(-3px);
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}

		.article-content {
			display: flex;
			flex-direction: row;
			gap: 20px;

			.article-image {
				flex: 0 0 200px;
				img {
					width: 100%;
					height: 120px;
					object-fit: cover;
					border-radius: 4px;
				}
			}

			.article-info {
				flex: 1;

				&.full-width {
					width: 100%;
				}

				.article-title {
					margin: 0 0 12px 0;
					font-size: 18px;
					font-weight: 600;
					line-height: 1.4;
					color: #333;
				}

				.article-meta {
					display: flex;
					justify-content: space-between;
					margin-bottom: 12px;

					.author-info {
						display: flex;
						align-items: center;
						gap: 8px;

						.author-avatar {
							width: 24px;
							height: 24px;
							border-radius: 50%;
							object-fit: cover;
						}

						.author {
							font-size: 14px;
							color: #666;
						}
					}

					.article-stats {
						display: flex;
						gap: 12px;

						.stat-item {
							font-size: 12px;
							color: #888;
						}
					}
				}

				.article-summary {
					margin: 0;
					font-size: 14px;
					line-height: 1.6;
					color: #666;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					overflow: hidden;
					text-overflow: ellipsis;
				}
			}
		}
	}
}

@media screen and (max-width: 768px) {
	.article-list-container {
		.article-item {
			.article-content {
				flex-direction: column;

				.article-image {
					flex: none;
					width: 100%;
					margin-bottom: 10px;

					img {
						width: 100%;
						height: auto;
					}
				}

				.article-meta {
					flex-direction: column;
					gap: 8px;
				}
			}
		}
	}
}
</style>