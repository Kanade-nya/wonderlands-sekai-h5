<template>
	<div class="register-container">
		<div class="register-box">
			<h2 class="register-title">注册</h2>

			<el-form :model="registerForm" :rules="rules" ref="registerFormRef">
				<el-form-item prop="username">
					<el-input
						v-model="registerForm.username"
						placeholder="用户名"
						:prefix-icon="User">
					</el-input>
				</el-form-item>

				<el-form-item prop="password">
					<el-input
						v-model="registerForm.password"
						type="password"
						placeholder="密码"
						:prefix-icon="Lock"
						show-password>
					</el-input>
				</el-form-item>

				<el-form-item prop="confirmPassword">
					<el-input
						v-model="registerForm.confirmPassword"
						type="password"
						placeholder="确认密码"
						:prefix-icon="Lock"
						show-password>
					</el-input>
				</el-form-item>

				<el-form-item prop="email">
					<div style="display: flex;justify-content: space-between;width: 100%;gap: 20px">
						<el-input
							v-model="registerForm.email"
							placeholder="邮箱"
							:prefix-icon="Message">
						</el-input>
						<el-button :disabled="isSendingCode" @click="sendVerificationCode" class="custom-font">
							{{ isSendingCode ? `${countdown}s` : '发送验证码' }}
						</el-button>
					</div>

				</el-form-item>

				<el-form-item prop="verificationCode">
					<el-input
						v-model="registerForm.verification_code"
						placeholder="邮箱验证码"
						:prefix-icon="Postcard">
					</el-input>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" class="register-btn custom-font" @click="submitForm">注册</el-button>
				</el-form-item>
			</el-form>
		</div>
	</div>
</template>

<script setup>
import {ref, reactive, onMounted, onUnmounted} from 'vue'
import {ElMessage} from 'element-plus'
import {User, Lock, Message, Postcard} from "@element-plus/icons-vue";

import axios from "axios";
import {useRouter} from "vue-router";

const router = useRouter()

// 表单引用
const registerFormRef = ref(null)

// 表单数据
const registerForm = reactive({
	username: '',
	password: '',
	confirmPassword: '',
	remember: false,
	email: '',
	verification_code: '',
})

// 表单验证规则
const rules = {
	username: [
		{required: true, message: '请输入用户名', trigger: 'blur'},
		{min: 3, max: 20, message: '用户名长度应在3到20个字符之间', trigger: 'blur'}
	],
	password: [
		{required: true, message: '请输入密码', trigger: 'blur'},
		{min: 8, max: 20, message: '密码长度应在8到20个字符之间', trigger: 'blur'}
	],
	confirmPassword: [
		{required: true, message: '请确认密码', trigger: 'blur'},
		{
			validator: (rule, value, callback) => {
				if (value !== registerForm.password) {
					callback(new Error('两次输入的密码不一致'))
				} else {
					callback()
				}
			},
			trigger: 'blur'
		}
	],
	email: [
		{required: true, message: '请输入邮箱', trigger: 'blur'},
		{type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur'}
	],
	verification_code: [
		{required: true, message: '请输入验证码', trigger: 'blur'}
	]
}

// 发送验证码相关
const isSendingCode = ref(false)
const countdown = ref(60)
let timer = null

const sendVerificationCode = async () => {
	if (isSendingCode.value) return

	// 验证邮箱格式
	if (!registerForm.email) {
		return ElMessage.error('请输入邮箱地址')
	}

	isSendingCode.value = true
	countdown.value = 60

	try {
		// 发送模拟请求
		const response = await axios.post(
			'http://127.0.0.1:8000/send-verification-code',
			{
				email: registerForm.email
			}
		)

		console.log(response)
		if (response.status === 200) {
			ElMessage.success('验证码发送成功')
			timer = setInterval(() => {
				countdown.value--
				if (countdown.value <= 0) {
					clearInterval(timer)
					isSendingCode.value = false
				}
			}, 1000)
		} else {
			ElMessage.error('数据错误，请联系管理员')
			isSendingCode.value = false
		}
	} catch (error) {
		ElMessage.error('发送验证码失败，请稍后重试')
		console.error(error)
		isSendingCode.value = false
	}
}


// 提交表单
const submitForm = () => {
	registerFormRef.value.validate(async (valid) => {
		if (!valid) {
			return ElMessage.error('请正确填写注册信息')
		}

		try {
			// 发送模拟请求
			const response = await axios.post(
				'http://127.0.0.1:8000/register',
				{
					username: registerForm.username,
					password: registerForm.password,
					email: registerForm.email,
					verification_code: registerForm.verification_code
				},
				{
					timeout: 10000
				}
			)


			if (response.status === 200) {
				ElMessage.success('注册成功，稍后跳转...')
				// 这里可以添加注册成功后的逻辑，如跳转到登录页等
				setTimeout(() => {
					router.push('/user/login')
				}, 2000)
			} else {
				ElMessage.error(response.data.detail)
			}
		} catch (error) {
			console.log(error)
			ElMessage.error(error.response.data.detail)
		}
	})
}

// 清除定时器
onUnmounted(() => {
	if (timer) {
		clearInterval(timer)
	}
})
</script>

<style lang="scss" scoped>
.custom-font {
	font-family: "Noto Serif SC", sans-serif !important;
}

.register-container {
	display: flex;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #f5f7fa;

	.register-box {
		width: 400px;
		padding: 40px;
		background-color: #fff;
		border-radius: 8px;
		box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);

		.register-title {
			margin-bottom: 30px;
			text-align: center;
			font-size: 24px;
			font-weight: bold;
			color: #303133;
		}

		.register-btn {
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

		//:deep(.el-input__inner) {
		//	height: 45px;
		//}
		//
		//:deep(.el-input__prefix) {
		//	left: 10px;
		//}
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