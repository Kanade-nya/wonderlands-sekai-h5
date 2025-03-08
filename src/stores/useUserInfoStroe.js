import {defineStore} from "pinia";

export const useUserInfoStore = defineStore('userInfo', {
    state: () => {
        return {
            userInfo: {
                userName: '',
                userIsActive: false,
                userAvatar: ''
            }
        }
    },
    getters: {
        getUserInfo: (state) => state.userInfo,
    },
    actions: {
        setUserInfo(data) {
            this.userInfo.userName = data.username;
            this.userInfo.userIsActive = data.is_active;
            this.userInfo.userAvatar = data.avatar
        },
        clearUserInfo() {
            this.userInfo = {
                userId: '',

            }
        }
    }
})