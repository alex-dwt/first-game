module.exports = {
    entry: '/app/src/application/index.ts',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: [ '.tsx', '.ts', '.js' ]
    },
    output: {
        filename: 'bundle.js',
        path: '/app/html'
    },
    devServer: {
        contentBase: '/app/html',
        compress: true,
        port: 8080,
        disableHostCheck: true
    }
};