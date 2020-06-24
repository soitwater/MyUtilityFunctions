let fs = require('fs');

/**
 * 遍历文件夹下的文件目录(目录下只能有一层文件夹),并将其存储在全局变量result
 * @param {*} result 结果存储 如： {"js": [{"name": "new创建过程", "path": "./js/new创建过程.md"}]}
 * @param {*} path 文件路径 如：E:/CCSY/cs-foundation/js/new创建过程.md
 * @param {*} attr 文件名 如: new创建过程.md
 * @param {*} ignore 应忽略的文件夹名/文件名
 * @param {*} prePath 如：E:/CCSY/cs-foundation
 */
function ScanDir(result, path, attr, ignore, prePath) {
  // 当前的path 是否为文件
  const isFile = fs.statSync(path).isFile()
  // 假如是文件
  if (isFile) {
    // 判断是否为应忽略的文件，若否:则将其存储进 result 对象中
    !checkIgnore(attr, isFile, ignore) && result[getDocumentNameByFilename(path, attr)].push({
      name: attr.slice(0, attr.lastIndexOf('.')),
      path: path.replace(prePath, '.')
    });
    return;
  }
  // 假如是文件夹
  try {
    // 若为应忽略的文件夹，则不进入该文件夹中
    if (attr !== '' && checkIgnore(attr, isFile, ignore)) {
      delete result[attr]
      return
    };
    // 遍历文件夹目录下的所有文件
    fs.readdirSync(path).forEach(function (file) {
      let documentPath = path + '/' + file
      let documentName = documentPath.slice(documentPath.lastIndexOf('/') + 1)
      // result 中还没有documentName 属性值 且 当前的路径不是文件时，才为result新增属性(文件夹名)
      if (!result[documentName] && !fs.statSync(documentPath).isFile()) {
        result[documentName] = [];
      }
      ScanDir(result, documentPath, documentName, ignore, prePath)
    })
  } catch (err) {
    console.log('err during scan the dir !!!\n', err)
  }

  // 获取当前文件所处的文件夹名字
  function getDocumentNameByFilename(path, name) {
    try {
      let pathWithoutFilename = path.slice(0, path.length - name.length - 1)
      return pathWithoutFilename.slice(pathWithoutFilename.lastIndexOf('/') + 1)
    } catch (err) { }
  }
  // 检查当前路径是否应忽略的文件夹 or 文件名
  function checkIgnore(file, isFile, ignore) {
    if (isFile) {
      return ignore.file.includes(file)
    } else {
      return ignore.folder.includes(file)
    }
  }
}

/**
 * 将文件目录结果转换为文本
 * @param {*} result 
 * @param {*} title 
 */
function result2Text(result, title) {
  let data = title + '\n'
  for (let i in result) {
    let list = ''
    for (let arr of result[i]) {
      list += `- [${arr.name}](${arr.path})\n`
    }
    data += `
<details>
  <summary>${i}</summary>

${list}
</details>
    `
  }
  return data
}

/**
 * @description 创建并将文本写入Readme.md 文件
 * @param {*} data 
 * @param {*} prePath 
 */
function createReadme(data, prePath) {
  let path = prePath + '/README' + getTimeString() + '.md'
  return new Promise((resolve, reject) => {
    fs.writeFile(path, data, (err) => {
      if (err) {
        console.log('err in create Readme.md!!\n' + err)
        reject(err)
      }
      resolve()
    })
  })

  function getTimeString() {
    let d = new Date()
    return "" + d.getFullYear() + (d.getMonth() + 1) + d.getDate() + d.getHours() + d.getMinutes() + d.getSeconds()
  }
}

module.exports = {
  createReadme,
  result2Text,
  ScanDir
}