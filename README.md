# webpack-plugin-ejs-minification
Plugin that minify ejs using [html-minifier-terser](https://www.npmjs.com/package/html-minifier-terser)

### installation
```
npm i --save-dev webpack-plugin-ejs-minification
```
```
yarn add --dev webpack-plugin-ejs-minification
```
Add the plugin to your webpack config as follows:
### webpack.config.js
```
const MinifyEJSContent = require('webpack-plugin-ejs-minification');
module.exports = {
  entry: 'index.js',
  output: {
    path: __dirname + '/dist',
    filename: 'index_bundle.js'
  },
  plugins: [
    new MinifyEJSContent({
      dirPath: path.resolve(__dirname, `../dist/views`),
      minify:{
        minifyJS: true,
        removeComments: true
      }
    }),
  ]
}
```
More options can be added from [https://github.com/DanielRuf/html-minifier-terser#options-quick-reference](https://github.com/DanielRuf/html-minifier-terser#options-quick-reference)
