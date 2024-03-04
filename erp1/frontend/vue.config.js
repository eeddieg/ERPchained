const { defineConfig } = require("@vue/cli-service");
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin");

module.exports = defineConfig({
    transpileDependencies: true,
    devServer: {
        compress: true,
        allowedHosts: ["dev.erp.com", "192.168.10.4"],
        port: 8081,
    },
    configureWebpack: {
        // It will be merged into the final Webpack config
        plugins: [new NodePolyfillPlugin()],
    },
});