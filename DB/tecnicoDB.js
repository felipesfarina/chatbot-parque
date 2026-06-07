import obterConexao from "./conexao.js";
import Tecnico from "../Model/tecnico.js";

export default class TecnicoDB {
    async sortear() {
        const conexao = await obterConexao();
        try {
            const sql = 'SELECT * FROM tecnico ORDER BY RAND() LIMIT 1';
            const [resultados] = await conexao.query(sql);
            const tecnico = resultados[0];
            return new Tecnico(tecnico.codigo, tecnico.nome, tecnico.especialidade);
        } finally {
            conexao.release();
        }
    }
}
