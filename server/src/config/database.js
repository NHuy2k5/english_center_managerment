const dotenv = require('dotenv');
dotenv.config();
module.exports = {
  development: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: process.env.DB_DRIVER,
    logging: true,
    pool: {
      max: 5,        // tối đa 5 connections
      min: 0,
      acquire: 60000, // ✅ tăng timeout lên 60s thay vì mặc định 60s
      idle: 10000
    },
    dialectOptions: {
      connectTimeout: 60000 // ✅ timeout kết nối 60s
    }
  },
  test: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER
  },
  production: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    host: process.env.DB_HOST,
    dialect: process.env.DB_DRIVER
  }
}
