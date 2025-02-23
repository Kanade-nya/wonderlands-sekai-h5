import {defineStore} from "pinia";
import axios from "axios";

export const useGetIpStore = defineStore('getIp', {
    state: () => ({
        ip: '',
        ipInfo: {
            country: '',
            region: '',
            city: '',
            isp: '',
            lat: '',
            lon: '',
            org: '',
            query: '',
            timezone: '',
            zip: ''
        }
    }),
    actions: {
        getIp() {
            return this.ip
        },
        setIp () {
            axios.get(
                'https://ipapi.co/json/'
            ).then(res => {
                this.ip  = res.data.country
            })
        }
    },
    persist: {
        enabled: true, // 开启数据缓存 +++++++解决刷新空数据的问题
    }
})