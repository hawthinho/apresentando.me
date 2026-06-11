import React from 'react';
import { formatHistoryDate } from '../services/historyService';

const formatAiLabel = (ai) => {
    if (!ai) return '';
    const provider = ai.providerLabel || ai.providerName || ai.providerId || 'IA';
    const model = ai.modelLabel || ai.modelId || '';
    return model ? `${provider} / ${model}` : provider;
};

const AiModelBadge = ({ label, ai, tone = 'muted' }) => {
    if (!ai) return null;

    const isPrimary = tone === 'primary';

    return (
        <span className={`inline-flex max-w-full items-center gap-2 border-2 px-2 py-1 font-jetbrains text-[9px] font-black uppercase leading-none ${isPrimary ? 'border-foreground bg-primary text-foreground' : 'border-foreground/50 bg-[#F4F4F0] text-foreground'} group-hover:border-foreground group-hover:bg-white group-hover:text-foreground`}>
            <span className="shrink-0 opacity-70">{label}</span>
            <span className="truncate">{formatAiLabel(ai)}</span>
        </span>
    );
};

export const HistoryView = ({ history, onSelectAnalysis, onBack, onClearHistory }) => {
    const handleClearHistory = () => {
        if (window.confirm('Apagar todo o histórico salvo neste navegador?')) {
            onClearHistory?.();
        }
    };

    return (
        <div className="w-full flex flex-col mt-8 animate-in fade-in slide-in-from-bottom-12 duration-500 max-w-5xl mx-auto">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b-4 border-foreground">
                <div>
                    <span className="inline-block font-jetbrains font-bold text-[10px] uppercase tracking-widest bg-foreground text-primary px-3 py-1 mb-4 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Logs do sistema
                    </span>
                    <h1 className="font-space font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none">
                        Histórico de <br/><span className="text-background bg-foreground px-2 inline-block mt-2 -rotate-1">Análises.</span>
                    </h1>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                    {history.length > 0 && (
                        <button
                            onClick={handleClearHistory}
                            className="self-start md:self-auto rounded-none bg-white hover:bg-destructive hover:text-destructive-foreground text-foreground border-4 border-foreground font-jetbrains font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1.5 active:translate-x-1.5 active:shadow-none transition-all flex items-center gap-3 h-14 px-6 shrink-0"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path></svg>
                            Limpar
                        </button>
                    )}
                    <button
                        onClick={onBack}
                        className="self-start md:self-auto rounded-none bg-white hover:bg-muted text-foreground border-4 border-foreground font-jetbrains font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1.5 active:translate-x-1.5 active:shadow-none transition-all flex items-center gap-3 h-14 px-8 shrink-0"
                    >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                        Voltar
                    </button>
                </div>
            </header>

            <div className="bg-[#D4FF00] text-foreground p-4 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-jetbrains font-bold text-xs uppercase mb-6 flex items-center gap-4">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                <span>ATENÇÃO: SEUS DADOS EXISTEM APENAS NO SEU NAVEGADOR. Faça o download dos currículos gerados, pois eles serão excluídos permanentemente se você limpar o cache do navegador.</span>
            </div>

            <div className="bg-white border-4 border-foreground shadow-[12px_12px_0px_0px_rgba(212,255,0,1)] flex flex-col p-6 md:p-8 min-h-[50vh]">
                {history.length === 0 ? (
                    <div className="text-center p-12 bg-[#F4F4F0] border-4 border-foreground border-dashed flex flex-col items-center justify-center flex-1">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mb-4 opacity-50"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><line x1="9" y1="3" x2="9" y2="21"></line></svg>
                        <p className="font-space font-black text-2xl uppercase mb-2">Sem registros</p>
                        <p className="text-sm font-medium font-jetbrains">Inicie uma nova análise na tela principal para registrar eventos.</p>
                    </div>
                ) : (
                    <div className="flex flex-col gap-6">
                        {history.map(item => (
                            <div 
                                key={item.id} 
                                className="group flex flex-col md:flex-row items-start md:items-center border-4 border-foreground p-6 cursor-pointer bg-white hover:bg-primary transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]"
                                onClick={() => onSelectAnalysis(item)}
                            >
                                <div className="bg-foreground text-primary p-4 mr-6 group-hover:bg-background group-hover:text-foreground transition-colors border-2 border-foreground shrink-0 mb-4 md:mb-0">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                                    <line x1="16" y1="13" x2="8" y2="13"></line>
                                    </svg>
                                </div>
                                <div className="flex-1 w-full min-w-0 mb-4 md:mb-0">
                                    <div className="flex items-center gap-3">
                                        <p className="font-space font-black text-2xl uppercase truncate group-hover:text-primary-foreground">{item.fileName}</p>
                                        {item.optimizedContent && (
                                            <span className="bg-primary text-foreground font-jetbrains font-black uppercase text-[10px] px-2 py-0.5 whitespace-nowrap border border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                                Otimizado
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-sm text-foreground/70 group-hover:text-foreground font-bold font-jetbrains mt-1">{formatHistoryDate(item.date)}</p>
                                    <div className="mt-3 flex max-w-full flex-wrap gap-2">
                                        <AiModelBadge label="Análise" ai={item.analysisAi} />
                                        <AiModelBadge label="Otimização" ai={item.optimizationAi} tone="primary" />
                                    </div>
                                </div>
                                <div className="flex flex-col items-end shrink-0 w-full md:w-auto mt-4 md:mt-0 pt-4 md:pt-0 border-t-2 border-foreground/30 md:border-0 border-dashed">
                                    <div className="font-space font-black text-4xl group-hover:text-primary-foreground">
                                        {item.atsScore} <span className="text-sm align-super opacity-50 font-jetbrains">/100</span>
                                    </div>
                                    <span className="font-jetbrains font-bold text-[10px] uppercase tracking-widest mt-1 opacity-70">Score ATS</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};
