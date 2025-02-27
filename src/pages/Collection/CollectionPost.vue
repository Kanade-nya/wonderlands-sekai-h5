<template>
	<div class="upload-container">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>创建合集</span>
				</div>
			</template>

			<!-- 搜索输入框 -->
			<search-input
				@click-search="handleSearch"
			/>

			<!-- 搜索结果列表 -->
			<div v-if="query_list.length" class="search-results">
				<ul>
					<li v-for="result in query_list" :key="result.id" @click="selectImage(result)">
						<div>
							{{ result.title }}
						</div>
						<div>
							<img :src="result.image_url[0]" alt="">
						</div>
					</li>
				</ul>
			</div>

			<!-- 编辑区域 -->
			<div class="editor-area">
				<h2>创建合集</h2>
				<el-form
					:model="formData"
					label-width="80px"
					class="data-form"
				>
					<el-form-item label="名称">
						<el-input v-model="formData.name" placeholder="请输入合集名称" style="font-family: 'Noto Serif SC', sans-serif ; !important;" />
					</el-form-item>

					<el-form-item label="描述">
						<el-input
							v-model="formData.description"
							type="textarea"
							:rows="4"
							placeholder="请输入合集描述"
						/>
					</el-form-item>

					<el-form-item label="图片列表">
						<ul>
							<li v-for="(imageId,index) in formData.ids_list" :key="imageId">
								{{ imageId }}
								<el-button @click="removeImage(index)">删除</el-button>
								<el-image
									:src="getCoverImage(index)"
									alt=""
									class="image-style"
								/>

							</li>
						</ul>
					</el-form-item>
				</el-form>

				<div class="submit-area">
					<el-button type="primary" @click="submitCollection">提交</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import SearchInput from '@/components/common/SearchInput.vue';
import requests from "@/utils/requests.js";
import { baseUrl ,localUrl} from "@/utils/methods.js";
import axios from "axios";

onMounted(() => {
	// 初始化表单数据
	formData.value = {
		name: '',
		description: '',
		ids_list: [],
		cover_list: []
	};
});

const query_list = ref([]);
const formData = ref({});

const handleSearch = async (value) => {
	let response = await requests.post(
		`${baseUrl}/api2/website_image/page`,
		{
			page_id: 1,
			page_size: 120,
			search_content: value,
			search_type: 'all'
		}
	);
	if (response.status === 200) {
		query_list.value = response.data.data.list;
		query_list.value.forEach(item => {
			item.image_url = JSON.parse(item.image_url.replace(/'/g, '"'));
		});
	}
};

const selectImage = (image) => {
	if (!formData.value.ids_list.includes(image._id)) {
		formData.value.ids_list.push(image._id);
		formData.value.cover_list.push(image.image_url[0])
	}
};

const submitCollection = async () => {
	// console.log(formData.value)
	// return
	try {
		const response = await requests.post(
			`${localUrl}/collections/`,
			{
				name: formData.value.name,
				description: formData.value.description,
				list: formData.value.ids_list,
				token: localStorage.getItem('token2')
			}
		);
		if (response.status === 200) {
			ElMessage.success('合集创建成功');
			// 清空表单数据
			formData.value = {
				name: '',
				description: '',
				ids_list: [],
				cover_list: []
			};
			query_list.value = [];
		} else {
			ElMessage.error('合集创建失败');
		}
	} catch (error) {
		console.error('提交合集数据时出错:', error);
		ElMessage.error('提交合集数据时出错');
	}
};

const getCoverImage = (index) => {
	if (!formData.value || !formData.value.cover_list) return '';
	return formData.value.cover_list[index] || '';
};
const removeImage = (index) => {
	formData.value.ids_list.splice(index, 1);
	formData.value.cover_list.splice(index, 1);
};
</script>

<style scoped lang="scss">
.image-style{
	max-height: 100px;
	object-fit: cover;
	display: block;
	:deep(.el-image__inner){
		max-height: 100px !important;
		object-fit: cover;
	}
}
.upload-container {
	max-width: 800px;
	margin: 20px auto;
	padding: 20px;

	.box-card {
		padding: 20px;

		.card-header {
			font-size: 18px;
			cursor: default;
		}
	}

	.search-results {
		margin-bottom: 20px;

		ul {
			list-style-type: none;
			padding: 0;

			li {
				cursor: pointer;
				padding: 5px;
				border-bottom: 1px solid #ccc;

				img {
					max-height: 200px;
					overflow: hidden;
					object-fit: cover;
				}

				&:hover {
					opacity: 0.5;
				}
			}
		}
	}

	.editor-area {
		.data-form {
			:deep(.el-form-item__label) {
				font-weight: bold;
			}

			.el-select,
			.el-input {
				width: 100%;
				:deep(.el-input__inner){
					font-family: "Noto Serif SC", sans-serif !important;
				}
				font-family: "Noto Serif SC", sans-serif !important;
			}
		}

		.submit-area {
			margin-top: 30px;
			text-align: center;

			.el-button {
				width: 200px;
				height: 40px;
			}
		}
	}
}
</style>