<div align="center">

  # APRESENTANDO.ME <br> _Motor Analítico ATS_

  **A ferramenta definitiva para otimizar e blindar seu currículo contra sistemas de recrutamento automatizados.**
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![Gemini API](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](#)
  [![OpenRouter](https://img.shields.io/badge/OpenRouter-111111?style=for-the-badge&logoColor=white)](#)
  [![DeepSeek](https://img.shields.io/badge/DeepSeek_V4-1A1A1A?style=for-the-badge&logoColor=white)](#)
  [![Z.ai](https://img.shields.io/badge/Z.ai_GLM_5.1-00B386?style=for-the-badge&logoColor=white)](#)
</div>

---

## 🚀 O que é o APRESENTANDO.ME?

Milhares de currículos são sumariamente descartados por sistemas de rastreamento de candidatos (ATS) não porque os profissionais não são qualificados, mas porque o layout do currículo (duas colunas, barras laterais, gráficos) impede a leitura por robôs.

O **APRESENTANDO.ME** é uma plataforma inovadora baseada no conceito de _Editorial Brutalism_ projetada para:
1. **Diagnosticar o seu PDF** e calcular um ATS Score (focado puramente em leitura por máquina).
2. **Comparar seu perfil com uma vaga alvo** e sugerir palavras-chave (Match Score).
3. **Reescrever seu currículo por completo** através de IA Generativa de maneira cirúrgica (em três níveis de agressividade).
4. **Gerar Cover Letters incríveis** vinculando sua bagagem exata com a descrição da vaga.
5. **Entregar o resultado final perfeitamente estruturado** em PDF ou LaTeX.

O app roda sem backend próprio: arquivos, histórico e chaves ficam no navegador. Durante análises e gerações, o currículo e a vaga são enviados ao provedor de IA escolhido pelo usuário.

---

## 🔥 Principais Funcionalidades

- 📄 **Leitura inteligente de PDF (`pdfjs`):** Extrai texto e sinais estruturais do PDF, como possível layout em colunas, sidebar e imagens.
- 🎯 **Três Tipos de Diagnósticos Isolados:**
  - **ATS Score:** Analisa o layout (duas colunas, ícones, imagens) e deduz penalizações.
  - **Match Score:** Avalia seu encaixe para a vaga desejada.
  - **Keywords:** Monitora o que os recrutadores pediram VS o que você escreveu.
- ⚡ **Override System (Motor de Otimização IA):**
  - Três níveis de agressividade algorítmica: `Conservador`, `Equilibrado` ou `Agressivo`.
  - Refaz o seu texto, reordena tópicos e converte parágrafos genéricos em resultados mensuráveis.
- 💌 **Redação de Cover Letters:** Cria cartas de apresentação altamente magnéticas e baseadas no seu histórico.
- 📝 **Editor Inteligente (JSON Parsing):** Possui edição manual pós-IA. Você sempre tem a palavra final.
- 🛡️ **Privacidade BYOK:** Não há armazenamento em servidor próprio. API keys e histórico ficam no Local Storage, com opção de limpar chaves e histórico pela interface.
- 💅 **Código LaTeX exportável:** Fornecemos o código fonte de cada versão final do currículo, ou um PDF compilado instantaneamente.

---

## ⚙️ Tecnologias Utilizadas

Este projeto foi construído usando tecnologias modernas focadas em agilidade e minimalismo brutalista:

- **React (`^19.x`)** via **Vite** para a interface interativa.
- **TailwindCSS** para uma estilização performática e semântica.
- **@google/generative-ai** como motor Gemini padrão (usando `gemini-3.1-flash-lite`).
- **OpenRouter / DeepSeek / Z.ai** por API compatível com OpenAI Chat Completions.
- **pdfjs-dist** para manipulação binária e visual do documento via Client-side.
- **jsPDF** para emissão de PDFs dinâmicos baseados no JSON otimizado.

---

## 🛠️ Como Instalar e Rodar Localmente

1. **Clone do repositório**
   ```bash
   git clone https://github.com/seu-usuario/apresentando-me.git
   cd apresentando-me
   ```

2. **Instalação das dependências**  
   Este projeto exige `Node.js` (recomenda-se a versão `20` ou superior).
   ```bash
   npm install
   ```
   *(ou `yarn install`, ou `pnpm install`)*

3. **Iniciando o Servidor de Desenvolvimento**
   ```bash
   npm run dev
   ```

4. Acesse em seu navegador a porta fornecida (normalmente: `http://localhost:5173`).

---

## 🔑 Como Utilizar o Sistema

O APRESENTANDO.ME opera no formato BYOK (*Bring Your Own Key*). Acesse **Configurações** no app, escolha o provedor/modelo e cole a API key correspondente.

### Provedores suportados

- **Google Gemini (`gemini-3.1-flash-lite`)**
  Obtenha chave em [Google AI Studio](https://aistudio.google.com/apikey). Possui cota gratuita e uso pago conforme sua conta.

- **OpenRouter (`openrouter/free`)**
  Obtenha chave em [OpenRouter Keys](https://openrouter.ai/keys). A opção padrão usa o Free Router, que escolhe modelos gratuitos compatíveis e pode variar em velocidade/disponibilidade. Também há modelos pagos via OpenRouter, como DeepSeek V4 Pro e Z.ai GLM 5.1.

- **DeepSeek (`deepseek-v4-pro`)**
  Obtenha chave em [DeepSeek Platform](https://platform.deepseek.com/api_keys). Modelo pago por token, recomendado quando você quer maior estabilidade que o roteador gratuito.

- **Z.ai (`glm-5.1`)**
  Obtenha chave em [Z.ai Model API](https://z.ai/model-api). Use a API geral da Z.ai; o endpoint de Coding Plan é voltado para ferramentas de coding específicas.

### Diagnose e Override
- Faça o upload do seu currículo antigo em `.PDF`.
- Colete toda a descrição da vaga na caixa correspondente.
- Pressione o botão para submeter a análise.
- Leia o painel com as críticas e scores, em seguida, pule para a seção de `Override (Otimização Completa)` para engajar as rotinas de AI e reescrever seu currículo de acordo com o nível que desejar.

> **Importante:** Sempre faça download das compilações finais ou guarde o arquivo LaTeX gerado. Caso você limpe o cache do navegador, seu Histórico de Análises e chaves locais serão deletados.

---

## ✨ Estilo: *Editorial Brutalism*

Este repositório orgulha-se do seu guia estilístico. A UI é carregada de bordas afiadas, letras garrafais (`Space Grotesk` / `JetBrains Mono`), sombras block e cores de alta saturação que desafiam interfaces brandas corporativas padrão. Se for modificar o código, lembre-se de manter o tom confiante, brutalista e hiper-objetivo.

---

## ☕ Apoie o Projeto

Curtiu o APRESENTANDO.ME? Ele deu um trabalho do caramba para ficar pronto.
Se quiser mandar um PIX para financiar meu café (e minha terapia), você ainda ganha o passaporte VIP pro céu dos Vibecoders! 
<br>

[![Apoie no LivePix](https://img.shields.io/badge/Apoiar_com_LivePix-%23D4FF00?style=for-the-badge&logo=pix&logoColor=black)](https://livepix.gg/hawth)

---
*Vibecodado com amor.*

<br>

&copy; 2026 apresentando.me. Distribuído sob a licença [MIT](./LICENSE).
