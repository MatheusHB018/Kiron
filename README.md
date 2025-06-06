# MedResiduos - Sistema de Gestão de Descarte de Resíduos de Saúde
![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

Repositório do protótipo do projeto **MedResiduos**, uma plataforma web para o controle, rastreabilidade e orientação do descarte de resíduos de saúde por pacientes em tratamento domiciliar.

## 📄 Índice

- [📖Sobre o Projeto](#-sobre-o-projeto)
- [✨ Funcionalidades](#-funcionalidades)
- [🌱 Alinhamento ESG](#-alinhamento-esg)
- [🛠️ Tecnologias Utilizadas](#️-tecnologias-utilizadas)
- [🚀 Como Executar](#-como-executar)
- [🏛️ Padrões de Projeto](#️-padrões-de-projeto)
- [👥 Equipe](#-equipe)

---

## 📖 Sobre o Projeto

O projeto **MedResiduos** propõe uma solução para um problema crítico de saúde pública e meio ambiente: o descarte incorreto de resíduos de saúde gerados em tratamentos domiciliares. Materiais como agulhas, seringas, fitas de glicemia e frascos de medicamentos, quando descartados de forma inadequada, apresentam sérios riscos de contaminação e impactos ambientais.

Nossa plataforma web visa conectar hospitais, unidades de saúde, pacientes e empresas de coleta para garantir a rastreabilidade e o descarte correto desses materiais, desde a entrega ao paciente até o recolhimento e tratamento final.

### Problemas Abordados
- Descarte incorreto de resíduos de saúde por pacientes (agulhas, seringas, etc.).
- Falta de rastreabilidade dos materiais após saírem das unidades de saúde.
- Riscos à saúde coletiva e impactos ambientais.
- Baixo controle sobre o fornecimento e uso dos materiais distribuídos.

---

## ✨ Funcionalidades

O sistema foi projetado com as seguintes funcionalidades-chave:

-   **Gestão de Pacientes:** Cadastro e monitoramento de pacientes que recebem insumos médicos.
-   **Controle de Materiais:** Registro da retirada de materiais e geração de histórico por paciente.
-   **Notificações Automáticas:** Envio de alertas por WhatsApp, SMS ou e-mail para pacientes com descarte pendente, ausência de retirada ou descarte inadequado.
-   **Rede de Parceiros:** Cadastro e gerenciamento de pontos de descarte parceiros, como farmácias, UBS e empresas especializadas.
-   **Agendamento de Coleta:** Permite agendar a próxima coleta de resíduos com as empresas parceiras.
-   **Módulo Educativo:** Oferece orientações sobre o descarte correto e conteúdos de conscientização ambiental.
-   **Relatórios ESG:** Geração de relatórios de sustentabilidade para as instituições de saúde.
-   **Canal de Comunicação:** Permite o contato direto entre a unidade de saúde e os pacientes para acompanhamento.

---

## 🌱 Alinhamento ESG

O projeto está totalmente alinhado com as práticas de ESG (Environmental, Social, and Governance):

-   **Ambiental:** Reduz o impacto ambiental do descarte incorreto e promove a conformidade com as normas da ANVISA.
-   **Social:** Aumenta a segurança da comunidade, conscientiza os pacientes e reduz os riscos de contaminação.
-   **Governança:** Oferece transparência e controle total sobre o ciclo de vida dos resíduos de saúde, melhorando a gestão para as instituições.

---

## 🛠️ Tecnologias Utilizadas

A seção a seguir descreve as tecnologias usadas no desenvolvimento do projeto.

-   **Frontend:** ``
-   **Backend:** ``
-   **Banco de Dados:** ``

---

## 🚀 Como Executar

Siga os passos abaixo para executar o projeto em seu ambiente local.

1.  **Clone o repositório:**
    ```sh
    git clone [https://github.com/Ma2903/MedResiduos.git](https://github.com/Ma2903/MedResiduos.git)
    ```
2.  **Navegue até o diretório do projeto:**
    ```sh
    cd MedResiduos
    ```
3.  **Instale as dependências:**
    ```sh
    # Adicione aqui o comando para instalar dependências (ex: npm install)
    ```
4.  **Inicie o servidor:**
    ```sh
    # Adicione aqui o comando para iniciar o projeto (ex: npm start)
    ```

---

## 🏛️ Padrões de Projeto

Para garantir um código flexível, escalável e de fácil manutenção, utilizamos os seguintes padrões de projeto:

-   **Singleton:** Aplicado para garantir uma instância única no gerenciamento centralizado de notificações e agendamentos, evitando conflitos e mantendo a consistência.
-   **Factory Method:** Utilizado para permitir a criação flexível de diferentes tipos de objetos (Resíduo, Paciente, Coleta) sem acoplar o código cliente às classes concretas.

---

## 👥 Equipe

Este projeto foi desenvolvido por:

-   Gustavo Henrique Bispo Costa
-   Ian Gabriel de Abreu Barbosa
-   Manoela Pinheiro da Silva
