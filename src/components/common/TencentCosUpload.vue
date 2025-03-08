<template>
	<el-upload
		action=""
		:before-upload="beforeUpload"
		:http-request="handleUpload"
		:show-file-list="false"
		:limit="1"
		:on-exceed="handleExceed"
	>
		<el-button type="primary">点击上传</el-button>
	</el-upload>
</template>

<script setup>
import { ref } from 'vue';
import COS from 'cos-js-sdk-v5';
import { ElMessage } from 'element-plus';
import {apiConfig} from "@/config/Config.js";
// 腾讯云 COS 配置
const cos = new COS({
	SecretId: apiConfig.getCosConfig().SecretId, // 替换为你的 SecretId
	SecretKey: apiConfig.getCosConfig().SecretKey, // 替换为你的 SecretKey
});

const file = ref(null);

// 文件选择后的回调
const beforeUpload = (rawFile) => {
	const isImage = rawFile.type.startsWith('image/');
	if (!isImage) {
		ElMessage.error('只能上传图片文件');
		return false;
	}
	file.value = rawFile;
	return true;
};

// 文件上传逻辑
const handleUpload = () => {
	if (!file.value) {
		ElMessage.error('请先选择文件');
		return;
	}

	const bucketName = 'user-1304757492'; // 替换为你的存储桶名称
	const region = 'ap-guangzhou'; // 替换为你的存储桶区域
	const key = `images/${Date.now()}_${file.value.name}`; // 生成唯一的文件路径

	cos.putObject(
		{
			Bucket: bucketName,
			Region: region,
			Key: key,
			Body: file.value,
		},
		(err, data) => {
			if (err) {
				ElMessage.error('上传失败');
				console.error(err);
			} else {
				ElMessage.success('上传成功');
				emit('upload-success', data.Location); // 上传成功后触发事件，返回文件 URL
				console.log(data.Location); // 上传成功后触发事件，返回文件 URL
			}
		}
	);
};

// 文件超出限制的回调
const handleExceed = () => {
	ElMessage.warning('最多只能上传一张图片');
};

// 定义事件
const emit = defineEmits(['upload-success']);
</script>

<style scoped>
.el-upload {
	display: inline-block;
}
</style>