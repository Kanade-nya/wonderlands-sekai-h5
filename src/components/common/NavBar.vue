<!-- src/components/Banner.vue -->
<script setup>
import {ref, defineProps} from 'vue';
import {ArrowDown, Back, Operation, UserFilled} from "@element-plus/icons-vue";
// import GridRow from "@/components/grid/GridRow.vue";
import VerticalMenu from "@/components/grid/VerticalMenu.vue";
// import uniIcons from "@dcloudio/uni-ui/lib/uni-icons/uni-icons.vue";
// import GridRow from "@/components/useful/GridRow.vue";
// import {goBack} from "@/utils/usual";
// import GridRow from "./grid/GridRow.vue";
import {useRouter} from "vue-router";
import MenuPanel from "@/components/common/MenuPanel.vue";
import SearchInput from "@/components/common/SearchInput.vue";
import PhonePanel from "@/components/common/PhonePanel.vue";

const router = useRouter();

let is_selected = ref(1);

const handleClick = function (label, index) {
	is_selected.value = index
	// 在这里添加你想要的点击事件逻辑
}


const goBack = () => {
	// console.log('back')
}
const websiteName = ref('CSQAQ.COM'); // 网站名称
// const isPanelVisible = ref(false);

const defaultProps = defineProps({
	notUseGoBack: {
		type: Boolean,
		default: false
	}
})


const gridStyle = {
	padding: 0,
	borderBottom: 0,
	margin: '4rpx'
}

// 图标数据
const gridItems = ref([
	// {iconType: 'home', label: '首页', url: '/pages/home/home'},
	// {iconType: 'email', label: '邮件', url: '/pages/email/email'},
	// {iconType: 'phone', label: '电话', url: '/pages/phone/phone'},
	// {iconType: 'settings', label: '设置', url: '/pages/settings/settings'},
	// {iconType: 'camera', label: '相机', url: '/pages/camera/camera'},
	// {iconType: 'music', label: '音乐', url: '/pages/music/music'},
	// {iconType: 'video', label: '视频', url: '/pages/video/video'},
	// {iconType: 'map', label: '地图', url: '/pages/map/map'}
	{iconType: 'home', label: '生日贺图', url: '/pages/home/home'},
	{iconType: 'email', label: '庆典贺图', url: '/pages/email/email'},
	{iconType: 'phone', label: '2DMV', url: '/pages/phone/phone'},
	{iconType: 'settings', label: '外服贺图', url: '/pages/settings/settings'},
	{iconType: 'camera', label: '人设/设计图', url: '/pages/camera/camera'},
	{iconType: 'music', label: '其他', url: '/pages/music/music'},
]);

// function onMenuClick() {
// 	return
// 	isPanelVisible.value = !isPanelVisible.value;
// }

function handleMenuItemClick(label, url) {
	// console.log(`Menu item clicked: ${label}, URL: ${url}`);
	// 在这里添加你想要的点击事件逻辑
}


const jump2Home = () => {
	router.push('/')
}

const jump2About = () => {
	router.push('/about')
}

const jump2Uploader = () => {
	router.push('/uploader')
}

const jump2Comments = () => {
	router.push('/comments')
}

const jump2Collection = () => {
	router.push('/c/box')
}

const isPanelVisible = ref(false);

const onMenuClick = () => {
	// console.log('click',isPanelVisible.value)
	isPanelVisible.value = !isPanelVisible.value;
};

const handleOptionSelected = (option) => {
	// 在这里处理选项点击事件，例如更新主页面数据
};

// 点击panel之后自动隐藏
const handleChangeVisible = (visible) => {
	// console.log('handleChangeVisible', visible)
	isPanelVisible.value = false;
};
const handlePanelTrue = () => {
	// console.log('handlePanelTrue')
	isPanelVisible.value = true;
};
const handlePanelFalse = () => {
	// console.log('handlePanelFalse')
	isPanelVisible.value = false;
};

let userAgent = navigator.userAgent

if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) { //判断iPhone|iPad|iPod|iOS
	//alert(navigator.userAgent);
	userAgent = "iOS";
} else if (/(Android)/i.test(navigator.userAgent)) {  //判断Android
	//alert(navigator.userAgent);
	userAgent = "Android";
} else { //pc
	userAgent = "PC";
}


const isPhoneVisible = ref(false);

const onPhoneClick = () => {
	isPhoneVisible.value = !isPhoneVisible.value;
	// console.log(isPhoneVisible.value)
};

const closePhonePanel = () => {
	isPhoneVisible.value = false;
};


const searchInfo = (search_query) =>{
	router.push({
			path: `/search/${search_query}/pages/1`
		}
	)
}
</script>

<template>
	<div class="banner">
		<!--		<view class="user-icon" @click="goBack">-->
		<!--			<uni-icons :type="defaultProps.notUseGoBack ? 'smile-face':'back'" color="#808080" size="24"></uni-icons>-->
		<!--		</view>-->
		<!--		<el-icon>-->
		<!--			<Back/>-->
		<!--		</el-icon>-->
		<span class="website-name website" @click="jump2Home" style="cursor: pointer;">
			<slot name="center">WONDERLANDS×SEKAI</slot>
		</span>

		<span class="website-name phone" @click="jump2Home">
			<slot name="center">W×SEKAI</slot>
		</span>

		<div class="clickable-grids">
			<el-link :underline="false" @click="jump2Home">
				<div class="grid-item" :class="{is_selected: is_selected === 1}" @click="handleClick('展示',1)">
					<span>主页</span>
				</div>
			</el-link>


			<el-link :underline="false" @click="jump2Collection">
				<div class="grid-item" :class="{is_selected: is_selected === 6}" @click="handleClick('合集',6)">
					<span>合集</span>
				</div>
			</el-link>

			<el-link :underline="false" @click="jump2Comments">
				<div class="grid-item" :class="{is_selected: is_selected === 5}" @click="handleClick('展示4',5) ">
					<span>评论</span>
				</div>
			</el-link>


			<el-link :underline="false" @click="jump2About">
				<div class="grid-item bar-about" :class="{is_selected: is_selected === 2}"
				     @click="handleClick('展示2',2)">
					<span>关于</span>
				</div>
			</el-link>


<!--			<div class="select-panel">-->

<!--				<el-link-->
<!--					:underline="false"-->
<!--					@click="onMenuClick"-->
<!--				>-->
<!--					<div class="grid-item bar-about justify"-->
<!--					     @click="handleClick('分类',6)">-->
<!--						<div style="display: flex">-->
<!--							<span>分类</span>-->
<!--							<div class="span-icon">-->
<!--								<el-icon>-->
<!--									<ArrowDown/>-->
<!--								</el-icon>-->
<!--							</div>-->
<!--						</div>-->

<!--					</div>-->
<!--				</el-link>-->


<!--				<transition-->
<!--					name="fade"-->
<!--					class="down-menu"-->
<!--				>-->
<!--					<div v-if="isPanelVisible">-->
<!--						<VerticalMenu-->
<!--							:items="gridItems"-->
<!--							@item-click="handleMenuItemClick"-->
<!--							@change-menu="handleChangeVisible"-->
<!--							@close-father="handlePanelFalse"-->
<!--						/>-->
<!--					</div>-->
<!--				</transition>-->
<!--			</div>-->


		</div>


		<div class="menu-flex">
			<!--			<div class="avatar-div ">-->
			<!--				<el-avatar :icon="UserFilled" class="avatar"/>-->
			<!--			</div>-->
			<div class="search-input-info">
				<search-input
					@click-search="searchInfo"
				></search-input>
			</div>


			<button class="menu-btn" v-if="userAgent !== 'PC'" @click="onPhoneClick">
				<el-icon :size="20">
					<Operation/>
				</el-icon>
			</button>

		</div>
		<!--		<MenuPanel v-if="isPanelVisible" class="panel" @option-selected="handleOptionSelected" />-->

		<!--		&lt;!&ndash; 面板组件 &ndash;&gt;-->


	</div>

	<transition
		name="fade"
		class="phone-menu"
	>
		<div v-if="isPhoneVisible">
			<phone-panel
				@change-menu="closePhonePanel"
			/>
		</div>
	</transition>


</template>


<style lang="scss" scoped>
.span-icon {
	//height: 20px;
	display: flex;
	margin: 0 2px;
	justify-content: center;
	flex-direction: column;
}

.select-panel {
	position: relative;
}

.phone-menu {
	position: fixed;
	top: 48px;
	left: 0;
	width: 100%;
	z-index: 1000;
}

.down-menu {

	box-sizing: border-box;
	width: 140px;
	position: absolute;
	left: 0;
	top: 48px; /* 确保下拉菜单在父元素下方 */
	z-index: 100;
	border-radius: 0 0 12px 12px;
	//padding: 4px 8px 12px 8px;
	background-color: white; /* 确保背景颜色正确 */
	border: 1px solid #eee; /* 添加边框以便更明显 */
	//box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
}


@media screen and (max-width: 768px) {
	//.bar-about{
	//	display: none;
	//}

	.clickable-grids {
		display: none !important;
	}
	.avatar-div {
		display: none !important;
	}
	.clickable-grids .grid-item {
		padding: 0 8px;
	}
	.menu-flex > .menu-btn {
		width: 20px;
		margin-right: 6px;
	}

	.phone {
		display: block !important;
		margin-left: 8px !important;
	}
	.website {
		display: none !important;
	}
	//.bar-about{
	//	display: none;
	//}
	.menu-btn{

	}
}

.search-input-info {
	display: flex;
	justify-content: center;
	flex-direction: column;
}

.phone {
	display: none;
}

.banner {

	position: sticky;
	top: 0px;
	z-index: 100;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	background-color: white;
	padding: 0 10px;
	padding-bottom: 1px;
	//border-radius: 5px;
	justify-content: left;
	height: 48px;
	width: 100%;
	border-bottom: 1px #eee solid;
	//box-shadow: 0px 0px 1px 1px rgba(0, 0, 0, 0.20);
	overflow: visible;

	.banner-tabs {
		height: 48px;

		.el-tabs__header {
			margin-bottom: 0;
		}
	}
}

.user-icon {
	//margin-right: 10px;
	width: 40px;
	//&::after{
	//	content: ' ';
	//	width: 100%;
	//	height: 100%;
	//	position: absolute;
	//	top: 0;
	//	left: 0;
	//	border: 1px solid rgba(0, 0, 0, 0.2);
	//	transform: scale(0.5);
	//	transform-origin: 0 0;
	//	box-sizing: border-box;
	//	border-radius: 10px;
	//}
}

.website-name {
	font-size: 14px;
	font-weight: bold;
	color: orange;
	margin: 0 20px;
	cursor: default;

}

.menu-flex {
	display: flex;
	margin-left: auto;

	.avatar-div {
		margin-right: 8px;
		display: flex;
		flex-direction: column;
		justify-content: center;
		cursor: pointer;

		.avatar {
			width: 25px;
			height: 25px;

		}
	}

}

.menu-btn {
	background-color: transparent;
	border: none;
	margin: 0;
	height: 40px;
	box-sizing: border-box;
	width: 40px;
	padding: 0;
	display: flex;
	justify-content: center;
	flex-direction: column;
	float: right;
	cursor: pointer;
}

.menu-icon {
	color: orange;
	display: flex;
	flex-direction: column;
	justify-content: center;
	height: 40px;
	width: 40px;
}

.panel {
	box-sizing: border-box;
	background-color: white;
	padding: 10px;
	//border: 1px solid #ccc;
	border-top: none;
	border-radius: 0 0 5px 5px;
	//box-shadow: 0 2px 12px rgba(0, 0, 0, 0.1);
	text-align: center;
	font-size: 16px;
	color: #333;
	//margin-top: -1px; /* 使面板紧挨着 banner */
	position: absolute;
	top: 40px;
	width: 20%;
	z-index: 1000;
	right: 4px;
}


/* 过渡效果 */
.fade-enter-active,
.fade-leave-active {
	transition: opacity 0.4s ease;
}

.fade-enter-from,
.fade-leave-to {
	opacity: 0;
}


.clickable-grids {
	display: flex;
	height: 100%;
	//gap: 10px;
	//margin-top: 10px;
	.is_selected {
		border-bottom: 1px solid skyblue;
	}
}

.grid-item {
	padding: 0 20px;
	min-width: 48px;
	//background-color: #f0f0f0;
	//border: 1px solid #ccc;
	cursor: pointer;
	text-align: center;
	height: 100%;

	span {
		//height: fit-content;
		line-height: 48px;
	}
}

.grid-item:hover {
	//background-color: #e0e0e0;
	//background: #eee;
	height: 100%;
}
</style>

