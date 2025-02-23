<script setup>
import {ref, onMounted} from "vue";
import {CaretRight} from "@element-plus/icons-vue";
import requests from "@/utils/requests.js";
import {baseUrl, splitTeamAndCharacter, treeToList} from "@/utils/methods.js";
import router from "@/router/router.js";

const team_info = ref([])
const character_info = ref([]);
const type_info = ref([]);

const getKeyAndId = async () => {
	const characterId = await requests.get(
		`${baseUrl}/api2/character/tree`,
	)
	if (characterId.status === 200) {
		// console.log(treeToList(characterId.data.data))
		[team_info.value, character_info.value] = [...splitTeamAndCharacter(characterId.data.data)];
	}
	const typeId = await requests.get(
		`${baseUrl}/api2/image_type/tree`,
	)
	if (typeId.status === 200) {
		type_info.value = (treeToList(typeId.data.data));
	}
}

onMounted(() => {
	getKeyAndId()
})

const jumpToTeam = (id) => {
	router.push({path: `/filter/${id}/pages/1`,query: {type: 'team'}})
}

const jumpToCharacter = (id) => {
	router.push({path: `/filter/${id}/pages/1`,query:{type:'character'}})
}

const jumpToType = (id) => {
	router.push({path: `/filter/${id}/pages/1`,query:{type:'type'}})
}
</script>

<template>
	<div class="collapse">
		<el-collapse>
			<el-collapse-item title="Filter" :icon="CaretRight">
				<div class="el-collapse-item">
					<div class="block-item">
						<el-col :span="3" class="label">团队</el-col>
						<el-row class="row-item" :gutter="10" style="width: 200px;">
							<el-col :span="6" class="col-item" v-for="item in team_info" :key="item.id" >
								<el-image :src="item.avatar" alt=""  :fit="'cover'" @click="jumpToTeam(item.id)"></el-image>
							</el-col>
						</el-row>
					</div>
					<div class="block-item">
						<el-col :span="3" class="label">角色</el-col>
						<el-row class="row-item row-item-character" :gutter="10">
							<el-col :span="6" class="col-item" v-for="item in character_info" :key="item.id" >
								<el-image :src="item.avatar" alt=""  :fit="'cover'" @click="jumpToCharacter(item.id)"></el-image>
							</el-col>
						</el-row>
					</div>
					<div class="block-item">
						<el-col :span="3" class="label">类型</el-col>
						<el-row class="row-item" :gutter="10">
							<el-col :span="6" class="col-item" v-for="item in type_info" :key="item.id">
								<div class="col-item-type" @click="jumpToType(item.id)">
									{{ item.name }}
								</div>
							</el-col>
						</el-row>
					</div>
				</div>

			</el-collapse-item>
		</el-collapse>
	</div>
</template>

<style scoped lang="scss">
@media  screen and (max-width: 768px){
	.col-item-type{
		font-size: 13px;
		padding-left: 0 !important;
		padding-right: 0 !important;

	}
}
.collapse {
	margin: 4px 0 12px;
	padding: 0 10px;


	.el-collapse-item {
		padding: 0 20px;
	}

	.block-item {
		display: flex;
		.label{
			cursor: default;
			margin-top: 12px;
		}
		.row-item {
			margin: 8px 0 !important;

			.label {
				display: flex;
				justify-content: right;
				padding-right: 8px;
				cursor: default;
			}

			.col-item {
				display: flex;
				justify-content: center;
				border-radius: 4px;
				margin: 2px 0;
				padding: 0 !important;
				:deep(.el-image){
					//width: 32px;
					//height: 32px;
					//padding: 4px;
					//object-fit: cover;
					padding: 2px;
					border-radius: 4px;
					&:hover {
						cursor: pointer;
						color: #409EFF;
						background-color: #F2F6FC;
					}
				}
				:deep(.el-image__inner){
					width: 32px;
					height: 32px;
				}
				.col-item-type{
					//margin-top: 4px ;
					padding: 4px 8px;
					border-radius: 4px;
					&:hover {
						cursor: pointer;
						color: #409EFF;
						background-color: #F2F6FC;
					}
				}
			}

		}
		.row-item-character{
			width: 200px;
			.col-item{
				width: calc(25% - 6px); /* 每个元素占25%，减去gap的一半 */
				text-align: center;
				padding: 8px;

			}
		}
	}
}
:deep(.el-collapse-item__header){
	font-family: "Noto Serif SC", sans-serif !important;
	font-size: 14px;
	font-weight: 500;
	color: #606266;
	padding-left: 20px;
}
</style>