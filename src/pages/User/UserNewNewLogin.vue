<template>
	<div class="login-container">
		<div class="login-box">
			<h2 class="login-title">系统登录</h2>

			<el-form :model="loginForm" :rules="rules" ref="loginFormRef">
				<el-form-item prop="username">
					<el-input
						v-model="loginForm.username"
						placeholder="用户名"
						:prefix-icon="User">
					</el-input>
				</el-form-item>

				<el-form-item prop="password">
					<el-input
						v-model="loginForm.password"
						type="password"
						placeholder="密码"
						:prefix-icon="Lock"
						show-password>
					</el-input>
				</el-form-item>

				<el-form-item>
					<el-checkbox v-model="loginForm.remember">
						记住我<el-link type="primary" class="forgot-pwd" @click="forgotPassword">忘记密码?</el-link>
					</el-checkbox>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" class="login-btn" @click="submitForm" :loading="loading">登录</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { User, Lock } from '@element-plus/icons-vue'
import Mock from 'mockjs'

// 加载状态
const loading = ref(false)

// 设置Mock数据
onMounted(() => {
	Mock.mock('/api/login', 'post', (options) => {
		const { username, password } = JSON.parse(options.body)

		// 模拟成功登录
		if (username && password) {
			return {
				code: 200,
				message: '登录成功',
				data: {
					userId: Mock.Random.id(),
					username,
					token: Mock.Random.guid(),
					avatar: Mock.Random.image('100x100', '#50B347', '#FFF', 'Avatar')
				}
			}
		} else {
			return {
				code: 401,
				message: '用户名或密码错误',
				data: null
			}
		}
	})
})

// 表单引用
const loginFormRef = ref(null)

// 表单数据
const loginForm = reactive({
	username: '',
	password: '',
	remember: false
})

// 表单验证规则
const rules = {
	username: [
		{ required: true, message: '请输入用户名', trigger: 'blur' }
	],
	password: [
		{ required: true, message: '请输入密码', trigger: 'blur' }
	]
}

// 提交表单
const submitForm = () => {
	loginFormRef.value.validate(async (valid) => {
		if (!valid) {
			return ElMessage.error('请输入用户名和密码')
		}

		loading.value = true

		try {
			// 发送模拟请求
			const response = await fetch('/api/login', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify({
					username: loginForm.username,
					password: loginForm.password
				})
			})

			const result = await response.json()

			if (result.code === 200) {
				ElMessage.success(result.message)

				// 如果选择记住我，保存用户信息到本地
				if (loginForm.remember) {
					localStorage.setItem('user', JSON.stringify({
						username: loginForm.username,
						token: result.data.token
					}))
				}

				// 这里可以添加登录成功后的逻辑，如跳转到首页等
			} else {
				ElMessage.error(result.message)
			}
		} catch (error) {
			ElMessage.error('登录失败，请稍后重试')
			console.error(error)
		} finally {
			loading.value = false
		}
	})
}

// 忘记密码
const forgotPassword = () => {
	ElMessage.info('忘记密码功能开发中...')
}
</script>

<style lang="scss" scoped>
.login-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f5f7fa;

	.login-box {
		width: 480px;
		padding: 40px;
		background-color: #ffffff;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

		.login-title {
			text-align: center;
			margin-bottom: 30px;
			font-size: 24px;
			font-weight: 500;
			color: #333;
		}

		.login-btn {
			width: 100%;
			height: 45px;
			font-size: 16px;
			margin-top: 10px;
			background-color: #409eff;
			border-color: #409eff;
		}

		.forgot-pwd {
			float: right;
			margin-left: 8px;
		}

		:deep(.el-input__inner) {
			height: 45px;
		}

		:deep(.el-input__prefix) {
			left: 10px;
		}
	}
}
</style>