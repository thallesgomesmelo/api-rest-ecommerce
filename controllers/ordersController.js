const mysql = require("../mysql");

exports.getOrders = async (req, res, next) => {
  try {
    const query = `SELECT orders.orderId, 
                          orders.quantity, 
                          products.productId, 
                          products.nome, 
                          products.price 
                     FROM orders 
               INNER JOIN products 
                       ON products.productId = orders.productId;`;
    const result = await mysql.execute(query);

    const response = {
      orders: result.map(ped => {
        return {
          orderId: ped.orderId,
          quantity: ped.quantity,
          product: {
            productId: ped.productId,
            nome: ped.nome,
            price: ped.price
          },
          request: {
            type: "GET",
            decription: "Retorna os detalhes de um pedido em específico.",
            url: `${process.env.URL_API}/pedidos/${ped.orderId}`
          }
        };
      })
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.getOneOrder = async (req, res, next) => {
  try {
    const query = "SELECT * FROM orders WHERE orderId = ?;";

    const result = await mysql.execute(query, [req.params.orderId]);

    if (result.length == 0) {
      return res.status(404).send({ message: "Pedido não encontrado." });
    }

    const response = {
      order: {
        orderId: result[0].orderId,
        productId: result[0].productId,
        quantity: result[0].quantity,
        request: {
          type: "GET",
          decription: "Retorna todos pedidos",
          url: `${process.env.URL_API}/pedidos`
        }
      }
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.postOrder = async (req, res, next) => {
  try {
    let query = "SELECT * FROM products WHERE productId = ?;";

    const results = await mysql.execute(query, [req.body.productId]);

    if (results.length == 0) {
      return res.status(404).send({ message: "Produto não encontrado." });
    }

    query = "INSERT INTO orders (productId, quantity) VALUES (?,?)";
    const params = [req.body.productId, req.body.quantity];

    const result = await mysql.execute(query, params);

    const response = {
      message: "Pedido inserido com sucesso.",
      orderCreate: {
        orderId: result.orderId,
        productId: req.body.productId,
        quantity: req.body.quantity,
        request: {
          type: "GET",
          decription: "Retorna todos pedidos",
          url: `${process.env.URL_API}/pedidos`
        }
      }
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.deleteOrder = async (req, res, next) => {
  try {
    const query = `DELETE FROM orders WHERE orderId = ?;`;

    await mysql.execute(query, [req.body.orderId]);

    const response = {
      message: "Pedido removido com sucesso.",
      request: {
        type: "POST",
        decription: "Insere um pedido.",
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
