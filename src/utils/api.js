const host = '//api.stock.com'
export default {
    overview: host + '/analysis', // 获取个股/指数的k线信息
    search: host + '/analysis/search', // 模糊搜索股票
    basic: host + '/analysis/basic', // 股票基本信息
    calMACD: host + '/analysis/macd', // 计算个股/指数的MACD指标
    calKDJ: host + '/analysis/kdj', // 计算个股/指数的KDJ指标
}