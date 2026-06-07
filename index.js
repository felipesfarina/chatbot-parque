import express from 'express';
import dotenv from 'dotenv';
import rotaAtracao from './routes/rotaAtracao.js';
import rotaChamado from './routes/rotaChamado.js';
import rotaDF from './routes/rotaDF.js';

dotenv.config();

const porta = 3000;
const host = '0.0.0.0';
const app = express();

app.use(express.json());
app.use(express.static('public'));
app.use('/atracao', rotaAtracao);
app.use('/chamado', rotaChamado);
app.use('/webhook', rotaDF);

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});
