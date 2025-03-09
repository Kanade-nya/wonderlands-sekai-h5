<template>
	<div class="article-detail-container" v-if="article">
		<div class="article-header">
			<h1 class="article-title">{{ article.title }}</h1>

			<div class="article-meta">
				<div class="author-info">
					<img :src="article.authorAvatar" class="author-avatar" alt="author avatar">
					<span class="author-name">{{ article.author }}</span>
				</div>
				<div class="article-stats">
					<span class="stat-item">文章数: {{ article.articleCount }}</span>
					<span class="stat-item">本篇阅读: {{ article.readCount }}</span>
					<span class="stat-item">{{ article.time }}</span>
				</div>
			</div>

			<div class="article-divider"></div>
		</div>

		<div class="article-content" v-html="article.content"></div>

		<div class="article-tags" v-if="article.tags && article.tags.length">
			<span class="tag-item" v-for="(tag, index) in article.tags" :key="index">{{ tag }}</span>
		</div>
		<UserComments></UserComments>
<!--		<div class="comments-section">-->
<!--			<h3 class="comments-title">评论 ({{ comments.length }})</h3>-->
<!--			<div class="comments-container">-->
<!--				&lt;!&ndash; undraw-ui Comment Component &ndash;&gt;-->
<!--				<u-comment-->
<!--					v-for="comment in comments"-->
<!--					:key="comment.id"-->
<!--					:avatar="comment.avatar"-->
<!--					:author="comment.author"-->
<!--					:content="comment.content"-->
<!--					:time="comment.time"-->
<!--					:likes="comment.likes"-->
<!--				>-->
<!--					<template v-if="comment.replies && comment.replies.length" #reply>-->
<!--						<u-comment-->
<!--							v-for="reply in comment.replies"-->
<!--							:key="reply.id"-->
<!--							:avatar="reply.avatar"-->
<!--							:author="reply.author"-->
<!--							:content="reply.content"-->
<!--							:time="reply.time"-->
<!--							:likes="reply.likes"-->
<!--						></u-comment>-->
<!--					</template>-->
<!--				</u-comment>-->
<!--			</div>-->

<!--			<div class="comment-form">-->
<!--				<h3>发表评论</h3>-->
<!--				<el-input-->
<!--					type="textarea"-->
<!--					:rows="4"-->
<!--					placeholder="请输入您的评论..."-->
<!--					v-model="newComment"-->
<!--				></el-input>-->
<!--				<el-button type="primary" @click="submitComment" class="submit-btn">提交评论</el-button>-->
<!--			</div>-->
<!--		</div>-->
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import Mock from 'mockjs';
import { ElMessage } from 'element-plus';
import { UComment } from 'undraw-ui';
import UserComments from "@/pages/User/UserComments.vue";
import axios from "axios";

const route = useRoute();
const article = ref(null);
const comments = ref([]);
const newComment = ref('');

// Setup mock data for article
const setupMockArticle = () => {
	Mock.mock('/api/article', 'get', {
		id: '@id',
		title: '[gal随笔34] 恋心如花惜绚烂: 如花香般纯粹而质朴的甜蜜',
		author: '风笛专用拖拉机',
		authorAvatar: 'https://picsum.photos/id/64/100/100',
		articleCount: '@integer(10, 50)',
		readCount: '@integer(1000, 10000)',
		time: '25天前',
		content: `<p>事情要从推完舞散樱恋（《樱花落舞恋如樱》）然后看迷搜名字类似的其他三部gal开始讲起: 在另外三部里面，我先是推了《恋花缤纷樱飞时》，但海色板的这部作品的确不太能入我眼；然后，当我决定最后推《樱花片落恋模样》、而先打开《恋心如花惜绚烂》时，它一开始并没有给我很惊艳的感觉——美术水平在线而不出众，剧本也是极致的日常。</p>
              <p>再然后，进入个人线，被高浓度甜蜜日常甜到不能自拔，却又从主角们的日常行迹中找不出任何过分贴合剧本的行为，那怕伊织在确定关系后的迅速要求同居在几段剧情后也有了充分的解释......</p>
              <p>于是水瓶在此做出分享——恋心可以惜绚烂，但好故事还是推广出来的好。</p>
              <div class="divider"></div>
              <p>不过纯粹的废萌作故事线几乎没有太过深奥的内容，共通线为每个女主角安排一个出场桥段，然后一边介绍角色一边推进剧情，最后选择其中一位进入她的故事线——《恋心如花惜绚烂》的个人线进线极其简洁: 除去二周目线女主藤堂永绊（表妹）以外，在唯一的选项那里选择想要深入了解的女主就好了√</p>
              <p>毕竟这作的男主是木绘主打一个情商拉满（也许是因为家庭），在共通线就已经和各位女主刷了不少好感度了.jpg</p>
              <p>以下，个人线简要分析:</p>
              <p>琴石伊织，开场第一位女主，超级主动的红毛天降，在一起没多久就敢主动告白的勇敢女孩。<span style="color: red;">她的故事有笑有泪，她的刀子货真价实。</span></p>
              <img src="https://picsum.photos/id/237/800/400" alt="Sample image" class="content-image">
              <p>与其他废萌不同的是，《恋心如花惜绚烂》最大的特点是极尽量让主角CP贴近现实中的情侣相处。</p>
              <p>比方说几乎每个女主线里，主角和女主确定关系后，都会有一个情感升温的过程，先是害羞的牵手，频繁的约会，然后偶尔去对方家里，再之后是在异地时的频繁通话...</p>`,
		tags: ['Galgame', '恋爱模拟', '游戏评测']
	});
};

// Setup mock data for comments
const setupMockComments = () => {
	Mock.mock('/api/comments', 'get', {
		'comments|5-10': [{
			'id|+1': 1,
			'author': '@cname',
			'avatar': function() {
				return `https://picsum.photos/id/${this.id + 50}/100/100`;
			},
			'content': '@cparagraph(1, 3)',
			'time': '@datetime("yyyy-MM-dd HH:mm")',
			'likes|0-30': 0,
			'replies|0-3': [{
				'id|+1': 100,
				'author': '@cname',
				'avatar': function() {
					return `https://picsum.photos/id/${this.id + 10}/100/100`;
				},
				'content': '@cparagraph(1, 2)',
				'time': '@datetime("yyyy-MM-dd HH:mm")',
				'likes|0-15': 0
			}]
		}]
	});
};

// Fetch mock article
const fetchArticle = async () => {
	setupMockArticle();
	try {
		const response = await axios.get('/api/article');
		article.value = response.data;
	} catch (error) {
		console.error('Error fetching article:', error);
	}
};

// Fetch mock comments
const fetchComments = async () => {
	setupMockComments();
	try {
		const response = await Mock.mock('/api/comments');
		comments.value = response.comments;
	} catch (error) {
		console.error('Error fetching comments:', error);
	}
};

// Submit new comment
const submitComment = () => {
	if (!newComment.value.trim()) {
		ElMessage.warning('评论内容不能为空');
		return;
	}

	const newCommentObj = {
		id: comments.value.length + 1,
		author: '当前用户',
		avatar: 'https://picsum.photos/id/1/100/100',
		content: newComment.value,
		time: new Date().toLocaleString('zh-CN', {
			year: 'numeric',
			month: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			minute: '2-digit'
		}),
		likes: 0,
		replies: []
	};

	comments.value.unshift(newCommentObj);
	newComment.value = '';
	ElMessage.success('评论发布成功');
};

onMounted(() => {
	fetchArticle();
	fetchComments();
});
</script>

<style lang="scss" scoped>
.main-page-layout{
	//background:;
}
.article-detail-container {
	//max-width: 800px;
	margin: 0 auto;
	padding: 20px;
	background-color: white;
	border-radius: 8px;
	//box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);

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

	.comments-section {
		margin-top: 40px;

		.comments-title {
			font-size: 18px;
			font-weight: 600;
			margin-bottom: 20px;
			padding-bottom: 10px;
			border-bottom: 1px solid #eaeaea;
		}

		.comments-container {
			margin-bottom: 30px;
		}

		.comment-form {
			background-color: #f8f8f8;
			padding: 20px;
			border-radius: 8px;

			h3 {
				font-size: 16px;
				margin-bottom: 15px;
			}

			.submit-btn {
				margin-top: 15px;
			}
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