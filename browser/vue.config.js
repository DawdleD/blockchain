module.exports = {
    assetsDir: 'assets',  //静态资源目录
    devServer: {
        open: true,
        proxy: {
            //配置跨域
            '/api': {
                target: 'http://localhost:3000',
                ws: true,
                changeOrigin: true,
                pathRewrite: {'^/api': '/api'}
            },
            '/images': {
                target: 'http://127.0.0.1:3000',//设置你调用的接口域名和端口号 别忘了加http
                changeOrigin: true,
                pathRewrite: {
                  '^/images': '/images'
                }
            }
        }
    }
}
