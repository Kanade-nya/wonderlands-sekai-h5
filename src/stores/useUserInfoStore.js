import { defineStore } from "pinia";

export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            userInfo: {
                userId: '',
                userName: '',
                userIsActive: false,
                userAvatar: '',
                userDescription: '',
                userBlog: '',
                isLogin: false,
                loadingSuccess: false
            }
        }
    },
    getters: {
        getUserInfo: (state) => state.userInfo,
    },
    actions: {
        setUserInfo(data) {
            this.userInfo.userId = data.id;
            this.userInfo.userName = data.username;
            this.userInfo.userIsActive = data.is_active;
            this.userInfo.userAvatar = data.avatar;
            this.userInfo.userDescription = data.description;
            this.userInfo.userBlog = data.blog;
            this.userInfo.isLogin = true;
            this.userInfo.loadingSuccess = true;
        },
        setUserAvatar(data) {
            this.userInfo.userAvatar = data;
        },
        clearUserInfo() {
            this.userInfo = {
                userId: '',

            }
        },
        // 更新用户信息
        updateUserInfo(data) {
            // 只更新传入的字段
            if (data.userName !== undefined) {
                this.userInfo.userName = data.userName;
            }
            if (data.userBlog !== undefined) {
                this.userInfo.userBlog = data.userBlog;
            }
            if (data.userDescription !== undefined) {
                this.userInfo.userDescription = data.userDescription;
            }
            if (data.userAvatar !== undefined) {
                this.userInfo.userAvatar = data.userAvatar;
            }
        },
        // 用户登出方法
        logout() {
            // 重置用户信息为初始状态
            this.userInfo = {
                userId: '',
                userName: '',
                userIsActive: false,
                userAvatar: '',
                userDescription: '',
                userBlog: '',
                isLogin: false,
                loadingSuccess: true
            };
            // 清除本地存储的token
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
        },
        // 添加一个方法来触发重新验证
        triggerRevalidation() {
            this.userInfo.loadingSuccess = false;
        },
        unLoginLoadingSuccess(){
            this.userInfo.loadingSuccess = true;
        }
    }
})