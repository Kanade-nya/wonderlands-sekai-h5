<script setup lang="ts">

import CollectionBox from "@/components/collection/CollectionBox.vue";

import {localUrl} from '@/utils/methods'
import requests from "@/utils/requests.js";
import {onMounted, ref} from 'vue';

onMounted(async () => {
	const response = await requests.get(
		`${localUrl}/collections/`
	)
	const {list, total} = response.data
	refList.value = list
	refTotal.value = total
	cleanListData()
	console.log(refList)
})
const cleanListData = () => {
	refList.value = refList.value.map((item, index) => {
		let cover
		if (item.collection_list.length === 0) {
			cover = null
		} else {
			const str_image_url = item.collection_list[0].image_url
			cover = JSON.parse(str_image_url.replace(/'/g, '"'))[0]
		}
		return {
			...item,
			cover
		}
	})
}
const refList = ref([])
const refTotal = ref(null)
</script>

<template>
	<div class="collection-container" style="">
		<CollectionBox
			v-for="item in refList"
			:cover="item.cover"
			:description="item.description"
			:date="item.create_date"
			:name="item.name"
			:id="item.id"
			class="collection-child"
		/>
	</div>
</template>

<style scoped lang="scss">
.collection-container {
	display: flex;
	flex-wrap: wrap;
	gap: 6px;
	justify-content: left;
	.collection-child{
		width: calc((100%  - 12px) / 3);
		border-radius: 8px;
	}
}
@media screen and (max-width: 768px) {
	.collection-container {
		gap: 3px;
		.collection-child{
			width: calc((100%  - 6px) / 2);
		}
	}
}
</style>