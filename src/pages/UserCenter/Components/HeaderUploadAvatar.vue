<!-- 上传头像 -->


<script setup>
import {ref, onMounted} from 'vue'
import TencentCosUpload from "@/components/common/TencentCosUpload.vue";
import {useUserInfoStore} from "@/stores/useUserInfoStore.js";
import requests from '@/utils/requests.js'
import {localUrl} from "@/utils/methods.js";
const localAvatar = ref('')
const store = useUserInfoStore()
localAvatar.value = store.getUserInfo.userAvatar

const getUserAvatar = async (avaUrl) => {
	const token = localStorage.getItem('access_token')
	const response = await requests.post(
		`${localUrl}/user/upload-avatar`,
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
		store.setUserAvatar(localAvatar.value)
	} else {
		ElMessage.error('更新服务器失败')
	}

	console.log(localAvatar.value)
}
console.log(store.getUserInfo)
onMounted(() => {
	console.log(localAvatar.value)

	console.log(localAvatar.value)
})
</script>

<template>
	<div class="profile-avatar">
	
		<tencent-cos-upload
			@upload-success="getUserAvatar"
		></tencent-cos-upload>


	</div>
</template>

<style scoped lang="scss">

</style>