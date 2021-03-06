const withCss = require('@zeit/next-css')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')
if(typeof require !== 'undefined'){
    require.extensions['.css'] = file => {}
}

module.exports = withCss({
    webpack: (config) => {
        config.plugins.push(
            new FilterWarningsPlugin({
                exclude: /mini-css-extract-plugin[^]*Conflicting order between:/,
            })
        );
        return config;
    }
});