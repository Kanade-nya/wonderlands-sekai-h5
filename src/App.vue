<script setup>
import HelloWorld from './components/HelloWorld.vue'
// import NavBar from "./components/NavBar.vue";
import NavBar from "@/components/common/NavBar.vue";
import Home from "@/pages/Home.vue";
import FooterBar from "@/components/common/FooterBar.vue";
import Token from "@/pages/Token.vue";

import {useRoute} from "vue-router";
const route = useRoute();

import {onMounted} from "vue";
import {useGetIpStore} from "@/stores/useGetIpStore.js";
const getIpStore = useGetIpStore();
onMounted(()=>{
	getIpStore.setIp()
	console.log(`Location: ${getIpStore.getIp()}`)

})


</script>

<template>
	<div class="main-body">
		<NavBar></NavBar>
		<div class="main-page-bg">
			<div class="main-page-layout">
				<router-view :key="route.fullPath"></router-view>
			</div>
		</div>
		<FooterBar></FooterBar>
	</div>



	<!--  <div>-->
	<!--    <a href="https://vite.dev" target="_blank">-->
	<!--      <img src="/vite.svg" class="logo" alt="Vite logo" />-->
	<!--    </a>-->
	<!--    <a href="https://vuejs.org/" target="_blank">-->
	<!--      <img src="./assets/vue.svg" class="logo vue" alt="Vue logo" />-->
	<!--    </a>-->
	<!--  </div>-->
	<!--  <HelloWorld msg="Vite + Vue" />-->
</template>

<style scoped lang="scss">
.main-body{
	overflow: visible;
}
.main-page-bg {
	width: 100%;
	background: #eee;
	min-height: 100vh;
	display: flex;
	padding-bottom: 20px;

	.main-page-layout {
		box-sizing: border-box;
		width: 1140px;
		padding: 12px 16px;
		margin: 20px auto 0;
		background: white;
		min-height: 100vh;
		border-radius: 2px;
		//border: 1px solid black;
	}
}

@media screen and (max-width: 768px) {
	.main-page-bg {
		width: 100%;
		padding: 0;

		.main-page-layout {
			box-sizing: border-box;
			width: 100%;
			padding: 12px 6px;
			margin-top: 0;
		}
	}
}
</style>
