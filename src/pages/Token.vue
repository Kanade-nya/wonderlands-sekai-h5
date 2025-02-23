<script setup lang="ts">
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const token = ref('0')

const confirm = () => {
	localStorage.setItem('token', token.value)
	router.push('/Post/information')
}
</script>

<template>
	<div class="token-display">
		<el-input v-model="token" style="width: 240px"></el-input>
		<el-button @click="confirm">确认</el-button>
	</div>

</template>

<style scoped lang="scss">
.token-display {
	width: 100%;
	height: 100%;
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	* {
		margin: 2px auto;
	}
}
</style>