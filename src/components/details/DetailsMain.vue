<!-- 具体的图片链接-->
<template>
	<div class="page-container">
		<details-title
			:title="box.title"
			:date="box.create_date"
			:character="box.character"
			:type="box.type"
		></details-title>
		<!-- 头部宣传区域 -->

		<!-- 画集介绍区域 -->
		<div class="introduction">
			<h3>Introduction</h3>
			<!--			<p>日本画师椎名優(椎名优、しいな ゆう、Shiina Yuu)的小画集，跨页图有拼接痕迹。</p>-->
			<p>画师： {{ box.illustrator }}</p>
			<!--			<p>上传日期： {{box.create_date}}</p>-->
			<p>类型： {{ box.type }}</p>
			<div style="border-top: 1px solid #ccc;margin: 8px 0 "></div>
			<div class="description" v-html="box.description">
			</div>
		</div>
		<!--		&lt;!&ndash; 下载地址区域 &ndash;&gt;-->
		<!--		<div class="download">-->
		<!--			<h3>下载地址</h3>-->
		<!--			<div class="download-content">-->
		<!--				<div class="login-info">-->
		<!--					<i class="icon-user"></i>-->
		<!--					<p>您需要登录才能查看完整内容</p>-->
		<!--				</div>-->
		<!--				<button @click="handleLogin">立即登录</button>-->
		<!--			</div>-->
		<!--		</div>-->
		<!-- 图片区域 -->
		<div class="image-list">
			<h3>Image</h3>
			<div class="image-list-container">
				<!--				<img src="@/assets/img_1.png" class="listed-image">-->
				<!--				<img src="@/assets/e0a9ce33a7fef53e5557e9bc2b9dafbe3546749308242173.jpg" class="listed-image">-->
				<!--				<img src="@/assets/img.png" class="listed-image">-->
				<div v-for="(path,index) in box.image_url">
					<el-image
						class="listed-image"
						alt=""
						:src="path"
						:preview-src-list="getPreviewImages(index)"
						lazy
					>
					</el-image>
				</div>
			</div>
		</div>
		<!--	tags区域	-->
		<div v-if="tags.length !== 0" class="tags">
			<h3>Tags</h3>
			<div class="tags-container">
				<el-tag v-for="item in tags" size="large" type="info" >{{item}}</el-tag>
			</div>
		</div>

		<!-- 更新记录区域 -->
		<div class="update-history">
			<h3>更新记录</h3>
			<div class="update-list">
				<!-- 创建记录 -->
				<div class="update-item">
					<div class="update-info">
						<span class="update-date">{{ formatDate(box.create_date) }}</span>
						<span class="update-author">admin</span>
					</div>
					<div class="update-content">
						<span>创建</span>
					</div>
				</div>
				<!-- 更新记录列表 -->
				<div v-for="(record, index) in updateRecords" :key="index" class="update-item">
					<div class="update-info">
						<span class="update-date">{{ formatDate(record.updated_at) }}</span>
						<span class="update-author">{{ record.updated_by || 'admin' }}</span>
					</div>
					<div class="update-content">

						<span v-for="(detail, index) in record.update_details">{{translate(index)}}: {{detail}}</span>
					</div>
				</div>
			</div>
		</div>

		<!--		评论区域-->
		<div class="comments">
			<Waline :serverURL="serverURL" :path="path" :reaction="[]"/>
		</div>
	</div>
</template>

<script setup>
import {computed, onMounted, ref} from 'vue';
import DetailsTitle from "@/components/details/DetailsTitle.vue";
import {baseUrl, imageUrl, localUrl, formatDate} from "@/utils/methods.js";


// Waline评论面板
import {Waline} from '@waline/client/component';
import {useRoute} from 'vue-router';

import '@waline/client/style';
import requests from "@/utils/requests.js";

import {useGetIpStore} from "@/stores/useGetIpStore.js";
const {getIp} = useGetIpStore()


const serverURL = 'https://comments.wonderlands-sekai.space';
const path = computed(() => useRoute().path);


// const imageUrl = ref('https://lingma-vl.oss-rg-china-mainland.aliyuncs.com/cloud/CPlxwF91fytKRrml8tR004190ZvojZlzmU6U0P3s2ZM/0e408adf-4593-4195-ae29-6b4b97d7d150_1736484421300.png'); // 替换为实际的宣传图地址
const box = ref({})
const tags = ref([])
const updateRecords = ref([])
const translate = (word) =>{
	switch (word) {
		case 'added_tags':
			return '添加标签';
		default:
			return word;
	}
}

const getPreviewImages = (index) => {
	let tempImgList = [...box.value.image_url];//所有图片地址
	if (index === 0) return tempImgList;
	// 调整图片顺序，把当前图片放在第一位
	let start = tempImgList.splice(index);
	let remain = tempImgList.splice(0, index);
	return start.concat(remain);
}

const props = defineProps({
	id: {
		type: String,
		required: true,
		default: ''
	}
})

// 获取更新记录
const fetchUpdateRecords = async (id) => {
	try {
		const response = await requests.get(
			`${localUrl}/tags/images/${id}/update-history`
		)
		if (response.status === 200 && response.data.update_history) {
			updateRecords.value = response.data.update_history;
			// console.log(updateRecords.value);
		}
	} catch (error) {
		console.error('获取更新记录失败:', error)
	}
}

onMounted(() => {
	// console.log(props.id)
	const firstLoading = ElLoading.service({
		text: '少女祈祷中...'
	})
	requests.get(
		`${baseUrl}/api2/website_image/${props.id}`,
		{
			params: {
				// id: props.id
			}
		}
	).then(response => {
		// console.log(response.data)
		if (response.status === 200) {
			box.value = response.data.data
			let origin_urls = JSON.parse(box.value.image_url.replace(/'/g, '"'))
			let after_urls = origin_urls.map(item => {
				return `${imageUrl}/${item.split('/')[item.split('/').length - 1]}`
			})

			if (getIp() !== 'CN' && getIp() !== '') {
				box.value.image_url = after_urls
			}else{
				box.value.image_url = origin_urls
			}
			// console.log(origin_url)
			// box.value.image_url =  after_urls;
			box.value.description = box.value.description.replace(/\n/g, '<br>')
		}
		firstLoading.close()
		requests.get(
			`${localUrl}/tags/images/${props.id}/tags`
		).then(response => {
			if (response.status === 200) {
				console.log(response.data)
				tags.value = response.data.tags
			}
		})
		// 获取更新记录
		fetchUpdateRecords(props.id)
	})
})

</script>

<style scoped lang="scss">
@media screen and (max-width: 768px) {

	.main-page-layout {
		.page-container {


			.introduction {
				padding: 8px;
			}

			.image-list {
				padding: 8px;

				& > h3 {
					margin-bottom: 4px;
				}

				& > .image-list-container {
					padding: 0;
				}
			}


		}
	}
}

.page-container {

	width: 100%;
	//padding: 20px;
	h3 {
		margin-top: 0;
	}

	.tags{
		h3{
			border-bottom: 1px solid #ccc;
			padding-bottom: 5px;
		}
		.tags-container{
			display: flex;
			justify-content: left;
			flex-wrap: wrap;
			gap: 12px;
			span{
				cursor: pointer;
				color: #61666D;
			}
		}

		margin-top: 20px;
		padding: 12px 20px;
		//background-color: rgba(255, 192, 203, 0.2);
		background-color: rgba(240, 248, 255, 0.3);
		border-radius: 10px;
	}

	.update-history {
		margin-top: 20px;
		padding: 12px 20px;
		background-color: rgba(240, 248, 255, 0.3);
		border-radius: 10px;
		
		h3 {
			border-bottom: 1px solid #ccc;
			padding-bottom: 5px;
		}
		
		.update-list {
			.update-item {
				padding: 8px 0;
				border-bottom: 1px dashed #eee;
				
				&:last-child {
					border-bottom: none;
				}
				
				.update-info {
					display: flex;
					justify-content: space-between;
					margin-bottom: 4px;
					
					.update-date {
						color: #888;
						font-size: 14px;
					}
					
					.update-author {
						color: #666;
						font-weight: 500;
					}
				}
				
				.update-content {
					color: #333;
					font-size: 14px;
				}
			}
		}
	}

	.header {
		position: relative;
		border-radius: 10px;
		overflow: hidden;

		img {
			width: 100%;
			height: auto;
		}

		.promotion-text {
			position: absolute;
			top: 50%;
			left: 50%;
			transform: translate(-50%, -50%);
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
			color: #fff;
			font-size: 18px;
			font-weight: bold;
			text-align: center;

			p {
				margin: 5px 0;
			}
		}
	}

	.introduction {
		margin-top: 20px;
		background-color: #f0f8ff;
		border-radius: 10px;
		padding: 12px 20px;

		.description {
			width: 100%;
			height: fit-content;
		}

		h3 {
			border-bottom: 1px solid #ccc;
			padding-bottom: 5px;
		}

		p {
			margin: 4px auto;
		}
	}

	.image-list {
		margin-top: 20px;
		background-color: #f0f8ff;
		border-radius: 10px;
		padding: 12px 20px;

		box-sizing: border-box;

		.image-list-container {
			padding: 0 130px;

			.listed-image {
				width: 100%;
				object-fit: cover;
				height: auto;
			}

		}

		h3 {
			border-bottom: 1px solid #ccc;
			padding-bottom: 5px;
		}

		p {
			margin-top: 10px;
		}
	}

	.download {
		margin-top: 20px;
		background-color: #f0f8ff;
		border-radius: 10px;
		padding: 20px;

		h3 {
			border-bottom: 1px solid #ccc;
			padding-bottom: 5px;
		}

		.download-content {
			display: flex;
			flex-direction: column;
			align-items: center;
			margin-top: 20px;

			.login-info {
				display: flex;
				align-items: center;

				i {
					font-size: 24px;
					margin-right: 10px;
				}

				p {
					font-size: 16px;
				}
			}

			button {
				margin-top: 20px;
				padding: 10px 20px;
				background-color: #007bff;
				color: #fff;
				border: none;
				border-radius: 5px;
				cursor: pointer;
			}
		}
	}
}
.comments{
	margin-left: -0.5em;
	margin-right: -0.5em;
}
</style>