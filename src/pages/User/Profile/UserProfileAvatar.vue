<script setup>
import {ref, onMounted} from 'vue'
import TencentCosUpload from "@/components/common/TencentCosUpload.vue";
import {useUserInfoStore} from "@/stores/useUserInfoStroe.js";
import requests from '@/utils/requests.js'
import {localUrl} from "@/utils/methods.js";

const store = useUserInfoStore()
const localAvatar = ref('')
const getUserAvatar = async (avaUrl) => {
	const token = localStorage.getItem('access_token')
	const response = await requests.post(
		`${localUrl}/user/uploader-avatar`,
		{
			"avatar_url": `https://${avaUrl}`
		},
		{
			headers: {
				Authorization: `Bearer ${token}`
			}
		}
	)
	if (response.status === 200) {
		localAvatar.value = `https://${avaUrl}`
	} else {
		ElMessage.error('更新服务器失败')
	}

	console.log(localAvatar.value)
}
console.log(store.getUserInfo)
onMounted(() => {
	console.log(localAvatar.value)
	localAvatar.value = store.getUserInfo.userAvatar
	console.log(localAvatar.value)
})
</script>

<template>
	<div class="profile-avatar">
		<div v-if="localAvatar">
			<el-avatar :fit='"cover"' :src=" localAvatar" :size="'large'"></el-avatar>
		</div>
		<tencent-cos-upload
			@upload-success="getUserAvatar"
		></tencent-cos-upload>


	</div>
</template>

<style scoped lang="scss">

</style>