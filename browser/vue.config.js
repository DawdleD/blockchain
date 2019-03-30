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
                pathRewrite: {'^/api': ''}
            }
        }
    }
}
