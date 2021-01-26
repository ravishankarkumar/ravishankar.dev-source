"use strict"

var fs = require('fs');
var fsex = require("fs-extra");
var swig = require("swig");

function cleanPublic() {
  var pubDir = __dirname + "/../tedhisadak.com";
  // fsex.emptyDirSync(pubDir);
}

function copyAssets() {
  fsex.copySync(__dirname + "/assets/", __dirname + "/../tedhisadak.com/");
}

function convertFile(path) {
  var src = __dirname + "/src" + path;
  var dst = __dirname + "/../tedhisadak.com" + path;

  var content = fs.readFileSync(src, "utf8");
  var pattern = "<!-- params"
  var start =  content.indexOf(pattern);
  var end = content.indexOf("-->", start);
  start = start + pattern.length;
  var pstr = content.substr(start, end - start); 
  var params = JSON.parse(pstr);
  var out = swig.renderFile(src, params);
  fs.writeFileSync(dst, out, "utf8");
}

function ensurePublicPath(path) {
  var dpath = __dirname + "/../tedhisadak.com" + path;
  if(!fs.existsSync(dpath)) {
    fs.mkdirSync(dpath);
  }
}

function convertDir(path) {
  ensurePublicPath(path);
  var dpath = __dirname + "/src/" + path;
  var files = fs.readdirSync(dpath);
  files.forEach(function(f) {
    var fp = dpath + "/" + f;
    if(fs.lstatSync(fp).isDirectory()) {
      convertDir(path + "/" + f);
    } else {
      // ignore hidden files
      if(f.indexOf(".") != 0) {
        convertFile(path + "/" + f);
      }
    }
  });
}

cleanPublic();
copyAssets();
convertDir("");
