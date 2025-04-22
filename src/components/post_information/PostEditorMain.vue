<template>
	<div class="upload-container">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>编辑帖子</span>
				</div>
			</template>

			<!-- 搜索输入框 -->
			<search-input @click-search="handleSearch" />

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

				<!-- 现有图片展示 -->
				<el-form-item label="图片">
					<div v-for="(item, index) in formData.image_url" :key="index" class="image-container">
						<el-image :src="item" class="image" />
						<div class="arrows" v-if="formData.image_url.length > 1">
							<el-icon class="arrow left" @click="moveImage(index, -1)" v-if="index > 0">
								<ArrowLeft />
							</el-icon>
							<el-icon class="arrow right" @click="moveImage(index, 1)"
								v-if="index < formData.image_url.length - 1">
								<ArrowRight />
							</el-icon>
						</div>

						<!-- 删除按钮独立出来 -->
						<div class="delete-container" @click="deleteImage(index)">
							<el-icon class="delete-icon">
								<Delete />
							</el-icon>
						</div>
					</div>
				</el-form-item>

				<!-- 添加新的图片上传区域 -->
				<el-form-item label="添加图片">
					<el-upload action="#" list-type="picture-card" :auto-upload="false"
						:on-change="handleImageOthersChange" :on-remove="handleImageOthersRemove" ref="uploadRef"
						v-model:file-list="imageUrlOthers">
						<el-icon>
							<Plus />
						</el-icon>

						<template #file="{ file }">
							<div>
								<img class="el-upload-list__item-thumbnail" :src="file.url" alt="" />
								<span class="el-upload-list__item-actions">
									<span v-if="!disabled" class="el-upload-list__item-delete"
										@click="handleRemove(file)">
										<el-icon>
											<Delete />
										</el-icon>
									</span>
								</span>
							</div>
						</template>
					</el-upload>
				</el-form-item>
				<el-form :model="formData" label-width="80px" class="data-form">
					<!--					<el-form-item label="图片">-->
					<!--						<el-image v-for="item in formData.image_url" :src="item" class="image-container"></el-image>-->
					<!--					</el-form-item>-->
					<el-form-item label="类型">
						<el-select v-model="formData.type" placeholder="请选择类型">
							<el-option v-for="item in type_options" :key="item.id" :label="item.name"
								:value="item.id" />
						</el-select>
					</el-form-item>

					<el-form-item label="角色">
						<el-select v-model="formData.character" placeholder="请选择类型">
							<el-option v-for="item in character_options" :key="item.id" :label="item.name"
								:value="item.id" />
						</el-select>
					</el-form-item>

					<el-form-item label="标题">
						<el-input v-model="formData.title" placeholder="请输入标题" />
					</el-form-item>

					<el-form-item label="画师">
						<el-input v-model="formData.illustrator" placeholder="请输入画师名称" />
					</el-form-item>

					<el-form-item label="描述">
						<el-input v-model="formData.description" type="textarea" :rows="4" placeholder="请输入详细描述" />
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
import { ref, onMounted } from 'vue';
import { Close, Delete, Plus } from "@element-plus/icons-vue";
import SearchInput from '@/components/common/SearchInput.vue';
import requests from "@/utils/requests.js";
import { baseUrl } from "@/utils/methods.js";
import { ArrowLeft, ArrowRight } from "@element-plus/icons-vue";
import axios from "axios";
import COS from "cos-js-sdk-v5";
import CryptoJS from 'crypto-js';
import { apiConfig } from "@/config/Config.js";
// import {baseUrl} from "@/utils/methods.js";

// 添加 COS 配置
let cos = '';
onMounted(() => {
	getInfo();
	initCOS();
})

const initCOS = () => {
	cos = new COS({
		SecretId: apiConfig.getCosConfig().SecretId,
		SecretKey: apiConfig.getCosConfig().SecretKey
	});
}

// 修改保存方法
const savePost = async () => {
	try {
		// 上传新添加的图片
		const uploadPromises = imageUrlOthers.value.map(async (file) => {
			const name = file.raw.name;
			const ext = name.split('.').pop();
			const newName = CryptoJS.MD5(name + Math.random()).toString() + '.' + ext;

			return new Promise((resolve, reject) => {
				cos.putObject({
					Bucket: 'pjsk-image-1304757492',
					Region: 'ap-chengdu',
					Key: `image_storage/${newName}`,
					StorageClass: 'STANDARD',
					Body: file.raw
				}, (err, data) => {
					if (data.statusCode === 200 && data.Location) {
						resolve(`https://${data.Location}`);
					} else {
						reject(err);
					}
				});
			});
		});

		// 等待所有图片上传完成
		const newImageUrls = await Promise.all(uploadPromises);

		// 更新帖子信息
		const response = await requests.put(
			`${baseUrl}/api2/website_image/update`,
			{
				data: {
					...formData.value,
					id: formData.value._id,
					image_url: [...formData.value.image_url, ...newImageUrls],
				},
				token: localStorage.getItem('token2')
			}
		);

		if (response.data.code === 200) {
			ElMessage.success('保存成功');
			// 清空上传的图片
			imageUrlOthers.value = [];
			if (uploadRef.value) {
				uploadRef.value.clearFiles();
			}
			// 可选：刷新页面或重新加载数据
		}
	} catch (error) {
		ElMessage.error('保存失败');
		console.error(error);
	}
};

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
		list.push({ name: item.name, id: item.id })
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
	selectedPost.value = { ...post };
	formData.value = { ...post }
};

const uploadImageRef = ref(null);

// 添加图片上传相关的变量
const imageUrlOthers = ref([]);
const disabled = ref(false);
const uploadRef = ref(null);

// 添加图片处理方法
const handleImageOthersChange = (file) => {
	imageUrlOthers.value.push({
		raw: file.raw,
		url: URL.createObjectURL(file.raw),
		uid: file.uid
	});
};

const handleImageOthersRemove = (file) => {
	const index = imageUrlOthers.value.findIndex(item => item.uid === file.uid);
	if (index !== -1) {
		imageUrlOthers.value.splice(index, 1);
	}
};

const handleRemove = (uploadFile) => {
	imageUrlOthers.value = imageUrlOthers.value.filter(file => file.uid !== uploadFile.uid);
};

// 移动图片逻辑
const moveImage = (index, direction) => {
	const newIndex = index + direction;
	if (newIndex >= 0 && newIndex < formData.value.image_url.length) {
		const temp = formData.value.image_url[index];
		formData.value.image_url[index] = formData.value.image_url[newIndex];
		formData.value.image_url[newIndex] = temp;
	}
};


// 添加删除图片方法
const deleteImage = (index) => {
	ElMessageBox.confirm(
		'确定要删除这张图片吗？',
		'警告',
		{
			confirmButtonText: '确定',
			cancelButtonText: '取消',
			type: 'warning',
		}
	).then(() => {
		formData.value.image_url.splice(index, 1);
		ElMessage.success('删除成功');
	}).catch(() => {
		ElMessage.info('已取消删除');
	});
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


			&:hover {
				.delete-container {
					opacity: 1;
				}
			}

			.delete-container {
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				background-color: rgba(220, 53, 69, 0.8);
				border-radius: 50%;
				width: 40px;
				height: 40px;
				display: flex;
				align-items: center;
				justify-content: center;
				cursor: pointer;
				opacity: 0;
				transition: all 0.3s ease;

				&:hover {
					background-color: rgba(220, 53, 69, 1);
					transform: translate(-50%, -50%) scale(1.1);
				}

				.delete-icon {
					color: white;
					font-size: 20px;
				}
			}

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

		.el-select,
		.el-input {
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
