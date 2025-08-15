# MedResiduos - Sistema de Gestão de Descarte de Resíduos de Saúde

## 📄 Sobre o Projeto

O **MedResiduos** é uma plataforma web desenvolvida como solução para o desafio **Tech4Health**, do curso de Análise e Desenvolvimento de Sistemas da Fatec Presidente Prudente. O projeto visa criar uma ponte entre pacientes em tratamento domiciliar, unidades de saúde e empresas de coleta, garantindo o controle, a rastreabilidade e a orientação para o descarte correto de resíduos de saúde.

A solução atende às demandas de hospitais e unidades de saúde, promovendo boas práticas ambientais, sociais e de governança (ESG), conforme o regulamento do Hackathon.

## ✨ Principais Funcionalidades

A plataforma oferece um conjunto robusto de funcionalidades para a gestão completa do ciclo de vida dos resíduos de saúde:

* 📊 **Dashboard Interativo:** Visualização rápida de dados chave, como coletas agendadas, entregas de materiais vencidas e gráficos de desempenho.
* 👤 **Gestão de Pacientes:** CRUD completo para registrar e acompanhar os pacientes que recebem materiais.
* 🧪 **Gestão de Resíduos:** Cadastro detalhado dos tipos de resíduos (agulhas, seringas, medicamentos vencidos) conforme a classificação da ANVISA.
* 🤝 **Gestão de Parceiros:** Cadastro de empresas de coleta, farmácias e UBSs parceiras.
* 📦 **Controle de Entregas:** Rastreamento dos materiais entregues aos pacientes, com datas de devolução previstas.
* 🗓️ **Agenda de Coletas:** Agendamento centralizado das coletas de resíduos, associando pacientes e parceiros.
* 📱 **Notificações via WhatsApp:** Integração com a API do WhatsApp Business para enviar lembretes e alertas automáticos aos pacientes sobre coletas e devoluções.
* 🔒 **Autenticação e Segurança:** Sistema de login com JWT (JSON Web Tokens) para garantir a segurança dos dados.

## 🌱 Alinhamento ESG

O projeto foi construído sobre os três pilares ESG:

* **🌍 Ambiental (E):** Garante que resíduos perigosos não contaminem o lixo comum, promovendo o descarte correto e a conformidade com as normas ambientais.
* **❤️ Social (S):** Educa os pacientes sobre o descarte seguro, reduzindo riscos à saúde coletiva e acidentes na comunidade.
* **🏛️ Governança (G):** Oferece às unidades de saúde uma ferramenta de gestão com rastreabilidade, transparência e controle de processos.

## 🚀 Stack Tecnológica

* **Frontend:** React (com Vite), utilizando a Context API para gestão de estado global.
* **Backend:** Node.js com Express.
* **Base de Dados:** MySQL.
* **Notificações:** WhatsApp Business Cloud API.
* **Autenticação:** JWT (JSON Web Tokens).

## 📐 Padrões de Projeto Aplicados

Conforme solicitado no escopo do projeto, foram utilizados os seguintes padrões de projeto:

* **Singleton:** Aplicado no `NotificationService.js` para criar uma instância única e centralizada que gere todas as notificações do sistema em tempo real.
* **Factory Method:** Utilizado no `EntityFactory.js` para permitir a criação flexível de diferentes objetos do sistema (como Usuários, Pacientes, Resíduos) sem acoplar o código principal a classes concretas.

## ⚙️ Como Executar o Projeto Localmente

### Pré-requisitos
* Node.js
* NPM ou Yarn
* Um servidor de base de dados MySQL (como o XAMPP)

### Backend
1.  Navegue até à pasta `server`: `cd server`
2.  Instale as dependências: `npm install`
3.  Crie um ficheiro `.env` na raiz da pasta `server` e adicione as suas credenciais da API do WhatsApp:
    ```
    WHATSAPP_TOKEN=SEU_TOKEN_AQUI
    WHATSAPP_PHONE_ID=SEU_ID_DE_TELEFONE_AQUI
    ```
4.  Inicie o servidor: `npm run dev`
5.  A API estará a funcionar em `http://localhost:3001`.

### Frontend
1.  Num novo terminal, navegue até à pasta `client`: `cd client`
2.  Instale as dependências: `npm install`
3.  Inicie a aplicação: `npm run dev`
4.  A aplicação estará acessível em `http://localhost:5173`.

## 👥 Membros da Equipa

* Gustavo Henrique Bispo Costa
* Ian Gabriel Abreu Barbosa
* Manoela Pinheiro da Silva
* Matheus Henrique da Conceição Bispo
