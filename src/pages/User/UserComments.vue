<template>
	<u-comment :config="config" @submit="submit">
		<!-- 启用信息卡槽来自定义用户名和标签 -->
		<template #info="{ user }">
			<div class="user-info-custom">
				<!-- <span class="username">{{ user.username }}</span> -->
				<span class="user-tag">1</span>
			</div>
		</template>
		<!-- <template>导航栏卡槽</template>
		<template #header>头部卡槽</template>
		<template #action="{ user }">动作卡槽{{ user.username }}</template>
		<template #avatar="{ id, user }">头像卡槽{{ user.avatar }}</template>
		<template #info>信息卡槽</template>
		<template #card>用户信息卡片卡槽</template>
		<template #func>功能区域卡槽</template> -->
	</u-comment>
</template>

<script setup>
import { reactive, onMounted, ref, watch } from 'vue'
import { UToast, Time, createObjectURL } from 'undraw-ui'
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";
import axios from "axios";
import { localUrl } from "@/utils/methods.js";
import { useRoute } from 'vue-router';
import COS from 'cos-js-sdk-v5';
import {apiConfig} from "@/config/Config.js";
import { fi } from 'element-plus/es/locale/index.mjs';

const route = useRoute();
const userInfoStore = useUserInfoStore();
const isLogin = ref(false);
const articleId = ref(null);
const temp_id = ref(0)
const upload_images_location = [];

const config = reactive({
	user: {}, // 当前用户信息
	comments: [], // 评论数据
	relativeTime: true, // 开启人性化时间
	show: {
		level: false,    // 关闭等级显示
		homeLink: false, // 关闭个人主页链接跳转
		address: false, // 关闭地址信息
		likes: false    // 关闭点赞按钮显示
	},
	// 添加禁用评论功能的配置
	disabled: !isLogin.value,
	disabledText: '请先登录后再评论',
	// 图片上传
	upload: async (files, finish) => {
		// 模拟请求接口上传处理
		if (files.length > 3) {
			UToast({ message: '最多只能上传三张图片', type: 'error' });
		}
		
		// 清空之前的上传记录
		upload_images_location.length = 0;
		// 创建上传任务数组
		const uploadTasks = [];
		
		for (let file of files) {
			// 上传图片到COS
			console.log(file);
			
			const cos = new COS({
				SecretId: apiConfig.getCosConfig().SecretId, // 替换为你的 SecretId
				SecretKey: apiConfig.getCosConfig().SecretKey, // 替换为你的 SecretKey
			});
			
			const bucketName = 'user-1304757492'; // 替换为你的存储桶名称
			const region = 'ap-guangzhou'; // 替换为你的存储桶区域
			const key = `images/${Date.now()}_${file.name}`; // 生成唯一的文件路径

			const uploadTask = new Promise((resolve, reject) => {
				cos.putObject(
					{
						Bucket: bucketName,
						Region: region,
						Key: key,
						Body: file,
					},
					(err, data) => {
						if (err) {
							UToast({ message: '上传失败', type: 'error' });
							console.error(err);
							reject(err);
						} else {
							UToast({ message: '上传成功', type: 'success' });
							console.log(data.Location);
							upload_images_location.push(`https://${data.Location}`);
							resolve(data.Location);
						}
					}
				);
			});
			uploadTasks.push(uploadTask);
		}
		try {
			// 等待所有上传任务完成
			await Promise.all(uploadTasks);
			console.log('所有图片上传完成:', upload_images_location);
			// 所有图片上传完成后调用finish
			finish(upload_images_location);
		} catch (error) {
			console.error('图片上传过程中出错:', error);
			UToast({ message: '部分图片上传失败', type: 'error' });
			
			// 即使有错误，也返回已成功上传的图片
			if (upload_images_location.length > 0) {
				finish(upload_images_location);
			}
		}
	}
})

/**
 * 评论对象数据结构
 * 存储结构: 一个评论表，通过paretnId是否为空判断类型 评论/回复
 * 层数: 两层
 * 第一层：评论 parentId属性为空; 第二层关系: id等于parentId的数据，则为第二层回复的评论数据
 * 第二层: 回复 parentId属性不为空; 第一层关系: parentId等于第一层id，则为第一层评论的回复数据
 *
 */
const commentsSample = [
	{
		id: '1',
		parentId: null,
		uid: '2',
		content: '床前明月光，疑是地上霜。<br>举头望明月，低头思故乡。<img class="a" id="a" style="width: 50px" src=a onerror="window.location.href=\'https://baidu.com\'">',
		createTime: new Time().add(-1, 'day'),
		user: {
			username: '李白 [唐代]',
			avatar: 'https://static.juzicon.com/images/image-231107185110-DFSX.png',
			homeLink: '/1'
		},
		reply: {
			total: 1,
			list: [
				{
					id: '11',
					parentId: 1,
					uid: '1',
					content: '🤪🤗😒',
					createTime: new Time().add(-3, 'day'),
					user: {
						username: '杜甫 [唐代]',
						avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg',
					}
				}
			]
		}
	},
	{
		id: '2',
		parentId: null,
		uid: '3',
		content: '国破山河在，城春草木深。<br>感时花溅泪，恨别鸟惊心。<br>烽火连三月，家书抵万金。<br>白头搔更短，浑欲不胜簪。',
		createTime: new Time().add(-5, 'day'),
		user: {
			username: '杜甫 [唐代]',
			avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg'
		}
	},
	{
		id: '3',
		parentId: null,
		uid: '2',
		content: '日照香炉生紫烟，遥看瀑布挂前川。<br>飞流直下三千尺，疑是银河落九天。',
		likes: 34116,
		createTime: new Time().add(-2, 'month'),
		user: {
			username: '李白 [唐代]',
			avatar: 'https://static.juzicon.com/images/image-231107185110-DFSX.png',
			homeLink: '/1'
		}
	}
]


// 获取文章评论
const fetchComments = async () => {
	try {
		if (!articleId.value) return;

		const response = await axios.get(`${localUrl}/articles/articles/${articleId.value}/comments`);
		if (response.data && Array.isArray(response.data)) {
			config.comments = response.data;
			temp_id.value = response.data.length;
		}
	} catch (error) {
		console.error('获取评论失败:', error);
		UToast({ message: '获取评论失败', type: 'error' });
	}
};

const loadUserInfo = () => {
	console.log('加载用户信息');
	if (userInfoStore.userInfo.loadingSuccess) { // 判断pinia加载
		if (!userInfoStore.userInfo.isLogin) {
			console.log('未登录');
		} else {
			config.user = {
				id: userInfoStore.userInfo.userId,
				username: userInfoStore.userInfo.userName,
				avatar: userInfoStore.userInfo.userAvatar,
			};
			isLogin.value = true;
		}
		// 加载用户信息后获取评论
		fetchComments();
	} else {
		setTimeout(() => {
			loadUserInfo();
		}, 1000);
	}
};


// // 模拟请求接口获取评论数据
// setTimeout(() => {
// 	// 当前登录用户数据
// 	config.user = {
// 		id: 1,
// 		username: '杜甫 [唐代]',
// 		avatar: 'https://static.juzicon.com/images/image-180327173755-IELJ.jpg',
// 	}
// 	config.comments = comments
// }, 500)


onMounted(() => {
	// 从路由获取文章ID
	articleId.value = route.params.id;
	loadUserInfo();
	// loadUserInfo()
	// config.comments = comments
	// console.log(config)
})

// 监听路由变化，当文章ID变化时重新获取评论
watch(() => route.params.id, (newId) => {
	if (newId && newId !== articleId.value) {
		articleId.value = newId;
		fetchComments();
	}
});

// 提交评论事件
const submit = ({ content, parentId, finish }) => {
	// 再次检查登录状态，确保安全
	if (!isLogin.value) {
		UToast({ message: '请先登录后再评论', type: 'warning' });
		return;
	}

	let str = '提交评论:' + content + ';\t父id: ' + parentId;
	console.log(str);

	// 这里可以替换为真实的API调用
	// 例如：axios.post('/api/comments', {content, parentId})
	axios.post(`${localUrl}/articles/comments`, {
		article_id: articleId.value,
		uid: config.user.id,
		content: content,
		parent_id: parentId
	}).then((response) => {
		console.log('评论成功:', response.data);
		UToast({ message: '评论成功', type: 'info' });
		// 刷新评论列表
		fetchComments();
	}).catch((error) => {
		console.error('评论失败:', error);
		UToast({ message: '评论失败', type: 'error' });
	});
	// // 模拟请求接口生成数据
	// const comment = {
	// 	id: String((temp_id += 1)),
	// 	parentId: parentId,
	// 	uid: config.user.id,
	// 	content: content,
	// 	createTime: new Time().toString(),
	// 	user: {
	// 		username: config.user.username,
	// 		avatar: config.user.avatar
	// 	},
	// 	reply: null
	// }
	// setTimeout(() => {
	// 	finish(comment);
	// 	UToast({message: '评论成功!', type: 'info'});
	// }, 200);
}

</script>

<style lang="scss" scoped>
.user-info-custom {
	display: flex;
	align-items: center;
	gap: 6px;

	.username {
		font-weight: 500;
	}

	.user-tag {
		background-color: #f0f2f5;
		color: #666;
		font-size: 12px;
		padding: 1px 6px;
		border-radius: 4px;
		display: inline-flex;
		align-items: center;
		justify-content: center;
	}
}
</style>