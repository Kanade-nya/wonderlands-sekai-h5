<template>
	<div class="login-container">
		<div class="login-box">
			<div class="login-title">

				<span><img src="@/public/images/icon.svg" alt="系统图标"></span>
				<div>登录</div>

			</div>
			<el-form :model="loginForm" :rules="loginRules" ref="loginFormRef" class="login-form">
				<el-form-item prop="username">
					<el-input v-model="loginForm.username" placeholder="用户名" class="custom-font">
						<template #prefix>
							<el-icon>
								<User />
							</el-icon>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item prop="password">
					<el-input v-model="loginForm.password" type="password" placeholder="密码" show-password
						@keyup.enter="handleLogin" class="custom-font">
						<template #prefix>
							<el-icon>
								<Lock />
							</el-icon>
						</template>
					</el-input>
				</el-form-item>
				<el-form-item>
					<div class="tools-bar">
						<el-checkbox v-model="loginForm.rememberMe" class="custom-font">记住我</el-checkbox>
						<div class="register">
							<div class="forget-link custom-font" @click="handleForget">
								<div>忘记密码?</div>
							</div>
							<div class="forget-link custom-font" @click="handleRegister">
								<div>注册</div>
							</div>
						</div>
					</div>

				</el-form-item>
				<el-form-item>
					<el-button type="primary" :loading="loading" class="login-button custom-font" @click="handleLogin">
						登录
					</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { User, Lock } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import { useRouter } from "vue-router";
import axios from "axios";
import { useUserInfoStore } from "@/stores/useUserInfoStore.js";
import { localUrl } from "@/utils/methods.js";
import { validateUserToken } from '@/utils/user.js'
import { useUserData } from "@/stores/useUserData.js";
const userData = useUserData()
const router = useRouter()

const handleForget = () => {
	ElNotification({
		title: 'Info',
		message: '还没有，好好记着自己的密码！',
		duration: 2000
	})
}

const handleRegister = () => {
	router.push({
		name: 'UserRegister'
	})
}


// 表单数据
const loginForm = reactive({
	username: '',
	password: '',
	rememberMe: false
})

// 表单验证规则
const loginRules = {
	username: [
		{ required: true, message: '请输入用户名', trigger: 'blur' },
		{ min: 3, max: 20, message: '长度在 3 到 20 个字符', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' },
		{ min: 8, max: 20, message: '长度在 8 到 20 个字符', trigger: 'blur' }
	]
}

const loginFormRef = ref(null)
const loading = ref(false)

// 登录处理
const handleLogin = async () => {
	if (!loginFormRef.value) return

	loginFormRef.value.validate(async (valid) => {
		if (!valid) {
			return ElMessage.error('请正确填写登录信息')
		}
		console.log(loginForm)
		try {
			loading.value = true
			const formData = {
				username: loginForm.username,
				password: loginForm.password
			}
			// 调用API
			const response = await axios.post(
				`${localUrl}/user/login`,
				formData,
				{
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					timeout: 10000
				}
			)
			if (response.data.code === 200) {
				ElMessage.success('登录成功')
				// 存储token
				localStorage.setItem('access_token', response.data.access_token)
				// 获取通过保护路由用户的基本数据
				await axios.get(`${localUrl}/user/protected`, {
					headers: {
						Authorization: `Bearer ${response.data.access_token}`
					}
				}).then(response => {
					// console.log(response)
					// 需要isLogin === 1 让navbar在点击头像的时候跳转到用户中心
					if (response.status === 200) {
						userData.setUserData({
							isLogin: 1,
							...response.data.user_info,
						})
					}
				})

				// 导入并使用 userInfoStore
				const userInfoStore = useUserInfoStore();
				// 触发重新验证
				userInfoStore.triggerRevalidation();

				await validateUserToken()


				// 这里可以添加路由跳转
				// router.push('/')
				router.replace('/')
				console.log('登录成功')
			} else {
				ElMessage.error(response.data.detail || '登录失败')
				// ElMessage.error(response.message )
			}
		} catch (error) {
			console.error('登录异常', error)
			ElMessage.error(error.response.data.detail)
		} finally {
			loading.value = false
		}
	})
}

onMounted(() => {
	// 如果之前记住了用户名，可以从localStorage获取
	// const savedUsername = localStorage.getItem('savedUsername')
	// if (savedUsername) {
	// 	loginForm.username = savedUsername
	// 	loginForm.rememberMe = true
	// }
	const token = localStorage.getItem('access_token')
	if (!token) {
		console.log('没有token')
	} else {
		axios.get(`${localUrl}/user/protected`, {
			headers: {
				Authorization: `Bearer ${token}`
			}
		}).then(response => {
			console.log(response)
			if (response.status === 200) {
				return true;
			} else {
				localStorage.removeItem('access_token');
				return false;
			}
		})
	}
})
</script>

<style lang="scss" scoped>
.custom-font {
	font-family: "Noto Serif SC", sans-serif !important;
}

.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f5f7fa;

	.login-box {
		width: 400px;
		padding: 40px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

		.login-title {
			//display: flex;
			//justify-content: center;
			margin-bottom: 30px;
			text-align: center;
			font-size: 24px;
			font-weight: bold;
			color: #303133;

			span {
				//width: 24px;
				//height: 24px;
				//display: flex;
				//flex-direction: column;
				//justify-content: center;
				margin: 0 2px;

				img {
					width: 24px;
					height: 24px;
				}
			}
		}

		.login-form {
			.tools-bar {
				display: flex;
				justify-content: space-between;
				width: 100%;

				.forget-link {
					margin-left: 4px;
				}

				.register {
					display: flex;
					justify-content: center;

				}
			}

			.login-button {
				width: 100%;
			}

			.forget-link {
				//float: right;
				font-size: 14px;
				color: #409eff;
				cursor: pointer;

				&:hover {
					text-decoration: underline;
				}
			}


		}
	}
}

// 输入框文本使用自定义字体
input {
	font-family: "Noto Serif SC", sans-serif !important;
}

// placeholder使用自定义字体
input::placeholder {
	font-family: "Noto Serif SC", sans-serif !important;
}

:deep(.el-input__inner) {
	font-family: "Noto Serif SC", sans-serif !important;
}
</style>