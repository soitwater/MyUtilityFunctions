// 数据库 - sequelize 是将数据库的行记录转换成对象，这样读写时操作都是对象，比较方便 - https://github.com/demopark/sequelize-docs-Zh-CN
// 如果操作的是 mysql，还需要另外安转`mysql2` 但不需要`require`
// sequelize 默认需要一个(主键)的字段，建立模型时需要标明`primaryKey: true`
const { Sequelize, DataTypes } = require("sequelize");
const chalk = require("chalk");
let config = {
  database: "test20191218",
  username: "root",
  password: "root123",
  host: "localhost",
  port: 3306
};
// 创建 sequelize 对象实例
let sequelize = new Sequelize(config.database, config.username, config.password, {
  host: config.host,
  dialect: "mysql", // 数据库类型
  pool: { // 连接池配置
    max: 5,
    min: 0,
    idle: 30000
  }
});
// 测试连接是否成功
(async () => {
  try {
    await sequelize.authenticate();
    console.log(chalk.green('连接成功Connection has been established successfully.'));
  } catch (error) {
    console.error(chalk.red('连接错误Unable to connect to the database:', error));
  }
})();
// 定义模型user，告诉Sequelize如何映射数据库表
let userModel = sequelize.define(
  "user",
  { // user是模型名称,取名随意
    name: { // name 是表格的字段名
      type: DataTypes.CHAR
    },
    index: {
      type: DataTypes.BIGINT,
      allowNull: false,
      primaryKey: true
    },
    id: {
      type: DataTypes.BIGINT
    }
  },
  {
    tableName: 'user', // 表格名称
    timestamps: false // 禁止Sequelize自动增加时间戳的行为
  }
);
// 为数据表新增数据
userModel.create({
  name: "username",
  id: parseInt(Math.random() * 10)
}).then((p) => {
  console.log('created.' + JSON.stringify(p));
}).catch(function (err) {
  console.log(chalk.red('failed during in add row: ' + err));
});
// 查询数据
(async () => {
  let result = await userModel.findAll({
    where: {
      name: "username"
    }
  });
  console.log(`find ${result.length} result:`);
  for (let p of result) {
    console.log(chalk.bgGray.underline.bold(JSON.stringify(p)));
    // 更新数据
    p.name = p.name + Date.now();
    await p.save();
    // 如果是删除数据的话
    // await p.destroy();
  }
})();