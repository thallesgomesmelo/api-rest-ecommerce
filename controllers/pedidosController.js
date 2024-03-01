const { query } = require("express");
const mysql = require("../mysql");

exports.getPedidos = async (req, res, next) => {
  try {
    const query = `SELECT pedidos.id_pedido, 
                          pedidos.quantidade, 
                          produtos.id_produtos, 
                          produtos.nome, 
                          produtos.preco 
                     FROM pedidos 
               INNER JOIN produtos 
                       ON produtos.id_produtos = pedidos.id_produtos;`;
    const result = await mysql.execute(query);

    const response = {
      pedidos: result.map(ped => {
        return {
          id_pedido: ped.id_pedido,
          quantidade: ped.quantidade,
          produto: {
            id_produto: ped.id_produtos,
            nome: ped.nome,
            preco: ped.preco
          },
          request: {
            tipo: "GET",
            descricao: "Retorna os detalhes de um pedido em específico.",
            url: `${process.env.URL_API}/pedidos/${ped.id_pedido}`
          }
        };
      })
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.getUmPedido = async (req, res, next) => {
  try {
    const query = "SELECT * FROM pedidos WHERE id_pedido = ?;";
    const params = [req.params.id_pedidos];

    const result = await mysql.execute(query, params);

    if (result.length == 0) {
      return res.status(404).send({ message: "Pedido não encontrado." });
    }

    const response = {
      pedido: {
        id_pedido: result[0].id_pedido,
        id_produto: result[0].id_produtos,
        quantidade: result[0].quantidade,
        request: {
          tipo: "GET",
          descricao: "Retorna todos pedidos",
          url: `${process.env.URL_API}/pedidos`
        }
      }
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.postPedidos = async (req, res, next) => {
  try {
    const queryProduto = "SELECT * FROM produtos WHERE id_produtos = ?;";

    const results = await mysql.execute(queryProduto, [req.body.id_produto]);

    if (results.length == 0) {
      return res.status(404).send({ message: "Produto não encontrado." });
    }

    const queryPedido = "INSERT INTO pedidos (id_produtos, quantidade) VALUES (?,?)";
    const params = [req.body.id_produto, req.body.quantidade];

    const result = await mysql.execute(queryPedido, params);

    const response = {
      message: "Pedido inserido com sucesso.",
      pedidoCriado: {
        id_pedido: result.id_pedido,
        id_produto: req.body.id_produto,
        quantidade: req.body.quantidade,
        request: {
          tipo: "GET",
          descricao: "Retorna todos pedidos",
          url: `${process.env.URL_API}/pedidos`
        }
      }
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.deletePedido = async (req, res, next) => {
  try {
    const query = `DELETE FROM pedidos WHERE id_pedido = ?;`;

    await mysql.execute(query, [req.body.id_pedido]);

    const response = {
      message: "Pedido removido com sucesso.",
      request: {
        tipo: "POST",
        descricao: "Insere um pedido.",
        url: `${process.env.URL_API}/pedidos`,
        body: {
          id_produto: "Number",
          quantidade: "Number"
        }
      }
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};
