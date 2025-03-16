<template>
	<div class="history-publication">
		<div></div>
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

		<!-- 查看文章详情对话框 -->
		<el-dialog v-model="dialogVisible" title="文章详情" width="70%">
			<div class="publication-detail">
				<h2>{{ currentPublication.title }}</h2>
				<div class="publication-info">
					<span>主题: {{ currentPublication.topicLabel }}</span>
					<span>发表时间: {{ currentPublication.createTime }}</span>
					<span>状态:
            <el-tag :type="getStatusType(currentPublication.status)">{{ currentPublication.status }}</el-tag>
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
import axios from "axios";
import { localUrl } from "@/utils/methods.js";
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';

const emit = defineEmits(['edit-publication']);

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
	currentPublication.value = row;
	dialogVisible.value = true;
};

// 编辑文章
const editPublication = (row) => {
	emit('edit-publication', row);
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
</script>

<style lang="scss" scoped>
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
</style>