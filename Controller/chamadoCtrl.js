import Chamado from "../Model/chamado.js";

export default class ChamadoCtrl {
    consultarPorCodigo(req, resp){
        if (req.method == "GET"){
            const codigo = req.params.codigo;
            const chamado = new Chamado();
            chamado.consultarPorCodigo(codigo)
            .then((chamadoEncontrado) =>{
                if (chamadoEncontrado) {
                    resp.status(200).json({
                        status: "true",
                        chamado: chamadoEncontrado
                    });
                }
                else {
                    resp.status(404).json({
                        status: "false",
                        mensagem: "Chamado nao encontrado"
                    });
                }
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
