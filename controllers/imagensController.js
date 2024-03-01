const mysql = require("../mysql");

exports.deleteImagem = async (req, res, next) => {
  try {
    const query = `DELETE FROM imagens_produtos WHERE id_imagem = ?;`;
    const params = [req.params.id_imagem];

    await mysql.execute(query, params);

    const response = {
      message: "Imagem removido com sucesso.",
      request: {
        tipo: "POST",
        descricao: "Insere um produto.",
        url: `${process.env.URL_API}/produtos/${req.body.id_produto}/imagem`,
        body: {
          id_produto: "Number",
          imagem_produto: "File"
        }
      }
    };

    return res.status(202).send(response);
  } catch (error) {
    return res.status(500).send({ erro: error });
  }
};
