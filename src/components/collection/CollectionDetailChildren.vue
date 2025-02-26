<template>
	<div class="page-container">
<!--		<details-title-->
<!--			:title="props.details.title"-->
<!--			:date="props.details.create_date"-->
<!--			:character="props.details.character"-->
<!--			:type="props.details.type"-->
<!--		></details-title>-->
		<!-- 头部宣传区域 -->

		<!-- 画集介绍区域 -->
<!--		<div class="introduction">-->
<!--			<h3>Introduction</h3>-->
<!--			&lt;!&ndash;			<p>日本画师椎名優(椎名优、しいな ゆう、Shiina Yuu)的小画集，跨页图有拼接痕迹。</p>&ndash;&gt;-->
<!--			<p>画师： {{ props.details.artiest }}</p>-->
<!--			&lt;!&ndash;			<p>上传日期： {{box.create_date}}</p>&ndash;&gt;-->
<!--			<p>类型： {{ props.details.type }}</p>-->
<!--			<div style="border-top: 1px solid #ccc;margin: 8px 0 "></div>-->
<!--			<div class="description" v-html="props.details.description">-->
<!--			</div>-->
<!--		</div>-->
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
			<h3 style="margin: 4px 0">Image</h3>
			<p style="margin: 4px 0">画师： {{ props.details.artiest }}</p>
			<div class="image-list-container">
				<!--				<img src="@/assets/img_1.png" class="listed-image">-->
				<!--				<img src="@/assets/e0a9ce33a7fef53e5557e9bc2b9dafbe3546749308242173.jpg" class="listed-image">-->
				<!--				<img src="@/assets/img.png" class="listed-image">-->
<!--				轮播图-->
				<el-carousel trigger="click"   class="cdc-carousel" @click="console.log(image_url)">
					<el-carousel-item v-for="(path,index) in image_url" :key="index" >
						<el-image
							class="listed-image"
							:src="path + '?imageMogr2/thumbnail/!50p'"
						/>
					</el-carousel-item>
				</el-carousel>
			</div>
		</div>

	</div>
</template>

<script setup>
import {ref,onMounted,defineProps} from "vue";
import {parseImageUrl} from "@/utils/methods.js";

const props = defineProps({
	details: {
		type: Array,
		required: true,
	}
})
const image_url = ref([])
onMounted(() => {
	console.log(props.details)
	image_url.value = parseImageUrl(props.details.image_url)
	console.log(image_url)
})

// 调整图片顺序
const getPreviewImages = (index) => {
	let tempImgList = [...props.details.image_url];//所有图片地址
	if (index === 0) return tempImgList;
	// 调整图片顺序，把当前图片放在第一位
	let start = tempImgList.splice(index);
	let remain = tempImgList.splice(0, index);
	return start.concat(remain);
}
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

:deep(.el-image__inner){
	max-height: 400px;
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
		//margin-top: 20px;
		background-color: #f0f8ff;
		border-radius: 10px;
		padding: 12px 20px;
		box-sizing: border-box;

		.image-list-container {
			//padding: 0 130px;
			//margin: 0 auto;
			width: 100%;
			//margin: 0 auto;
			//display: flex;
			//justify-content: center;
			:deep(.el-carousel__container){
				height: 400px;
			}
			.cdc-carousel{
				height: 400px;
				:deep(.el-carousel__item){
					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
			.listed-image {
				max-height: 100%;
				//width: 100%;
				border-radius: 8px;
				//height: 400px;
				margin: 0 auto;
				//display: flex;
				//justify-content: center;
				//align-items: center;
				:deep(.el-image__inner){
					object-fit: cover !important;
				}
				img {
					object-fit: cover !important;
				}
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
	:deep(.el-carousel__container){
		height: 200px !important;
	}
	.cdc-carousel{
		height: 200px !important;
		:deep(.el-carousel__item){
			display: flex;
			justify-content: center;
			align-items: center;
		}
	}
	.listed-image {
		//width: 100%;
		border-radius: 8px;
		height: 400px;
		margin: 0 auto;
		display: flex;
		justify-content: center;
		align-items: center;
		:deep(.el-image__inner){
			object-fit: cover !important;
		}
		img {
			object-fit: cover !important;
		}
	}
}
</style>

<!--template 好像没用


<template #toolbar ="{ actions, prev, next, reset, activeIndex }" >
							<el-icon @click="prev">
								<DArrowLeft/>
							</el-icon>
							<el-icon @click="next">
								<DArrowRight/>
							</el-icon>
							<el-icon @click="actions('zoomOut')">
								<ZoomOut/>
							</el-icon>
							<el-icon
								@click="actions('zoomIn', { enableTransition: false, zoomRate: 2 })"
							>
								<ZoomIn/>
							</el-icon>
							<el-icon
								@click="actions('clockwise', { rotateDeg: 180, enableTransition: false })">
								<RefreshRight/>
							</el-icon>
							<el-icon @click="actions('anticlockwise')">
								<RefreshLeft/>
							</el-icon>
							<el-icon @click="reset">
								<Refresh/>
							</el-icon>
							<el-icon @click="download(activeIndex)">
								<Download/>
							</el-icon>
						</template>




-->