// api/mock.js
import Mock from 'mockjs'

// 模拟接口地址
const baseUrl = '/api'

// 模拟用户数据
const users = [
    {
        id: 1,
        username: 'admin',
        password: '123456',
        role: 'admin',
        avatar: 'https://placeholder.pics/svg/150'
    },
    {
        id: 2,
        username: 'user',
        password: '123456',
        role: 'user',
        avatar: 'https://placeholder.pics/svg/150'
    }
]

// 模拟登录接口
Mock.mock(`${baseUrl}/login`, 'post', (options) => {
    const { username, password } = JSON.parse(options.body)

    // 查找匹配的用户
    const user = users.find(user => user.username === username && user.password === password)

    if (user) {
        return {
            code: 200,
            message: '登录成功',
            data: {
                token: Mock.Random.guid(),
                userInfo: {
                    id: user.id,
                    username: user.username,
                    role: user.role,
                    avatar: user.avatar
                }
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


Mock.mock('/api/register', 'post', (options) => {
    const { username, password, email, verificationCode } = JSON.parse(options.body)

    // 模拟注册成功率为80%
    if (Math.random() > 0.2) {
        return {
            code: 200,
            message: '注册成功',
            data: {
                userId: Mock.Random.id(),
                username,
                token: Mock.Random.guid()
            }
        }
    } else {
        return {
            code: 500,
            message: '用户名已存在，请更换用户名',
            data: null
        }
    }
})

Mock.mock('/api/sendVerificationCode', 'post', (options) => {
    const { email } = JSON.parse(options.body)
    // 模拟发送验证码成功
    return {
        code: 200,
        message: '验证码已发送，请查收邮件',
        data: {
            verificationCode: Mock.Random.string('number', 6)
        }
    }
})


// API封装
export default {
    login(data) {
        return new Promise((resolve, reject) => {
            try {
                // 在实际项目中，这里会使用axios等工具发起HTTP请求
                const xhr = new XMLHttpRequest()
                xhr.open('post', `${baseUrl}/user/login`, true)
                xhr.setRequestHeader('Content-Type', 'application/json')
                xhr.onreadystatechange = function() {
                    if (xhr.readyState === 4) {
                        if (xhr.status === 200) {
                            resolve(JSON.parse(xhr.responseText))
                        } else {
                            reject(new Error('请求失败'))
                        }
                    }
                }
                xhr.send(JSON.stringify(data))
            } catch (error) {
                reject(error)
            }
        })
    }
}