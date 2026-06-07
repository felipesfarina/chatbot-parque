import obterConexao from "./conexao.js";
import Chamado from "../Model/chamado.js";
import Cliente from "../Model/cliente.js";
import Atracao from "../Model/atracao.js";
import Tecnico from "../Model/tecnico.js";

export default class ChamadoDB {
    async gravar(chamado) {
        const conexao = await obterConexao();
        try {
            const sql = `INSERT INTO chamado
                (dataAbertura, status, codigoCliente, codigoAtracao, codigoTecnico, descricao)
                VALUES (?, ?, ?, ?, ?, ?)`;
            const [resultado] = await conexao.query(sql, [
                chamado.dataAbertura,
                chamado.status,
                chamado.cliente.codigo,
                chamado.atracao.codigo,
                chamado.tecnico.codigo,
                chamado.descricao
            ]);
            chamado.codigo = resultado.insertId;
            return chamado;
        } finally {
            conexao.release();
        }
    }

    async consultarPorCodigo(codigo) {
        const conexao = await obterConexao();
        try {
            const sql = `SELECT c.codigo, c.dataAbertura, c.status, c.descricao,
                    cli.codigo AS clienteCodigo, cli.nome AS clienteNome,
                    cli.documento, cli.localizacao, cli.telefone,
                    a.codigo AS atracaoCodigo, a.nome AS atracaoNome,
                    a.prazoManutencao, a.situacao,
                    t.codigo AS tecnicoCodigo, t.nome AS tecnicoNome, t.especialidade
                FROM chamado c
                INNER JOIN cliente cli ON cli.codigo = c.codigoCliente
                INNER JOIN atracao a ON a.codigo = c.codigoAtracao
                INNER JOIN tecnico t ON t.codigo = c.codigoTecnico
                WHERE c.codigo = ?`;
            const [resultados] = await conexao.query(sql, [codigo]);
            const resultado = resultados[0];
            if (!resultado) {
                return null;
            }

            const cliente = new Cliente(
                resultado.clienteCodigo,
                resultado.clienteNome,
                resultado.documento,
                resultado.localizacao,
                resultado.telefone
            );
            const atracao = new Atracao(
                resultado.atracaoCodigo,
                resultado.atracaoNome,
                resultado.prazoManutencao,
                resultado.situacao
            );
            const tecnico = new Tecnico(
                resultado.tecnicoCodigo,
                resultado.tecnicoNome,
                resultado.especialidade
            );

            return new Chamado(
                resultado.codigo,
                resultado.dataAbertura,
                resultado.status,
                cliente,
                atracao,
                tecnico,
                resultado.descricao
            );
        } finally {
            conexao.release();
        }
    }
}
