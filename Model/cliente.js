import ClienteDB from "../DB/clienteDB.js";

export default class Cliente {
    #codigo
    #nome
    #documento
    #localizacao
    #telefone

    constructor(codigo, nome, documento, localizacao, telefone) {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#documento = documento;
        this.#localizacao = localizacao;
        this.#telefone = telefone;
    }

    get codigo() { return this.#codigo; }
    get nome() { return this.#nome; }
    get documento() { return this.#documento; }
    get localizacao() { return this.#localizacao; }
    get telefone() { return this.#telefone; }

    set codigo(codigo) { this.#codigo = codigo; }
    set nome(nome) { this.#nome = nome; }
    set documento(documento) { this.#documento = documento; }
    set localizacao(localizacao) { this.#localizacao = localizacao; }
    set telefone(telefone) { this.#telefone = telefone; }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            documento: this.#documento,
            localizacao: this.#localizacao,
            telefone: this.#telefone
        };
    }

    async gravar(){
        const clienteDB = new ClienteDB();
        return await clienteDB.gravar(this);
    }
}
