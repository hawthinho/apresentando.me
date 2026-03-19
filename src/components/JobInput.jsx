import React, { useState, useMemo } from 'react';

const JOB_PRESETS = [
    {
        label: "[01] Desenvolvedor(a) Fullstack Sênior",
        text: `🚀 SOBRE A VAGA
Estamos buscando um(a) Desenvolvedor(a) Fullstack Sênior para integrar nossa principal Squad de pagamentos. Você será diretamente responsável por arquitetar soluções resilientes, de alta disponibilidade e contribuir com decisões arquiteturais de impacto para milhões de usuários.

💼 RESPONSABILIDADES
- Liderar o desenho e implementação de microsserviços escaláveis.
- Manter e evoluir interfaces front-end complexas utilizando React.js e Next.js.
- Otimizar queries e modelagem de banco de dados relacionais e NoSQL (PostgreSQL, MongoDB).
- Atuar como mentor técnico para desenvolvedores Plenos e Juniores.

🎯 REQUISITOS OBRIGATÓRIOS
- 5+ anos de experiência comprovada com Node.js e React.
- Vivência sólida em arquiteturas orientadas a eventos (Kafka/RabbitMQ).
- Forte background em testes automatizados e Integração Contínua (CI/CD).
- Inglês avançado para conversação com times globais.

🌟 DIFERENCIAIS
- Conhecimento prático em metodologias de DevOps (Docker, Kubernetes).
- Certificações AWS ou GCP.`
    },
    {
        label: "[02] Coordenador(a) Financeiro(a) Corporativo",
        text: `🚀 SOBRE A VAGA
Buscamos um(a) Coordenador(a) Financeiro(a) analítico(a) e movido(a) a resultados para gerenciar o planejamento financeiro, orçamento e rotinas de tesouraria de uma grande multinacional de varejo.

💼 RESPONSABILIDADES
- Coordenar a equipe de contas a pagar, receber e tesouraria diária (Cash Management).
- Estruturar e analisar o DRE mensal, garantindo a saúde do fluxo de caixa e capital de giro.
- Elaborar reports e dashboards financeiros críticos em Power BI para a diretoria executiva.
- Liderar o processo de auditoria externa e garantir a conformidade fiscal (Compliance).

🎯 REQUISITOS OBRIGATÓRIOS
- Formação superior completa em Administração, Economia ou Ciências Contábeis.
- Excel nível Especialista (VBA, Power Query, modelagem financeira de alto grau).
- Experiência mínima de 4 anos em posição de liderança no setor financeiro corporativo.
- Sólido conhecimento de operação em ERPs de grande porte (SAP HANO ou TOTVS).

🌟 DIFERENCIAIS
- Pós-graduação, MBA ou especialização em Controladoria Corporativa.
- CRC Ativo.`
    },
    {
        label: "[03] Gerente de Recursos Humanos (HR Business Partner)",
        text: `🚀 SOBRE A VAGA
Vaga para Gerente de Recursos Humanos (BP) com atuação 100% estratégica e próxima às lideranças (C-Level). Foco total em retenção de talentos (Turnover) e gestão robusta da cultura de um ambiente em hiper-crescimento.

💼 RESPONSABILIDADES
- Estruturar planos de carreira consolidados, trilhas de desenvolvimento (PDI) e mapas de sucessão empresarial.
- Conduzir e orquestrar avaliações de desempenho (OKRs, Matriz 9-Box) integradas com feedbacks 360º.
- Desenhar políticas de Remuneração e Benefícios baseadas em benchmarks de mercado (Pesquisas Salariais).
- Liderar o direcionamento de Programas de Diversidade, Equidade e Inclusão (DE&I).

🎯 REQUISITOS OBRIGATÓRIOS
- Formação superior em Psicologia, Administração ou Gestão de RH.
- Sólida vivência demonstrável de no mínimo 6 anos em posições estratégicas de Recursos Humanos.
- Domínio em metodologias ágeis de avaliação e People Analytics em softwares modernos.
- Capacidade argumentativa e visão de dono do negócio.

🌟 DIFERENCIAIS
- Vivência prévia no segmento de tecnologia (Startups/Fintechs) escalando de Series A para Series C.`
    },
    {
        label: "[04] Enfermeiro(a) RT - Auditoria Clínica Hospitalar",
        text: `🚀 SOBRE A VAGA
Rede hospitalar referência de nível ouro busca Enfermeiro(a) Especialista em Auditoria Clínica para atuar estritamente na garantia da qualidade da assistência prestada (Quality Assurance) e conformidade de faturamentos operacionais.

💼 RESPONSABILIDADES
- Realizar rotinas de auditoria concorrente à beira do leito e retrospectiva analítica de prontuários eletrônicos.
- Analisar a pertinência clínica de uso rigoroso de OPME (Órteses, Próteses e Materiais Especiais) frente às normativas ANS Múltiplas.
- Elaborar e assinar pareceres técnicos baseados em literatura médica para contestação robusta de glosas junto às Operadoras.
- Criar POPs e capacitar equipes gerenciais de enfermagem para minimizar evasão local.

🎯 REQUISITOS OBRIGATÓRIOS
- Graduação em Enfermagem com registro ativo, isento de infrações e totalmente regularizado no COREN.
- Pós-graduação lato-sensu completa em Auditoria de Sistemas de Saúde ou Gestão de OPME.
- Experiência prévia exigida de 3 anos liderando rotinas de auditoria complexa em contas médicas.
- Domínio técnico da Tabela SUS, CBHPM e Rol de Procedimentos Reguladores da ANS.

🌟 DIFERENCIAIS
- Vivência em Terapia Intensiva (UTI) de Alta Complexidade.
- Treinamento ONA 3 consolidado.`
    },
    {
        label: "[05] UX/UI Product Designer",
        text: `🚀 SOBRE A VAGA
Buscamos um Product Designer end-to-end com paixão em traduzir dores de negócios latentes em interfaces polidas, mágicas e super usáveis para o nosso maior pilar SaaS B2B.

💼 RESPONSABILIDADES
- Conduzir ciclos completos de pesquisas de UX (User Research), testes a/b em massa e entrevistas com grande amostragem de clientes corporativos.
- Desenhar arquitetura de informação coerente, criar fluxos lógicos e construir jornadas sem atritos.
- Dar manutenção iterativa ao nosso forte Design System local (Design Tokens & Hand-offs).
- Produzir protótipos em alta fidelidade com extrema qualidade visual usando Figma.

🎯 REQUISITOS OBRIGATÓRIOS
- Mais de 3 anos de experiência imersa construindo Produtos Digitais e Web Apps complexos.
- Portfólio demonstrando não apenas as interfaces prontas, mas todo o processo de investigação e discovery (Design Thinking).
- Facilidade com prototipagem avançada de Auto-layouts no Figma.
- Empatia e foco contínuo no sucesso do usuário final.

🌟 DIFERENCIAIS
- Habilidade profunda em microinterações avançadas usando Framer ou Principie.`
    }
];

export const JobInput = ({ value, onChange }) => {
    const [isExpanded, setIsExpanded] = useState(!!value);

    const isJobIdentified = useMemo(() => value && value.length > 50, [value]);

    const toggleExpand = () => {
        setIsExpanded(prev => !prev);
    };

    return (
        <div className="w-full flex flex-col font-jetbrains">
            {/* Expand/Collapse toggle */}
            <button
                type="button"
                onClick={toggleExpand}
                className={`
                    w-full flex items-center justify-between gap-4 px-4 md:px-5 lg:px-6 py-4
                    border-4 border-foreground font-space font-black text-sm md:text-lg lg:text-xl uppercase tracking-tight
                    transition-all duration-200
                    shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]
                    active:translate-y-1 active:translate-x-1 active:shadow-none
                    ${isExpanded
                        ? 'bg-foreground text-background border-b-0 shadow-none'
                        : 'bg-white text-foreground hover:bg-muted'
                    }
                `}
            >
                <div className="flex items-center gap-3">
                    <svg className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <polyline points="9 18 15 12 9 6" />
                    </svg>
                    <span>Descrição da Vaga</span>
                    <span className={`font-jetbrains font-bold text-[10px] px-2 py-0.5 uppercase tracking-widest ${isExpanded ? 'bg-primary text-foreground' : 'border-2 border-foreground/30 text-foreground/50'}`}>
                        Opcional
                    </span>
                </div>

                {/* Status indicator */}
                {isJobIdentified && !isExpanded && (
                    <span className="flex items-center gap-2 font-jetbrains font-bold text-[10px] bg-primary text-foreground px-2 py-0.5 uppercase tracking-widest">
                        <span className="w-2 h-2 bg-foreground animate-pulse" />
                        Preenchido
                    </span>
                )}
            </button>

            {/* Expandable content */}
            <div className={`overflow-hidden transition-all duration-500 ease-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                <div className="border-4 border-foreground border-t-0">

                    {/* Preset selector */}
                    <div className="relative border-b-2 border-foreground/20">
                        <select
                            className="w-full appearance-none bg-muted/30 font-jetbrains font-bold uppercase text-[11px] py-3 px-4 pr-12 focus:outline-none focus:bg-primary/10 cursor-pointer transition-colors"
                            onChange={(e) => { onChange(e.target.value); }}
                            defaultValue=""
                        >
                            <option value="" disabled>⚡ CARREGAR PRESET DE VAGA</option>
                            {JOB_PRESETS.map((preset, idx) => (
                                <option key={idx} value={preset.text}>{preset.label}</option>
                            ))}
                        </select>
                        <div className="absolute right-0 top-0 bottom-0 w-10 flex items-center justify-center pointer-events-none text-foreground/40">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="6 9 12 15 18 9" />
                            </svg>
                        </div>
                    </div>

                    {/* Textarea container */}
                    <div className="relative">
                        {/* Line numbers */}
                        <div className="absolute left-0 top-0 bottom-0 w-10 md:w-14 border-r-2 border-foreground/10 bg-muted/20 pointer-events-none flex flex-col items-center pt-4 font-jetbrains text-[9px] text-foreground/15 overflow-hidden z-10">
                            {[...Array(15)].map((_, i) => (
                                <span key={i} className="mb-[10px] flex-shrink-0 leading-none">{String((i + 1) * 10).padStart(3, '0')}</span>
                            ))}
                        </div>

                        <textarea
                            className={`
                                w-full h-64 md:h-72 lg:h-80 resize-none bg-white p-4 md:p-5 lg:p-6 pl-14 md:pl-20 lg:pl-24
                                font-jetbrains text-sm md:text-base lg:text-lg leading-relaxed
                                focus:outline-none focus:bg-foreground focus:text-primary
                                transition-colors duration-200
                                placeholder:text-foreground/20 placeholder:uppercase
                                custom-scrollbar-job
                                ${isJobIdentified ? 'bg-primary/5' : ''}
                            `}
                            value={value}
                            onChange={(e) => onChange(e.target.value)}
                            placeholder={`>_ Cole aqui a descrição da vaga...\n\nListe requisitos técnicos, skills e competências avaliadas.\n\nIsto melhora a precisão da análise ATS.`}
                            spellCheck="false"
                        />

                        <style>{`
                            .custom-scrollbar-job::-webkit-scrollbar { width: 8px; }
                            .custom-scrollbar-job::-webkit-scrollbar-track { background: transparent; }
                            .custom-scrollbar-job::-webkit-scrollbar-thumb { background-color: #121212; border: 2px solid white; }
                        `}</style>
                    </div>

                    {/* Bottom bar with progress */}
                    <div className="flex items-center justify-between bg-muted/30 px-4 py-2 border-t-2 border-foreground/10">
                        <div className="flex items-center gap-3">
                            <span className={`w-2 h-2 ${isJobIdentified ? 'bg-primary animate-pulse' : 'bg-foreground/20'}`} />
                            <span className="font-jetbrains font-bold text-[10px] uppercase tracking-widest text-foreground/50">
                                {isJobIdentified ? 'Vaga Detectada' : 'Aguardando Input'}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            <span className="font-jetbrains font-bold text-[10px] tabular-nums text-foreground/40">
                                {value.length} CARACTERES
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
