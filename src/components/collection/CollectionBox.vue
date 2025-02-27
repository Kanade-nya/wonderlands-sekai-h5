<!--合集功能的BOX-->

<script setup >
import {ref, defineProps} from 'vue'
import {useRouter} from "vue-router";

const router = useRouter();
const props = defineProps({
	id: {
		type: Number,
		required: true,
		default: ''
	},
	cover: {
		type: [String, null],
		default: ''
	},
	description: {
		type: String,
		default: ''
	},
	date: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: ''
	}
})

console.log('props', props)

const formatDate = (dateString) => {
	const date = new Date(dateString)
	const year = date.getFullYear()
	const month = date.getMonth() + 1 // 月份从0开始，需要加1
	const day = date.getDate()
	return `${year}-${month}-${day}`
}

const jumpToId = () => {
	router.push({
		path: `/c/detail/${props.id}`
	})
}
</script>

<template>
	<div class="post-card-item default post-card-item card" show-author="true">
		<div href="#" class="a-div" rel="follow" @click="jumpToId">
			<div class="arco-image arco-image-with-footer-inner post-card-image">
				<img class="arco-image-img" :src="props.cover"
				     style="object-fit: cover;" alt="">
				<!--v-if-->
<!--				<div class="arco-image-footer" prefix-cls="arco-image">&lt;!&ndash;v-if&ndash;&gt;-->
<!--					<div class="arco-image-footer-extra">-->
<!--                        <span class="badge bg-gradient-light badge-sm false text-dark!">-->
<!--                            <i class="vikacg-credit xs vikacg-icon"></i>-->
<!--                            <span class="small">支付积分</span>-->
<!--                        </span>-->
<!--					</div>-->
<!--				</div>-->
			</div>
		</div>
		<div class="post-card-info">
			<h4 class="title">
				<a href="#" class="text-dark!" rel="follow">
					{{ props.name }}
				</a>
			</h4>
			<p class="description text-muted">
				<a href="#" class="text-muted" rel="follow">{{ props.description }}</a>
			</p>
			<div class="metadata-box">
				<!--				<div class="cat-info">-->
				<!--					<a aria-current="page" href="/reads/acg"-->
				<!--					   class="router-link-active router-link-exact-active post-list-cat-item b2-radius" target="_blank"-->
				<!--					   rel="follow" id="4E2C0FA8-4D36-455F-82C1-9CA207A5EAE0" style="color: rgb(235, 80, 126);">专栏区-二次元（ACG）</a>-->
				<!--				</div>-->
				<!-- 下面是 点赞按钮-->
				<!--
				<a href="/p/98386.html" class="count-info" target="_blank" rel="follow"
				   id="6FF0CA0A-C716-4E78-94C3-A8175027E56C">
					<li class="count-item Post-list-meta-like"><i class="vikacg-love xs vikacg-icon icon"></i><span
						class="value">13</span></li>
					<li class="count-item Post-list-meta-comment"><i class="vikacg-comment xs vikacg-icon icon"></i><span
						class="value">27</span></li>
					<li class="count-item Post-list-meta-views"><i class="vikacg-visibility xs vikacg-icon icon"></i><span
						class="value">9.7k</span></li>
				</a>
				-->
			</div>
			<div class="post-card-author">
				<div class="author-info">
					<a href="#" class="post-list-meta-avatar" rel="follow">
						<img class="avatar avatar-xs only-pc"
						     src="https://thirdqq.qlogo.cn/ek_qqapp/AQVDrHCPiaOEZREfUh4MuO93hQ01LMrkvHTX6KAHgF5KaAeBdwX32CaUYZPZqicfc7cCNjN85TJ1ic8qNhX5IicyGkMzBsgPnMia1hVJlFSUULlib2o48Xia5g/100">
						<span class="post-user-name">Admin</span>
					</a>
				</div>
				<div class="create-time">{{ formatDate(props.date) }}</div>
			</div>
		</div>
	</div>
</template>

<style scoped lang="scss">


.post-card-item {
	background-color: #fff;
	border-radius: 6px;
	width: calc(33% - 4px);
	box-shadow: 0 4px 6px -1px rgba(0, 0, 0, .1), 0 2px 4px  -1px rgba(0, 0, 0, .06);
	//margin-bottom: 12px;

	margin: 0 auto 12px;

	a, .a-div {
		color: #344767;
		letter-spacing: 0;
		text-decoration: none !important;
		cursor: pointer;

		.post-card-image {
			border-radius: 12px 12px 0 0 !important;
			background-color: #000;
			border-radius: 6px 6px 0 0;
			height: 177px;
			width: 100%;
		}

		.arco-image {
			border-radius: var(--border-radius-small);
			display: inline-block;
			position: relative;

			.arco-image-img {
				//border-radius: 0;
				height: 100%;
				width: 100%;
				vertical-align: center;
				object-fit: cover;
				border-radius: 8px;
			}

			.arco-image-footer {
				align-items: center;
				background: linear-gradient(1turn, rgba(0, 0, 0, .3), transparent);
				border-bottom-left-radius: var(--border-radius-small);
				border-bottom-right-radius: var(--border-radius-small);
				bottom: 0;
				box-sizing: border-box;
				color: var(--color-white);
				left: 0;
				padding: 9px 16px;
				position: absolute;

				.arco-image-footer-extra {
					flex: 0 0 auto;

					.badge-sm {
						border-radius: .2rem;
						font-size: .625rem;
						line-height: 1;
						padding: .25rem .4rem;

						.small {
							font-size: .875em;
						}
					}
				}
			}

			.arco-image-footer {
				display: flex;
				max-width: 100%;
				width: 100%;
			}
		}
	}

	.post-card-info {
		box-sizing: border-box;
		width: 100%;

		.title {
			display: -webkit-box;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 1;
			font-size: 15px;
			margin: 11px 8px 5px;
			overflow: hidden;

			.text-dark\! {
				--un-text-opacity: 1 !important;
				//color: rgb(52 71 103/ 1 !important) !important;
			}
		}

		.description {
			color: #797c80;
			display: -webkit-box;
			font-size: 12px;
			-webkit-box-orient: vertical;
			-webkit-line-clamp: 2;
			margin: 0 8px 13px;
			overflow: hidden;
			word-break: break-all;

			.text-muted {
				color: #7b809a !important;
			}
		}

		.metadata-box {
			align-items: center;
			display: flex;
			margin: 0 8px 10px;

			.cat-info {
				display: flex;
				flex: auto;
				gap: 5px;
				//width: -moz-fit-content;
				width: fit-content;
			}

			.count-info {
				align-items: center;
				display: flex;
				gap: 10px;
				justify-content: flex-end;
				list-style: none;
				//width: -moz-fit-content;
				width: fit-content;

				.count-item {
					align-items: center;
					display: flex;
					gap: 5px;
					justify-content: center;
				}
			}
		}

		.post-card-author {
			align-items: center;
			border-top: 1px solid #d9d9d9;
			display: flex;
			justify-content: space-between;
			padding: 10px 8px 12px;

			.author-info {
				.post-list-meta-avatar {
					align-items: center;
					display: flex;
					flex: auto;
					gap: 10px;

					.avatar {
						align-items: center;
						border-radius: 50rem;
						color: #fff;
						display: inline-flex;
						font-size: 1rem;
						height: 48px;
						justify-content: center;
						transition: all .2s ease-in-out;
						width: 48px;
						max-width: unset;
					}

					.avatar-xs {
						height: 24px;
						width: 24px;
					}

					.post-user-name {
						font-size: 8pt;
					}
				}
			}

			.create-time {
				font-size: 8pt;
				//width: -moz-fit-content;
				width: fit-content;
			}
		}
	}
}


@media screen and (max-width: 768px) {
	.post-card-item {
		width: calc(50% - 5px);
	}
}
</style>