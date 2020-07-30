"use strict";
var fs = require('fs');
const path = require("path");
var minify = require('html-minifier-terser').minify;

function MinifyEJSContent(config) {
  console.log("config", config);
  this.config = config;
  this.init();
}
MinifyEJSContent.prototype.init=function () {
  this.config.minify = {
    collapseWhitespace: true,
    ...(this.config.minify ||{})
  }
}
MinifyEJSContent.prototype.apply = function (compiler) {
  compiler.plugin("done",  (compilation, callback)=> {
    function workThrough(dir, minifyOption) {
      console.log("minifyOption===", minifyOption);
      const files = fs.readdirSync(dir);
      files.forEach(filepath => {
        if (fs.statSync(dir + "/" + filepath).isDirectory()) {
          workThrough(dir + "/" + filepath );
        } else if(filepath.includes(".ejs")) {
          fs.readFile(path.resolve(`${dir}/${filepath}`), "utf-8",  (err, data) =>{
            if(err){
              console.log(err , " to read file");
              return;
            }
            console.log("minifyOption", minifyOption);
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
    console.log("this.config", this.config);
    workThrough(this.config.dirPath,this.config.minify);
  });
}


module.exports = MinifyEJSContent;
