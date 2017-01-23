var webpack = require('webpack');
var bower_dir = __dirname + '/bower_components';
module.exports = {
    context: __dirname,
    entry: {
        app: './main.js'
    },
    output: {
        path: __dirname + '/js',
        filename: 'bundle.js'
    },
    devServer: {
        inline: true
    },
    resolve: {
        modulesDirectories: ["web_modules", "node_modules", "bower_components"],
        alias: {
            'jquery': bower_dir + '/jquery/dist/jquery.min.js',
            'angular': bower_dir + '/angular/angular.min.js',
            'ngRoute': 'angular-route',
            'ui.bootstrap': 'angular-ui-bootstrap'
        }
    },
    plugins: [
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin(".bower.json", ["main"])
        ),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            _: 'lodash',
            // [...] some other libraries that put themselves in the global scope.
            //angular: 'angular', // No, I prefer to require it everywhere explicitly.
        }),
    ],

};