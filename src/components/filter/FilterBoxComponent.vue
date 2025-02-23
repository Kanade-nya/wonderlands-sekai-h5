<template>
	<!-- 'border': `1px solid ${characterColors.find(item => item.name === box.character).color}`, 	-->
	<div class="boxes-container">
		<div class="box" v-for="(box, index) in boxes"
		     :key="index"
		     :style="{'--var-color': `${characterColors.find(item => item.name === box.character).color}` }"
		>
			<filter-box-content :author="box.illustrator"
			                    :title="box.title"
			                    :time="box.create_date"
			                    :src="box.cover"
			                    :box="box"/>
		</div>
	</div>

	<div class="pagination" :style="{display: showPagination === false ? 'none': 'flex' }">
		<el-pagination
			layout="prev, pager, next"
			background
			:total="totalDataCount"
			v-model:current-page="currPage"
			:default-page-size=12
			:pager-count="userAgent === 'PC' ? 8 : 4"
		></el-pagination>
	</div>
</template>

<script setup>
import FilterBoxComponent from "@/components/filter/FilterBoxComponent.vue";
import {onMounted, ref, watch} from "vue";
import axios from "axios";
import {baseUrl, characterColors} from "@/utils/methods.js";
import {useRoute, useRouter} from "vue-router";
import requests from "@/utils/requests.js";
import FilterBoxContent from "@/components/filter/FilterBoxContent.vue";
// import {log} from "node:util";

const route = useRoute();
const router = useRouter()

const page_id = route.params.page_id
let filter_type = route.params.type
const boxes = ref([])
const totalDataCount = ref(0)
const currPage = ref(0)

const showPagination = ref(false)

const type = route.query.type || 'None'

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

import {useGetIpStore} from "@/stores/useGetIpStore.js";
const {getIp} = useGetIpStore()

const justifyType = () => {
	// ?console.log(page_id,filter_type)
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

const filterFunc = () => {
	currPage.value = Number(page_id)
	updateValue()
}

onMounted(() => {
	// 先获取进入方式
	const intoType = justifyType()
	// 首页进入
	if (intoType === 0) {
		filterFunc()
	}
})

watch(currPage, (newValue, oldValue) => {
		// console.log(newValue, oldValue)
		if (oldValue !== 0) {
			boxes.value.length = 0 // 清除box
			scrollTo(0, 0)
			router.push({
				path: `/filter/${filter_type}/pages/${newValue}`,
				query: {type: type}
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
	console.log(filter_type)
	if (type === 'type') {
		requests.post(
			// `${baseUrl}/api/get/recent/website_image/page/${filter_type}/${updateId}`,
			`${baseUrl}/api2/website_image/page`,
			{

				// search_type: filter_type,
				// search_content: filter_type,
				page_id: updateId,
				page_size: 12,
				image_type_id: filter_type

			}
		).then(response => {
			if (response.status === 200) {
				// console.log(response.data.data.list)
				totalDataCount.value = response.data.data.total
				response.data.data.list?.map(item => {
					item.cover = JSON.parse(item.image_url.replace(/'/g, '"'))[0];
					boxes.value.push(item)
				})
				// 渲染完成
				showPagination.value = true
			}
			firstLoading.close()
		}).catch(error => {
			console.log(error)
			ElMessage.error({
				message: '网络开小差了，请刷新重试',
				type: 'error',
				duration: 2000
			})
			firstLoading.close()
		})
	} else {
		requests.post(
			// `${baseUrl}/api/get/recent/website_image/page/${filter_type}/${updateId}`,
			`${baseUrl}/api2/website_image/page`,
			{
				// search_content: filter_type,
				page_id: updateId,
				page_size: 12,
				character_id: filter_type
			},
			{
				headers: {
					'Content-Type': 'application/json'
				}
			}
		).then(response => {
			if (response.status === 200) {
				// console.log(response.data.data.list)
				totalDataCount.value = response.data.data.total
				response.data.data.list?.map(item => {
					item.cover = JSON.parse(item.image_url.replace(/'/g, '"'))[0];
					boxes.value.push(item)
				})
				// 渲染完成
				showPagination.value = true
			}
			firstLoading.close()
		}).catch(error => {
			console.log(error)
			ElMessage.error({
				message: '网络开小差了，请刷新重试',
				type: 'error',
				duration: 2000
			})
			firstLoading.close()
		})
	}

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
	display: grid;
	grid-template-columns: repeat(3, 1fr);
	gap: 10px;
	cursor: pointer;

	transition: box-shadow 0.2s ease-in-out;

	& > .box {
		border: 1px solid #eee;
		padding: 10px;
		border-radius: 4px;
		transition: box-shadow 0.2s ease-in-out;

		&:hover {
			box-shadow: 0 0 5px var(--var-color);
		}

	}


}

//.box:hover {
//	box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
//}
</style>