<script setup>
import {Waline} from '@waline/client/component';
import {computed} from 'vue';
import {useRoute} from 'vue-router';


import '@waline/client/style';

const serverURL = 'https://comments.wonderlands-sekai.space';
const path = computed(() => useRoute().path);
</script>

<template>
	<div class="comments">
		<h2>评论区</h2>
		<el-text class="comments-text"> 畅所欲言吧 ⭐</el-text>
		<br>
		<el-text class="comments-text"> 欢迎 游戏/角色相关，以及对于我们的网站建设的意见反馈</el-text>
		<div style="margin-bottom: 20px;"></div>

		<Waline :serverURL="serverURL" :path="path" :reaction="[]"/>
	</div>

	
</template>

<style scoped lang="scss">
.comments{
	margin: 0 8px;
	min-height: (calc(100vh - 80px - 58px))
}
.comments-text{
	font-size: 1rem;
	margin: 4px auto;
}
</style>