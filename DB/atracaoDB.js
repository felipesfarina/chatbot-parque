import obterConexao from "./conexao.js";
import Atracao from "../Model/atracao.js";

export default class AtracaoDB {
    async consultar() {
        const conexao = await obterConexao();
        try {
            const sql = 'SELECT * FROM atracao;';
            const [resultados] = await conexao.query(sql);
            const listaAtracoes = [];
            for (const resultado of resultados) {
                listaAtracoes.push(new Atracao(
                    resultado.codigo,
                    resultado.nome,
                    resultado.prazoManutencao,
                    resultado.situacao
                ));
            }
            return listaAtracoes;
        } finally {
            conexao.release();
        }
    }

    async consultarPorNome(termo) {
        const conexao = await obterConexao();
        try {
            const sql = 'SELECT * FROM atracao WHERE nome LIKE ?';
            const [resultados] = await conexao.query(sql, [`%${termo}%`]);
            const listaAtracoes = [];
            for (const resultado of resultados) {
                listaAtracoes.push(new Atracao(
                    resultado.codigo,
                    resultado.nome,
                    resultado.prazoManutencao,
                    resultado.situacao
                ));
            }
            return listaAtracoes;
        } finally {
            conexao.release();
        }
    }
}
