<script setup>
import {ref} from 'vue'
import {useMakeFormDataStore} from "@/stores/useMakeFormDataStore.js";

const store = useMakeFormDataStore()
const title = ref('')
const description = ref('')
const illustrator = ref('')

const collectionData = () => {
	return {
		title: title.value,
		description: description.value,
		illustrator: illustrator.value,
	}
}
defineExpose({
	collectionData
})
</script>

<template>
	<div class="uploader-default-value">
		<el-input
			v-model="title"
			type="textarea"
			placeholder="标题"
			style="width: 240px"
			:autosize="{ minRows: 1, maxRows: 4 }"
		></el-input>
		<el-input
			v-model="illustrator"
			placeholder="画师"
			style="width: 240px"
		></el-input>
		<el-input
			v-model="description"
			placeholder="描述"
			style="width: 240px"
			type="textarea"
			:autosize="{ minRows:2, maxRows: 4 }"
		></el-input>
	</div>
</template>

<style scoped lang="scss">
.uploader-default-value {
	display: flex;
	//align-items: ;
	flex-direction: column;
	gap: 10px;
}
</style>