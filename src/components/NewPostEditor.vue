<!-- wonderlands-sekai-h5/src/components/NewPostEditor.vue -->
<template>
	<div class="new-post-editor">
		<el-form :model="formData" label-width="80px">
			<el-form-item label="标题">
				<el-input v-model="formData.title" placeholder="请输入标题" />
			</el-form-item>
			<el-form-item label="主题">
				<el-input v-model="formData.theme" placeholder="请输入主题" />
			</el-form-item>
			<el-form-item label="内容">
				<markdown-editor v-model="formData.content" />
			</el-form-item>
			<el-form-item>
				<el-button type="primary" @click="submitPost">提交</el-button>
			</el-form-item>
		</el-form>
	</div>
</template>

<script setup>
import { ref } from 'vue';
import MarkdownEditor from 'vue3-markdown-it-editor'; // 引入 Markdown 编辑器组件

const formData = ref({
	title: '',
	theme: '',
	content: '',
});

const submitPost = () => {
	// 这里可以添加实际的提交逻辑，比如发送请求到服务器
	console.log('提交的文章信息：', formData.value);
};
</script>

<style scoped>
.new-post-editor {
	padding: 20px;
}
</style>