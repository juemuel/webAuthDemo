const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 部署生产环境和开发环境下的URL：可对当前环境进行区分，baseUrl 从 Vue CLI 3.3 起已弃用，要使用publicPath
  // publicPath: './',
  publicPath: process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
    ? '/healthstation/' // 生产环境的基础 URL
    : './',
  // 输出文件目录：在npm run build时，生成文件的目录名称
  outputDir: process.env.VUE_APP_DIR_NAME,
  // 放置生成的静态资源 (js、css、img、fonts) 的 (相对于 outputDir 的) 目录
  assetsDir: 'assets',
  pluginOptions: { electronBuilder: { nodeIntegration: true } }, // 支持node
  // fallback: {
  //   url: require.resolve('url/')
  // },
  configureWebpack: config => {
    if (process.env.NODE_ENV !== 'production') return
    // 配置分包（不一定变快、需调整） splitChunks https://webpack.docschina.org/configuration/optimization/#optimizationsplitchunks
    // config.optimization.splitChunks = {
    //   chunks: 'all',
    //   maxInitialRequests: Infinity,
    //   minSize: 20000,
    //   maxSize: 60000,
    //   cacheGroups: {
    //     vendors: {
    //       test: /[\\/]node_modules[\\/]/,
    //       priority: -10
    //     }
    //   }
    // }

    // 设置 runtimeChunk https://webpack.docschina.org/configuration/optimization/#optimizationruntimechunk
    config.optimization.runtimeChunk = 'single'
    // 配置 performance
    config.performance = {
      maxEntrypointSize: 100000000,
      maxAssetSize: 300000000
    }
    config.module.rules.push({
      test: /\.m?js$/,
      exclude: /(node_modules|bower_components)/,
      use: {
        loader: 'babel-loader'
      }
    })
  },
  chainWebpack: config => {
    config.resolve.merge({
      fallback: {
        url: false, // 或者使用 require.resolve('url/') 以及安装 url 库（见上文）
        canvas: false,
        fs: false,
        http: false,
        https: false,
        zlib: false
      }
    })
    if (process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test') {
      // if (false) {
      // 防止缓存，文件后缀增加对应的hash
      config.output.filename('assets/js/[name].[chunkhash:8].js?v=' + process.env.VUE_APP_VERSION).chunkFilename('assets/js/[name].[chunkhash:8].js?v=' + process.env.VUE_APP_VERSION).end()
      // 如果filenameHashing设置为了false，可以通过这段代码给打包出的css文件增加hash值
      config.plugin('extract-css').tap(args => [{
        filename: 'assets/css/[name].[chunkhash:8].css?v=' + process.env.VUE_APP_VERSION,
        chunkFilename: 'assets/css/[name].[chunkhash:8].css?v=' + process.env.VUE_APP_VERSION
      }])
    }
  },
  // 是否在构建生产包时生成 sourceMap 文件，false将提高构建速度
  productionSourceMap: false,
  // 默认情况下，生成的静态资源在它们的文件名中包含了 hash 以便更好的控制缓存，你可以通过将这个选项设为 false 来关闭文件名哈希。(false的时候就是让原来的文件名不改变)
  filenameHashing: false,
  // 代码保存时进行eslint检测
  lintOnSave: false,
  // webpack-dev-server 相关配置
  devServer: {
    // 绕过主机检查
    allowedHosts: 'all',
    // 自动打开浏览器
    open: true,
    // 测试环境服务器IP
    host: '0.0.0.0',
    // 端口
    port: 33535,
    // https
    https: false,
    // 热更新
    hot: false
  }
})
