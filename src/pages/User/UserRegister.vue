<template>
	<el-row class="wrapper verify" >
		<el-col :xs="24" :sm="12" :xl="12" class="verify-wrap flex-inline">
			<el-form :model="user" ref="userForm" status-icon label-width="100px" style="width: 375px;">
				<el-form-item>
					<img src="/public/vite.svg" alt="RYMCU" class="icon-rymcu">
				</el-form-item>
				<el-form-item label="邮箱" prop="email"
				              :rules="[
                  { required: true, message: '请输入邮箱地址', trigger: 'blur' },
                  { type: 'email', message: '请输入正确的邮箱地址', trigger: ['blur', 'change'] }]">
					<el-input v-model="user.email" autocomplete="off"></el-input>
				</el-form-item>
				<el-form-item label="密码" prop="password"
				              :rules="[{ required: true, message: '请输入密码', trigger: 'blur' }]">
					<el-input type="password" v-model="user.password" autocomplete="off" show-password></el-input>
				</el-form-item>
				<el-form-item label="确认密码" prop="confirmPassword"
				              :rules="[{ required: true, message: '请输入确认密码', trigger: 'blur' }]">
					<el-input type="password" v-model="user.confirmPassword" autocomplete="off" show-password></el-input>
				</el-form-item>
				<el-form-item label="验证码" prop="code"
				              :rules="[{ required: true, message: '请输入验证码', trigger: 'blur' }]">
					<el-input v-model="user.code" maxlength="6" autocomplete="off">
						<el-button type="email" size="small" slot="append" @click="sendCode" :loading="loading" plain>
							{{ loadText }}
						</el-button>
					</el-input>
				</el-form-item>
				<el-form-item>
					<el-button style="width: 60%;" type="primary" @click="register" :loading="registerLoading" plain>立即注册
					</el-button>
					<el-button style="width: 32%;" @click="login" plain>登录</el-button>
				</el-form-item>
			</el-form>
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
import {useMenuStore} from "@/stores/useMenuStore.js";

// 表单数据
const user = ref({
	email: '',
	code: '',
	password: '',
	confirmPassword: ''
});

// 加载状态
const loading = ref(false);
const registerLoading = ref(false);

// 路由实例
const router = useRouter();

// Pinia 状态管理
const menuStore = useMenuStore();

// 发送验证码
const sendCode = () => {
	loading.value = true;
	const email = user.value.email;
	if (!email) {
		return;
	}
	// 这里应该是发送验证码的请求，假设请求接口为 /api/console/get-register-code
	// axios.get('/api/console/get-register-code', { params: { email } })
	//   .then(() => {
	//     loading.value = false;
	//     ElMessage.success('验证码发送成功');
	//   })
	//   .catch(() => {
	//     loading.value = false;
	//     ElMessage.error('验证码发送失败');
	//   });
};

// 注册方法
const register = () => {
	registerLoading.value = true;
	const data = user.value;
	axios.post('/api/console/register', data)
		.then((res) => {
			registerLoading.value = false;
			if (res.data) {
				ElMessage.success("注册成功！");
				router.push({
					name: 'login'
				});
			}
		})
		.catch(() => {
			registerLoading.value = false;
			ElMessage.error("注册失败，请稍后重试");
		});
};

// 跳转到登录页面
const login = () => {
	router.push({
		name: 'login'
	});
};

// 挂载时设置活跃菜单
onMounted(() => {
	menuStore.setActiveMenu('register');
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