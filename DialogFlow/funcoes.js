import Atracao from "../Model/atracao.js";
import Cliente from "../Model/cliente.js";
import Chamado from "../Model/chamado.js";
import TecnicoDB from "../DB/tecnicoDB.js";

function criarRespostaTexto(textos, origem){
    if (origem == "custom"){
        return {
            fulfillmentMessages: [{
                text: {
                    text: textos
                }
            }]
        };
    }

    return {
        fulfillmentMessages: [{
            payload: {
                richContent: [[{
                    type: "description",
                    text: textos
                }]]
            }
        }]
    };
}

function obterSessao(dados){
    return dados?.session?.split("/").pop() || "sessao";
}

function obterParametro(dados, nome){
    return dados?.queryResult?.parameters?.[nome];
}

function normalizarTexto(valor){
    if (Array.isArray(valor)){
        return valor[0] || "";
    }
    return valor || "";
}

function criarMessengerCard(atracao){
    return {
        type:"info",
        title: atracao.nome,
        subtitle: `Prazo de manutencao: ${atracao.prazoManutencao}. Situacao: ${atracao.situacao}`,
        image: {
            src : {
                rawUrl:"https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9"
            }
        },
        actionLink:""
    };
}

function criarCustomCard(atracao){
    return {
        card: {
            title: atracao.nome,
            subtitle: `Prazo de manutencao: ${atracao.prazoManutencao}. Situacao: ${atracao.situacao}`,
            imageUri:"https://images.unsplash.com/photo-1513889961551-628c1e5e2ee9",
            buttons: [
                {
                    text:"Mais informacoes",
                    postback:"https://www.google.com"
                }
            ]
        }
    };
}

export async function apresentarAtracoes(origem){
    const atracao = new Atracao();
    const listaAtracoes = await atracao.consultar();

    if (origem == "custom"){
        const resposta = {
            fulfillmentMessages: [{
                text: {
                    text: ["Estas sao as principais atracoes cadastradas no sistema:"]
                }
            }]
        };
        for (const item of listaAtracoes){
            resposta.fulfillmentMessages.push(criarCustomCard(item));
        }
        return resposta;
    }

    const resposta = {
        fulfillmentMessages: [{
            payload: {
                richContent: [[{
                    type:"description",
                    title:"Atracoes do parque",
                    text:["Estas sao as principais atracoes cadastradas no sistema:"]
                }]]
            }
        }]
    };
    for (const item of listaAtracoes){
        resposta.fulfillmentMessages[0].payload.richContent[0].push(criarMessengerCard(item));
    }
    return resposta;
}

export async function relatarProblema(dados, origem){
    const sessao = obterSessao(dados);
    const nomeAtracao = normalizarTexto(obterParametro(dados, "atracao"));
    const atracao = new Atracao();
    const listaAtracoes = await atracao.consultarPorNome(nomeAtracao);
    const atracaoEncontrada = listaAtracoes[0];

    if (!global.dados){
        global.dados = {};
    }
    if (!global.dados[sessao]){
        global.dados[sessao] = { atracoes: [] };
    }

    if (!atracaoEncontrada){
        return criarRespostaTexto([
            "Desculpe, nao encontrei essa atracao no sistema.",
            "Informe uma das atracoes cadastradas: Montanha-russa Dragão Azul, Carrossel Encantado, Trem Fantasma Sombrio ou Roda-Gigante Estelar."
        ], origem);
    }

    global.dados[sessao].atracoes.push({
        codigo: atracaoEncontrada.codigo,
        nome: atracaoEncontrada.nome,
        prazoManutencao: atracaoEncontrada.prazoManutencao
    });

    return criarRespostaTexto([
        `Entendido! Nosso prazo estimado para atendimento na ${atracaoEncontrada.nome} e de ${atracaoEncontrada.prazoManutencao}.`,
        "Deseja registrar mais alguma atracao?"
    ], origem);
}

export async function registrarChamado(dados, origem){
    const sessao = obterSessao(dados);
    const atracoes = global.dados?.[sessao]?.atracoes || [];

    if (atracoes.length == 0){
        return criarRespostaTexto([
            "Antes de registrar seus dados, informe qual atracao esta com problema."
        ], origem);
    }

    const nome = normalizarTexto(obterParametro(dados, "nome"));
    const documento = normalizarTexto(obterParametro(dados, "documento"));
    const localizacao = normalizarTexto(obterParametro(dados, "localizacao") || obterParametro(dados, "localização"));
    const telefone = normalizarTexto(obterParametro(dados, "telefone"));

    const cliente = new Cliente(null, nome, documento, localizacao, telefone);
    await cliente.gravar();

    const tecnicoDB = new TecnicoDB();
    const protocolos = [];
    let tecnicoResponsavel = null;

    for (const item of atracoes){
        const atracao = new Atracao(item.codigo, item.nome, item.prazoManutencao, "");
        const tecnico = await tecnicoDB.sortear();
        tecnicoResponsavel = tecnico;
        const chamado = new Chamado(
            null,
            new Date(),
            "Tecnico acionado",
            cliente,
            atracao,
            tecnico,
            `Problema informado pelo usuario na atracao ${item.nome}`
        );
        await chamado.gravar();
        protocolos.push(`#${chamado.codigo} - ${item.nome}`);
    }

    global.dados[sessao] = { atracoes: [] };

    return criarRespostaTexto([
        `Perfeito, ${cliente.nome}! Seu chamado foi registrado.`,
        `Protocolos: ${protocolos.join(", ")}.`,
        `O tecnico responsavel sera ${tecnicoResponsavel.nome}, que ja foi acionado.`
    ], origem);
}

export async function consultarStatus(dados, origem){
    const protocolo = normalizarTexto(obterParametro(dados, "protocolo"));
    const chamado = new Chamado();
    const chamadoEncontrado = await chamado.consultarPorCodigo(protocolo);

    if (!chamadoEncontrado){
        return criarRespostaTexto([
            "Chamado nao encontrado. Confira o numero do protocolo e tente novamente."
        ], origem);
    }

    return criarRespostaTexto([
        "Chamado localizado!",
        `Status: ${chamadoEncontrado.status}.`,
        `O tecnico ${chamadoEncontrado.tecnico.nome} esta a caminho da ${chamadoEncontrado.atracao.nome}.`,
        `Local informado pelo usuario: ${chamadoEncontrado.cliente.localizacao}.`
    ], origem);
}

export async function informacoesParque(origem){
    return criarRespostaTexto([
        "O parque funciona das 9h as 22h.",
        "Os pontos de apoio ficam na entrada principal, praca central e area medieval.",
        "A estacao de primeiros socorros fica proxima a praca central.",
        "Tambem posso registrar problemas em atracoes ou consultar chamados."
    ], origem);
}
