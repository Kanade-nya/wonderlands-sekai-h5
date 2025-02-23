<template>
	<div class="home-page-layout">
<!--		<quickly-jump-bar></quickly-jump-bar>-->
		<filter-panel></filter-panel>
		<filter-box-component></filter-box-component>
	</div>
<!--	<box-component></box-component>-->
</template>

<script setup>
import QuicklyJumpBar from "@/components/common/QuicklyJumpBar.vue";
import BoxComponent from "@/components/home/BoxComponent.vue";
import Pages from "@/pages/Pages.vue";
import {onMounted} from "vue";
import FilterBoxComponent from "@/components/filter/FilterBoxComponent.vue";
import FilterPanel from "@/components/common/FilterPanel.vue";

const props = defineProps({
	type: {
		type: String,
		required: true,
		default: ''
	}
})


onMounted(() => {
	// 过滤页面
	// console.log(props.type)
})
</script>

<style scoped lang="scss">

</style>