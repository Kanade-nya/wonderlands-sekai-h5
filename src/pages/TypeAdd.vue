<script setup>
import {ref} from "vue";
import PostImage from "@/components/post_information/PostImage.vue";
import requests from "@/utils/requests.js";
import {baseUrl} from "@/utils/methods.js";

const formData = ref({
	name: '',
	father: 0
})

const upload = async () => {
	const response = requests.post(
		`${baseUrl}/api2/image_type/add`,
		{
			name: formData.value.name,
			parentId: formData.value.father
		}
	)
	console.log(response)
}
</script>

<template>
	<el-card class="box-card">
		<template #header>
			<div class="card-header">
				<span>数据上传</span>
			</div>
		</template>

	<el-form
		v-model="formData"
		label-width="80px"
		class="data-form"
	>
		<el-form-item label="类型名字">
			<el-input v-model="formData.name"></el-input>
		</el-form-item>
		<el-form-item label="父节点Id">
			<el-input v-model="formData.father"></el-input>
		</el-form-item>
	</el-form>
		<el-button @click="upload">上传</el-button>
	</el-card>
</template>

<style scoped lang="scss">
.box-card {
	padding: 20px;

	.card-header {
		font-size: 18px;
		cursor: default;
	}

	.data-form {
		:deep(.el-form-item__label) {
			font-weight: bold;
		}

		.el-select, .el-input {
			width: 100%;
		}
	}

}
</style>