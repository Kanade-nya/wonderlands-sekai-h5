<script setup>
import {ref, onMounted, watch} from 'vue';
import {useRouter} from 'vue-router';
import requests from "@/utils/requests.js";
import {baseUrl, characterColors} from "@/utils/methods.js";
import BoxContent from "@/components/home/BoxContent.vue";
import {ElLoading, ElMessage} from 'element-plus';
import FilterBoxContent from "@/components/filter/FilterBoxContent.vue";

const router = useRouter();

const props = defineProps({
	content: {
		type: String,
		default: ''
	},
	page_id: {
		type: Number,
		default: 1
	}
})

const boxes = ref([]);
const totalDataCount = ref(0);
const currPage = ref(1);
const showPagination = ref(false);

let userAgent = navigator.userAgent;

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
	userAgent = "iOS";
} else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
	userAgent = "Android";
} else { //pc
	userAgent = "PC";
}

const updateValue = (updateId = 1) => {
	let firstLoading = ElLoading.service({
		text: '少女祈祷中...'
	});
	requests.post(
		`${baseUrl}/api2/website_image/page`,
		{
			"page_id": props.page_id,
			"page_size": 12,
			"search_type": "all",
			"search_content": props.content
		},
	).then(response => {
		if (response.status === 200) {
			if (response.data.data.total === 0) {
				ElMessage.info({
					message: '无搜索结果！',
					type: 'info',
					duration: 2000
				});
			} else {
				totalDataCount.value = response.data.data.total;

				boxes.value = response.data.data.list;
				boxes.value.map((item) => {
					item.cover = JSON.parse(item.image_url.replace(/'/g, '"'))[0];
				})
				// 渲染完成
				showPagination.value = true;
			}
		}
		firstLoading.close();
	}).catch(error => {
		console.log(error);
		ElMessage.error({
			message: '网络开小差了，请刷新重试',
			type: 'error',
			duration: 2000
		});
		firstLoading.close();
	});
}

onMounted(() => {
	currPage.value = Number(props.page_id)
	updateValue();
});

watch(currPage, (newValue, oldValue) => {
	if (oldValue !== 0) {
		boxes.value.length = 0; // 清除box
		scrollTo(0, 0);
		router.push({
			path: `/search/${props.content}/pages/${newValue}`,
			// query: {content: props.content}
		});
		// updateValue(newValue);
	}
}, {
	immediate: false
});
</script>

<template>
	<div class="boxes-container">
		<div class="box" v-for="(box, index) in boxes"
		     :key="index"
		     :style="{'--var-color': `${characterColors.find(item => item.name === box.character)?.color || '#000'}` }"
		>
			<FilterBoxContent :author="box.illustrator"
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
			:page-size="12"
			:pager-count="userAgent === 'PC' ? 8 : 4"
		></el-pagination>
	</div>
</template>

<style scoped lang="scss">
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
	}
}
</style>
