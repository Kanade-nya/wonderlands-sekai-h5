<template>
	<div class="article-list-container">
		<div v-for="article in articles" :key="article.id" class="article-item">
			<!-- Article with image on left -->
			<div class="article-content">
<!--				<div class="article-image" v-if="article.image">-->
<!--					<img :src="article.image" :alt="article.title">-->
<!--				</div>-->
				<div class="article-info" :class="{ 'full-width': !article.image }">
					<h3 class="article-title">{{ article.title }}</h3>
					<div class="article-meta">
						<span class="author">{{ article.author }}</span>
						<span class="divider">/</span>
						<span class="time">{{ article.time }}</span>
					</div>
					<p class="article-summary">{{ article.summary }}</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import Mock from 'mockjs';
import axios from "axios";

// Setup mock data
const setupMockData = () => {
	Mock.mock('/api/articles', 'get', {
		'articles|8': [{
			'id|+1': 1,
			'title': '@ctitle(10, 30)',
			'author': '@cname',
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
		// In a real app, you would use axios or fetch
		const response = await axios.get('/api/articles');
		console.log(response)
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
		padding: 20px 0;
		border-bottom: 1px solid #eaeaea;

		&:last-child {
			border-bottom: none;
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
					margin: 0 0 8px 0;
					font-size: 18px;
					font-weight: 600;
					line-height: 1.4;
					color: #333;
				}

				.article-meta {
					margin-bottom: 10px;
					font-size: 14px;
					color: #888;

					.divider {
						margin: 0 5px;
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
			}
		}
	}
}
</style>