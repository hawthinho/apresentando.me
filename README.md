<div align="center">

  # APRESENTANDO.ME <br> _Motor Analítico ATS_

  **A ferramenta definitiva para otimizar e blindar seu currículo contra sistemas de recrutamento automatizados.**
  
  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](#)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](#)
  [![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](#)
  [![Gemini API](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](#)
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

Tudo isso **[100% de forma local no seu navegador]**, focando em garantir o máximo da sua privacidade.

---

## 🔥 Principais Funcionalidades

- 📄 **Leitura inteligente de PDF (`pdfjs`):** Extrai o texto cru do seu currículo.
- 🎯 **Três Tipos de Diagnósticos Isolados:**
  - **ATS Score:** Analisa o layout (duas colunas, ícones, imagens) e deduz penalizações.
  - **Match Score:** Avalia seu encaixe para a vaga desejada.
  - **Keywords:** Monitora o que os recrutadores pediram VS o que você escreveu.
- ⚡ **Override System (Motor de Otimização IA):**
  - Três níveis de agressividade algorítmica: `Conservador`, `Equilibrado` ou `Agressivo`.
  - Refaz o seu texto, reordena tópicos e converte parágrafos genéricos em resultados mensuráveis.
- 💌 **Redação de Cover Letters:** Cria cartas de apresentação altamente magnéticas e baseadas no seu histórico.
- 📝 **Editor Inteligente (JSON Parsing):** Possui edição manual pós-IA. Você sempre tem a palavra final.
- 🛡️ **Privacidade "Serverless":** Não guardamos as chaves de API, nem seu currículo. Todo o histórico (*cache*) e análises são mantidos exclusivamente na sua máquina, e os cálculos ocorrem direto entre seu computador e o Google.
- 💅 **Código LaTeX exportável:** Fornecemos o código fonte de cada versão final do currículo, ou um PDF compilado instantaneamente.

---

## ⚙️ Tecnologias Utilizadas

Este projeto foi construído usando tecnologias modernas focadas em agilidade e minimalismo brutalista:

- **React (`^19.x`)** via **Vite** para a interface interativa.
- **TailwindCSS** para uma estilização performática e semântica.
- **@google/generative-ai** como motor de LLM (usando `Gemini 3 Flash Preview`).
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

O APRESENTANDO.ME é moldado para operar num formato BYOK (*Bring Your Own Key*), garantindo controle total.

### 1. Obtenha sua Gemini API Key
- Acesse o [Google AI Studio](https://aistudio.google.com/).
- Crie uma nova API Key (o uso na camada gratuita possui franquia suficiente de Requisições por Minuto para o seu dia a dia).

### 2. Configure-a no Menu do App
- Clique no menu **Settings / Configuração de Módulos (Engrenagem)** no topo superior esquerdo da interface principal.
- Insira sua chave e escolha o modelo `gemini-3-flash-preview` (ou o fallback gratuito atual do pacote básico).

### 3. Diagnose e Override
- Faça o upload do seu currículo antigo em `.PDF`.
- Colete toda a descrição da vaga na caixa correspondente.
- Pressione o botão para submeter a análise.
- Leia o painel com as críticas e scores, em seguida, pule para a seção de `Override (Otimização Completa)` para engajar as rotinas de AI e reescrever seu currículo de acordo com o nível que desejar.

> **Importante:** Sempre faça download das compilações finais ou guarde o arquivo LaTeX gerado! Caso você limpe o cache do seu navegador, seu Histórico de Análises será deletado!

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
