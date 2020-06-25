let fs = require('fs');
let path = require('path');
let axios = require('axios');
let iconv = require('iconv-lite');
let cheerio = require('cheerio');

// 网页内容
let data = null;

// 获取目标path的整个网页内容
async function getDemoPage(opts) {
  await requestNewPage(opts.path)
  return data
}

// 获取目标path的指定selector的内容
async function catchWebsite(opts) {
  await requestNewPage(opts.path)
  let $ = cheerio.load(data)
  let text = $(opts.selector).text().trim().replace(/&nbsp\;/g, '').replace(/<br>/g, '')
  fs.writeFileSync(path.resolve(opts.savePath, opts.index + '.txt'), text)
  return true
}

// 获取目录页的所有章节的跳转链接
async function getLinks(opts) {
  await requestNewPage(opts.path)
  let $ = cheerio.load(data)
  let links = $(opts.selector)
  let arr = Array.from(links)
  let linksResult = []
  try {
    for (let i in links) {
      linksResult[i] = {
        index: i,
        name: arr[i].children[0].data,
        path: opts.prefix + arr[i].attribs.href
      }
    }
  } catch (e) {
    console.log(`error in novelQuery.js:\n`, e)
  }
  return linksResult
}


async function requestNewPage(path) {
  await axios({
    method: 'get',
    url: path,
    responseType: 'arraybuffer'
  }).then(res => {
    // 编码需结合网页实际情况
    data = iconv.decode(Buffer.from(res.data), 'utf8')
  })
}

module.exports = { getLinks, getDemoPage, catchWebsite }