<template>
	<div class="home-page-layout">
		<!--		<quickly-jump-bar></quickly-jump-bar>-->
		<Pages></Pages>
	</div>
</template>

<script setup>
import QuicklyJumpBar from "@/components/common/QuicklyJumpBar.vue";
import BoxComponent from "@/components/home/BoxComponent.vue";
import Pages from "@/pages/Pages.vue";
import { ElMessageBox,  ElMessage } from "element-plus";
import { onMounted } from "vue";

const setTime = '05-05'

onMounted(() => {
	const lastNotification = localStorage.getItem('lastNotification')
	ElNotification({
		title: '数据更新',
		dangerouslyUseHTMLString: true,
		message: `<p>帮助我们补全数据库</p><p>通过用户中心->提交 -> 上传未收录的图片</p>`,
		position: 'bottom-right',
		duration: 3000
	})
	if (lastNotification !== setTime) {
		// ElNotification({
		// 	title: '帮助我们补全数据库',
		// 	message: '从用户中心->提交->提交未收录的图片.提交通过后将收录在网站数据中',
		// 	duration: 4500,
		// })
		// ElMessageBox.confirm(
		// 	`从用户中心->提交->提交未收录的图片.
		// 	提交通过后将收录在网站数据中
		// 	`,
		// 	'帮助我们补全数据库',
		// 	{
		// 		confirmButtonText: 'OK',
		// 		cancelButtonText: 'Cancel',
		// 		type: 'warning',
		// 	}
		// )
		// 	.then(() => {
		// 		ElMessage({
		// 			type: 'success',
		// 			// message: 'Delete completed',
		// 		})
		// 	})
		// 	.catch(() => {
		// 		ElMessage({
		// 			type: 'info',
		// 			// message: 'Delete canceled',
		// 		})
		// 	}

		localStorage.setItem('lastNotification', setTime)
	}
})
</script>

<style scoped lang="scss"></style>