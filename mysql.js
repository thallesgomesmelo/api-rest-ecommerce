const mysql = require("mysql");

const poll = mysql.createPool({
  user: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  host: process.env.MYSQL_HOST,
  port: process.env.MYSQL_PORT,
  connectionLimit: 1000
});

exports.execute = (query, params = []) => {
  return new Promise((resolve, reject) => {
    poll.query(query, params, (erro, result, fields) => {
      if (erro) {
        reject(erro);
      } else {
        resolve(result);
      }
    });
  });
};

exports.poll = poll;
