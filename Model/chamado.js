import ChamadoDB from "../DB/chamadoDB.js";

export default class Chamado {
    #codigo
    #dataAbertura
    #status
    #cliente
    #atracao
    #tecnico
    #descricao

    constructor(codigo, dataAbertura, status, cliente, atracao, tecnico, descricao) {
        this.#codigo = codigo;
        this.#dataAbertura = dataAbertura;
        this.#status = status;
        this.#cliente = cliente;
        this.#atracao = atracao;
        this.#tecnico = tecnico;
        this.#descricao = descricao;
    }

    get codigo() { return this.#codigo; }
    get dataAbertura() { return this.#dataAbertura; }
    get status() { return this.#status; }
    get cliente() { return this.#cliente; }
    get atracao() { return this.#atracao; }
    get tecnico() { return this.#tecnico; }
    get descricao() { return this.#descricao; }

    set codigo(codigo) { this.#codigo = codigo; }

    toJSON() {
        return {
            codigo: this.#codigo,
            dataAbertura: this.#dataAbertura,
            status: this.#status,
            cliente: this.#cliente,
            atracao: this.#atracao,
            tecnico: this.#tecnico,
            descricao: this.#descricao
        };
    }

    async gravar(){
        const chamadoDB = new ChamadoDB();
        return await chamadoDB.gravar(this);
    }

    async consultarPorCodigo(codigo){
        const chamadoDB = new ChamadoDB();
        return await chamadoDB.consultarPorCodigo(codigo);
    }
}
