<template>
	<div class="upload-container">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>编辑帖子</span>
				</div>
			</template>

			<!-- 搜索输入框 -->
			<search-input
				@click-search="handleSearch"
			/>

			<!-- 搜索结果列表 -->
			<div v-if="query_list.length" class="search-results">
				<ul>
					<li v-for="result in query_list" :key="result.id" @click="selectPost(result)">
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
			<div v-if="selectedPost" class="editor-area">
				<h2>编辑帖子</h2>
				<el-form
					:model="formData"
					label-width="80px"
					class="data-form"
				>
					<!--					<el-form-item label="图片">-->
					<!--						<el-image v-for="item in formData.image_url" :src="item" class="image-container"></el-image>-->
					<!--					</el-form-item>-->
					<el-form-item label="图片">
						<div v-for="(item, index) in formData.image_url" :key="index" class="image-container">
							<el-image :src="item" class="image"/>
							<div class="arrows" v-if="formData.image_url.length > 1">
								<el-icon class="arrow left" @click="moveImage(index, -1)" v-if="index > 0">
									<ArrowLeft/>
								</el-icon>
								<el-icon class="arrow right" @click="moveImage(index, 1)"
								         v-if="index < formData.image_url.length - 1">
									<ArrowRight/>
								</el-icon>
							</div>
						</div>
					</el-form-item>
					<el-form-item label="类型">
						<el-select v-model="formData.type" placeholder="请选择类型">
							<el-option
								v-for="item in type_options"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>

					<el-form-item label="角色">
						<el-select v-model="formData.character" placeholder="请选择类型">
							<el-option
								v-for="item in character_options"
								:key="item.id"
								:label="item.name"
								:value="item.id"
							/>
						</el-select>
					</el-form-item>

					<el-form-item label="标题">
						<el-input v-model="formData.title" placeholder="请输入标题"/>
					</el-form-item>

					<el-form-item label="画师">
						<el-input v-model="formData.illustrator" placeholder="请输入画师名称"/>
					</el-form-item>

					<el-form-item label="描述">
						<el-input
							v-model="formData.description"
							type="textarea"
							:rows="4"
							placeholder="请输入详细描述"
						/>
					</el-form-item>
				</el-form>

				<div class="submit-area">
					<el-button type="primary" @click="savePost">保存</el-button>
					<el-button type="danger" @click="delPost">删除</el-button>
				</div>
			</div>
		</el-card>
	</div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import SearchInput from '@/components/common/SearchInput.vue';
import requests from "@/utils/requests.js";
import {baseUrl} from "@/utils/methods.js";
import {ArrowLeft, ArrowRight} from "@element-plus/icons-vue";
import axios from "axios";

onMounted(() => {
	getInfo()
})
const character_options = ref([])
const type_options = ref([])
const getInfo = async () => {
	const characterId = await requests.get(
		`${baseUrl}/api2/character/tree`,
	)
	if (characterId.status === 200) {
		// console.log(treeToList(characterId.data.data))
		character_options.value = treeToList(characterId.data.data)
	}
	const typeId = await requests.get(
		`${baseUrl}/api2/image_type/tree`,
	)
	if (typeId.status === 200) {
		// console.log(treeToList(typeId.data.data))
		type_options.value = treeToList(typeId.data.data)
	}
}

// 树转数组
const treeToList = (tree) => {
	let list = []
	for (let item of tree) {
		// console.log(item)
		list.push({name: item.name, id: item.id})
		if (item.children.length !== 0) {
			list.push(...treeToList(item.children))
		}
	}
	return list
}

const formData = ref({})
const query_list = ref([])
const selectedPost = ref(null);

const handleSearch = async (value) => {
	// 模拟搜索请求，实际应用中应替换为真实的 API 请求
	// 这里使用静态数据作为示例
	let response = requests.post(
		`${baseUrl}/api2/website_image/page`,
		{
			page_id: 1,
			page_size: 12,
			search_content: value,
			search_type: 'all'
		}
	)
	response.then(response => {
		if (response.status === 200) {
			query_list.value = response.data.data.list;
			query_list.value.forEach(item => {
				item.image_url = JSON.parse(item.image_url.replace(/'/g, '"'));
			})
		}
	})
};

const delPost = async () => {
		// 在此处处理删除帖子的逻辑
		let inputValue = ''
		console.log('删除帖子:', selectedPost.value);
		let response = await ElMessageBox.prompt('输入验证码', 'Tip', {
			confirmButtonText: 'OK',
			cancelButtonText: 'Cancel',
		})

		inputValue = response.value
		const delRes = await requests.post(
			`${baseUrl}/api2/website_image/delete/${formData.value._id}`,
			{
				token: inputValue
			}
		)
		// console.log(delRes)
		if (delRes.data.code === 200) {
			ElMessage.success('删除成功')
		} else {
			ElMessage.error('验证码错误')
		}
// 这里可以添加实际的删除逻辑，比如发送请求到服务器
	}
;

// 点击事件
const selectPost = (post) => {
	selectedPost.value = {...post};
	formData.value = {...post}
};

const savePost = () => {
	// 在此处处理保存帖子的逻辑
	console.log('保存帖子:', formData.value);
	requests.put(
		`${baseUrl}/api2/website_image/update`,
		{
			data: {
				...formData.value,
				id: formData.value._id,
			},
			token: localStorage.getItem('token2')
		}
	)
	// 这里可以添加实际的保存逻辑，比如发送请求到服务器
};

//移动图片逻辑
const moveImage = (index, direction) => {
	const newIndex = index + direction;
	if (newIndex >= 0 && newIndex < formData.value.image_url.length) {
		const temp = formData.value.image_url[index];
		formData.value.image_url[index] = formData.value.image_url[newIndex];
		formData.value.image_url[newIndex] = temp;
	}
};


</script>

<style scoped lang="scss">
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
					//background-color: #f0f0f0;
					opacity: 0.5;
				}
			}
		}
	}

	.editor-area {
		.image-container {
			position: relative;
			display: inline-block;
			margin-right: 10px;

			.image {
				max-width: 200px;
				height: auto;
			}

			.arrows {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				width: 100%;
				display: flex;
				justify-content: space-between;

				.arrow {
					cursor: pointer;
					background-color: rgba(0, 0, 0, 0.5);
					color: white;
					padding: 5px;
					border-radius: 50%;
				}

				.left {
					//left: 0;
					left: 4px;
				}

				.right {
					//right: 0;
					right: 4px;
					margin-left: auto;
				}

			}
		}
	}

	.data-form {
		:deep(.el-form-item__label) {
			font-weight: bold;
		}

		.el-select, .el-input {
			width: 100%;
		}

		.image-container {
			max-width: 180px;
			overflow: hidden;
			object-fit: cover;
			margin: 4px 8px;

			&:hover {
				opacity: 0.8;
				//background: #000;
				cursor: pointer;
			}
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
</style>
