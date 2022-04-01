module.exports = {
  chainWebpack: (config) => {
    // 详见 https://v4.webpack.js.org/loaders/worker-loader/
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      // inline: 'fallback' 可以支持旧版浏览器，但是实测有严重缓存问题
      .options({inline: 'fallback'});
    // 解决 "window is undefined", 这是因为 worker 线程中不存在 window 对象, 要用 this 代替
    config.output.globalObject("this");
  },
  // 解决打包的时报错
  parallel: false,
};
