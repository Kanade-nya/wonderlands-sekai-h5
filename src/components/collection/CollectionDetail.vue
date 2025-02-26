<!--具体实现-->
<script setup lang="ts">
import {ref, onMounted, onBeforeUnmount,computed} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import requests from '@/utils/requests'
import {localUrl} from '@/utils/methods'
import DetailsTitle from "@/components/details/DetailsTitle.vue";
import CollectionDetailChildren from "@/components/collection/CollectionDetailChildren.vue";


import {Waline} from '@waline/client/component';

import '@waline/client/style';

const serverURL = 'https://comments.wonderlands-sekai.space';
const path = computed(() => useRoute().path);

const router = useRouter()
const route = useRoute()
const id = route.params.id
const refValue = ref({})
const box = ref({})
onMounted(async () => {
	const response = await requests.get(
		`${localUrl}/collections/get/${id}`
	)
	if (response.status === 200) {
		box.value = response.data
		console.log(box.value)
	}
})



</script>

<template>
	<div class="page-container">
		<details-title
			:title="box.name"
			:date="box.create_date"
		></details-title>
		<!-- 头部宣传区域 -->

		<!-- 画集介绍区域 -->
		<div class="introduction" style="background:rgba(255,192,203,0.4);">
			<h3>Info</h3>
			<div>
				为节省流量，合集区域画质有所压缩，建议下载图片使用搜索功能。
			</div>
		</div>
		<!-- 画集介绍区域 -->
		<div class="introduction">
			<h3>Introduction</h3>
			<div class="description">
				{{ box.description }}
			</div>
		</div>

		<!--  子children -->
		<div class="detail-children-wrapper">
			<collection-detail-children
				v-for="item in box.collection_list"
				class="detail-children"
				:details="item"
			/>
		</div>

		<div style="margin: 4px auto"></div>
		<!--		评论区域-->
		<Waline :serverURL="serverURL" :path="path" :reaction="[]"/>
	</div>
</template>

<style scoped lang="scss">


.detail-children-wrapper {
	margin-top: 10px;
	display: flex;
	//flex-direction: column;
	gap: 12px;
	flex-wrap: wrap;
	justify-content: center;
	align-items: center;

	.detail-children {
		width: calc(50% - 6px);
		//margin: 0 auto;
	}
}


.page-container {
	width: 100%;
	//padding: 20px;
	h3 {
		margin-top: 0;
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

@media screen and (max-width: 768px) {

	.detail-children-wrapper {
		margin-top: 4px;
		display: flex;
		//flex-direction: column;
		gap: 12px;
		flex-wrap: wrap;
		justify-content: center;
		align-items: center;

		.detail-children {
			width: calc(100%);
			//margin: 0 auto;
		}
	}
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
</style>