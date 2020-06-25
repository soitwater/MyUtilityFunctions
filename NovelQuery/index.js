let { getLinks, getDemoPage, catchWebsite, requestNewPage } = require('./tool.js');

async function exec() {
  let opts = {
    // 小说网址(目录页) 
    path: 'http://www.xbiquge.la/61/61945/',
    // 链接跳转
    selector: '#list a',
    // <a>标签链接跳转是不带域名前缀的
    prefix: 'http://www.xbiquge.la'
  }
  // 存放所有跳转链接
  let linksResult = await getLinks(opts);
  // console.log(linksResult)

  // 爬取的起始范围
  let [start, end] = [0, linksResult.length - 1];
  for (let i = start; i <= end; i++) {
    let opts = {
      path: linksResult[i].path,
      index: linksResult[i].index,
      // 内容页的选择器
      selector: "#content",
      // 保存路径
      savePath: "C:/Users/CSY/Desktop/a"
    }
    await catchWebsite(opts)
  }
  return true
}
exec();
