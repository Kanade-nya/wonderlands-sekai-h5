<template>
	<div class="upload-container">
		<el-card class="box-card">
			<template #header>
				<div class="card-header">
					<span>数据上传</span>
				</div>
			</template>

			<post-image ref="postImageRef"></post-image>


			<!-- 数据表单 -->
			<el-form
				:model="formData"
				label-width="80px"
				class="data-form"
			>
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
					<el-input v-model="formData.artiest" placeholder="请输入画师名称"/>
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
				<el-button
					type="primary"
					@click="handleSubmit"
				>
					提交
				</el-button>
			</div>
		</el-card>
	</div>
</template>

<script setup>
import {ref, onMounted} from 'vue';
import {ElMessage} from 'element-plus';
import {Plus} from '@element-plus/icons-vue';
import PostImage from "@/components/post_information/PostImage.vue";
import requests from "@/utils/requests.js";
import {ACCOUNT_ID, baseUrl, imageUrl} from "@/utils/methods.js";
import COS from "cos-js-sdk-v5";
// import {createHash} from "crypto";
import CryptoJS from 'crypto-js'
import axios from "axios";
import router from "@/router/router.js";

import {
	S3Client,
	ListBucketsCommand,
	ListObjectsV2Command,
	GetObjectCommand,
	PutObjectCommand,
} from "@aws-sdk/client-s3";
import {getSignedUrl} from "@aws-sdk/s3-request-presigner";
// import {readFile} from "node:fs/promises";
// 对象存储相关
let cos = ''
let s3 = ''
const getKeyAndId = async () => {
	cos = new COS({
		SecretId: 'AKIDWv76yfXTVi3jNvbDtSsDMH3pkjs9Sk7X',
		SecretKey: 'a4sldccUTewtkws2QuQ2XxGWjzHpKmPC'
	})
	s3 = new S3Client({
		region: 'auto',
		endpoint: `https://${ACCOUNT_ID}.r2.cloudflarestorage.com`,
		// endpoint: `https://${ACCOUNT_ID}.cos.ap-chengdu.myqcloud.com`,
		credentials: {
			accessKeyId: '9efefcd5e0aa0d1ae32a08469bce5dd8',
			secretAccessKey: 'f49d4005117f64ec1ea25ccc6eb85b503cbe72386ef63448891d8c6ccedee9eb',
		},
	})
	///固定的桶
	// const bucket = await requests.get(
	// 	`${baseUrl}/api2/website_image/upload/tmp_key`,
	// 	{
	// 		params: {
	// 			authorisation: 'woxihuanni'
	// 		}
	// 	}
	// )
	// if (bucket.status === 200) {
	// 	// [cos.SecretId,cos.SecretKey] = [bucket.data.data.tmp_secret_id,bucket.data.data.tmp_secret_key]
	// 	// cos = new COS({
	// 	// 	SecretId: bucket.data.data.tmp_secret_id,
	// 	// 	SecretKey: bucket.data.data.tmp_secret_key
	// 	// })
	// 	// AKIDWv76yfXTVi3jNvbDtSsDMH3pkjs9Sk7X
	// 	cos = new COS({
	// 		SecretId: bucket.data.data.tmp_secret_id,
	// 		SecretKey: bucket.data.data.tmp_secret_key
	// 	})
	// }
	console.log(cos)
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

// 获取子组件相关
const postImageRef = ref(null)
// 初始化
onMounted(() => {
	getKeyAndId()
})

/////正式的内容 form表单
const formData = ref({
	type: '',
	character: '',
	title: '',
	artiest: '',
	description: '',
	image_url: [],

});
const character_options = ref([])
const type_options = ref([])

const getImageUploaderInfo = (fileList) => {

}


const uploadTitle = async () => {
	let titleImage = postImageRef.value.returnImageTitle();
	if (titleImage) {
		console.log(titleImage);
		const name = titleImage.name;
		const exp = name.split('.')[name.split('.').length - 1];
		const newName = CryptoJS.MD5(name + Math.random()).toString() + '.' + exp;


		// console.log(s3)

		const readableStream = titleImage.raw.stream();

		// const signedUrl = await s3.send(new PutObjectCommand({
		// 		Bucket: 'image-storage',
		// 		Key: newName,
		// 		Body: readableStream,
		// 		CORSConfiguration: {
		// 			CORSRules: new Array({
		// 				AllowedHeaders: ["content-type"],
		// 				AllowedMethods: ["GET", "PUT", "HEAD"],
		// 				AllowedOrigins: ["*"],
		// 				ExposeHeaders: [],
		// 				MaxAgeSeconds: 3000,
		// 			}),
		// 		},
		// 	})
		// )


		const url = await getSignedUrl(
			s3,
			new PutObjectCommand({
				Bucket: 'image-storage',
				Key: newName,
			}),
			{expiresIn: 60 * 60 * 24 * 7}
		)
		const response = new Promise((resolve,reject) => {
			axios.put(url, titleImage.raw, {
				headers: {
					'Content-Type': 'image/jpeg',
				},
			}).then((res) => {
				if (res.status === 200) {
					resolve({'code': 200});
				}
			}).catch((err) => {
				console.log(err)
				reject({'code': 400});
			})
		})

		const cosRes = new Promise((resolve, reject) => {
			cos.putObject({
				Bucket: 'pjsk-image-1304757492',
				Region: 'ap-chengdu',
				Key: `image_storage/${newName}`, // 文件名
				StorageClass: 'STANDARD', // 固定值
				Body: titleImage.raw // 文件体
			}, (err, data) => {
				if (data.statusCode === 200 && data.Location) {
					formData.value.image_url.unshift(`https://${data.Location}`);
					console.log('title 数据上传完成');
					resolve({'code': 200});
				} else {
					console.log(err);
					reject({'code': 400});
				}
			});
		})
		return Promise.all([response,cosRes]);

// console.log('response::::')
// console.log(response)

	}
}


const uploadOthers = async () => {
	const imageList = postImageRef.value.returnImageList();
	// 允许没有图片
	if (imageList.length === 0) {
		console.log('无图片');
		return { code: 200 };
	}

	const processedImages = imageList.map((item) => {
		const name = item.name;
		const ext = name.split('.').pop(); // 获取文件扩展名
		const newName = CryptoJS.MD5(name + Math.random()).toString() + '.' + ext;
		return { ...item, newName };
	});

	// 上传图片到服务器
	const uploadPromises = processedImages.map(async (item) => {
		try {
			const url = await getSignedUrl(
				s3,
				new PutObjectCommand({
					Bucket: 'image-storage',
					Key: item.newName,
				}),
				{ expiresIn: 60 * 60 * 24 * 7 }
			);

			// 使用axios上传图片
			await axios.put(url, item.raw, {
				headers: {
					'Content-Type': item.raw.type, // 使用原始文件的MIME类型
				},
			});

			// 使用cos上传图片
			const cosRes = await new Promise((resolve, reject) => {
				cos.putObject({
					Bucket: 'pjsk-image-1304757492',
					Region: 'ap-chengdu',
					Key: `image_storage/${item.newName}`, // 文件名
					StorageClass: 'STANDARD', // 固定值
					Body: item.raw, // 文件体
				}, (err, data) => {
					if (data.statusCode === 200 && data.Location) {
						formData.value.image_url.push(`https://${data.Location}`);
						resolve(data.Location);
					} else {
						reject(err);
					}
				});
			});

			console.log('others 数据上传完成');
			return { code: 200, url: `https://${cosRes}` };
		} catch (error) {
			console.error(error);
			return { code: 400, error };
		}
	});

	// 等待所有图片上传完成
	const results = await Promise.all(uploadPromises);
	console.log('all:', results);

	// 检查是否所有图片都上传成功
	const allSuccess = results.every(item => item.code === 200);
	return allSuccess ? { code: 200 } : { code: 400 };


};

const handleSubmit = async () => {
	if (formData.value.type === '' || formData.value.character === '' || formData.value.title === '' || formData.value.artiest === '' || formData.value.description === '') {
		ElMessage.warning('请填写完整信息')
		return false
	}

	//传递封面
	let _uploadTitle = await uploadTitle()
	console.log('title结果')
	console.log(_uploadTitle)




	// 传递其他图片
	let _uploadOthers = await uploadOthers()

	console.log('other结果')
	console.log(_uploadOthers)
	console.log(formData.value.image_url)

	// return false

	console.log(_uploadOthers)
	if (_uploadTitle.every(item => item.code === 200) && _uploadOthers.code === 200) {
		console.log(formData.value.image_url)
	} else {
		formData.value.image_url.length
		ElMessage.warning('上传失败，请重试')
		return false
	}
	// console.log(formData.value.image_url)
	// console.log(formData.value.image_url)

	const response = await axios.post(
		`${baseUrl}/api2/website_image/add`,
		{
			data: {
				title: formData.value.title,
				image_url: formData.value.image_url,
				image_type_id: formData.value.type,
				character_id: formData.value.character,
				description: formData.value.description,
				illustrator: formData.value.artiest
			},
			token: localStorage.getItem('token2')
		}
	)
	console.log(`response:`)
	console.log(response)
	if (response.status === 200) {
		console.log('upload success')
		console.log(response.data)
		ElMessageBox.alert('上传成功，感谢提交', 'success', {
			// if you want to disable its autofocus
			// autofocus: false,
			confirmButtonText: 'OK',
			callback: (action) => {
				ElMessage({
					type: 'success',
					message: `上传成功`,
				})
				router.replace({path: '/'})
			},
		})
	} else {
		ElMessageBox.alert('图片上传失败，请重试', 'Error', {
			// if you want to disable its autofocus
			// autofocus: false,

			confirmButtonText: 'OK',
			callback: (action) => {
				ElMessage({
					type: 'info',
					message: error,
				})
			},
		})
	}


	return false;
	if (!imageUrl.value) {
		ElMessage.warning('请先上传图片');
		return;
	}

	// 这里添加实际的上传逻辑
	console.log('提交数据:', {
		...formData.value,
		image: imageUrl.value
	});

	ElMessage.success('上传成功！');
	// 重置表单
	imageUrl.value = '';
	formData.value = {
		type: '',
		role: '',
		title: '',
		artist: '',
		description: ''
	};
};
</script>

<style lang="scss" scoped>
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


	.data-form {
		:deep(.el-form-item__label) {
			font-weight: bold;
		}

		.el-select, .el-input {
			width: 100%;
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