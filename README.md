# Plataforma Educativa

Sistema de gerenciamento de recursos educacionais com assistência de Inteligência Artificial.

## Tecnologias Utilizadas

- **Frontend**: React, Tailwind CSS, Lucide React, Framer Motion
- **Backend**: Node.js, Express, Better SQLite3
- **IA**: Google Gemini API
- **Linguagem**: TypeScript

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm (gerenciador de pacotes do Node)

## Como Rodar Localmente

1. **Clone o repositório**

   ```bash
   git clone https://github.com/leonardobrahim/desafio-tecnico-fullstack.git
   ```

2. **Instale as dependências**:
   Abra o terminal na pasta raiz do projeto e execute:

   ```bash
   npm install
   ```

3. **Configure as Variáveis de Ambiente**:
   Crie um arquivo `.env` na raiz do projeto (você pode copiar o `.env.example`):

   ```bash
   cp .env.example .env
   ```

   Edite o arquivo `.env` e adicione sua chave da API do Google Gemini:

   ```env
   GEMINI_API_KEY="sua_chave_api_aqui"
   ```

   > Você pode obter uma chave gratuita em: https://aistudio.google.com/app/apikey

4. **Inicie a Aplicação**:
   Execute o comando:

   ```bash
   npm run dev
   ```

5. **Acesse no Navegador**:
   A aplicação estará rodando em: `http://localhost:3000`

## Estrutura do Projeto

- `/src`: Código fonte do Frontend (React)
- `/server.ts`: Código fonte do Backend (Express) e integração com IA
- `/resources.db`: Banco de dados SQLite (criado automaticamente ao iniciar)

## Funcionalidades

- **Listagem de Recursos**: Visualize todos os materiais cadastrados.
- **Cadastro Inteligente**: Use o botão "Gerar com IA" para preencher automaticamente a descrição e tags baseadas no título.
- **Gerenciamento**: Edite ou exclua recursos facilmente.
