<!--旧的 PostRecord 组件，把投稿，历史拆分-->
<template>
	<div class="publication-container">
		<el-card class="publication-card">
			<template #header>
				<div class="card-header">
					<h2>发表记录管理</h2>
				</div>
			</template>

			<el-tabs v-model="activeTab" class="publication-tabs">
				<el-tab-pane label="新建投稿" name="new">
					<div class="new-publication">
						<el-form :model="publicationForm" label-position="top" :rules="rules" ref="publicationFormRef">
							<el-form-item label="标题" prop="title">
								<el-input v-model="publicationForm.title" placeholder="请输入文章标题"></el-input>
							</el-form-item>

							<el-form-item label="主题" prop="topic">
								<!--								<el-select v-model="publicationForm.topic" placeholder="请选择文章主题" class="topic-select">-->
								<!--									<el-option v-for="item in topicOptions" :key="item.value" :label="item.label" :value="item.value"></el-option>-->
								<!--								</el-select>-->
								<el-input v-model="publicationForm.topic" placeholder="文章的主题是？"></el-input>
							</el-form-item>

							<el-form-item label="内容" prop="content">
								<!-- <div class="markdown-container">
									<v-md-editor v-model="publicationForm.content"
										class="markdown-editor"></v-md-editor>


								</div> -->
								<div class="markdown-container">
									<div style="border: 1px solid #ccc">
										<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
										         :defaultConfig="toolbarConfig" :mode="mode" />
										<Editor style="height: 500px; overflow-y: hidden;"
										        v-model="publicationForm.content" :defaultConfig="editorConfig" :mode="mode"
										        @onCreated="handleCreated" />
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
				</el-tab-pane>

				<el-tab-pane label="历史投稿" name="history">
					<div class="history-publication">
						<el-table :data="historyPublications" style="width: 100%">
							<el-table-column prop="title" label="标题" min-width="150"></el-table-column>
							<el-table-column prop="topic" label="主题" width="120"></el-table-column>
							<el-table-column prop="createTime" label="发表时间" width="180"></el-table-column>
							<el-table-column prop="status" label="状态" width="100">
								<template #default="scope">
									<el-tag :type="getStatusType(scope.row.status)">{{ scope.row.status }}</el-tag>
								</template>
							</el-table-column>
							<el-table-column label="操作" width="150">
								<template #default="scope">
									<el-button size="small" @click="viewPublication(scope.row)">查看</el-button>
									<el-button size="small" type="primary" @click="editPublication(scope.row)"
									           v-if="scope.row.status === '草稿' || scope.row.status === '退回修改'">
										编辑
									</el-button>
								</template>
							</el-table-column>
						</el-table>

						<div class="pagination-container">
							<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
							               :current-page="pagination.currentPage" :page-sizes="[10, 20, 30, 50]"
							               :page-size="pagination.pageSize" layout="total, sizes, prev, pager, next, jumper"
							               :total="pagination.total">
							</el-pagination>
						</div>
					</div>
				</el-tab-pane>
			</el-tabs>
		</el-card>

		<!-- 查看文章详情对话框 -->
		<el-dialog v-model="dialogVisible" title="文章详情" width="70%">
			<div class="publication-detail">
				<h2>{{ currentPublication.title }}</h2>
				<div class="publication-info">
					<span>主题: {{ currentPublication.topicLabel }}</span>
					<span>发表时间: {{ currentPublication.createTime }}</span>
					<span>状态:
						<el-tag :type="getStatusType(currentPublication.status)">{{ currentPublication.status
							}}</el-tag>
					</span>
				</div>
				<div class="publication-content">
					<v-md-preview :text="currentPublication.content"></v-md-preview>
				</div>
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { ElMessage } from 'element-plus';
import COS from 'cos-js-sdk-v5';
// import VmdEditor from '@kangc/v-md-editor';

import '@kangc/v-md-editor/lib/style/base-editor.css';
// import vuepress from "@kangc/v-md-editor/src/theme/vuepress/index.js";
import vuepressTheme from '@kangc/v-md-editor/lib/theme/vuepress.js';
import '@kangc/v-md-editor/lib/theme/style/vuepress.css';
import Prism from 'prismjs';
// 导入行号插件和复制代码插件及其样式
import createLineNumbertPlugin from '@kangc/v-md-editor/lib/plugins/line-number/index';
import createCopyCodePlugin from '@kangc/v-md-editor/lib/plugins/copy-code/index';
import '@kangc/v-md-editor/lib/plugins/copy-code/copy-code.css';

// 使用 VuePress 主题配置 Markdown 编辑器，包括 Prism 和代码高亮扩展映射
import VMdEditor from '@kangc/v-md-editor';
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css'
import axios from "axios";
import { localUrl } from "@/utils/methods.js";
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";
const userInfoStore = useUserInfoStore();
import {apiConfig} from "@/config/Config.js";

// 局部引入
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'

import '@wangeditor/editor/dist/css/style.css' // 引入 css

import { onBeforeUnmount, shallowRef } from 'vue'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'

const editorRef = shallowRef()

// 内容 HTML
const valueHtml = ref('<p>hello</p>')

// 模拟 ajax 异步获取内容
onMounted(() => {
	setTimeout(() => {
		valueHtml.value = '<p>模拟 Ajax 异步设置内容</p>'
	}, 1500)
})

const toolbarConfig = {}
const editorConfig = {
	placeholder: '请输入内容...',
	withCredentials: true,
	MENU_CONF: {},
}

editorConfig.MENU_CONF['uploadImage'] = {
	async customUpload(file, insertFn) {
		const cos = new COS({
			SecretId: apiConfig.getCosConfig().SecretId, // 替换为你的 SecretId
			SecretKey: apiConfig.getCosConfig().SecretKey, // 替换为你的 SecretKey
		});

		const bucketName = 'user-1304757492'; // 替换为你的存储桶名称
		const region = 'ap-guangzhou'; // 替换为你的存储桶区域
		const key = `images/${Date.now()}_${file.name}`; // 生成唯一的文件路径

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
						// UToast({ message: '上传失败', type: 'error' });
						reject(err);
					} else {
						ElMessage.info('上传成功');
						insertFn(`https://${data.Location}`, '', '')
						console.log(data.Location);
						// upload_images_location.push(`https://${data.Location}`);
						resolve(data.Location);
					}
				}
			);
		});
		// TS 语法
		// async customUpload(file, insertFn) {                   // JS 语法
		// file 即选中的文件
		// 自己实现上传，并得到图片 url alt href
		// 最后插入图片

	},
}

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
	const editor = editorRef.value
	if (editor == null) return
	editor.destroy()
})

const handleCreated = (editor) => {
	editorRef.value = editor // 记录 editor 实例，重要！
}

VMdEditor.use(vuepressTheme, {
	Prism,
	codeHighlightExtensionMap: {
		vue: 'html',
	},
});
VMdPreview.use(vuepressTheme, {
	Prism,
	codeHighlightExtensionMap: {
		vue: 'html',
	},
});

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
const activeTab = ref('new');
const dialogVisible = ref(false);
const currentPublication = ref({});

// 主题选项
const topicOptions = [
	{ value: 'technology', label: '科技' },
	{ value: 'life', label: '生活' },
	{ value: 'education', label: '教育' },
	{ value: 'health', label: '健康' },
	{ value: 'travel', label: '旅游' },
	{ value: 'other', label: '其他' }
];

// 历史投稿数据
const historyPublications = ref([]);
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
});

// 获取状态对应的类型
const getStatusType = (status) => {
	const statusMap = {
		'已发布': 'success',
		'审核中': 'warning',
		'草稿': 'info',
		'退回修改': 'danger'
	};
	return statusMap[status] || 'info';
};

// 提交投稿
const submitPublication = () => {
	publicationFormRef.value.validate(async (valid) => {
		if (valid) {
			// 这里可以添加API调用，提交数据到后端
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
			)

			ElMessage.success('投稿提交成功！');

			// 模拟添加到历史投稿列表
			const topicLabel = topicOptions.find(item => item.value === publicationForm.topic)?.label;
			const newPublication = {
				id: Date.now(),
				title: publicationForm.title,
				topic: publicationForm.topic,
				topicLabel: topicLabel,
				content: publicationForm.content,
				createTime: new Date().toLocaleString(),
				status: '审核中'
			};

			historyPublications.value.unshift(newPublication);
			resetForm();
			activeTab.value = 'history';
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

// 查看文章详情
const viewPublication = (row) => {
	currentPublication.value = row;
	dialogVisible.value = true;
};

// 编辑文章
const editPublication = (row) => {
	// 将选中的文章数据填充到表单中
	publicationForm.title = row.title;
	publicationForm.topic = row.topic;
	publicationForm.content = row.content;
	activeTab.value = 'new';
};

// 处理分页变化
const handleSizeChange = (val) => {
	pagination.pageSize = val;
	fetchHistoryPublications();
};

const handleCurrentChange = (val) => {
	pagination.currentPage = val;
	fetchHistoryPublications();
};

// 获取历史投稿数据
const fetchHistoryPublications = () => {
	// 这里可以添加API调用，从后端获取历史投稿数据
	// 模拟数据
	const mockData = [];
	for (let i = 1; i <= 20; i++) {
		const statusOptions = ['已发布', '审核中', '草稿', '退回修改'];
		const topicIndex = Math.floor(Math.random() * topicOptions.length);
		mockData.push({
			id: i,
			title: `测试文章标题 ${i}`,
			topic: topicOptions[topicIndex].value,
			topicLabel: topicOptions[topicIndex].label,
			content: `# 测试文章 ${i}\n\n这是一篇测试文章的内容。\n\n## 二级标题\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n### 代码示例\n\n\`\`\`javascript\nconsole.log('Hello World');\n\`\`\``,
			createTime: new Date(Date.now() - i * 86400000).toLocaleString(),
			status: statusOptions[Math.floor(Math.random() * statusOptions.length)]
		});
	}

	historyPublications.value = mockData;
	pagination.total = mockData.length;
};

onMounted(() => {
	fetchHistoryPublications();
});
</script>

<style lang="scss">
.publication-container {
	max-width: 1200px;
	margin: 20px auto;

	.publication-card {
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

		.card-header {
			display: flex;
			justify-content: space-between;
			align-items: center;

			h2 {
				margin: 0;
				font-size: 20px;
				color: #333;
			}
		}

		.publication-tabs {
			margin-top: 10px;
		}
	}

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

			.v-md-editor {
				min-height: 400px;
				box-shadow: none;
			}
		}

		.form-buttons {
			display: flex;
			justify-content: flex-end;
			margin-top: 20px;
		}
	}

	.history-publication {
		.pagination-container {
			margin-top: 20px;
			display: flex;
			justify-content: center;
		}
	}

	.publication-detail {
		h2 {
			margin-top: 0;
			color: #333;
		}

		.publication-info {
			display: flex;
			gap: 20px;
			margin: 15px 0;
			color: #666;
		}

		.publication-content {
			margin-top: 20px;
			padding: 20px;
			background-color: #f9f9f9;
			border-radius: 4px;
		}
	}
}
</style>