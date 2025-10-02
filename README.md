# ♻️ MedResiduos - Gestão Inteligente de Resíduos de Saúde

![Status do Projeto](https://img.shields.io/badge/status-concluído-brightgreen.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)

## 📄 Sobre o Projeto

O **MedResiduos** é uma plataforma web desenvolvida como solução para o desafio **Tech4Health**, da Fatec Presidente Prudente. O projeto cria uma ponte entre pacientes em tratamento domiciliar, unidades de saúde e empresas de coleta, garantindo o **controle, a rastreabilidade e o descarte correto** de resíduos de saúde, em linha com as melhores práticas **ESG** (Ambiental, Social e Governança).

## ✨ Principais Funcionalidades

- **📊 Dashboard Interativo:** Visualização rápida de coletas, entregas vencidas e gráficos de desempenho.
- **👥 Gestão de Pacientes:** CRUD completo para registro e acompanhamento de pacientes.
- **🗑️ Gestão de Resíduos:** Cadastro detalhado de resíduos conforme a classificação da ANVISA.
- **🤝 Gestão de Parceiros:** Cadastro de empresas de coleta, farmácias e UBSs.
- **📦 Controle de Entregas:** Rastreamento de materiais entregues a pacientes, com controle de devolução.
- **🗓️ Agenda de Coletas:** Agendamento centralizado de coletas, associando pacientes e parceiros.
- **📱 Notificações via WhatsApp:** Alertas automáticos para pacientes sobre coletas e devoluções.
- **🔐 Autenticação Segura:** Sistema de login com JWT (JSON Web Tokens).

## 🌱 Alinhamento ESG

- **🌳 Ambiental (E):** Garante o descarte correto de resíduos perigosos, evitando a contaminação do lixo comum.
- **🧑‍🤝‍🧑 Social (S):** Educa pacientes sobre o descarte seguro, reduzindo riscos à saúde coletiva.
- **🏛️ Governança (G):** Oferece rastreabilidade, transparência e controle de processos para as unidades de saúde.

## 🚀 Tecnologias Utilizadas

| Categoria   | Tecnologia                                                                                                                                                                                                                                  |
|-------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Frontend** | ![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB) ![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)                                             |
| **Backend** | ![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white) ![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)                      |
| **Banco de Dados** | ![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white)                                                                                                                                       |
| **Notificações** | ![WhatsApp](https://img.shields.io/badge/WhatsApp-25D366?style=for-the-badge&logo=whatsapp&logoColor=white)                                                                                                                               |
| **Autenticação** | ![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white)                                                                                                                                         |

## 📐 Padrões de Projeto Aplicados
- **Singleton:** Implementado no `NotificationService.js` para uma instância única e centralizada de gerenciamento de notificações.
- **Factory Method:** Utilizado no `EntityFactory.js` para desacoplar a criação de objetos (Usuários, Pacientes, etc.), permitindo maior flexibilidade.

## ⚙️ Como Executar o Projeto

Siga os passos abaixo para rodar o projeto em sua máquina local.

#### **Pré-requisitos**
-   [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
-   [NPM](https://www.npmjs.com/) ou [Yarn](https://yarnpkg.com/)
-   Um servidor MySQL (Ex: XAMPP, Docker).

---

#### **1. Configuração do Banco de Dados**
-   Crie um banco de dados chamado `medresiduos`.
-   Importe o arquivo `client/banco/medresiduos.sql` para criar as tabelas e popular os dados iniciais.
-   Ajuste as credenciais de acesso no arquivo `server/db.js` se necessário.

---

#### **2. Backend (`/server`)**
```bash
# Navegue até a pasta do servidor
cd server

# Instale as dependências
npm install

# Crie um arquivo .env na raiz de /server e adicione suas credenciais
WHATSAPP_TOKEN=SEU_TOKEN_DA_API_DO_WHATSAPP
WHATSAPP_PHONE_ID=SEU_ID_DE_TELEFONE_DE_ORIGEM

# Inicie o servidor em modo de desenvolvimento
npm run dev

# O servidor estará rodando em http://localhost:3001
```

---

#### **3. Frontend (`/client`)**
```bash
# Em um novo terminal, navegue até a pasta do cliente
cd client

# Instale as dependências
npm install

# Inicie a aplicação
npm run dev

# A aplicação estará disponível em http://localhost:5173
```

## 👥 Equipe do Projeto

-   **Gustavo Henrique Bispo Costa**
-   **Ian Gabriel Abreu Barbosa**
-   **Manoela Pinheiro da Silva**
-   **Matheus Henrique da Conceição Bispo**

## 📜 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.
