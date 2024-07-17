module.exports = {
    chainWebpack: (config) => {
      // Add a new rule for handling CSS files
      config.module
        .rule('css')
        .test(/\.css$/)
        .use('vue-style-loader')
        .loader('vue-style-loader')
        .end()
        .use('css-loader')
        .loader('css-loader')
        .end();
    }
};