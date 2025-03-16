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

const setTime = '03-13'
onMounted(()=>{
	const lastNotification = localStorage.getItem('lastNotification')
	if(lastNotification !== setTime){
		ElNotification({
			title: '新通知',
			message: '帮我们测试一下登录功能！\n 右上角注册登录',
			duration: 4500,
		})
		localStorage.setItem('lastNotification', setTime)
	}
})
</script>

<style scoped lang="scss">

</style>