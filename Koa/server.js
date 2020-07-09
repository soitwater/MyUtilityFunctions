const path = require("path");
const chalk = require("chalk");
// koa —— 包装过的http对象
const koa = require('koa');
// 静态文件代理服务 - 文档 https://www.npmjs.com/package/koa-static-cache
const koaStaticCache = require('koa-static-cache');

// 路由 - 文档 https://github.com/ZijianHe/koa-router
const router = require('koa-router');

// 模板 - 与 Vue / React 的SSR模板互斥，了解即可
const Swig = require('koa-swig');
// 异步控制模块，基于ES6中的`generator`，类似的还有 async / Promise / then.js / 
const co = require('co');

// 新建http服务器，监听客户端请求
const server = new koa();

// ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

// 路由管理
let newsRouter = new router();
let parentRouter = new router();
// 普通情况 - 客户端请求 http://localhost:8080/news?aid=123&name=zhangsan
newsRouter.get('/news', async (ctx, next) => {
  //从ctx中读取get传值
  console.log(ctx.query);  // **推荐-返回一个对象 { aid: '123', name: 'zhangsan' }
  console.log(ctx.querystring);  // 字符串 aid=123&name=zhangsan
  console.log(ctx.url);   // 获取url地址 /news?aid=123&name=zhangsan
  //ctx里面的request里面获取get传值
  console.log(ctx.request.url); // 获取url地址 /news?aid=123&name=zhangsan
  console.log(ctx.request.query);   // 对象 { aid: '123', name: 'zhangsan' }  
  console.log(ctx.request.querystring);   // 字符串 aid=123&name=zhangsan
  ctx.body = "看控制面板-normal";
})

// 动态路由 - 客户端请求 http://localhost:8080/news/123/zhangsan
newsRouter.get('/news/:aid/:name', async (ctx) => {
  console.log(ctx.params); // 对象 { aid: '123', name: 'zhangsan' }
  ctx.body = "看控制面板-dynamic";
});
// 启动路由(别遗漏)
server.use(newsRouter.routes()).use(newsRouter.allowedMethods());

// 嵌套路由 - 相当于在`newsRouter`的基础上加前缀`/parent/:pid` 和加路由前缀类似
// http://localhost:8080/parent/67/news?aid=123&name=zhangsan
parentRouter.use('/parent/:pid', newsRouter.routes(), newsRouter.allowedMethods());
server.use(parentRouter.routes());

// 路由前缀
// prefix 的值需要是 `/` 起头的
let prefixRouter = new router({ prefix: "/prefix" });
prefixRouter.get("/p/:pid", async (ctx) => {
  console.log(ctx.params);
  ctx.body = "http://localhost:8080/prefix/p/3";
})
server.use(prefixRouter.routes());

// ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

// server.use 注册中间件函数
// 静态资源管理：静态资源放在`__dirname + '/static'`目录下
server.use(koaStaticCache(__dirname + '/static', {
  maxAge: 365 * 24 * 60 * 60,
  prefix: '/public' // 客户端请求的 url 应该类似于：`http://localhost:8080/public/1.txt`
}))

// ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————

// 模板
const render = Swig({
  root: __dirname + '/view', // 模板的存放目录
  autoescape: true,          // 是否自动escape编码
  cache: false,              // 是否启用缓存
  ext: '.html'               // 设置模板后缀
});
server.context.render = co.wrap(render);
let users = [{ username: '张三' }, { username: '李四' }, { username: '王二麻' }];
let templateRouter = new router();
// 客户端请求 http://localhost:8080/list
templateRouter.get('/list', async (ctx, next) => {
  ctx.body = await ctx.render('1.html', { users })
});
server.use(templateRouter.routes());

// ———————————————————————————————————————————————————————————————————————————————————————————————————————————————————————————
// 监听端口
server.listen(8080, () => {
  console.log('listen at 端口 8080')
});