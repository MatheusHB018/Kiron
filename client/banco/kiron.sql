-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Tempo de geração: 14-Ago-2025 às 21:53
-- Versão do servidor: 10.4.27-MariaDB
-- versão do PHP: 8.2.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `kiron`
--

-- --------------------------------------------------------

--
-- Estrutura da tabela `agenda_de_coleta`
--

CREATE TABLE `agenda_de_coleta` (
  `id_agenda` int(11) NOT NULL,
  `id_paciente` int(11) DEFAULT NULL,
  `id_parceiro` int(11) DEFAULT NULL,
  `data_agendada` datetime DEFAULT NULL,
  `status` enum('agendada','realizada','cancelada') DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Extraindo dados da tabela `agenda_de_coleta`
--

INSERT INTO `agenda_de_coleta` (`id_agenda`, `id_paciente`, `id_parceiro`, `data_agendada`, `status`) VALUES
(1, 3, 3, '2025-08-05 14:00:00', 'realizada'),
(2, 4, 3, '2025-08-10 10:00:00', 'realizada'),
(3, 1, 3, '2025-08-20 09:30:00', 'agendada'),
(4, 5, 3, '2025-08-25 11:00:00', 'agendada'),
(5, 2, 3, '2025-08-12 15:00:00', 'cancelada'),
(6, 11, 4, '2025-08-14 16:00:00', 'agendada');

-- --------------------------------------------------------

--
-- Estrutura da tabela `entrega_materiais`
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
-- Extraindo dados da tabela `entrega_materiais`
--

INSERT INTO `entrega_materiais` (`id_entrega`, `id_paciente`, `id_residuo`, `quantidade`, `data_entrega`, `observacoes`, `status`, `data_prevista_devolucao`) VALUES
(1, 1, 1, 30, '2025-06-10 10:00:00', 'Kit mensal de agulhas', 'Devolvido', '2025-07-10'),
(2, 2, 5, 50, '2025-06-15 11:30:00', 'Fitas de glicemia', 'Devolvido', '2025-07-15'),
(3, 3, 4, 100, '2025-07-01 09:00:00', 'Lancetas para 1 mês', 'Aguardando Devolução', '2025-08-01'),
(4, 4, 1, 30, '2025-07-05 14:00:00', 'Kit mensal de agulhas', 'Aguardando Devolução', '2025-08-05'),
(5, 5, 7, 5, '2025-07-20 16:00:00', 'Frascos de insulina', 'Aguardando Devolução', '2025-08-20'),
(6, 6, 3, 1, '2025-08-01 10:20:00', 'Kit de curativos grande', 'Aguardando Devolução', '2025-08-31'),
(7, 1, 9, 10, '2025-08-05 11:00:00', 'Ampolas de vitamina', 'Aguardando Devolução', '2025-09-05'),
(8, 7, 2, 30, '2025-08-10 08:30:00', 'Seringas descartáveis', 'Entregue', NULL);

-- --------------------------------------------------------

--
-- Estrutura da tabela `paciente`
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
-- Extraindo dados da tabela `paciente`
--

INSERT INTO `paciente` (`id_paciente`, `nome`, `cpf`, `telefone`, `email`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`, `data_nascimento`) VALUES
(1, 'João da Silva', '11122233301', '18997112233', 'joao.silva@email.com', NULL, NULL, NULL, NULL, NULL, 'Presidente Prudente', 'SP', '1985-05-20'),
(2, 'Maria Oliveira', '22233344402', '18996223344', 'maria.oliveira@email.com', NULL, NULL, NULL, NULL, NULL, 'Pirapozinho', 'SP', '1992-11-15'),
(3, 'Carlos Pereira', '33344455503', '18991334455', 'carlos.pereira@email.com', NULL, NULL, NULL, NULL, NULL, 'Álvares Machado', 'SP', '1978-02-10'),
(4, 'Ana Costa', '44455566604', '18996816585', 'ana.costa@email.com', '', '', '', '', '', 'Presidente Prudente', 'SP', '2001-07-30'),
(5, 'Pedro Martins', '55566677705', '18981556677', 'pedro.martins@email.com', NULL, NULL, NULL, NULL, NULL, 'Regente Feijó', 'SP', '1995-09-01'),
(6, 'Juliana Santos', '66677788806', '18997667788', 'juliana.santos@email.com', NULL, NULL, NULL, NULL, NULL, 'Presidente Prudente', 'SP', '1988-12-25'),
(7, 'Lucas Ferreira', '77788899907', '18996778899', 'lucas.ferreira@email.com', NULL, NULL, NULL, NULL, NULL, 'Pirapozinho', 'SP', '1999-03-12'),
(8, 'Beatriz Lima', '88899900008', '18991889900', 'beatriz.lima@email.com', NULL, NULL, NULL, NULL, NULL, 'Presidente Prudente', 'SP', '1980-06-05'),
(9, 'Gabriel Souza', '99900011109', '18988990011', 'gabriel.souza@email.com', NULL, NULL, NULL, NULL, NULL, 'Álvares Machado', 'SP', '2003-10-18'),
(10, 'Sofia Almeida', '12312312310', '18981112233', 'sofia.almeida@email.com', NULL, NULL, NULL, NULL, NULL, 'Regente Feijó', 'SP', '1996-01-22'),
(11, 'Manoela Pinheiro da Silva', '48767759823', '18996816585', 'manoelaps2022@gmail.com', '19200009', 'Rua Angelo Salvatori', '125', '', 'Centro', 'Pirapozinho', 'SP', '2006-03-29');

-- --------------------------------------------------------

--
-- Estrutura da tabela `parceiro`
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
-- Extraindo dados da tabela `parceiro`
--

INSERT INTO `parceiro` (`id_parceiro`, `nome`, `cnpj`, `inscricao_estadual`, `responsavel`, `observacoes`, `tipo`, `telefone`, `email`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `estado`) VALUES
(1, 'Farmácia Central de Prudente', '11.222.333/0001-44', NULL, 'Sr. Carlos', NULL, 'farmacia', '1832231122', 'contato@farmaciacentral.com', NULL, NULL, NULL, NULL, NULL, 'Presidente Prudente', 'SP'),
(2, 'UBS Ana Jacinta', '22.333.444/0001-55', NULL, 'Enf. Maria', NULL, 'ubs', '1839092233', 'ubs.anajacinta@prudente.sp.gov.br', NULL, NULL, NULL, NULL, NULL, 'Presidente Prudente', 'SP'),
(3, 'Coleta Segura Ambiental', '33.444.555/0001-66', NULL, 'Sra. Beatriz', NULL, 'empresa_coleta', '1839064455', 'comercial@coletasegura.com', NULL, NULL, NULL, NULL, NULL, 'Álvares Machado', 'SP'),
(4, 'Drogaria Confiança Pirapozinho', '44.555.666/0001-77', NULL, 'Sr. Ricardo', NULL, 'farmacia', '1832691020', 'contato@confiancapira.com', NULL, NULL, NULL, NULL, NULL, 'Pirapozinho', 'SP'),
(5, 'Posto de Saúde Central (Regente)', '55.666.777/0001-88', NULL, 'Dr. Roberto', NULL, 'ubs', '1832791122', 'saude@regentefeijo.sp.gov.br', NULL, NULL, NULL, NULL, NULL, 'Regente Feijó', 'SP');

-- --------------------------------------------------------

--
-- Estrutura da tabela `residuo`
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
-- Extraindo dados da tabela `residuo`
--

INSERT INTO `residuo` (`id_residuo`, `nome`, `descricao`, `grupo`, `risco_especifico`, `estado_fisico`, `acondicionamento`) VALUES
(1, 'Agulhas de Insulina 4mm', 'Agulhas para aplicação de insulina subcutânea', 'E - Perfurocortante', 'Perfurocortante', 'Sólido', 'Caixa para Perfurocortante (Descarpack)'),
(2, 'Seringas Descartáveis 5ml', 'Utilizadas para administração de medicamentos', 'D - Comum', 'Nenhum', 'Sólido', 'Saco Preto'),
(3, 'Curativos com Sangue', 'Gazes e algodão utilizados em ferimentos', 'A - Infectante', 'Biológico', 'Sólido', 'Saco Branco Leitoso'),
(4, 'Lancetas para Glicemia', 'Utilizadas para perfurar a pele e medir glicose', 'E - Perfurocortante', 'Perfurocortante', 'Sólido', 'Caixa para Perfurocortante (Descarpack)'),
(5, 'Fitas Reagentes de Glicemia', 'Tiras com resíduo de sangue para medição de glicose', 'A - Infectante', 'Biológico', 'Sólido', 'Saco Branco Leitoso'),
(6, 'Frasco de Soro Fisiológico', 'Frasco plástico com sobras de soro', 'D - Comum', 'Nenhum', 'Líquido', 'Saco Preto'),
(7, 'Frasco de Insulina Vazio', 'Frasco de vidro com resíduo de medicamento', 'B - Químico', 'Químico', 'Líquido', 'Galão Rígido'),
(8, 'Luvas de Procedimento Usadas', 'Luvas de látex ou nitrílicas', 'A - Infectante', 'Biológico', 'Sólido', 'Saco Branco Leitoso'),
(9, 'Ampolas de Vitamina B12', 'Fragmentos de vidro de ampolas de medicamento', 'E - Perfurocortante', 'Perfurocortante', 'Sólido', 'Caixa para Perfurocortante (Descarpack)'),
(10, 'Medicamentos Vencidos (Comprimidos)', 'Cartelas de comprimidos com prazo de validade expirado', 'B - Químico', 'Químico', 'Sólido', 'Galão Rígido');

-- --------------------------------------------------------

--
-- Estrutura da tabela `usuario`
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
-- Extraindo dados da tabela `usuario`
--

INSERT INTO `usuario` (`id_usuario`, `nome`, `email`, `senha`, `tipo`, `cep`, `logradouro`, `numero`, `complemento`, `bairro`, `cidade`, `uf`) VALUES
(8, 'Manoela Pinheiro da Silva', 'manoela2903@outlook.com', '$2b$10$cy6YqZ7w3PdejvlBZHsk5exZ7hiqUBnc/s6h17lMep65xP9dx6FKm', 'admin', '19200009', 'Rua Angelo Salvatori', '125', 'Ao Lado do Hotel Almanara', 'Centro', 'Pirapozinho', 'SP'),
(10, 'Gustavo Henrique Bispo Costa', 'gustavobispocosta5521@gmail.com', '$2b$10$eyBqAjIehZIXtgi0OSEYO.J6w.iUV8CacfghHcc7MDZ2UvRVP67z2', 'admin', '19220222', 'Rua José Braz da Silva', '4', 'Casa com Sobrado', 'Parque dos Ingás II', 'Narandiba', 'SP'),
(12, 'Matheus Henrique da Conceição Bispo', 'matheusbispo@gmail.com', '$2b$10$hw7isRBQTTk1Bp3tdiUtROmrBoDrzsyhZxUBWjoihIUL0PyH7EGf2', 'admin', '19200009', 'Rua Angelo Salvatori', '125', '', 'Centro', 'Pirapozinho', 'SP');

--
-- Índices para tabelas despejadas
--

--
-- Índices para tabela `agenda_de_coleta`
--
ALTER TABLE `agenda_de_coleta`
  ADD PRIMARY KEY (`id_agenda`),
  ADD KEY `id_paciente` (`id_paciente`),
  ADD KEY `id_parceiro` (`id_parceiro`);

--
-- Índices para tabela `entrega_materiais`
--
ALTER TABLE `entrega_materiais`
  ADD PRIMARY KEY (`id_entrega`),
  ADD KEY `fk_entrega_paciente` (`id_paciente`),
  ADD KEY `fk_entrega_residuo` (`id_residuo`);

--
-- Índices para tabela `paciente`
--
ALTER TABLE `paciente`
  ADD PRIMARY KEY (`id_paciente`),
  ADD UNIQUE KEY `cpf` (`cpf`);

--
-- Índices para tabela `parceiro`
--
ALTER TABLE `parceiro`
  ADD PRIMARY KEY (`id_parceiro`),
  ADD UNIQUE KEY `cnpj` (`cnpj`);

--
-- Índices para tabela `residuo`
--
ALTER TABLE `residuo`
  ADD PRIMARY KEY (`id_residuo`);

--
-- Índices para tabela `usuario`
--
ALTER TABLE `usuario`
  ADD PRIMARY KEY (`id_usuario`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT de tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `agenda_de_coleta`
--
ALTER TABLE `agenda_de_coleta`
  MODIFY `id_agenda` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de tabela `entrega_materiais`
--
ALTER TABLE `entrega_materiais`
  MODIFY `id_entrega` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT de tabela `paciente`
--
ALTER TABLE `paciente`
  MODIFY `id_paciente` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- AUTO_INCREMENT de tabela `parceiro`
--
ALTER TABLE `parceiro`
  MODIFY `id_parceiro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de tabela `residuo`
--
ALTER TABLE `residuo`
  MODIFY `id_residuo` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT de tabela `usuario`
--
ALTER TABLE `usuario`
  MODIFY `id_usuario` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Restrições para despejos de tabelas
--

--
-- Limitadores para a tabela `agenda_de_coleta`
--
ALTER TABLE `agenda_de_coleta`
  ADD CONSTRAINT `agenda_de_coleta_ibfk_1` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `agenda_de_coleta_ibfk_2` FOREIGN KEY (`id_parceiro`) REFERENCES `parceiro` (`id_parceiro`) ON DELETE SET NULL ON UPDATE CASCADE;

--
-- Limitadores para a tabela `entrega_materiais`
--
ALTER TABLE `entrega_materiais`
  ADD CONSTRAINT `fk_entrega_paciente` FOREIGN KEY (`id_paciente`) REFERENCES `paciente` (`id_paciente`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_entrega_residuo` FOREIGN KEY (`id_residuo`) REFERENCES `residuo` (`id_residuo`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
