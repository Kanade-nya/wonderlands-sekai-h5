<script setup lang="ts">
import {useRouter} from "vue-router";
import { defineEmits } from "vue";
const router = useRouter();
const jump2Home = () => {
	router.push('/')
	emits('change-menu', 'false')
}

const jump2About = () => {
	router.push('/about')
	emits('change-menu', 'false')
}

const jump2Comments = () => {
	router.push('/comments')
	emits('change-menu', 'false')
}

const jump2Collection = () => {
	router.push('/c/box')
	emits('change-menu', 'false')
}
// const handleClick = (item: String) => {
// 	if (item === 'Leo/need') {
// 		router.push({
// 			path: `/filter/Leo/pages/1`
// 		})
// 	} else {
// 		router.push({
// 			path: `/filter/${item}/pages/1`
// 		})
// 	}
// 	emits('change-menu', 'false')
// }

const emits = defineEmits(['change-menu'])
</script>

<template>
	<div class="phone-panel-layout">
		<div class="grid-container">
			<div class="title">跳转</div>
			<el-link :underline="false" @click="jump2Home" class="link">
				<div class="grid-item">
					<span>主页</span>
				</div>
			</el-link>


			<el-link :underline="false" @click="jump2Comments" class="link">
				<div class="grid-item">
					<span>评论</span>
				</div>
			</el-link>


			<el-link :underline="false" @click="jump2About" class="link">
				<div class="grid-item bar-about">
					<span>关于</span>
				</div>
			</el-link>
			<el-link :underline="false" @click="jump2Collection" class="link">
				<div class="grid-item bar-about">
					<span>合集</span>
				</div>
			</el-link>
			<div class="link"></div>
		</div>
<!--		<div class="grid-container-x">-->
<!--			<div class="title">分类</div>-->
<!--			<div class="total-menu-item el-link" @click="handleClick('birthday')">-->
<!--				&lt;!&ndash;				<i class="el-icon-document"></i>&ndash;&gt;-->
<!--				<span>生日贺图</span>-->
<!--			</div>-->
<!--			<div class="total-menu-item el-link" @click="handleClick('celebration')">-->
<!--				&lt;!&ndash;				<i class="el-icon-chat-line-round"></i>&ndash;&gt;-->
<!--				<span>庆典贺图</span>-->
<!--			</div>-->
<!--			<div class="total-menu-item el-link" @click="handleClick('2dmv')">-->
<!--				&lt;!&ndash;				<i class="el-icon-s-tools"></i>&ndash;&gt;-->
<!--				<span>2DMV</span>-->
<!--			</div>-->
<!--			<div class="total-menu-item el-link" @click="handleClick('international')">-->
<!--				&lt;!&ndash;				<i class="el-icon-s-promotion"></i>&ndash;&gt;-->
<!--				<span>外服贺图</span>-->
<!--			</div>-->
<!--			<div class="total-menu-item el-link" @click="handleClick('design')">-->
<!--				&lt;!&ndash;				<i class="el-icon-picture-outline-button"></i>&ndash;&gt;-->
<!--				<span>人设/设计图</span>-->
<!--			</div>-->
<!--			<div class="total-menu-item el-link" @click="handleClick('others')">-->
<!--				&lt;!&ndash;				<i class="el-icon-gift-box"></i>&ndash;&gt;-->
<!--				<span>其他</span>-->
<!--			</div>-->
<!--		</div>-->
	</div>
</template>

<style scoped lang="scss">
.phone-panel-layout {

	box-sizing: border-box;
	z-index: 1000;
	display: flex;
	padding: 20px 100px 0;
	//justify-content: center;
	//align-items: center;
	flex-direction: column;
	width: 100%;
	height: calc(100vh - 48px);
	background: #ffffff;
	//opacity: 0.8;
	.grid-container {
		display: flex;
		//flex-direction: column;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		flex-wrap: wrap;
		.link {
			width: 50%;
			font-size: 16px;
		}

		.title {
			//border-bottom: 1px solid #eee;
			//font-size: 18px;
			//width: fit-content;
			width: 100%;
			text-align: center;
			font-size: 20px;
			font-weight: 500;
			color: #606266;
		}

	}
	.grid-container-x{
		display: flex;
		justify-content: center;
		align-items: center;
		font-size: 20px;
		flex-wrap: wrap;
		.title {
			//border-bottom: 1px solid #eee;
			font-size: 18px;
			width: 100%;
			text-align: center;
		}

		.total-menu-item {
			box-sizing: border-box;
			width: 50%;
			cursor: pointer;
			height: fit-content;
			transition: all 0.2s ease-in-out;
			//margin: 4px auto;
			padding: 4px;
			border-radius: 6px;
		}
	}
}
</style>