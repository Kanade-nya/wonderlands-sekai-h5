<template>
	<el-row class="wrapper verify" style="">
		<el-col :xs="24" :sm="12" :xl="12" class="verify-wrap flex-inline">
			<el-form :model="user" ref="userForm" status-icon label-width="100px" style="width: 375px;">
				<el-form-item>
					<img src="/public/vite.svg" alt="RYMCU" class="icon-rymcu">
				</el-form-item>
				<el-form-item label="账号" prop="account" :rules="[{ required: true, message: '请输入账号', trigger: 'blur' }]">
					<el-input v-model="user.account" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password" :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
					<el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
				</el-form-item>
				<el-form-item>
					<el-link rel="nofollow" style="float: right;" :underline="false" @click="forgetPassword">忘记密码</el-link>
				</el-form-item>
				<el-form-item>
					<el-button style="width: 60%;" type="primary" @click="login" :loading="loginLoading" plain>立即登录</el-button>
					<el-button style="width: 32%;" @click="register" plain>注册</el-button>
				</el-form-item>
			</el-form>
			<!-- 忘记密码对话框 -->
			<el-dialog :visible="forget" title="忘记密码" width="30%">
				<el-form :model="forgetForm" ref="forgetFormRef">
					<el-form-item label="邮箱" prop="email" :rules="[{ required: true, message: '请输入邮箱', trigger: 'blur' }]">
						<el-input v-model="forgetForm.email" autocomplete="off"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button :loading="loading" @click="sendEmailCode" plain>发送验证码</el-button>
						<el-button @click="hideForgetPasswordDialog" plain>取消</el-button>
					</el-form-item>
				</el-form>
			</el-dialog>
		</el-col>
		<el-col :xs="24" :sm="12" :xl="12" class="intro vditor-reset verify__sign">
			<div>
				<h2>欢迎来到 RYMCU</h2>
				<p><a rel="nofollow" href="/">RYMCU</a> 是一个嵌入式知识学习交流平台，专注于单片机学习。</p>
				<p>我们正在构建一个小众社区。大家在这里相互<strong>信任</strong>，以<em>平等 • 自由 • 奔放</em>的价值观进行分享交流。最终，希望大家能够找到与自己志同道合的伙伴，共同成长。
				</p>
				<p>最后请大家共同爱护这个<i>自由</i>的交流环境，相信这里一定是你注册过的所有社区中用户体验最好的 😍</p>
			</div>
		</el-col>
	</el-row>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import axios from 'axios';
// import { useStore } from 'pinia';
import { useMenuStore } from '@/stores/useMenuStore.js'; // 假设菜单状态管理在这个路径

// 表单数据
const user = ref({
	account: '',
	password: ''
});

// 忘记密码表单数据
const forgetForm = ref({
	email: ''
});

// 控制忘记密码对话框的显示与隐藏
const forget = ref(false);

// 加载状态
const loading = ref(false);
const loginLoading = ref(false);

// 历史跳转链接
const historyUrl = ref('');

// 路由实例
const router = useRouter();

// Pinia 状态管理
const menuStore = useMenuStore();

const userForm = ref(null);
// 登录方法
const login = async () => {

	await userForm.value.validate(async (valid) => {
		if (valid) {
			loginLoading.value = true;
			const data = {
				account: user.value.account,
				password: user.value.password
			};
			try {
				// 这里假设 $auth.loginWith 是一个异步方法，需要根据实际情况替换
				const response = await loginWith('local', { data });
				if (response.success) {
					// 这里假设 $auth.setUserToken 是一个设置用户令牌的方法，需要根据实际情况替换
					setUserToken(response.data.token, response.data.refreshToken);
					if (historyUrl.value) {
						window.location.href = historyUrl.value;
					}
				}
				loginLoading.value = false;
			} catch (err) {
				loginLoading.value = false;
				console.log(err);
			}
		} else {
			return false;
		}
	});
};

// 注册方法
const register = () => {
	router.push({
		name: 'register'
	});
};

// 忘记密码方法
const forgetPassword = () => {
	forget.value = true;
};

// 隐藏忘记密码对话框
const hideForgetPasswordDialog = () => {
	forget.value = false;
};

// 发送忘记密码验证码
const sendEmailCode = () => {
	loading.value = true;
	const email = forgetForm.value.email;
	if (!email) {
		return;
	}
	const data = {
		email
	};
	axios.get('/api/console/get-forget-password-email', {
		params: data
	}).then((res) => {
		loading.value = false;
		forget.value = false;
		if (res.data) {
			ElMessage.success(res.data.message);
		}
	}).catch(() => {
		loading.value = false;
		ElMessage.error('发送验证码失败，请稍后重试');
	});
};

// 挂载时设置活跃菜单并获取历史跳转链接
onMounted(() => {
	menuStore.setActiveMenu('login');
	historyUrl.value = router.currentRoute.value.query.historyUrl || '';
});
</script>

<style lang="scss" scoped>
.wrapper {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100%;
}
.icon-rymcu {
	margin: 0 auto;
	display: block;
	height: 4rem;
}

.verify {

	&.verify-wrap {
		// width: 60%;
	}

	&.intro {
		padding: 50px;
		background-color: #f1f7fe;
		// width: 40%;
		color: #616161;
	}
}

.flex-inline {
	display: flex;
	align-items: center;
}

.verify__sign {
	background-color: transparent !important;
}

.vditor-reset {
	font-variant-ligatures: no-common-ligatures;
	font-family: Helvetica Neue, Luxi Sans, DejaVu Sans, Tahoma, Hiragino Sans GB, Microsoft Yahei, sans-serif, Apple Color Emoji, Segoe UI Emoji, Noto Color Emoji, Segoe UI Symbol, Android Emoji, EmojiSymbols;
	word-wrap: break-word;
	overflow: auto;
	line-height: 1.5;
	font-size: 16px;
	word-break: break-word;
}
</style>