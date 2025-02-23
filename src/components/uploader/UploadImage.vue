<script setup>
import {ref} from 'vue'
import {Delete, Download, Plus, ZoomIn} from '@element-plus/icons-vue'
import {useMakeFormDataStore} from "@/stores/useMakeFormDataStore.js";
import axios from "axios";
import {baseUrl} from "@/utils/methods.js";
import router from "@/router/router.js";
const store = useMakeFormDataStore()
// import type { UploadFile } from 'element-plus'

// import type { UploadProps, UploadUserFile } from 'element-plus'

const uploadUrl = `${baseUrl}/api/post/save_image_loader`

const fileList = ref([])
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
const disabled = ref(false)

const handleRemove = (uploadFile) => {
	fileList.value = fileList.value.filter(file => file.uid !== uploadFile.uid);
}

const handlePictureCardPreview = (file) => {
	dialogImageUrl.value = file.url
	dialogVisible.value = true
}

const handleDownload = (file) => {
}
const uploadRef = ref(null)

let loadType = 'normal'
let loadingInstance = null
const uploadImage = async (type='normal') => {
	// console.log(store.getFileListUrls());
	if (type === 'only') {
		loadType = 'only'
	}
	let res = await uploadRef.value.submit()
	loadingInstance = ElLoading.service()
	// console.log(res)
}

const handleSuccess = (response, file, fileList) => {
	// console.log(store);
	console.log('上传图片完成')
	if (response.code === 200) {
		// 	上传成功
		console.log('图片链接：' + response.urls[0])
		store.pushFileListUrls(response.urls[0])
		store.getFileListUrls()
		// console.log(fileList.value.length)
		if (fileList.length === store.getFileListUrls().length) {
			// 全部上传完成
			uploadRef.value.clearFiles()
			if (loadType === 'normal'){
				handlePost()
			}else{
				loadType = 'normal'
				loadingInstance.close()
			}

		}
	}
	// console.log(response)
	// console.log(file)
	// console.log(fileList)
}
const handleError = (err, file, fileList) => {
	console.log(err)
	loadingInstance.close()
	ElMessageBox.alert('图片上传失败，请重试', 'Error', {
		// if you want to disable its autofocus
		// autofocus: false,
		confirmButtonText: 'OK',
		callback: (action) => {
			ElMessage({
				type: 'info',
				message: `Something Error...`,
			})
		},
	})
}

const handlePost = () => {
	const data = store.getAll()
	data.fileListUrls = Object.assign([], data.fileListUrls)
	console.log(data)
	axios.post(
		`${baseUrl}/api/post/save_to_web_image_storage`,
		{data: data}
	).then(response => {
		if(response.status === 200){
			loadingInstance.close()
			store.clearFileListUrls()
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
					router.replace({ path: '/' })
				},
			})
		}
	}).catch(error => {
		loadingInstance.close()
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
	})
}

defineExpose({
	uploadImage
})
</script>

<template>
	<div>
		<el-upload
			:action="uploadUrl"
			list-type="picture-card"
			:auto-upload="false"
			ref="uploadRef"
			:on-success="handleSuccess"
			:on-error="handleError"
			v-model:file-list="fileList">
			<el-icon>
				<Plus/>
			</el-icon>

			<template #file="{ file }">
				<div>
					<img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
					<span class="el-upload-list__item-actions">
		          <span
			          class="el-upload-list__item-preview"
			          @click="handlePictureCardPreview(file)"
		          >
		            <el-icon><zoom-in/></el-icon>
		          </span>
		          <span
			          v-if="!disabled"
			          class="el-upload-list__item-delete"
			          @click="handleDownload(file)"
		          >
		            <el-icon><Download/></el-icon>
		          </span>
		          <span
			          v-if="!disabled"
			          class="el-upload-list__item-delete"
			          @click="handleRemove(file)"
		          >
		            <el-icon><Delete/></el-icon>
		          </span>
		        </span>
				</div>
			</template>
		</el-upload>

		<el-dialog v-model="dialogVisible">
			<img w-full :src="dialogImageUrl" alt="Preview Image"/>
		</el-dialog>

		<button @click="uploadImage('only')">点击上传</button>
	</div>
</template>

<style scoped lang="scss">
.el-dialog {
	img {
		width: 100%;
	}
}
</style>