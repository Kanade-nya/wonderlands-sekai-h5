import axios from "axios";
//创建一个axios实例
const requests = axios.create({
  timeout: 4000, //请求超时时间（5秒后还未接收到数据，就需要再次发送请求）
});
requests.defaults.retry = 2
requests.defaults.retryDelay = 1000


//响应拦截器
requests.interceptors.response.use(
    (res) => {
      return Promise.resolve(res);
    },
    (error) => {
      // 请求失败在这里处理
      if (error.code === 'ECONNABORTED' && error.message.includes('timeout')) {
        const config = error.config;
        if (!config || !config.retry) {
          console.log('请求失败')
          return Promise.reject(error)
        }

        config.__retryCount = config.__retryCount || 0
        if (config.__retryCount >= config.retry) {
          // 超时重发的次数已用完
          console.log('请求失败')
          return Promise.reject(error)
        }

        // 定义一个延迟的方法，也可以单独抽离出来做公共方法
        const backoff = new Promise((resolve) => {
          setTimeout(() => {
            resolve()
          }, config.retryDelay || 1000)
        })

        // 延迟时间到后重新发起请求
        return backoff.then(() => {
          config.__retryCount++
          return requests(config)
        })
      }
    }


);

export default requests;