<script setup>
import {ref,onMounted} from "vue";
import {useRoute} from "vue-router";
const route = useRoute();
import BoxComponent from "@/components/home/BoxComponent.vue";
import FilterPanel from "@/components/common/FilterPanel.vue";
import CollectionBox from "@/components/collection/CollectionBox.vue";

// import router from "@/router/router.js";

onMounted(() => {
	// console.log('pages')
	// console.log(router.params.page_id)
	// console.log(route.params.page_id);
})
</script>

<template>
	<filter-panel></filter-panel>
	<div style="display: flex;flex-wrap: wrap;gap: 6px;justify-content: space-between">
		<CollectionBox></CollectionBox>
		<CollectionBox></CollectionBox>
		<CollectionBox></CollectionBox>
		<CollectionBox></CollectionBox>
	</div>

	<box-component></box-component>
</template>

<style scoped lang="scss">

</style>