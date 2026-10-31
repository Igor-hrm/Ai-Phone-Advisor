# Ai-Phone-Advisor

Chatbot de recomendação de celulares com IA. A pessoa escreve o que procura
(por exemplo, "quero um com muita bateria") e a IA sugere celulares do
catálogo, mostrados como cards com link para a página de detalhes.

> **Sobre este projeto:** ele faz parte de outro projeto maior, o catálogo
> **Nice Gadgets** (loja de celulares, tablets e acessórios). Aqui ele foi
> reduzido para apenas a listagem de celulares e a página de detalhes, para
> servir de base para testar a integração com uma API de IA.
>
> Projeto original: _[(https://github.com/Igor-hrm/react_phone-catalog/tree/develop)]_

## Como funciona

```
React (chat)  ->  Node/Express  ->  Gemini
     ^                 |
     +-- reply + products (celulares completos)
```

1. A pessoa digita a mensagem no chat (front-end React).
2. O front manda a mensagem para o servidor Node (`POST /api/recommend`).
3. O servidor envia a mensagem ao Gemini junto com uma versão compacta do
   catálogo e pede a resposta em JSON (`reply` + lista de `ids`).
4. O servidor descarta ids que a IA inventou, troca os ids pelos celulares
   completos e devolve `{ reply, products }`.
5. O front mostra o texto e renderiza um `CatalogCard` para cada celular.

A chave da API fica **só no servidor**. Nunca no React, porque qualquer coisa
que vai para o front-end pode ser vista no navegador.

## Estrutura dos arquivos do chatbot

### Back-end (`backend/`)

| Arquivo        | O que faz                                                                                                                    |
| -------------- | ---------------------------------------------------------------------------------------------------------------------------- |
| `server.js`    | Servidor Express. Lê o catálogo, monta a versão compacta, chama o Gemini, valida os ids e responde em `POST /api/recommend`. |
| `phones.json`  | Catálogo de celulares que a IA usa para recomendar. É uma cópia do `public/api/phones.json` do front.                        |
| `package.json` | Dependências (`express`, `cors`, `@google/genai`) e o script `dev`.                                                          |
| `.env`         | Guarda a chave (`GEMINI_API_KEY`). **Não vai para o Git.**                                                                   |
| `.gitignore`   | Impede que `.env` e `node_modules` sejam versionados.                                                                        |

### Front-end (`src/`)

| Arquivo                                  | O que faz                                                                                                         |
| ---------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `components/ChatBot/ChatBot.tsx`         | O chat: botão flutuante, painel, lista de mensagens, formulário, estado de carregamento e salvamento da conversa. |
| `components/ChatBot/ChatBot.module.scss` | Estilos do chat. No celular ocupa 95% da tela, no computador vira um painel no canto.                             |
| `components/ChatBot/index.ts`            | Exporta o componente.                                                                                             |
| `api/chat.ts`                            | `getRecommendations`: faz o `fetch` para o servidor Node e devolve `{ reply, products }`.                         |
| `types/ChatMessage.ts`                   | Tipo de uma mensagem da conversa (autor, texto e celulares recomendados).                                         |
| `types/ChatResponse.ts`                  | Tipo da resposta do servidor.                                                                                     |
| `App.tsx`                                | Renderiza o `<ChatBot />` fora das rotas, para o chat não ser destruído ao trocar de página.                      |

### Reaproveitados do projeto original

| Arquivo                                                                                                | Papel no chat                                                                                                       |
| ------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------- |
| `components/CatalogCard/`                                                                              | Mostra cada celular recomendado, com link para `/product/:id`.                                                      |
| `types/PhoneDetails.ts`                                                                                | Tipo único do celular, usado no catálogo, nos cards e na resposta da IA.                                            |
| `components/UnavailablePopup/`, `contexts/UnavailablePopupContext.tsx`, `hooks/useUnavailablePopup.ts` | Popup "função indisponível" dos botões de carrinho e favoritos dos cards (essas funções não existem neste projeto). |

## Comportamento do chat

- O botão redondo no canto abre o chat. Fecha com o **✕** ou com **ESC**.
- Ao clicar em um celular recomendado, o chat fecha e abre a página de
  detalhes. A conversa continua guardada.
- A conversa fica no `sessionStorage`: sobrevive a recarregar a página e some
  ao fechar a aba. O botão **Clear** apaga na hora.

## Como rodar

São dois programas, então use dois terminais.

**1. Back-end** (precisa de Node 20.6 ou mais novo)

```bash
cd backend
npm install
```

Crie o arquivo `backend/.env`:

```
GEMINI_API_KEY=sua_chave_aqui
```

A chave é gerada no [Google AI Studio](https://aistudio.google.com/apikey).
Depois:

```bash
npm run dev
```

O servidor sobe em `http://localhost:3001`.

**2. Front-end** (na raiz do projeto)

```bash
npm install
npm start
```

## Limitações

- **Bateria:** o catálogo não tem esse campo. A IA estima pelo que conhece de
  cada modelo e avisa que é uma estimativa.
- **Plano gratuito:** a API tem limite de requisições por minuto, e o conteúdo
  enviado pode ser usado pelo Google para melhorar seus produtos. Não envie
  dados pessoais.
- **Modelo:** o nome do modelo em `server.js` pode ser descontinuado. Se a API
  responder `404`, confira qual modelo gratuito está disponível no AI Studio.
- **Endereço do servidor:** `http://localhost:3001` está fixo em
  `src/api/chat.ts`. Para publicar, precisa virar uma variável de ambiente, e
  o servidor precisa de hospedagem própria (o GitHub Pages só serve o front).
- **Catálogo duplicado:** o `phones.json` existe em `public/api/` e em
  `backend/`. Se alterar um, altere o outro.

## Tecnologias

React, TypeScript, Vite, SCSS Modules, React Router, Node.js, Express e a API
do Gemini (`@google/genai`).
