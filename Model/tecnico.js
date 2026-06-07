export default class Tecnico {
    #codigo
    #nome
    #especialidade

    constructor(codigo, nome, especialidade) {
        this.#codigo = codigo;
        this.#nome = nome;
        this.#especialidade = especialidade;
    }

    get codigo() { return this.#codigo; }
    get nome() { return this.#nome; }
    get especialidade() { return this.#especialidade; }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            especialidade: this.#especialidade
        };
    }
}
