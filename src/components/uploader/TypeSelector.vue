<!--选择类型-->
<script setup>
import {onMounted, ref} from "vue";
import {useSekaiNameStore} from "@/stores/useSekaiNameStore.js";

const value = ref('')
const options = [
	{
		value: '生日贺图',
		label: '生日贺图',
	},
	{
		value: '庆典贺图',
		label: '庆典贺图',
		// disabled: true,
	},
	{
		value: '2DMV',
		label: '2DMV',
	},
	{
		value: '外服贺图',
		label: '外服贺图',
	},
	{
		value: '人设/设计图',
		label: '人设/设计图',
	},
	{
		value: '其他',
		label: '其他',
	}
]

const value1 = ref('')
const handleSelect = (item) => {
	// console.log(item)
}

const store = useSekaiNameStore()
const query = ref([])
onMounted(() => {
	// console.log(query.value.concat(store.getSekaiName()))
	const loadAll = () =>{
		const results = ref([])
		store.getSekaiName().map(item => {
			results.value.push({
				value: item
			})
		})
		store.getBandName().map(item => {
			results.value.push({
				value: item
			})
		})
		return results
	}
	query.value = loadAll().value

})


const querySearch = (queryString, cb) => {
	// console.log(query.value)
	const results = queryString ? query.value.filter(createFilter(queryString)) : query.value
	// console.log(results)
	cb(results)
}
const createFilter = (queryString) => {
	return (query) => {
		// console.log(queryString)
		return query.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0
	}
}

const collectionData = () => {
	return {
		type: value,
		character: value1
	}
}
defineExpose({
	collectionData
})
</script>

<template>
	<div class="select-value">
		<el-select v-model="value" placeholder="选择" style="width: 240px">
			<el-option
				v-for="item in options"
				:key="item.value"
				:label="item.label"
				:value="item.value"
				:disabled="item.disabled"
				placeholder="选择类型"
			/>
		</el-select>
		<el-autocomplete
			v-model="value1"
			:fetch-suggestions="querySearch"
			clearable
			class="inline-input w-50"
			placeholder="选择角色"
			@select="handleSelect"
			style="width: 240px"
		/>
	</div>
</template>

<style scoped lang="scss">
.select-value{
	display: flex;
	flex-direction: column;
	align-items: flex-start;
	gap: 10px;
}
</style>