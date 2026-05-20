import axios from 'axios'
const service = axios.create({
  baseURL: 'http://localhost:3000', //请求前缀
  timeout: 5000, //请求的超时时间
})
//请求拦截器
service.interceptors.request.use((config) => {
  return config
})
//响应拦截器
service.interceptors.response.use(
  (response) => {
    if (response.data.status === 20000) {
      return response.data.data
    }
  },
  (err) => {
    return Promise.reject(err)
  },
)
export default service
