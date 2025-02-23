<script setup>
import {ref,onMounted} from "vue";
import UploadImage from "@/components/uploader/UploadImage.vue";
import TypeSelector from "@/components/uploader/TypeSelector.vue";
import DefaultValue from "@/components/uploader/DefaultValue.vue";
import {useMakeFormDataStore} from "@/stores/useMakeFormDataStore.js";
import axios from "axios";
import {baseUrl} from "@/utils/methods.js";
const store = useMakeFormDataStore();
const defaultValue = ref(null);
const typeSelector = ref(null);
const uploadImage = ref(null);
const test = () => {
	collectionOtherData()
	// console.log(store.getAll())
	uploadImage.value.uploadImage()
}

const collectionOtherData = () => {
	const defaultValueData = defaultValue.value.collectionData();
	const typeSelectorData = typeSelector.value.collectionData();
	store.setState([defaultValueData,typeSelectorData])
}

const loadCharacter = async () =>{
	let response = await axios.get(
		`${baseUrl}/api2/character/tree`
	)
	if(response.status === 200){
		console.log(response.data)
	}
}
onMounted(()=>{
	loadCharacter()
})


</script>

<template>
	<h3>上传页面</h3>
	<upload-image ref="uploadImage" :collection="collectionOtherData" ></upload-image>
	<h3>提交页面</h3>
	<type-selector ref="typeSelector"></type-selector>
	<h3>基本信息</h3>
	<default-value ref="defaultValue"></default-value>
	<div style="width: 100%;height: 0;padding: 4px 0"></div>
	<el-button @click="test">上传</el-button>
</template>

<style scoped lang="scss">

</style>