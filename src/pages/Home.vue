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
import {onMounted} from "vue";

const setTime = '02-29'
onMounted(()=>{
	const lastNotification = localStorage.getItem('lastNotification')
	if(lastNotification !== setTime){
		ElNotification({
			title: '新通知',
			message: '合集功能已上线~有新功能建议可以在关于页面提交问卷~',
			duration: 4500,
		})
		localStorage.setItem('lastNotification', setTime)
	}
})
</script>

<style scoped lang="scss">

</style>