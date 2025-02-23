<template>
	<div class="box-content" @click="clickToDetails">
		<div class="box-image">
			<!-- 这里可以添加图片，例如使用img标签 -->
<!--			<el-image :src="props.src + '?imageMogr2/thumbnail/!30p'" alt="" lazy fit="cover"/>-->
<!--			<el-image :src="props.src" alt="" lazy fit="cover"/>-->
			<el-image
				:src="imageSrc"
				alt=""
				lazy
				fit="cover"/>
		</div>
		<div class="box-info">
			<div class="box-title">
				<div class="info-title">{{ title }}</div>

			</div>
			<div class="info-detail">
				<div><span class="info-detail-span">{{ box.type }}</span></div>
				<span>{{ author }}</span>
			</div>
		</div>
	</div>
</template>

<script setup>
import {defineProps,onMounted,ref} from 'vue';
import {useRouter} from "vue-router";
import {useGetIpStore} from "@/stores/useGetIpStore.js";
const {getIp} = useGetIpStore()

const router = useRouter();
const props = defineProps({
	title: {
		type: String,
		required: true
	},
	time: {
		type: String,
		required: true
	},
	src: {
		type: String,
		required: true
	},
	author: {
		type: String,
		required: true,
		default: 'default'
	},
	box: {
		type: Object,
		required: true
	},
	ip: {
		type: String,
		required: true,
		default: 'CN'
	}
});

const imageSrc = ref('');
onMounted(()=>{
	if (getIp() !== 'CN' && getIp() !== '') {
		imageSrc.value = 'https://img.wonderlands-sekai.space/' + props.src.split('/')[props.src.split('/').length - 1]
	}else{
		imageSrc.value = props.src
	}
})
const clickToDetails = () => {
	// console.log(props.box._id)
	router.push({path: `/details/${props.box._id}`})
};
</script>

<style lang="scss" scoped>
@media screen and (max-width: 768px) {
	.box > .box-content > .box-image {
		min-height: 100px;
	}
	.info-detail {
		display: flex;
		flex-direction: column;

		& .info-detail-span {
			margin-right: 0 !important;
		}
	}
	.box-title {
		max-width: 100%;
		display: block !important;

		.info-title {
			//text-overflow: ellipsis;
			//overflow: hidden;
			//word-break: break-all;
			//word-wrap: break-word;
			//-webkit-line-clamp: 2;
			////width: fit-content;
			display: -webkit-box;
			-webkit-line-clamp: 2; /* 限制行数为3 */
			-webkit-box-orient: vertical;
			overflow: hidden;
			margin: 0 !important;
		}
	}

}


.box-content {
	text-align: center;


	.box-image {
		height: 100px;
		background-color: white;
		/* 这里可以设置图片的样式，例如：
		background-image: url('your-image-url');
		background-size: cover;
		background-position: center;
		*/
		min-height: 260px;
		//background-size: contain;
		//background-position: center;
		//background-repeat: no-repeat;
		//height: fit-content;
		margin-bottom: 10px;
		display: flex;
		justify-content: center;
		align-items: center;


		img {
			max-width: 100%;
			max-height: 100%;
			object-fit: cover
		}

		.el-image {
			max-width: 100%;
			max-height: 100%;

			.el-image__inner {
				max-width: 100%;
				max-height: 100%;
				object-fit: cover
			}
		}
	}

	.box-info {
		font-size: 14px;

		div {
			margin: 2px 0;
		}

		.box-title {
			display: flex;
			justify-content: center;

			.info-title {
				margin-right: 8px;
			}
		}

		.info-title {
			font-weight: bold;
			//margin-bottom: 5px;
		}

		.info-detail {
			display: flex;
			justify-content: center;
			align-items: center;

			.info-detail-span {
				margin-right: 16px;
			}

			.info-time {
				margin-right: 10px;
			}

			.info-percentage {
				font-weight: bold;
			}

			.positive {
				color: green;
			}

			.negative {
				color: red;
			}

			.info-detail-btn {
				cursor: pointer;
				margin-left: 10px;
			}
		}
	}
}
</style>