import { apresentarAtracoes, relatarProblema, registrarChamado, consultarStatus, informacoesParque } from "../DialogFlow/funcoes.js";

export default class DFCtrl{
    obterAtracoes(req, resp){
        if (req.method=="GET"){
            apresentarAtracoes("messenger")
            .then((resposta) => {
                resp.status(200).json(resposta);
            })
            .catch((erro) => {
                resp.status(500).json({
                    status:"false",
                    mensagem: erro.message
                });
            });
        }
    }

    async processarIntents(req, resp){
        if (req.method == "POST" && req.is("application/json")){
            let resposta = {};
            const dados = req.body;
            let origem = dados?.originalDetectIntentRequest?.source;
            if (origem){
                origem = "custom";
            }
            else{
                origem = "messenger";
            }
            const intencao = dados?.queryResult?.intent?.displayName;
            switch(intencao){
                case "relatar_problema":
                    resposta = await relatarProblema(dados, origem);
                    break;
                case "registrar_dados_usuario":
                    resposta = await registrarChamado(dados, origem);
                    break;
                case "consultar_status":
                    resposta = await consultarStatus(dados, origem);
                    break;
                case "informacoes_parque":
                    resposta = await informacoesParque(origem);
                    break;
                default:
                    resposta = await apresentarAtracoes(origem);
                    break;
            }

            resp.json(resposta);
        }
        else{
            resp.status(405).json({
                status:"false",
                mensagem:"Metodo nao permitido"
            });
        }
    }
}
