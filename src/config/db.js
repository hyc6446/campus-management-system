// 数据库配置文件
const mongoose = require('mongoose');

/**
 * 连接到MongoDB数据库
 */
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    
    console.log(`MongoDB连接成功: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`MongoDB连接失败: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;