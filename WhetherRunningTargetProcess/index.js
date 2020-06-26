let { whetherRunningTargetProcess } = require('./tool.js');

async function exec() {
  // 目标程序名称(大小写随意,最后都会变成小写)
  let targetProcess = "QQBrowser.exe";
  // true 表示 windows 平台; false 表示 linux 平台
  let platform = true;
  let flag = await whetherRunningTargetProcess(targetProcess, platform);
  console.log(`${targetProcess}是否正在运行: `, flag)
}

exec()