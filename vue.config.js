module.exports = {
  //对内部的 webpack 配置进行更细粒度的修改
  chainWebpack: (config) => {
    config.module
      .rule("worker")
      .test(/\.worker\.js$/)
      .use("worker-loader")
      .loader("worker-loader")
      .options({ inline: "fallback" });
    // 解决 "window is undefined", 这是因为 worker 线程中不存在 window 对象, 要用 this 代替
    config.output.globalObject("this");
  },
  // 解决打包的时报错
  parallel: false,
};
