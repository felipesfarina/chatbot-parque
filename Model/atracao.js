import AtracaoDB from "../DB/atracaoDB.js";

export default class Atracao {
    #codigo
    #nome
    #prazoManutencao
    #situacao

    constructor(codigo, nome, prazoManutencao, situacao) {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#prazoManutencao = prazoManutencao;
        this.#situacao = situacao;
    }

    get codigo() { return this.#codigo; }
    get nome() { return this.#nome; }
    get prazoManutencao() { return this.#prazoManutencao; }
    get situacao() { return this.#situacao; }

    set codigo(codigo) { this.#codigo = codigo; }
    set nome(nome) { this.#nome = nome; }
    set prazoManutencao(prazoManutencao) { this.#prazoManutencao = prazoManutencao; }
    set situacao(situacao) { this.#situacao = situacao; }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            prazoManutencao: this.#prazoManutencao,
            situacao: this.#situacao
        };
    }

    async consultar(){
        const atracaoDB = new AtracaoDB();
        return await atracaoDB.consultar();
    }

    async consultarPorNome(termo){
        const atracaoDB = new AtracaoDB();
        return await atracaoDB.consultarPorNome(termo);
    }
}
