let { ScanDir, result2Text, createReadme } = require('./tool.js');
let setting = {
  // 将获取到的文件列表以键值对的形式存放在此变量中(用户无需配置)
  result: {},
  // 文件夹路径
  path: "E:/CSY/CCSY/cs-foundation",
  // 应忽略的文件夹名 or 文件名
  ignore: {
    folder: ['.git', 'assets', '.vscode'],
    file: ['README.md']
  },
  // Readme.md 文件的标题(为遵循markdown语法,title需要以`# `为开头)
  title: "# cs-foundation"
}

let { result, path, ignore, title } = setting;
ScanDir(result, path, "", ignore, path);
// console.log(result);
let text = result2Text(result, title);
// console.log(text);
createReadme(text, path);