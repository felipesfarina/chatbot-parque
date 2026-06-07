USE PFS2_10442510930;

CREATE TABLE atracao (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    prazoManutencao VARCHAR(30) NOT NULL,
    situacao VARCHAR(100) NOT NULL
);

CREATE TABLE cliente (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    documento VARCHAR(30) NOT NULL,
    localizacao VARCHAR(150) NOT NULL,
    telefone VARCHAR(30) NOT NULL
);

CREATE TABLE tecnico (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    especialidade VARCHAR(100) NOT NULL
);

CREATE TABLE chamado (
    codigo INT AUTO_INCREMENT PRIMARY KEY,
    dataAbertura DATETIME NOT NULL,
    status VARCHAR(50) NOT NULL,
    codigoCliente INT NOT NULL,
    codigoAtracao INT NOT NULL,
    codigoTecnico INT NOT NULL,
    descricao VARCHAR(255),
    FOREIGN KEY (codigoCliente) REFERENCES cliente(codigo),
    FOREIGN KEY (codigoAtracao) REFERENCES atracao(codigo),
    FOREIGN KEY (codigoTecnico) REFERENCES tecnico(codigo)
);

INSERT INTO atracao (nome, prazoManutencao, situacao) VALUES
('Montanha-russa Dragão Azul', '3 horas', 'Em funcionamento'),
('Carrossel Encantado', '2 horas', 'Em funcionamento'),
('Trem Fantasma Sombrio', '1 hora', 'Em funcionamento'),
('Roda-Gigante Estelar', '4 horas', 'Em funcionamento');

INSERT INTO tecnico (nome, especialidade) VALUES
('Roberto Mekan', 'Montanhas-russas'),
('Juliana Torres', 'Brinquedos familiares'),
('Carlos Nunes', 'Sistemas eletricos'),
('Patricia Lima', 'Operacoes gerais');
