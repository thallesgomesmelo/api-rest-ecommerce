const mysql = require("../mysql");

exports.deleteImage = async (req, res, next) => {
  try {
    const query = `DELETE FROM productImages WHERE imageId = ?;`;
    const params = [req.params.imageId];

    await mysql.execute(query, params);

    const response = {
      message: "Imagem removido com sucesso.",
      request: {
        type: "POST",
        decription: "Insere um produto.",
        url: `${process.env.URL_API}/produtos/${req.body.productId}/imagem`,
        body: {
          productId: "Number",
          productImage: "File"
        }
      }
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};
