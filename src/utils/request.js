import ins from "@/utils/axios.js"
import api from "@/utils/api.js";

export default {
    calMACD: (params) => {
        return ins.get(api.calMACD, {
            params: params
        })
    },
    getKData: (params) => {
        return ins.get(api.overview, {
            params: params
        })
    },
    searchStock: (params) => {
        return ins.get(api.search, {
            params: params
        })
    },
    getStockInfo: (params) => {
        return ins.get(api.basic, {
            params: params
        })
    }
}