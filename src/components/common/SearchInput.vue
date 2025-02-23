<!-- 搜索框-->
<script setup lang="ts">
import {ref, defineEmits} from 'vue'
import {Search} from '@element-plus/icons-vue'
const emits = defineEmits(['clickSearch'])

const search_query = ref('')
const search_func = () => {
	emits('clickSearch', search_query.value)
}
</script>

<template>
	<div class="input-box">
		<el-input
			class="search-input"
			v-model="search_query"
			placeholder="Search"
			@keyup.enter="search_func"
		>
			<template #suffix>
				<el-icon class="el-input__icon" @click="search_func">
					<Search/>
				</el-icon>
			</template>
		</el-input>
	</div>

</template>

<style scoped lang="scss">
.input-box {
	border-radius: 24px;
	display: flex;
	flex-direction: column;
	justify-content: center;

	.search-input {
		margin-right: 16px;
		width: 200px;
		//border: 1px skyblue solid;
		.el-input__icon {
			margin: 0 4px;
		}
	}
}

:deep(.el-input__wrapper) {
	border-radius: 24px;
}

:deep(.el-input__suffix-inner) {
	cursor: pointer;
	display: flex;
	justify-content: center;
	align-items: center;
	margin: 2px 0;
	border-radius: 2px;

	&:hover {
		background: #eee;
	}
}

///*搜索组件最外层div */
//.input_box {
//	width: 300px;
//	margin-right: 15px;
//	border-radius: 95px;
//	//background: rgb(0 234 245 / 48%);
//}
///*搜索input框 */
//:deep(.el-input__wrapper) {
//	//background-color: transparent;/*覆盖原背景颜色，设置成透明 */
//	border-radius: 95px;
//	border: 0;
//	//box-shadow: 0 0 0 0px;
//}
///*搜索button按钮 */
//:deep(.el-input-group__append) {
//	background: rgb(0 234 245 / 48%);
//	border-radius: 95px;
//	border: 0;
//	//box-shadow: 0 0 0 0px;
//}
</style>