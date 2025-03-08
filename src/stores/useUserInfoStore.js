import {defineStore} from "pinia";

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
        }
    }
})