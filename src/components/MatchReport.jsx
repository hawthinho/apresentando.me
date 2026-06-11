import React from 'react';

export const MatchReport = ({ score, analysis, foundKeywords, missingKeywords }) => {
    return (
        <div className="w-full bg-[#f8f9fa] border-4 border-foreground mt-12 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative">
            <div className="absolute -top-5 right-8 bg-foreground text-background font-jetbrains font-black text-xs px-4 py-2 uppercase tracking-widest flex items-center gap-2">
                Módulo de compatibilidade
            </div>

            {/* Header Area */}
            <div className="flex flex-col md:flex-row border-b-4 border-foreground">
                <div className="p-8 md:border-r-4 border-foreground flex items-center justify-center bg-white min-w-[250px]">
                    <div className="text-center">
                        <div className="font-space font-black text-7xl uppercase tracking-tighter text-foreground">
                            {score}<span className="text-4xl text-primary">%</span>
                        </div>
                        <div className="font-jetbrains font-bold text-xs uppercase tracking-widest mt-2 border-t-2 border-foreground pt-2">
                            Compatibilidade
                        </div>
                    </div>
                </div>
                <div className="p-8 flex-1 bg-background flex flex-col justify-center">
                    <h3 className="font-space font-black text-2xl uppercase mb-3">Análise de aderência</h3>
                    <p className="font-jetbrains text-sm md:text-base text-foreground/80 leading-relaxed font-medium">
                        {analysis}
                    </p>
                </div>
            </div>

            {/* Keywords Grid Area */}
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y-4 md:divide-y-0 md:divide-x-4 divide-foreground bg-white">
                {/* Found Keywords */}
                <div className="p-8">
                    <div className="font-jetbrains font-black uppercase text-sm mb-6 pb-2 border-b-4 border-foreground flex items-center justify-between">
                        <span>Checklist de requisitos</span>
                        <span className="bg-foreground text-background px-2 py-0.5 text-[10px]">{foundKeywords.length}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {foundKeywords.map((kw, i) => (
                            <div key={i} className="flex justify-between items-center bg-primary/20 border-2 border-primary p-3 group">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                        <polyline points="20 6 9 17 4 12"></polyline>
                                    </svg>
                                    <span className="font-jetbrains font-bold uppercase text-sm">{kw}</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-[#5a6b00]">Validado</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Missing Keywords */}
                <div className="p-8">
                    <div className="font-jetbrains font-black uppercase text-sm mb-6 pb-2 border-b-4 border-foreground flex items-center justify-between">
                        <span>O que acrescentar</span>
                        <span className="bg-destructive text-destructive-foreground px-2 py-0.5 text-[10px]">{missingKeywords.length}</span>
                    </div>
                    <div className="flex flex-col gap-3">
                        {missingKeywords.map((kw, i) => (
                            <div key={i} className="flex justify-between items-center bg-destructive/10 border-2 border-destructive p-3 group">
                                <div className="flex items-center gap-3">
                                    <svg className="w-4 h-4 text-destructive" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                        <line x1="12" y1="8" x2="12" y2="16"></line>
                                        <line x1="12" y1="20" x2="12.01" y2="20"></line>
                                    </svg>
                                    <span className="font-jetbrains font-bold uppercase text-sm">{kw}</span>
                                </div>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-destructive">Ausente</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};
