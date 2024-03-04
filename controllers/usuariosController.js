const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const mysql = require("../mysql");

exports.cadastroUsuario = async (req, res, next) => {
  try {
    let query = "SELECT * FROM users WHERE email = ?;";
    let result = await mysql.execute(query, [req.body.email]);

    if (result.length > 0) {
      return res.status(409).send({ message: "Usuário já cadastrado." });
    }

    const hash = bcrypt.hashSync(req.body.senha, 10);

    query = `INSERT INTO users (email, password) VALUES (?,?);`;
    const results = await mysql.execute(query, [req.body.email, hash]);

    const response = {
      message: "Usuário criado com sucesso.",
      usuarioCriado: { userId: result.insertId, email: req.body.email }
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.Login = async (req, res, next) => {
  try {
    const query = "SELECT * FROM users WHERE email = ?;";

    const results = await mysql.execute(query, [req.body.email]);

    if (results.length < 1) {
      return res.status(401).send({ message: "Falha na autenticação." });
    }

    if (bcrypt.compareSync(req.body.senha, results[0].password)) {
      const token = jwt.sign(
        { id_usuario: results[0].userId, email: results[0].email },
        process.env.JWT_KEY,
        { expiresIn: "1h" }
      );

      return res.status(200).send({ message: "Autenticado com sucesso", token });
    }

    return res.status(401).send({ message: "Falha na autenticação." });
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};
