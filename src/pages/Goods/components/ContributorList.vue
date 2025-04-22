<script setup lang="ts">
import { type Contributor } from '../types/index';

defineProps({
	contributors: {
		type: Array as () => Contributor[],
		default: () => []
	}
});
</script>

<template>
	<div class="contributor-list">
		<h4 class="contributor-title">贡献者</h4>
		<div class="contributors">
			<div v-for="(contributor, index) in contributors" :key="index" class="contributor-item">
				<div class="contributor-avatar">
					<img v-if="contributor.avatar" :src="contributor.avatar" alt="贡献者头像">
					<div v-else class="avatar-placeholder">{{ contributor.name.charAt(0) }}</div>
				</div>
				<span class="contributor-name">{{ contributor.name }}</span>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">
.contributor-list {
	margin-top: 16px;

	.contributor-title {
		font-size: 16px;
		margin-bottom: 12px;
		color: #303133;
	}

	.contributors {
		display: flex;
		flex-wrap: wrap;
		gap: 12px;

		.contributor-item {
			display: flex;
			align-items: center;

			.contributor-avatar {
				width: 32px;
				height: 32px;
				border-radius: 50%;
				overflow: hidden;
				margin-right: 8px;

				img {
					width: 100%;
					height: 100%;
					object-fit: cover;
				}

				.avatar-placeholder {
					width: 100%;
					height: 100%;
					display: flex;
					align-items: center;
					justify-content: center;
					background-color: #e6e8eb;
					color: #606266;
					font-weight: bold;
				}
			}

			.contributor-name {
				font-size: 14px;
				color: #606266;
			}
		}
	}
}
</style>