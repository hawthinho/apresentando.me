import React, { useState, useMemo } from 'react';

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
                            <option value="Desenvolvedor(a) Fullstack Sênior | Remoto...">[01] Desenvolvedor Fullstack Sênior</option>
                            <option value="UX/UI Designer Pleno | Híbrido - São Paulo...">[02] UX/UI Designer Pleno</option>
                            <option value="Product Manager | Remoto...">[03] Product Manager Estratégico</option>
                            <option value="Analista de Dados Sênior | Híbrido - Rio de Janeiro...">[04] Data Analyst Sr. / Scientist</option>
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
