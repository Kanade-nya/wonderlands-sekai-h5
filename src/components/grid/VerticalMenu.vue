<template>
	<div class="vertical-menu">
		<div class="total-menu">
			<div
				class="total-sub-menu"
				@mouseenter="showSubPanel('type')"
			>
				<span>类型分类</span>
				<div v-if="showSub === 'type'"
				     class="total-sub-menu-panel"
				     @mouseenter="showSubPanel('type')"
				     @mouseleave="showSubPanel('')"
				>
					<div class="total-menu-subtitle">类型分类</div>
					<div class="total-menu-item el-link" @click="handleClick('birthday')">
						<!--				<i class="el-icon-document"></i>-->
						<span>生日贺图</span>
					</div>
					<div class="total-menu-item el-link" @click="handleClick('celebration')">
						<!--				<i class="el-icon-chat-line-round"></i>-->
						<span>庆典贺图</span>
					</div>
					<div class="total-menu-item el-link" @click="handleClick('2dmv')">
						<!--				<i class="el-icon-s-tools"></i>-->
						<span>2DMV</span>
					</div>
					<div class="total-menu-item el-link" @click="handleClick('international')">
						<!--				<i class="el-icon-s-promotion"></i>-->
						<span>外服贺图</span>
					</div>
					<div class="total-menu-item el-link" @click="handleClick('design')">
						<!--				<i class="el-icon-picture-outline-button"></i>-->
						<span>人设/设计图</span>
					</div>
					<div class="total-menu-item el-link" @click="handleClick('others')">
						<!--				<i class="el-icon-gift-box"></i>-->
						<span>其他</span>
					</div>
				</div>
			</div>

			<div class="total-sub-menu" @mouseenter="showSubPanel('character')">
				<span>角色分类</span>

				<div
					v-if="showSub === 'character'"
					class="total-sub-menu-panel"
					@mouseenter="showSubPanel('character')"
					@mouseleave="showSubPanel('')"
				>
					<div class="total-menu-subtitle" >角色分类</div>
					<div
						class="total-menu-item-c el-link"
						@click="handleClick(name)"
						v-for="name in characterName"
						:style="{'--var-color': `${characterColors.find(item => item.name === name).color}` }"

					>
						<span>{{name}}</span>
					</div>
				</div>
			</div>


			<div class="total-sub-menu"  @mouseenter="showSubPanel('band')">
				<span>团队分类</span>
				<div
					v-if="showSub === 'band'"
					class="total-sub-menu-panel"
					@mouseenter="showSubPanel('band')"
					@mouseleave="showSubPanel('')"
				>
					<div class="total-menu-subtitle" >团队分类</div>
					<div
						class="total-menu-item-c total-menu-item-c-b el-link"
						@click="handleClick(name)"
						v-for="name in characterBandName"
						:style="{'--var-color': `${characterColors.find(item => item.name === name).color}` }"

					>
						<span>{{name}}</span>
					</div>
				</div>
			</div>





		</div>



	</div>
</template>

<script>
import {ElMenu, ElMenuItem} from 'element-plus';
import {defineEmits,onMounted} from 'vue'
// import {defaultE}
// import router from "@/router/router.js";
// const emits = defineEmits(['change-menu'])

import {characterColors,characterBand} from "@/utils/methods.js";

const characterName = characterBand.sekaiName;
const characterBandName = characterBand.bandName;
// onMounted(()=>{
// 	const name = store.getSekaiName()
// 	console.log(name)
// })



export default {
	name: 'VerticalMenu',
	data() {
		return {
			characterName,
			characterBandName,
			characterColors,
			showSub: ''
		}
	},
	components: {
		ElMenu,
		ElMenuItem,
	},
	methods: {
		handleClick(item) {
			if (item === 'Leo/need'){
				this.$router.push({
					path: `/filter/Leo/pages/1`
				})
			}else{
				this.$router.push({
					path: `/filter/${item}/pages/1`
				})
			}

			this.$emit('change-menu', 'false')
		},
		showSubPanel(item) {
			this.showSub = item
			if (item === ''){
				// this.$emit('close-father','false')
			}
			// console.log(this.showSub)
		}
	},
};
</script>

<style scoped lang="scss">
.total-menu {
	display: flex;
	flex-direction: column;
	justify-content: center;
	text-align: center;
	.total-sub-menu{
		position: relative;
		box-sizing: border-box;
		display: flex;
		justify-content: center;
		align-items: center;
		flex-wrap: wrap;
		width: 100%;
		cursor: pointer;
		padding: 4px;
		border-radius: 6px;
		font-size: 14px;
		font-weight: 500;
		color: #606266;
		height: 50px;
		&:hover{
			background: #f0f8ff;
		}
	}
	.total-sub-menu-panel{
		position: absolute;
		top: 0;
		left: 135px;
		width: 180px;
		background: #fff;
		border-radius: 12px;
		padding: 0 8px 8px 8px;
		.total-menu-subtitle {
			width: 100%;
			border-bottom: 1px solid #eee;
			font-size: 14px;
			font-weight: 500;
			color: #606266;
			display: flex;
			justify-content: center;
			padding: 8px 0;
			margin: 0 auto;
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

			&:hover {
				background: #f0f8ff;
			}
		}
		.total-menu-item-c {
			box-sizing: border-box;
			width: 50%;
			cursor: pointer;
			height: fit-content;
			transition: all 0.2s ease-in-out;
			//margin: 4px auto;
			padding: 4px;
			border-radius: 6px;

			&:hover {
				//background: #f0f8ff;
				color: white;
				background: var(--var-color);
			}
		}
		.total-menu-item-c-b{
			width: 100%;
		}
	}

}

.vertical-menu {
	box-sizing: border-box;
	width: 140px;
	padding: 8px;
	border-radius: 0 0 12px 12px;
	//height: 100%;
	background-color: #fff;
	//color: #fff;
	z-index: 1000;
}




</style>
