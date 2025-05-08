<template>
	<div class="history-publication">
		<div></div>
        <div class="user-center-upload-new" style="margin-bottom: 8px;"><el-button type="primary" @click="jump2UploadMainArticle">提交新数据</el-button></div>
		<el-table :data="historyPublications" style="width: 100%">
			<el-table-column prop="title" label="标题" min-width="150"></el-table-column>
			<el-table-column prop="theme" label="主题" width="120"></el-table-column>
			<el-table-column prop="create_date" label="发表时间" width="180"></el-table-column>
			<el-table-column prop="status" label="状态" width="100">
				<template #default="scope">
					<el-tag :type="'success'">已发布</el-tag>
				</template>
			</el-table-column>
			<el-table-column label="操作" width="150">
				<template #default="scope">
					<el-button size="small" @click="viewPublication(scope.row)">
						查看
					</el-button>
					<el-button size="small" type="primary" @click="editPublication(scope.row)">
						编辑
					</el-button>
				</template>
			</el-table-column>
		</el-table>

		<div class="pagination-container">
			<el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange"
			               :current-page="pagination.currentPage" :page-sizes="[10, 20, 30, 50]"
			               :page-size="pagination.pageSize"
			               layout="total, sizes, prev, pager, next, jumper" :total="pagination.total">
			</el-pagination>
		</div>

		<!-- 查看文章详情对话框 -->
		<el-dialog v-model="dialogVisible" title="文章详情" width="70%">
			<div class="publication-detail">
				<h2>{{ currentPublication.title }}</h2>
				<div class="publication-info">
					<span>主题: {{ currentPublication.theme }}</span>
					<span>发表时间: {{ currentPublication.create_date }}</span>
					<span>状态:<el-tag :type="'success'">已发布</el-tag></span>
				</div>
				<div class="publication-content">
					<!-- 显示文章内容 -->
					<div v-html="currentPublication.content" class="content-display"></div>
					
					<!-- 添加编辑按钮 -->
					<div class="dialog-footer">
						<el-button @click="dialogVisible = false">关闭</el-button>
						<el-button type="primary" @click="openEditDialog">编辑文章</el-button>
					</div>
				</div>
			</div>
		</el-dialog>
		
		<!-- 添加单独的编辑对话框 -->
		<el-dialog v-model="editDialogVisible" title="编辑文章" width="80%" append-to-body>
			<div class="edit-publication">
				<el-form :model="editForm" label-position="top" :rules="rules" ref="editFormRef">
					<el-form-item label="标题" prop="title">
						<el-input v-model="editForm.title" placeholder="请输入文章标题"></el-input>
					</el-form-item>

					<el-form-item label="主题" prop="topic">
						<el-input v-model="editForm.topic" placeholder="文章的主题是？"></el-input>
					</el-form-item>

					<el-form-item label="内容" prop="content">
						<div class="markdown-container">
							<div style="border: 1px solid #ccc">
								<Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
								         :defaultConfig="toolbarConfig" :mode="mode" />
								<Editor style="height: 500px; overflow-y: hidden;"
								        v-model="editForm.content" :defaultConfig="editorConfig"
								        :mode="mode" @onCreated="handleCreated"/>
							</div>
						</div>
					</el-form-item>

					<el-form-item>
						<div class="form-buttons">
							<el-button type="primary" @click="submitUpdate">更新文章</el-button>
							<el-button @click="editDialogVisible = false">取消</el-button>
						</div>
					</el-form-item>
				</el-form>
			</div>
		</el-dialog>
	</div>
</template>

<script setup>
import {ref, reactive, onMounted, defineExpose, shallowRef, onBeforeUnmount} from 'vue';
import {ElMessage} from 'element-plus';
import axios from "axios";
import {localUrl, formatDate} from "@/utils/methods.js";
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import requests from "@/utils/requests.js";
import COS from 'cos-js-sdk-v5'; // 确保导入COS
import { apiConfig } from "@/config/Config.js"; // 确保导入apiConfig
import '@wangeditor/editor/dist/css/style.css'; // 确保导入编辑器样式
import { Editor, Toolbar } from '@wangeditor/editor-for-vue';
import { useRouter } from 'vue-router';
const router = useRouter();

const currentPublicationRef = ref(null);
const rules = {
	title: [{required: true, message: '请输入文章标题', trigger: 'blur'}],
	topic: [{required: true, message: '请选择文章主题', trigger: 'change'}],
	content: [{required: true, message: '请输入文章内容', trigger: 'blur'}]
};
const editorRef = shallowRef();
const mode = 'default';
const handleCreated = (editor) => {
	editorRef.value = editor;
};
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


const submitHistoryPublication = async () => {
	// 提交投稿

	currentPublicationRef.value.validate(async (valid) => {
		if (valid) {
			try {
				const response = await axios.put(
					`${localUrl}/articles/articles/${currentPublication.value.id}`,
					{
						title: publicationForm.title,
						theme: publicationForm.topic,
						content: publicationForm.content,
					}
				);

				ElMessage.success('投稿提交成功！');

				// // 创建新发布的文章对象
				// const newPublication = {
				// 	id: response.data.id || Date.now(),
				// 	title: publicationForm.title,
				// 	topic: publicationForm.topic,
				// 	content: publicationForm.content,
				// 	createTime: new Date().toLocaleString(),
				// 	status: '审核中'
				// };

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

}
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


const emit = defineEmits(['edit-publication']);

// 主题选项
const topicOptions = [
	{value: 'technology', label: '科技'},
	{value: 'life', label: '生活'},
	{value: 'education', label: '教育'},
	{value: 'health', label: '健康'},
	{value: 'travel', label: '旅游'},
	{value: 'other', label: '其他'}
];

// 历史投稿数据
const historyPublications = ref([]);
const pagination = reactive({
	currentPage: 1,
	pageSize: 10,
	total: 0
});

const dialogVisible = ref(false);
const currentPublication = ref({});

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

// 查看文章详情
const viewPublication = (row) => {
	console.log(row);
	currentPublication.value = row;
	dialogVisible.value = true;
};

// 编辑文章
// 添加编辑对话框相关变量
const editDialogVisible = ref(false);
const editForm = reactive({
  title: '',
  topic: '',
  content: ''
});
const editFormRef = ref(null);

// 打开编辑对话框
const openEditDialog = () => {
  editForm.title = currentPublication.value.title;
  editForm.topic = currentPublication.value.theme; // 使用theme而不是topic
  editForm.content = currentPublication.value.content;
  dialogVisible.value = false;
  editDialogVisible.value = true;
};

// 提交更新
const submitUpdate = () => {
  editFormRef.value.validate(async (valid) => {
    if (valid) {
      try {
        const response = await axios.put(
          `${localUrl}/articles/articles/${currentPublication.value.id}`,
          {
            title: editForm.title,
            theme: editForm.topic, // 注意这里使用topic映射到theme
            content: editForm.content
          },
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('access_token')}`
            }
          }
        );

        ElMessage.success('文章更新成功！');
        
        // 关闭编辑对话框
        editDialogVisible.value = false;
        
        // 刷新文章列表
        fetchHistoryPublications();
      } catch (error) {
        console.error('更新文章失败:', error);
        ElMessage.error('更新失败，请稍后重试');
      }
    } else {
      ElMessage.error('请完善表单信息');
    }
  });
};

// 修改现有的编辑文章函数
const editPublication = (row) => {
  currentPublication.value = row;
  openEditDialog();
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
const fetchHistoryPublications = async () => {
	try {
		// 这里应该替换为实际的API调用
		// 暂时使用模拟数据
		// const mockData = [];
		// for (let i = 1; i <= 20; i++) {
		// 	const statusOptions = ['已发布', '审核中', '草稿', '退回修改'];
		// 	const topicIndex = Math.floor(Math.random() * topicOptions.length);
		// 	mockData.push({
		// 		id: i,
		// 		title: `测试文章标题 ${i}`,
		// 		topic: topicOptions[topicIndex].value,
		// 		topicLabel: topicOptions[topicIndex].label,
		// 		content: `# 测试文章 ${i}\n\n这是一篇测试文章的内容。\n\n## 二级标题\n\n- 列表项1\n- 列表项2\n- 列表项3\n\n### 代码示例\n\n\`\`\`javascript\nconsole.log('Hello World');\n\`\`\``,
		// 		createTime: new Date(Date.now() - i * 86400000).toLocaleString(),
		// 		status: statusOptions[Math.floor(Math.random() * statusOptions.length)]
		// 	});
		// }
		const response = await requests.get(
			localUrl + '/articles/my-articles',
			{
				headers: {
					Authorization: `Bearer ${localStorage.getItem('access_token')}`
				}
			}
		);


		historyPublications.value = response.data;
		console.log(historyPublications)
		pagination.total = response.data.length;
	} catch (error) {
		console.error('获取历史投稿失败:', error);
		ElMessage.error('获取历史投稿失败，请稍后重试');
	}
};

// 添加新发布的文章到列表
const addNewPublication = (publication) => {
	if (publication) {
		// 查找主题标签
		const topicObj = topicOptions.find(item => item.value === publication.topic);
		const newPub = {
			...publication,
			topicLabel: topicObj ? topicObj.label : publication.topic
		};

		historyPublications.value.unshift(newPub);
		pagination.total += 1;
	}
};

onMounted(() => {
	fetchHistoryPublications();
});

// 暴露方法给父组件
defineExpose({
	addNewPublication,
	fetchHistoryPublications
});

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});


const jump2UploadMainArticle = () => {
	router.push('/user/center/upload/article')
};
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
		height: auto;
	}

	.dialog-footer {
		display: flex;
		justify-content: flex-end;
		margin-top: 20px;
		gap: 10px;
	}
}

.edit-publication {
	padding: 10px 0;

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
		gap: 10px;
	}
}

.content-display {
		font-size: 16px;
		line-height: 1.8;
		color: #333;
		// margin-bottom: 30px;
		padding: 0 10px;

		:deep(img) {
			max-width: 100%;
			height: auto;
			border-radius: 8px;
			margin: 1.5em 0;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
			transition: transform 0.3s ease;

			&:hover {
				transform: scale(1.01);
			}
		}

		:deep(p) {
			margin-bottom: 20px;
			letter-spacing: 0.5px;
		}

		:deep(h1),
		:deep(h2),
		:deep(h3),
		:deep(h4),
		:deep(h5),
		:deep(h6) {
			font-weight: 600;
			margin: 1.5em 0 0.8em;
			color: #222;
			line-height: 1.4;
		}

		:deep(h1) {
			font-size: 1.8em;
			border-bottom: 1px solid #eee;
			padding-bottom: 0.3em;
		}

		:deep(h2) {
			font-size: 1.5em;
			border-bottom: 1px solid #f0f0f0;
			padding-bottom: 0.3em;
		}

		:deep(h3) {
			font-size: 1.3em;
		}

		:deep(a) {
			color: #0366d6;
			text-decoration: none;
			transition: color 0.2s ease;

			&:hover {
				color: #0056b3;
				text-decoration: underline;
			}
		}

		:deep(blockquote) {
			border-left: 4px solid #dfe2e5;
			padding: 0 1em;
			color: #6a737d;
			margin: 1.5em 0;
			background-color: #f8f9fa;
			border-radius: 0 4px 4px 0;

			p {
				margin: 1em 0;
			}
		}

		:deep(ul),
		:deep(ol) {
			padding-left: 2em;
			margin: 1em 0;
		}

		:deep(li) {
			margin-bottom: 0.5em;
		}

		:deep(code) {
			font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
			background-color: rgba(27, 31, 35, 0.05);
			padding: 0.2em 0.4em;
			border-radius: 3px;
			font-size: 0.9em;
		}

		:deep(pre) {
			background-color: #f6f8fa;
			border-radius: 6px;
			padding: 16px;
			overflow: auto;
			margin: 1.5em 0;

			code {
				background-color: transparent;
				padding: 0;
				white-space: pre;
				font-size: 0.9em;
				line-height: 1.5;
				display: block;
			}
		}

		:deep(table) {
			border-collapse: collapse;
			width: 100%;
			margin: 1.5em 0;
			overflow: auto;

			th,
			td {
				border: 1px solid #dfe2e5;
				padding: 8px 12px;
			}

			th {
				background-color: #f6f8fa;
				font-weight: 600;
			}

			tr:nth-child(even) {
				background-color: #f8f9fa;
			}

			tr:hover {
				background-color: #f1f4f7;
			}
		}

		:deep(hr) {
			height: 1px;
			background-color: #eaeaea;
			border: none;
			margin: 2em 0;
		}

		:deep(.content-image) {
			width: 100%;
			margin: 20px 0;
			border-radius: 8px;
			box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
		}
	}
</style>