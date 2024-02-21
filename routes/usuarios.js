const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const mysql = require("../mysql").poll;

router.post("/cadastro", (req, res, next) => {
  mysql.getConnection((err, conn) => {
    if (err) {
      return res.status(500).send({ erro: err });
    }

    conn.query(
      "SELECT * FROM usuarios WHERE email = ?",
      [req.body.email],
      (erro, result) => {
        if (erro) {
          return res.status(500).send({ erro: erro });
        }

        if (result.length > 0) {
          res.status(409).send({ message: "Usuário já cadastrado." });
        } else {
          bcrypt.hash(req.body.senha, 10, (errBcrypt, hash) => {
            if (errBcrypt) {
              return res.status(500).send({ erro: errBcrypt });
            }

            conn.query(
              `INSERT INTO usuarios (email, senha) VALUES (?,?)`,
              [req.body.email, hash],
              (error, result) => {
                conn.release();

                if (error) {
                  return res.status(500).send({ erro: error });
                }

                const response = {
                  message: "Usuário criado com sucesso.",
                  usuarioCriado: {
                    id_usuario: result.insertId,
                    email: req.body.email
                  }
                };

                return res.status(201).send(response);
              }
            );
          });
        }
      }
    );
  });
});

module.exports = router;
