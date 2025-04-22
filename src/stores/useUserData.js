import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUserData = defineStore('userData', () => {

    /**
     * 用户数据
     */
    const userData = ref({
        id: 0,
        username: '',
        avatar: '',
        description: '',
        blog: '',
        isLogin: 0, // 0:未检测 1:已登录 -1:未登录 -2:检测失败
        loadingSuccess: false
    })

    /**
     * 获取用户数据
     * @return {object}
     */
    const getUserData = () => {
        return userData.value
    }

    /**
     * 设置用户数据
     * @param {object} data
     */
    const setUserData = (data) => {
        for (let key in data) {
            if (userData.value.hasOwnProperty(key)) {
                userData.value[key] = data[key]
            }
        }
    }

    const isLogin = () => {
        return userData.value.isLogin === 1
    }




    return { userData, getUserData,setUserData,isLogin }
})