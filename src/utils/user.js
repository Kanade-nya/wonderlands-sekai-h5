import axios from "axios"
import { localUrl } from "./methods"
import {useUserInfoStore} from "@/stores/useUserInfoStore.js";

const useUserInfo = useUserInfoStore();

// 验证用户token的函数
export const validateUserToken = async () => {
    
    const token = localStorage.getItem('access_token')
    console.log(token)
    if (!token) {
        console.log('没有token，去登录')
        return false
    }
    try {
        const response = await axios.get(`${localUrl}/user/protected`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
        
        if (response.status === 200) {
            // ElMessage.success(`欢迎回来，${response.data.user_info.username}`)
            useUserInfo.setUserInfo(response.data.user_info)
            return true
        } else {
            return false
        }
    } catch (error) {
        console.error('验证token失败', error)
        return false
    }
}

export const defaultAvatar = 'https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png'