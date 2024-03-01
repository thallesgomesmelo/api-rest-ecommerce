const mysql = require("../mysql");

exports.getProdutos = async (req, res, next) => {
  try {
    const result = await mysql.execute("SELECT * FROM produtos;");

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
            url: `${process.env.URL_API}/produtos/${prod.id_produtos}`
          }
        };
      })
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getUmProduto = async (req, res, next) => {
  try {
    const query = "SELECT * FROM produtos WHERE id_produtos = ?;";
    const params = [req.params.id_produto];

    const result = await mysql.execute(query, params);

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
          url: `${process.env.URL_API}/produtos`
        }
      }
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postProduto = async (req, res, next) => {
  try {
    const query = "INSERT INTO produtos (nome, preco,imagem_produto) VALUES (?,?,?)";
    const params = [req.body.nome, req.body.preco, req.file.path];

    const result = await mysql.execute(query, params);

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
          url: `${process.env.URL_API}/produtos`
        }
      }
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.pathProduto = async (req, res, next) => {
  try {
    const query = `UPDATE produtos SET nome = ?, preco = ? WHERE id_produtos = ?;`;
    const params = [req.body.nome, req.body.preco, req.body.id_produto];

    await mysql.execute(query, params);

    const response = {
      message: "Produto atualizado com sucesso.",
      produtoAtualizado: {
        id_produto: req.body.id_produto,
        nome: req.body.nome,
        preco: req.body.preco,
        request: {
          tipo: "GET",
          descricao: "Retorna os detalhes de um produto específico.",
          url: `${process.env.URL_API}/produtos/${req.body.id_produto}`
        }
      }
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.deleteProduto = async (req, res, next) => {
  try {
    const query = `DELETE FROM produtos WHERE id_produtos = ?;`;
    const params = [req.body.id_produto];

    await mysql.execute(query, params);

    const response = {
      message: "Produto removido com sucesso.",
      request: {
        tipo: "POST",
        descricao: "Insere um produto.",
        url: `${process.env.URL_API}/produtos`,
        body: {
          nome: "String",
          preco: "Number"
        }
      }
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

// Imagem
exports.postImagem = async (req, res, next) => {
  try {
    const query = "INSERT INTO imagens_produtos (id_produto, caminho) VALUES (?,?)";
    const params = [req.params.id_produto, req.file.path];

    const result = await mysql.execute(query, params);

    const response = {
      message: "Imagem inserido com sucesso.",
      imagemCriado: {
        id_produto: req.params.id_produto,
        id_imagem: result.insertId,
        imagem_produto: req.file.path,
        request: {
          tipo: "GET",
          descricao: "Retorna todas as imagens.",
          url: `${process.env.URL_API}/produtos/${req.params.id_produto}/imagens`
        }
      }
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.getImagens = async (req, res, next) => {
  try {
    const query = "SELECT * FROM imagens_produtos WHERE id_produto = ?;";
    const result = await mysql.execute(query, [req.params.id_produto]);

    const response = {
      quantidade: result.length,
      imagens: result.map(img => {
        return {
          id_produto: parseInt(req.params.id_produto),
          id_imagem: img.id_imagem,
          caminho: `${process.env.URL_API}/${img.caminho}`
        };
      })
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
