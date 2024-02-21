const express = require("express");
const router = express.Router();

// Usado para adicionar arquivo do tipo imagem ao banco de dados.
const multer = require("multer");
const storage = multer.diskStorage({
  // Onde será salvo.
  destination: function (req, file, cb) {
    cb(null, "./uploads/");
  },
  // Nome do arquivo.
  filename: function (req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});
// Criando um filtro para o tipo de arquivo aceito.
const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg" || file.mimetype === "image/png") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  // Adidiconado limite de tamanho do arquivo para 5Mb
  limits: {
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

const mysql = require("../mysql").poll;
const login = require("../middleware/login");

// Retorna todos os produtos.
router.get("/", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ erro: error });
    }

    conn.query("SELECT * FROM produtos", (err, result, field) => {
      if (err) {
        return res.status(500).send({ erro: error });
      }

      // Fazendo que fique mais rastreavel o valor da requisição.
      const response = {
        quantidade: result.length,
        produtos: result.map(prod => {
          return {
            id_produto: prod.id_produtos,
            nome: prod.nome,
            preco: prod.preco,
            imagem_produto: prod.imagem_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um produto específico.",
              url: `http://localhost:3000/produtos/${prod.id_produtos}`
            }
          };
        })
      };

      return res.status(200).send({ response });
    });
  });
});

// Retorna um produto.
router.get("/:id_produto", (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ erro: error });
    }

    conn.query(
      "SELECT * FROM produtos WHERE id_produtos = ?",
      [req.params.id_produto],
      (err, result, fields) => {
        if (err) {
          return res.status(500).send({ erro: error });
        }

        if (result.length == 0) {
          return res.status(404).send({ message: "Produto não encontrado." });
        }

        const response = {
          produto: {
            id_produto: result[0].id_produtos,
            nome: result[0].nome,
            preco: result[0].preco,
            imagem_produto: result[0].imagem_produto,
            request: {
              tipo: "GET",
              descricao: "Retorna todos produtos",
              url: `http://localhost:3000/produtos`
            }
          }
        };

        return res.status(200).send(response);
      }
    );
  });
});

// Adiciona um produto.
router.post(
  "/",
  login.obrigatorio,
  upload.single("produto_imagem"),
  (req, res, next) => {
    console.log(req.file);
    mysql.getConnection((error, conn) => {
      if (error) {
        return res.status(500).send({ erro: error });
      }

      conn.query(
        "INSERT INTO produtos (nome, preco,imagem_produto) VALUES (?,?,?)",
        [req.body.nome, req.body.preco, req.file.path],
        (err, result, field) => {
          conn.release();

          if (err) {
            return res.status(500).send({ erro: err, response: null });
          }

          const response = {
            message: "Produto inserido com sucesso.",
            produtoCriado: {
              id_produto: result.id_produtos,
              nome: req.body.nome,
              preco: req.body.preco,
              imagem_produto: req.file.path,
              request: {
                tipo: "GET",
                descricao: "Retorna todos produtos",
                url: `http://localhost:3000/produtos`
              }
            }
          };

          return res.status(201).send(response);
        }
      );
    });
  }
);

// Atualiza um produto expecifico.
router.patch("/", login.obrigatorio, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ erro: error });
    }

    conn.query(
      `UPDATE produtos
          SET nome        = ?,
              preco       = ?
        WHERE id_produtos = ?
      `,
      [req.body.nome, req.body.preco, req.body.id_produto],
      (err, result, fields) => {
        conn.release();

        if (err) {
          return res.status(500).send({ erro: err, response: null });
        }

        const response = {
          message: "Produto atualizado com sucesso.",
          produtoAtualizado: {
            id_produto: result.id_produtos,
            nome: result.nome,
            preco: result.preco,
            request: {
              tipo: "GET",
              descricao: "Retorna os detalhes de um produto específico.",
              url: `http://localhost:3000/produtos/${result.id_produtos}`
            }
          }
        };

        res.status(202).send({ response });
      }
    );
  });
});

// Apaga um produto expecifico.
router.delete("/", login.obrigatorio, (req, res, next) => {
  mysql.getConnection((error, conn) => {
    if (error) {
      return res.status(500).send({ erro: error });
    }

    conn.query(
      `DELETE FROM produtos WHERE id_produtos = ?`,
      [req.body.id_produto],
      (err, result, fields) => {
        conn.release();

        if (err) {
          return res.status(500).send({ erro: err, response: null });
        }

        const response = {
          message: "Produto removido com sucesso.",
          request: {
            tipo: "POST",
            descricao: "Insere um produto.",
            url: `http://localhost:3000/produtos`,
            body: {
              nome: "String",
              preco: "Number"
            }
          }
        };

        return res.status(202).send(response);
      }
    );
  });
});

module.exports = router;
