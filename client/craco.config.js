const webpack = require('webpack');

module.exports = {
    webpack: {
        plugins: {
            add: [
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser'
                }),
            ],
        },
    },
    configure: (webpackConfig, { env, paths }) => {
        webpackConfig.resolve.fallback = {
            ...(webpackConfig.resolve.fallback || {}),
            buffer: require.resolve('buffer/'),
            process: require.resolve('process/browser'),
        };
        return webpackConfig;
    },
}