<template>
	<!-- 'border': `1px solid ${characterColors.find(item => item.name === box.character).color}`, 	-->
	<div class="boxes-container">
		<div class="box" v-for="(box, index) in boxes" :key="index"
			:style="{ '--var-color': `${characterColors.find(item => item.name === box.character).color}` }">


			<FilterBoxContent :author="box.illustrator" :title="box.title" :time="box.create_date" :src="box.cover"
				:box="box" />
		</div>
	</div>

	<div class="pagination" :style="{ display: showPagination === false ? 'none' : 'flex' }">
		<el-pagination layout="prev, pager, next" background :total="totalDataCount" v-model:current-page="currPage"
			:default-page-size=12 :pager-count="userAgent === 'PC' ? 8 : 4"></el-pagination>
	</div>
</template>

<script setup>
import BoxContent from './BoxContent.vue';
import { onMounted, ref, watch } from "vue";
import axios from "axios";
import { baseUrl, characterColors } from "@/utils/methods.js";
import { useRoute, useRouter } from "vue-router";
import requests from "@/utils/requests.js";
import FilterBoxContent from "@/components/filter/FilterBoxContent.vue";
import CollectionBox from "@/components/collection/CollectionBox.vue";
// import {log} from "node:util";

const route = useRoute();
const router = useRouter()

const page_id = route.params.page_id
const filter_type = route.params.type
const boxes = ref([])
const totalDataCount = ref(0)
const currPage = ref(0)

const showPagination = ref(false)


let userAgent = navigator.userAgent

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
	//alert(navigator.userAgent);
	userAgent = "iOS";
} else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
	//alert(navigator.userAgent);
	userAgent = "Android";
} else { //pc
	userAgent = "PC";
}


const justifyType = () => {

	if (page_id && filter_type) {
		// 从过滤器页面过来的
		return 0
	} else if (page_id) {
		// 从选择页数进入的
		return 1
	} else {
		// 从主页
		return 2
	}
}

const mainPageFunc = () => {
	// 从主页进来的
	// 获取总数
	let firstLoading = ElLoading.service({
		text: '少女祈祷中...'
	})

	currPage.value = Number(1)
	// 调取下一步
	requests.get(
		// `${baseUrl}/api/get/recent/website_image/page/all/1`
		`${baseUrl}/api2/website_image/page`,
		{
			params: {
				search_type: 'all',
				page_id: 1,
				page_size: 12
			}
		}
	).then(response => {
		if (response.status === 200) {

			totalDataCount.value = response.data.data.total
			response.data.data.list.map(item => {
				// let val = Object.assign({}, item)
				// val.image_url	= JSON.parse(item.image_url)

				item.cover = JSON.parse(item.image_url.replace(/'/g, '"'))[0];

				boxes.value.push(item)
			})
			// 渲染完成，关闭
			showPagination.value = true
		}
		firstLoading.close()
	}).catch(error => {

		firstLoading.close()
		ElMessage.error({
			message: '网络开小差了，请刷新重试',
			type: 'error',
			duration: 2000
		})
	})
}

const pageFunc = () => {
	// let firstLoading = ElLoading.service({
	// 	text: '少女祈祷中...'
	// })
	currPage.value = Number(page_id)
	// requests.get(
	// 	`${baseUrl}/api/get/website_image_count/all`,
	// ).then(response => {
	// 	if (response.status === 200) {
	// 		totalDataCount.value = response.data.count
	// 	}
	// 	firstLoading.close()
	// 	updateValue()
	//
	// }).catch(error => {
	// 	firstLoading.close()
	// 	ElMessage.error({
	// 		message: '网络开小差了，请刷新重试',
	// 		type: 'error',
	// 		duration: 2000
	// 	})
	// })
	updateValue()
}

const filterFunc = () => {

}

onMounted(() => {
	// 先获取进入方式
	const intoType = justifyType()
	// 首页进入
	if (intoType === 2) {
		mainPageFunc()
	} else if (intoType === 1) {
		pageFunc()
		// currPage.value = Number(page_id)
	} else if (intoType === 0) {
		filterFunc()
	}
})

watch(currPage, (newValue, oldValue) => {
	if (oldValue !== 0) {
		boxes.value.length = 0 // 清除box
		scrollTo(0, 0)
		router.push({
			path: `/pages/${newValue}`
		})
		// updateValue(newValue)
	}
}, {
	immediate: false
}
)


const updateValue = (updateId = page_id) => {
	let firstLoading = ElLoading.service({
		text: '少女祈祷中...'
	})
	requests.get(
		`${baseUrl}/api2/website_image/page`,
		{
			params: {
				search_type: 'all',
				page_id: updateId,
				page_size: 12
			}
		}
	).then(response => {
		if (response.status === 200) {
			totalDataCount.value = response.data.data.total
			response.data.data.list.map(item => {
				item.cover = JSON.parse(item.image_url.replace(/'/g, '"'))[0];
				boxes.value.push(item)
			})
			// 渲染完成
			showPagination.value = true
		}
		firstLoading.close()
	}).catch(error => {
		firstLoading.close()
		ElMessage.error({
			message: '网络开小差了，请刷新重试',
			type: 'error',
			duration: 2000
		})
	})
}

</script>

<style lang="scss" scoped>
:root {
	--var-color: #000;
}

.pagination {
	display: flex;
	justify-content: center;
	margin: 16px auto 4px;
	box-sizing: border-box;
	max-width: 100% !important;
}

.boxes-container {
	display: flex;
	flex-wrap: wrap;
	gap: 10px;
	cursor: pointer;

	& > .box {
		flex: 0 0 calc(33.333% - 7px); // 三列布局，考虑间距
		border: 1px solid #eee;
		padding: 10px;
		border-radius: 4px;
		transition: box-shadow 0.2s ease-in-out;
		box-sizing: border-box;

		&:hover {
			box-shadow: 0 0 5px var(--var-color);
		}
	}
	
	// 添加媒体查询，针对移动设备优化布局
	@media screen and (max-width: 768px) {
		& > .box {
			flex: 0 0 calc(50% - 5px); // 平板设备显示两列
			padding: 8px;
		}
	}

	@media screen and (max-width: 480px) {
		& > .box {
			flex: 0 0 100%; // 手机设备显示单列
			padding: 10px;
		}
	}
}

// 确保图片在容器内正确显示
:deep(.box-content) {
	width: 100%;

	img {
		width: 100%;
		height: auto;
		object-fit: cover;
		min-height: 150px; // 添加最小高度确保图片显示完整
	}
}

// 针对移动端优化图片显示
@media screen and (max-width: 768px) {
	:deep(.box-content) {
		.box-image {
			min-height: 120px;
			display: flex;
			align-items: center;
			justify-content: center;
			
			img {
				max-height: 200px;
				object-position: center;
			}
		}
	}
}

@media screen and (max-width: 480px) {
	:deep(.box-content) {
		.box-image {
			min-height: 180px; // 在手机上增加最小高度
			
			img {
				max-height: 250px;
			}
		}
	}
}

//.box:hover {
//	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
//}
</style>