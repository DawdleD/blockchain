const CompressionWebpackPlugin = require('compression-webpack-plugin');
const productionGzipExtensions = ['js', 'css'];
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
    },
    configureWebpack: {
        // 把原本需要写在webpack.config.js中的配置代码 写在这里 会自动合并
        externals: {
            'vue': 'Vue',
            'element-ui': 'ELEMENT',
            'axios':'axios',
        },
        plugins:[
            /* 开启Gzip压缩*/
            new CompressionWebpackPlugin({
                filename: '[path].gz[query]',
                algorithm: 'gzip',
                test: new RegExp('\\.(' + productionGzipExtensions.join('|') + ')$'),
                threshold: 10240,
                minRatio: 0.8
            })
        ]
    }
}
