import { Router } from "express";
import AtracaoCtrl from "../Controller/atracaoCtrl.js";

const rotaAtracao = Router();
const atracaoCtrl = new AtracaoCtrl();

rotaAtracao.get("/", atracaoCtrl.consultar);
rotaAtracao.get("/:termo", atracaoCtrl.consultarPorNome);

export default rotaAtracao;
