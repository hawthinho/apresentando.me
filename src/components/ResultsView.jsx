import React from 'react';
import { Button } from '@/components/ui/button';
import { ScoreSection } from './ScoreSection';
import { MatchReport } from './MatchReport';
import { StrengthsSection } from './StrengthsSection';
import { ImprovementsSection } from './ImprovementsSection';
import { OptimizationPromoCard } from './OptimizationPromoCard';

export const ResultsView = ({ data, onBack, onNavigateOptimization, isOptimized }) => {

    return (
        <div className="w-full flex flex-col gap-12 mt-8 md:mt-12 lg:mt-16 animate-in fade-in slide-in-from-bottom-12 duration-500 max-w-7xl lg:max-w-[90rem] mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b-4 border-foreground pb-6 lg:pb-10">
                <div>
                    <span className="inline-block font-jetbrains font-bold text-[10px] uppercase tracking-widest bg-primary text-foreground px-3 py-1 mb-4 border-2 border-foreground shadow-[2px_2px_0px_rgba(0,0,0,1)]">
                        Terminal de Resultados
                    </span>
                    <h1 className="font-space font-black text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-tighter text-balance leading-none">
                        Diagnóstico <br/><span className="text-background bg-foreground px-2 inline-block mt-2 -rotate-1">Concluído.</span>
                    </h1>
                </div>
                <Button
                    onClick={onBack}
                    className="self-start md:self-auto rounded-none bg-white hover:bg-primary hover:text-foreground text-foreground border-4 border-foreground font-jetbrains font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1.5 active:translate-x-1.5 active:shadow-none transition-all flex items-center gap-3 h-14 md:px-8 shrink-0"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
                    Nova Análise
                </Button>
            </header>

            {isOptimized && (
                <div className="bg-primary border-4 border-foreground p-6 md:p-8 lg:p-10 flex flex-col md:flex-row items-start md:items-center justify-between shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-[-1rem] lg:mt-[-2rem] mb-4">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <span className="w-3 h-3 bg-foreground rounded-full animate-pulse"></span>
                            <span className="font-jetbrains font-black uppercase text-[10px] tracking-widest bg-foreground text-primary px-2 py-0.5">Versão em Cache</span>
                        </div>
                        <h2 className="font-space font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter text-foreground leading-none mt-4">Matriz Otimizada <br className="hidden md:block"/> Disponível.</h2>
                    </div>
                    <Button 
                        onClick={onNavigateOptimization}
                        className="w-full md:w-auto mt-6 md:mt-0 h-16 px-8 rounded-none bg-foreground text-primary hover:bg-black font-jetbrains font-black uppercase text-sm border-2 border-transparent hover:border-foreground transition-all shrink-0 active:scale-95"
                    >
                        Acessar Documento Seguro
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="ml-3"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
                    </Button>
                </div>
            )}

            <div className="flex flex-col w-full">
                <ScoreSection
                    score={data.atsScore}
                    probability={data.probability}
                    reason={data.screeningReason}
                />

                {!isOptimized && (
                    <OptimizationPromoCard
                        onOptimize={onNavigateOptimization}
                        benefits={[
                            "Otimização automática de keywords",
                            "Reescrita algorítmica de experiências",
                            "Design LaTeX premium blindado",
                            "Aumento imediato do ATS Score",
                            "Compatibilidade com Gupy e ATS globais",
                            "Correção paramétrica de gramática"
                        ]}
                    />
                )}

                {data.matchScore !== null && (
                    <MatchReport
                        score={data.matchScore}
                        analysis={data.matchAnalysis}
                        foundKeywords={data.foundKeywords}
                        missingKeywords={data.missingKeywords}
                    />
                )}

                <StrengthsSection strengths={data.strengths} />

                <ImprovementsSection
                    keywordOps={data.keywordOps}
                    tips={data.tips}
                />


            </div>
        </div>
    );
};
