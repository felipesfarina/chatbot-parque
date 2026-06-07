import obterConexao from "./conexao.js";

export default class ClienteDB {
    async gravar(cliente) {
        const conexao = await obterConexao();
        try {
            const sql = 'INSERT INTO cliente (nome, documento, localizacao, telefone) VALUES (?, ?, ?, ?)';
            const [resultado] = await conexao.query(sql, [
                cliente.nome,
                cliente.documento,
                cliente.localizacao,
                cliente.telefone
            ]);
            cliente.codigo = resultado.insertId;
            return cliente;
        } finally {
            conexao.release();
        }
    }
}
