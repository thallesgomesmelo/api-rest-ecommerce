const mysql = require("../mysql");

exports.getProducts = async (req, res, next) => {
  try {
    const result = await mysql.execute("SELECT * FROM products;");

    const response = {
      length: result.length,
      products: result.map(prod => {
        return {
          productId: prod.productId,
          nome: prod.nome,
          price: prod.price,
          productImage: prod.productImage,
          request: {
            type: "GET",
            description: "Retorna os detalhes de um produto específico.",
            url: `${process.env.URL_API}/produtos/${prod.productId}`
          }
        };
      })
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.getOneProduct = async (req, res, next) => {
  try {
    const query = "SELECT * FROM products WHERE productId = ?;";
    const params = [req.params.productId];

    const result = await mysql.execute(query, params);

    if (result.length == 0) {
      return res.status(404).send({ message: "Produto não encontrado." });
    }

    const response = {
      product: {
        productId: result[0].productId,
        nome: result[0].nome,
        price: result[0].price,
        productImage: result[0].productImage,
        request: {
          type: "GET",
          decription: "Retorna todos produtos",
          url: `${process.env.URL_API}/produtos`
        }
      }
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};

exports.postProduct = async (req, res, next) => {
  try {
    const query = "INSERT INTO products (nome, price, productImage) VALUES (?,?,?)";
    const params = [req.body.nome, req.body.price, req.file.path];

    const result = await mysql.execute(query, params);

    const response = {
      message: "Produto inserido com sucesso.",
      productCreate: {
        productId: result.productId,
        nome: req.body.nome,
        price: req.body.price,
        productImage: req.file.path,
        request: {
          type: "GET",
          decription: "Retorna todos produtos",
          url: `${process.env.URL_API}/produtos`
        }
      }
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const query = `UPDATE products SET nome = ?, price = ? WHERE productId = ?;`;
    const params = [req.body.nome, req.body.price, req.body.productId];

    await mysql.execute(query, params);

    const response = {
      message: "Produto atualizado com sucesso.",
      productUpdate: {
        productId: req.body.productId,
        nome: req.body.nome,
        price: req.body.price,
        request: {
          type: "GET",
          decription: "Retorna os detalhes de um produto específico.",
          url: `${process.env.URL_API}/produtos/${req.body.productId}`
        }
      }
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    const query = `DELETE FROM products WHERE productId = ?;`;
    const params = [req.body.productId];

    await mysql.execute(query, params);

    const response = {
      message: "Produto removido com sucesso.",
      request: {
        type: "POST",
        decription: "Insere um produto.",
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
exports.postImage = async (req, res, next) => {
  try {
    const query = "INSERT INTO productImages (productId, path) VALUES (?,?);";
    const params = [req.params.productId, req.file.path];

    const result = await mysql.execute(query, params);

    const response = {
      message: "Imagem inserido com sucesso.",
      imageCreate: {
        productId: req.params.productId,
        imageId: result.insertId,
        productImage: req.file.path,
        request: {
          type: "GET",
          decription: "Retorna todas as imagens.",
          url: `${process.env.URL_API}/produtos/${req.params.productId}/imagens`
        }
      }
    };

    return res.status(201).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};

exports.getImages = async (req, res, next) => {
  try {
    const query = "SELECT * FROM productImages WHERE productId = ?;";
    const result = await mysql.execute(query, [req.params.productId]);

    const response = {
      length: result.length,
      images: result.map(img => {
        return {
          productId: parseInt(req.params.productId),
          imageId: img.imageId,
          path: `${process.env.URL_API}/${img.path}`
        };
        s;
      })
    };

    return res.status(200).send(response);
  } catch (error) {
    return res.status(500).send({ error: error });
  }
};
