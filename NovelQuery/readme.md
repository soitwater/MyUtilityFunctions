# NovelQuery
- 本质是`axios`去自动下载网页，再提取目标文本，最后保存文本至本地
- 测试网站用的是`笔趣阁`，示例如下
  * 小说目录页
    ```js
    第一章 aa  第二章 bb 第三章 cc！
    第四章 dd！第五章 ee 第六章 ff(点击可跳转至对应章节内容页) 
    ......
    ```

## how to use?
- 在`NovelQuery/index.js`下可以配置参数
- 运行
  ```js
  node index.js
  ```