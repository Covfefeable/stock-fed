import axios from 'axios'
import { ElMessage } from "element-plus";
let instance = axios.create({
    headers: {
        'content-type': 'application/x-www-form-urlencoded'
    }
})

instance.interceptors.response.use(
    response => {
        if (response.data.code) {
            switch (response.data.code) {
                case '500':
                    ElMessage({
                        message: response.data.msg,
                        type: "error",
                    });
            }
        }
        return response
    },
    //接口错误状态处理，也就是说无响应时的处理
    error => {
        return Promise.reject(error.response.status) // 返回接口返回的错误信息
    })
export default instance