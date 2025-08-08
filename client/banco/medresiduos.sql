-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 08/08/2025 às 03:22
-- Versão do servidor: 10.4.28-MariaDB
-- Versão do PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `medresiduos`
--

-- --------------------------------------------------------

--
-- Estrutura para tabela `agenda_de_coleta`
--

CREATE TABLE `agenda_de_coleta` (
  `id_agenda` int(11) NOT NULL,
  `id_paciente` int(11) DEFAULT NULL,
  `id_parceiro` int(11) DEFAULT NULL,
  `data_agendada` datetime DEFAULT NULL,
  `status` enum('agendada','realizada','cancelada') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `agenda_de_coleta`
--

INSERT INTO `agenda_de_coleta` (`id_agenda`, `id_paciente`, `id_parceiro`, `data_agendada`, `status`) VALUES
(1, 8, 2, '2025-07-22 01:00:00', 'cancelada'),
(2, 9, 5, '2025-07-22 16:28:00', 'realizada'),
(3, 4, 2, '2025-07-31 16:36:00', 'cancelada'),
(4, 13, 4, '2025-08-09 16:37:00', 'agendada'),
(5, 14, 6, '2025-08-05 20:40:00', 'agendada'),
(6, 12, 2, '2025-07-10 17:40:00', 'agendada'),
(7, 4, 6, '2025-08-06 10:00:00', 'cancelada'),
(8, 13, 4, '2025-08-01 11:00:00', 'realizada');

-- --------------------------------------------------------

--
-- Estrutura para tabela `entrega_materiais`
--

CREATE TABLE `entrega_materiais` (
  `id_entrega` int(11) NOT NULL,
  `id_paciente` int(11) NOT NULL,
  `id_residuo` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `data_entrega` datetime NOT NULL DEFAULT current_timestamp(),
  `observacoes` text DEFAULT NULL,
  `status` enum('Entregue','Aguardando Devolução','Devolvido','Vencido') NOT NULL DEFAULT 'Aguardando Devolução',
  `data_prevista_devolucao` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `entrega_materiais`
--

INSERT INTO `entrega_materiais` (`id_entrega`, `id_paciente`, `id_residuo`, `quantidade`, `data_entrega`, `observacoes`, `status`, `data_prevista_devolucao`) VALUES
(10, 8, 4, 10, '2025-08-07 22:07:01', 'Kit 10 dias', 'Aguardando Devolução', '2025-08-18');

-- --------------------------------------------------------

--
-- Estrutura para tabela `paciente`
--

CREATE TABLE `paciente` (
  `id_paciente` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `cpf` varchar(14) DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cep` varchar(9) DEFAULT NULL,
  `logradouro` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL,
  `data_nascimento` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `paciente`
--

INSERT INTO `paciente` (`id_paciente`, `nome`, `cpf`, `telefone`, `email`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `data_nascimento`) VALUES
(4, 'Manoela Pinheiro da Silva', '48767759823', '18996816585', 'manoelaps2022@gmail.com', '19200009', 'Rua Angelo Salvatori', '125', 'ao lado do hotel almanara', 'Centro', 'Pirapozinho', 'SP', '2006-03-29'),
(5, 'João da Silva', '11122233344', '11987654321', 'joao.silva@email.com', '01311000', 'Avenida Paulista', '1578', 'Andar 10', 'Bela Vista', 'São Paulo', 'SP', '1980-05-15'),
(6, 'Maria Oliveira', '22233344455', '21912345678', 'maria.oliveira@email.com', '22071000', 'Avenida Atlântica', '1702', 'Apto 501', 'Copacabana', 'Rio de Janeiro', 'RJ', '1992-11-20'),
(7, 'Carlos Pereira', '33344455566', '18999887766', 'carlos.pereira@email.com', '19015020', 'Avenida Washington Luiz', '2500', NULL, 'Jardim Paulista', 'Presidente Prudente', 'SP', '1975-02-10'),
(8, 'Ana Costa', '44455566677', '18988776655', 'ana.costa@email.com', '19200000', 'Rua Sete de Setembro', '450', 'Casa', 'Centro', 'Pirapozinho', 'SP', '2001-07-30'),
(9, 'Pedro Martins', '55566677788', '31977665544', 'pedro.martins@email.com', '30112010', 'Avenida do Contorno', '2905', 'Sala 3', 'Santa Efigênia', 'Belo Horizonte', 'MG', '1988-09-01'),
(10, 'Lúcia Ferreira', '66677788899', '71966554433', 'lucia.ferreira@email.com', '40020000', 'Avenida Sete de Setembro', '1234', NULL, 'Centro', 'Salvador', 'BA', '1995-03-25'),
(11, 'Marcos Almeida', '77788899900', '81955443322', 'marcos.almeida@email.com', '50030000', 'Avenida Marquês de Olinda', '290', 'Pista Local', 'Recife', 'Recife', 'PE', '1969-12-07'),
(12, 'Sofia Ribeiro', '88899900011', '41944332211', 'sofia.ribeiro@email.com', '80050350', 'Avenida Sete de Setembro', '2775', 'Loja 15', 'Rebouças', 'Curitiba', 'PR', '2003-01-18'),
(13, 'Daniel Carvalho', '99900011122', '51933221100', 'daniel.carvalho@email.com', '90010191', 'Rua dos Andradas', '1001', 'Sobreloja', 'Centro Histórico', 'Porto Alegre', 'RS', '1978-06-22'),
(14, 'Beatriz Santos', '00011122233', '62922110099', 'beatriz.santos@email.com', NULL, NULL, NULL, NULL, NULL, NULL, NULL, '1999-08-14');

-- --------------------------------------------------------

--
-- Estrutura para tabela `parceiro`
--

CREATE TABLE `parceiro` (
  `id_parceiro` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `cnpj` varchar(18) DEFAULT NULL,
  `inscricao_estadual` varchar(20) DEFAULT NULL,
  `responsavel` varchar(100) DEFAULT NULL,
  `observacoes` text DEFAULT NULL,
  `tipo` enum('farmacia','ubs','empresa_coleta') DEFAULT NULL,
  `telefone` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `cep` varchar(9) DEFAULT NULL,
  `logradouro` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `estado` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `parceiro`
--

INSERT INTO `parceiro` (`id_parceiro`, `nome`, `cnpj`, `inscricao_estadual`, `responsavel`, `observacoes`, `tipo`, `telefone`, `email`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`) VALUES
(2, 'Farmais Pirapozinho', '12.345.678/0001-01', '555.123.456.789', 'Carlos Medeiros', 'Ponto de coleta de medicamentos vencidos.', 'farmacia', '(18) 3269-1020', 'pirapozinho@farmais.com.br', '19200-000', 'Rua Rui Barbosa', '789', 'Ao lado do mercado', 'Centro', 'Pirapozinho', 'SP'),
(4, 'Drogaria Nissei', '34.567.890/0001-03', '666.777.888.999', 'Fernanda Lima', 'Não aceita perfurocortantes.', 'farmacia', '(18) 3222-3040', 'prudente.centro@nissei.com.br', '19010-000', 'Avenida Coronel José Soares Marcondes', '1120', '', 'Centro', 'Presidente Prudente', 'SP'),
(5, 'UBS Dr. Vila Real', '45.678.901/0001-04', 'Isento', 'Dra. Helena Martins', 'Ponto de descarte para a comunidade do bairro.', 'ubs', '(18) 3269-5566', 'ubs.vilareal@pirapozinho.sp.gov.br', '19200-000', 'Rua das Flores', '150', 'Posto de Saúde', 'Jardim Bela Vista', 'Pirapozinho', 'SP'),
(6, 'Rede Farma Certa', '56.789.012/0001-05', '999.888.777.666', 'Ricardo Almeida', 'Coleta de segunda a sexta, horário comercial.', 'farmacia', '(18) 3221-5060', 'parquedopovo@farmacerta.com.br', '19060-000', 'Avenida Quatorze de Setembro', '2345', '', 'Parque do Povo', 'Presidente Prudente', 'SP'),
(7, 'Droga Raia - Parque do Povo', '61.585.865/0146-93', '111.222.333.444', 'Juliana Lima', 'Ponto de coleta oficial Descarte-Certo', 'farmacia', '(18) 3908-1234', 'ppo.drogaraia@email.com', '19060-050', 'Av. Onze de Maio', '1500', '', 'Parque do Povo', 'Presidente Prudente', 'SP'),
(8, 'UBS Jardim Guanabara', '46.382.759/0001-91', 'Isento', 'Dr. Ricardo Mendes', 'Atende a zona leste da cidade', 'ubs', '(18) 3905-4321', 'ubs.guanabara@presidenteprudente.sp.gov.br', '19033-040', 'Rua Doutor Gurgel', '822', '', 'Jardim Guanabara', 'Presidente Prudente', 'SP'),
(9, 'Farmácia São Paulo - Centro', '55.444.333/0001-22', '987.654.321.000', 'Márcio Campos', 'Coleta de perfurocortantes e medicamentos líquidos', 'farmacia', '(18) 3221-9876', 'centro.saopaulo@farmacia.com', '19010-061', 'Rua Tenente Nicolau Maffei', '550', '', 'Centro', 'Presidente Prudente', 'SP');

-- --------------------------------------------------------

--
-- Estrutura para tabela `residuo`
--

CREATE TABLE `residuo` (
  `id_residuo` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `descricao` text DEFAULT NULL,
  `grupo` enum('A - Infectante','B - Químico','D - Comum','E - Perfurocortante') NOT NULL COMMENT 'Classificação ANVISA RDC 222/2018',
  `risco_especifico` enum('Biológico','Químico','Perfurocortante','Nenhum') NOT NULL,
  `estado_fisico` enum('Sólido','Líquido','Semissólido') NOT NULL,
  `acondicionamento` enum('Saco Branco Leitoso','Saco Vermelho','Caixa para Perfurocortante (Descarpack)','Galão Rígido','Saco Preto') NOT NULL COMMENT 'Tipo de embalagem para descarte'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `residuo`
--

INSERT INTO `residuo` (`id_residuo`, `nome`, `descricao`, `grupo`, `risco_especifico`, `estado_fisico`, `acondicionamento`) VALUES
(2, 'Curativos e Gazes', 'Utilizados em ferimentos com sangue', 'A - Infectante', 'Biológico', 'Sólido', 'Saco Branco Leitoso'),
(3, 'Frascos de Medicamento', 'Frascos de vidro de medicação líquida', 'B - Químico', 'Químico', 'Líquido', 'Galão Rígido'),
(4, 'Agulha de Insulina', 'Utilizado por paciente diabetico', 'E - Perfurocortante', 'Perfurocortante', 'Sólido', 'Caixa para Perfurocortante (Descarpack)'),
(5, 'Lancetas para Glicemia', 'Usadas para medir nível de açúcar no sangue', 'E - Perfurocortante', 'Perfurocortante', 'Sólido', 'Caixa para Perfurocortante (Descarpack)'),
(6, 'Fitas de Glicemia', 'Tiras reagentes com resíduo de sangue', 'A - Infectante', 'Biológico', 'Sólido', 'Saco Branco Leitoso'),
(7, 'Frasco de Insulina', 'Frasco de vidro com sobras de medicamento', 'B - Químico', 'Químico', 'Líquido', 'Galão Rígido'),
(8, 'Algodão e Gazes com Sangue', 'Material de curativo utilizado em pacientes', 'A - Infectante', 'Biológico', 'Sólido', 'Saco Branco Leitoso'),
(9, 'Seringa para Insulina (sem agulha)', 'Corpo plástico da seringa após uso', 'D - Comum', 'Nenhum', 'Sólido', 'Saco Preto'),
(10, 'Ampolas de Vidro', 'Recipiente de medicamento quebrado após o uso', 'E - Perfurocortante', 'Perfurocortante', 'Sólido', 'Caixa para Perfurocortante (Descarpack)');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuario`
--

CREATE TABLE `usuario` (
  `id_usuario` int(11) NOT NULL,
  `nome` varchar(100) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `senha` varchar(255) DEFAULT NULL,
  `tipo` enum('admin','comum') DEFAULT 'comum',
  `cep` varchar(10) DEFAULT NULL,
  `logradouro` varchar(255) DEFAULT NULL,
  `numero` varchar(20) DEFAULT NULL,
  `complemento` varchar(100) DEFAULT NULL,
  `bairro` varchar(100) DEFAULT NULL,
  `cidade` varchar(100) DEFAULT NULL,
  `uf` varchar(2) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome`, `email`, `senha`, `tipo`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `uf`) VALUES
(8, 'Manoela Pinheiro da Silva', 'manoela2903@outlook.com', '$2b$10$cy6YqZ7w3PdejvlBZHsk5exZ7hiqUBnc/s6h17lMep65xP9dx6FKm', 'admin', '19200009', 'Rua Angelo Salvatori', '125', 'Ao Lado do Hotel Almanara', 'Centro', 'Pirapozinho', 'SP'),
(10, 'Gustavo Henrique Bispo Costa', 'gustavobispocosta5521@gmail.com', '$2b$10$eyBqAjIehZIXtgi0OSEYO.J6w.iUV8CacfghHcc7MDZ2UvRVP67z2', 'admin', '19220222', 'Rua José Braz da Silva', '4', 'Casa com Sobrado', 'Parque dos Ingás II', 'Narandiba', 'SP');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `agenda_de_coleta`
--
ALTER TABLE `agenda_de_coleta`
  ADD PRIMARY KEY (`id_agenda`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_parceiro` (`id_parceiro`);

--
-- Índices de tabela `entrega_materiais`
--
ALTER TABLE `entrega_materiais`
  ADD PRIMARY KEY (`id_entrega`),
  ADD KEY `fk_entrega_paciente` (`id_paciente`),
  ADD KEY `fk_entrega_residuo` (`id_residuo`);

--
-- Índices de tabela `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- Índices de tabela `parceiro`
--
ALTER TABLE `parceiro`
  ADD PRIMARY KEY (`id_parceiro`),
  ADD UNIQUE KEY `cnpj` (`cnpj`);

--
-- Índices de tabela `residuo`
--
ALTER TABLE `residuo`
  ADD PRIMARY KEY (`id_residuo`);

--
-- Índices de tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agenda_de_coleta`
--
ALTER TABLE `agenda_de_coleta`
  MODIFY `id_agenda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `entrega_materiais`
--
ALTER TABLE `entrega_materiais`
  MODIFY `id_entrega` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `parceiro`
--
ALTER TABLE `parceiro`
  MODIFY `id_parceiro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT de tabela `residuo`
--
ALTER TABLE `residuo`
  MODIFY `id_residuo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `agenda_de_coleta`
--
ALTER TABLE `agenda_de_coleta`
  ADD CONSTRAINT `agenda_de_coleta_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `agenda_de_coleta_ibfk_2` FOREIGN KEY (`id_parceiro`) REFERENCES `parceiro` (`id_parceiro`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Restrições para tabelas `entrega_materiais`
--
ALTER TABLE `entrega_materiais`
  ADD CONSTRAINT `fk_entrega_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_entrega_residuo` FOREIGN KEY (`id_residuo`) REFERENCES `residuo` (`id_residuo`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
