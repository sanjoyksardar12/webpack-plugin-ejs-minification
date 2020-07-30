"use strict";
var fs = require('fs');
const path = require("path");
var minify = require('html-minifier-terser').minify;

function MinifyEJSContent(config) {
  this.config = config;
  this.init(config);
}
MinifyEJSContent.prototype.init=function (config) {
  this.config.minify = {
    collapseWhitespace: true,
    ...(config.minify ||{})
  }
}
MinifyEJSContent.prototype.apply = function (compiler) {
  compiler.plugin("done",  function(stat, callback) {
    function workThrough(dir, minifyOption) {
      const files = fs.readdirSync(dir);
      files.forEach(filepath => {
        if (fs.statSync(dir + "/" + filepath).isDirectory()) {
          workThrough(dir + "/" + filepath ,minifyOption);
        } else if(filepath.includes(".ejs")) {
          fs.readFile(path.resolve(`${dir}/${filepath}`), "utf-8",  (err, data) =>{
            if(err){
              console.log(err , " to read file");
              return;
            }
            const updatedContent = minify(data, {...minifyOption} );
            fs.writeFile(path.resolve(`${dir + "/"}${filepath}`), updatedContent, (err) => {
              if (err) console.log(err);
              const completeFilePath = `${dir + "/"}${filepath}`;
              console.log(`Successfully Minified ${completeFilePath.split("dist")[1]}`);
            });
          });
        }
      });
    }
    const config = stat.compilation.options.plugins.filter(plugin=>plugin.constructor.name ==="MinifyEJSContent")[0].config;
    workThrough(config.dirPath,config.minify);
  });
}


module.exports = MinifyEJSContent;
