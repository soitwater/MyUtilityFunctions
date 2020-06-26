/**
 * 将NodeJS的error-first风格转为promise风格
 * @param {*} asyncFunc 
 */
function promisify(asyncFunc) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      args.push(function callback(err, ...values) {
        if (err) {
          return reject(err)
        }
        return resolve(...values)
      })
      asyncFunc.call(this, ...args)
    })
  }
}

let path = require('path');
const child_process_P = new Proxy(require('child_process'), {
  get(target, key) {
    return promisify(target[key])
  }
})

/**
 * 当前运行的程序中是否包含目标程序
 * @param {*} platform 
 * @param {*} targetProcess 目标程序的名称(打开任务管理器可以看到名称)
 */
async function whetherRunningTargetProcess(targetProcess, platform = true) {
  let flag = null;
  // tasklist 是 windows 的，ps aux 是 Linux 的
  const cmd = platform ? 'tasklist' : 'ps aux'
  let stdout = await child_process_P.exec(cmd)
  flag = stdout.split('\n').some(function (line) {
    let p = line.trim().split(/\s+/), pname = p[0], pid = p[1];
    if (pname.toLowerCase().indexOf(targetProcess.toLowerCase()) >= 0 && parseInt(pid)) {
      return true;
    } else {
      return false;
    }
  })
  return flag;
}

module.exports = { whetherRunningTargetProcess };