import Atracao from "../Model/atracao.js";

export default class AtracaoCtrl {
    consultar(req, resp){
        if (req.method == "GET"){
            const atracao = new Atracao();
            atracao.consultar()
            .then((listaAtracoes) =>{
                resp.status(200).json({
                    status: "true",
                    atracoes: listaAtracoes
                });
            })
            .catch((erro) => {
                resp.status(500).json({
                    status:"false",
                    mensagem: erro.message
                });
            });
        }
        else{
            resp.status(405).json({
                status:"false",
                mensagem: "Metodo nao permitido"
            });
        }
    }

    consultarPorNome(req, resp){
        if (req.method == "GET"){
            const termo = req.params.termo;
            const atracao = new Atracao();
            atracao.consultarPorNome(termo)
            .then((listaAtracoes) =>{
                resp.status(200).json({
                    status: "true",
                    atracoes: listaAtracoes
                });
            })
            .catch((erro) => {
                resp.status(500).json({
                    status:"false",
                    mensagem: erro.message
                });
            });
        }
        else{
            resp.status(405).json({
                status:"false",
                mensagem: "Metodo nao permitido"
            });
        }
    }
}
