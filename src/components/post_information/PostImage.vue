<script setup>

import {Close, Delete, Download, Plus, ZoomIn} from "@element-plus/icons-vue";
import {ref, defineExpose} from "vue";


//  下面是封面图片的处理方式
const imageUrlTitle = ref(''); // 预览图
const imageUrlTitleFile = ref([]); // 实际的file
// const imageUrlTitleUrl = ref('');
const handleImageTitleChange = (file) => {
	imageUrlTitle.value = URL.createObjectURL(file.raw);
};

const handleImageTitleRemove = (uploadFile) => {
	imageUrlTitleFile.value.length = 0;
	console.log(imageUrlTitleFile)
	imageUrlTitle.value = ''
};

// 其他图片的设置
const imageUrlOthers = ref([]);
const disabled = ref(false)
const handleImageOthersChange = (file) => {
	imageUrlOthers.value.push(URL.createObjectURL(file.raw));
};
const handleImageOthersRemove = (file) => {
	const index = imageUrlOthers.value.indexOf(file.url);
	imageUrlOthers.value.splice(index, 1);
};
const handleRemove = (uploadFile) => {
	// console.log(typeof uploadFile)
	// console.log('2' + imageUrlOthers.value)
	imageUrlOthers.value = imageUrlOthers.value.filter(file => file.uid !== uploadFile.uid);
}

// 属性暴漏给父组件
const returnImageTitle = () => {
	return imageUrlTitleFile.value[0]
}
const returnImageList = () => {
	return imageUrlOthers.value
}
defineExpose({
	returnImageTitle,
	returnImageList
})
</script>

<template>
	<el-form
		label-width="80px"
		class="data-form"
	>
		<el-form-item label="封面">
			<!-- 图片上传区域 -->
			<el-upload
				class="image-uploader"
				action="#"
				:auto-upload="false"
				:show-file-list="false"
				:on-change="handleImageTitleChange"
				:on-remove="handleImageTitleRemove"
				accept="image/png, image/jpeg"
				v-model:file-list="imageUrlTitleFile"
				limit="1"
			>

				<!--				<template #file="{ file }">-->
				<div v-if="imageUrlTitle" class="preview-wrapper">
					<img :src="imageUrlTitle" class="preview-image" alt="">
					<!-- 添加删除按钮 -->
					<div class="delete-mask" @click.stop="handleImageTitleRemove">
						<el-icon class="delete-icon">
							<Close/>
						</el-icon>
					</div>
				</div>
				<el-icon v-else class="uploader-icon">
					<Plus/>
				</el-icon>
				<!--				</template>-->
			</el-upload>
		</el-form-item>

		<!--	-----------------------------------	-->
		<el-form-item label="其他图片">
			<!-- 图片上传区域 -->
			<el-upload
				action="#"
				list-type="picture-card"
				:auto-upload="false"
				:on-change="handleImageOthersChange"
				:on-remove="handleImageOthersRemove"
				ref="uploadRef"
				v-model:file-list="imageUrlOthers"
			>
				<el-icon>
					<Plus/>
				</el-icon>

				<template #file="{ file }">
					<div>
						<img class="el-upload-list__item-thumbnail" :src="file.url" alt=""/>
						<span class="el-upload-list__item-actions">
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
		</el-form-item>
	</el-form>
</template>

<style scoped lang="scss">
.image-uploader {
	margin-bottom: 30px;
	border: 2px dashed #ddd;
	border-radius: 6px;
	text-align: center;
	cursor: pointer;
	transition: border-color 0.3s;
	width: 100%;
	height: 280px;
	display: flex;
	justify-content: center;
	align-items: center;
	overflow: hidden;
	box-sizing: border-box;
	padding: 15px;

	.preview-wrapper {
		position: relative;

		&:hover {
			.delete-mask {
				opacity: 1;
			}
		}
	}

	.delete-mask {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		background: rgba(0, 0, 0, 0.5);
		display: flex;
		align-items: center;
		justify-content: center;
		opacity: 0;
		transition: opacity 0.3s;
		cursor: pointer;

		.delete-icon {
			color: white;
			font-size: 24px;
			transition: transform 0.3s;

			&:hover {
				transform: scale(1.2);
			}
		}
	}


	:deep(.el-upload--text) {
		width: 100%;
		height: 100%;
	}

	&:hover {
		border-color: #409eff;
	}

	.uploader-icon {
		font-size: 28px;
		color: #8c939d;
		margin: 40px 0;
		width: 100%;
	}

	.preview-image {
		width: 100%;
		max-height: 250px;
		object-fit: contain;
	}
}
</style>