<template>
	<div class="new-publication">
		<el-form :model="publicationForm" label-position="top" :rules="rules" ref="publicationFormRef">
			<el-form-item label="标题" prop="title">
				<el-input v-model="publicationForm.title" placeholder="请输入文章标题"></el-input>
			</el-form-item>

			<el-form-item label="主题" prop="topic">
				<el-input v-model="publicationForm.topic" placeholder="文章的主题是？"></el-input>
			</el-form-item>

			<el-form-item label="内容" prop="content">
				<div class="markdown-container">
					<div style="border: 1px solid #ccc">
						<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef" :defaultConfig="toolbarConfig" :mode="mode" />
						<Editor style="height: 500px; overflow-y: hidden;" v-model="publicationForm.content" :defaultConfig="editorConfig" :mode="mode" @onCreated="handleCreated" />
					</div>
				</div>
			</el-form-item>

			<el-form-item>
				<div class="form-buttons">
					<el-button type="primary" @click="submitPublication">发表</el-button>
					<el-button @click="resetForm">重置</el-button>
				</div>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeUnmount, shallowRef } from 'vue';
import { ElMessage } from 'element-plus';
import COS from 'cos-js-sdk-v5';
import axios from "axios";
import { localUrl } from "@/utils/methods.js";
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";
import { apiConfig } from "@/config/Config.js";
import '@wangeditor/editor/dist/css/style.css';
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';

const emit = defineEmits(['publication-submitted']);

const userInfoStore = useUserInfoStore();
const editorRef = shallowRef();
const mode = 'default';

// 表单数据
const publicationForm = reactive({
	title: '',
	topic: '',
	content: ''
});

// 表单校验规则
const rules = {
	title: [{ required: true, message: '请输入文章标题', trigger: 'blur' }],
	topic: [{ required: true, message: '请选择文章主题', trigger: 'change' }],
	content: [{ required: true, message: '请输入文章内容', trigger: 'blur' }]
};

const publicationFormRef = ref(null);

const toolbarConfig = {};
const editorConfig = {
	placeholder: '请输入内容...',
	withCredentials: true,
	MENU_CONF: {},
};

editorConfig.MENU_CONF['uploadImage'] = {
	async customUpload(file, insertFn) {
		const cos = new COS({
			SecretId: apiConfig.getCosConfig().SecretId,
			SecretKey: apiConfig.getCosConfig().SecretKey,
		});

		const bucketName = 'user-1304757492';
		const region = 'ap-guangzhou';
		const key = `images/${Date.now()}_${file.name}`;

		const uploadTask = new Promise((resolve, reject) => {
			cos.putObject(
				{
					Bucket: bucketName,
					Region: region,
					Key: key,
					Body: file,
				},
				(err, data) => {
					if (err) {
						ElMessage.info('上传失败');
						reject(err);
					} else {
						ElMessage.info('上传成功');
						insertFn(`https://${data.Location}`, '', '');
						console.log(data.Location);
						resolve(data.Location);
					}
				}
			);
		});
	},
};

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value;
	if (editor == null) return;
	editor.destroy();
});

const handleCreated = (editor) => {
	editorRef.value = editor;
};

// 提交投稿
const submitPublication = () => {
	publicationFormRef.value.validate(async (valid) => {
		if (valid) {
			try {
				const response = await axios.post(
					`${localUrl}/articles/articles`,
					{
						title: publicationForm.title,
						theme: publicationForm.topic,
						content: publicationForm.content,
						author_name: userInfoStore.userInfo.userName,
						author_id: userInfoStore.userInfo.userId,
						author_avatar: userInfoStore.userInfo.userAvatar,
					}
				);

				ElMessage.success('投稿提交成功！');

				// 创建新发布的文章对象
				const newPublication = {
					id: response.data.id || Date.now(),
					title: publicationForm.title,
					topic: publicationForm.topic,
					content: publicationForm.content,
					createTime: new Date().toLocaleString(),
					status: '审核中'
				};

				// 通知父组件发布成功
				emit('publication-submitted', newPublication);

				// 重置表单
				resetForm();
			} catch (error) {
				console.error('发布文章失败:', error);
				ElMessage.error('发布失败，请稍后重试');
			}
		} else {
			ElMessage.error('请完善表单信息');
		}
	});
};

// 重置表单
const resetForm = () => {
	publicationFormRef.value.resetFields();
	publicationForm.content = '';
};

// 接收外部传入的文章数据进行编辑
const setPublicationData = (data) => {
	if (data) {
		publicationForm.title = data.title || '';
		publicationForm.topic = data.topic || '';
		publicationForm.content = data.content || '';
	}
};

// 暴露方法给父组件
defineExpose({
	setPublicationData
});
</script>

<style lang="scss" scoped>
.new-publication {
	padding: 10px 0;

	.topic-select {
		width: 100%;
	}

	.markdown-container {
		border: 1px solid #dcdfe6;
		border-radius: 4px;
		width: 100%;
		min-height: 400px;
	}

	.form-buttons {
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;
	}
}
</style>