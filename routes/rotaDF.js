import { Router } from "express";
import DFCtrl from "../Controller/dfCtrl.js";

const rotaDF = Router();
const dfCtrl = new DFCtrl();

rotaDF.get("/", dfCtrl.obterAtracoes);
rotaDF.post("/", dfCtrl.processarIntents);

export default rotaDF;
