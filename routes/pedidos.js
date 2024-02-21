const express = require("express");
const router = express.Router();

const mysql = require("../mysql").poll;

// Retorna todos os pedidos.
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ erro: error });
    }

    conn.query("SELECT * FROM pedidos", (err, result, field) => {
      if (err) {
        return res.status(500).send({ erro: error });
      }

      // Fazendo que fique mais rastreavel o valor da requisição.
      const response = {
        quantidade: result.length,
        pedidos: result.map(ped => {
          return {
            id_pedido: ped.id_pedido,
            id_produto: ped.produtos_id_produtos,
            quantidade: ped.quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um pedido em específico.",
              url: `http://localhost:3000/pedidos/${ped.id_pedido}`
            }
          };
        })
      };

      return res.status(200).send(response);
    });
  });
});

// Retorna um pedido.
router.get("/:id_pedidos", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ erro: error });
    }

    conn.query(
      "SELECT * FROM pedidos WHERE id_pedido = ?",
      [req.params.id_pedidos],
      (err, result, fields) => {
        if (err) {
          return res.status(500).send({ erro: error });
        }

        if (result.length == 0) {
          return res.status(404).send({ message: "Pedido não encontrado." });
        }

        const response = {
          pedido: {
            id_pedido: result[0].id_pedido,
            id_produto: result[0].produtos_id_produtos,
            quantidade: result[0].quantidade,
            request: {
              tipo: "GET",
              descricao: "Retorna todos pedidos",
              url: `http://localhost:3000/pedidos`
            }
          }
        };

        return res.status(200).send(response);
      }
    );
  });
});

// Adiciona um pedidos.
router.post("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ erro: error });
    }

    conn.query(
      "SELECT * FROM produtos WHERE id_produtos = ?",
      [req.body.id_produtos],
      (err, result, fields) => {
        if (error) {
          return res.status(500).send({ erro: error });
        }

        if (result.length == 0) {
          return res.status(404).send({ message: "Produto não encontrado." });
        }

        conn.query(
          "INSERT INTO pedidos (produtos_id_produtos, quantidade) VALUES (?,?)",
          [req.body.id_produto, req.body.quantidade],
          (err, result, field) => {
            conn.release();

            if (err) {
              return res.status(500).send({ erro: err, response: null });
            }

            const response = {
              message: "Pedido inserido com sucesso.",
              pedidoCriado: {
                id_pedido: result.id_pedido,
                id_produto: req.body.produtos_id_produto,
                quantidade: req.body.quantidade,
                request: {
                  tipo: "GET",
                  descricao: "Retorna todos pedidos",
                  url: `http://localhost:3000/pedidos`
                }
              }
            };

            return res.status(201).send({ response });
          }
        );
      }
    );
  });
});

// Apaga um pedido expecifico.
router.delete("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ erro: error });
    }

    conn.query(
      `DELETE FROM pedidos WHERE id_pedido = ?`,
      [req.body.id_pedido],
      (err, result, fields) => {
        conn.release();

        if (err) {
          return res.status(500).send({ erro: err, response: null });
        }

        const response = {
          message: "Pedido removido com sucesso.",
          request: {
            tipo: "POST",
            descricao: "Insere um pedido.",
            url: `http://localhost:3000/pedidos`,
            body: {
              id_produto: "Number",
              quantidade: "Number"
            }
          }
        };

        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
