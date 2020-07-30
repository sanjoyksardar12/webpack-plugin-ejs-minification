"use strict";
var fs = require('fs');
const path = require("path");
var minify = require('html-minifier-terser').minify;

function MinifyEJSContent(option) {
  this.option = option;
}

MinifyEJSContent.prototype.apply = function (compiler, option) {
  compiler.plugin("done",  (compilation, callback)=> {
    function workThrough(dir) {
      const files = fs.readdirSync(dir);
      files.forEach(filepath => {
        if (fs.statSync(dir + "/" + filepath).isDirectory()) {
          workThrough(dir + "/" + filepath );
        } else if(filepath.includes(".ejs")) {
          fs.readFile(path.resolve(`${dir}/${filepath}`), "utf-8", function (err, data) {
            if(err){
              console.log(err , " to read file");
            }
            const updatedContent = minify(data, { collapseWhitespace: true, removeComments: true, minifyJS: true });
            fs.writeFile(path.resolve(`${dir + "/"}${filepath}`), updatedContent, (err) => {
              if (err) console.log(err);
              const completeFilePath = `${dir + "/"}${filepath}`;
              console.log(`Successfully Minified ${completeFilePath.split("dist")[1]}`);
            });
          });
        }
      });
    }
    workThrough(this.option.dirPath);
  });
}


module.exports = MinifyEJSContent;
