import React from 'react';
import { FileUpload } from './FileUpload';
import { JobInput } from './JobInput';
import { getSettings } from '../services/settingsService';

export const AnalysisCard = ({
    file,
    onFileSelect,
    jobDescription,
    onChangeJobDescription,
    onAnalyze,
    onOpenSettings
}) => {
    const firstName = 'Operador';
    const settings = getSettings();
    const hasApiKey = Boolean(settings?.apiKey);

    return (
        <div className="w-full max-w-5xl lg:max-w-6xl mx-auto flex flex-col mt-2 md:mt-6 lg:mt-10 mb-24 relative">

            {/* ── Editorial Header ─────────────────────── */}
            <header className="mb-8 md:mb-12 lg:mb-16">
                {/* Top line — system status */}
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-2.5 h-2.5 bg-primary animate-pulse" />
                    <span className="font-jetbrains font-bold text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
                        Motor ATS Online — Pronto para Análise
                    </span>
                </div>

                {/* Main title */}
                <h1 className="font-space font-black text-5xl md:text-7xl lg:text-8xl uppercase tracking-tighter leading-[0.85] text-foreground select-none">
                    Olá,{' '}
                    <span className="relative inline-block">
                        <span className="relative z-10 bg-primary px-2 md:px-3">{firstName}</span>
                    </span>
                </h1>

                {/* Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mt-6">
                    <p className="font-jetbrains font-bold text-sm md:text-base uppercase text-muted-foreground max-w-xl md:w-3/4 lg:w-2/3 leading-relaxed">
                        Carregue seu currículo para<br className="hidden md:block" /> iniciar a análise de compatibilidade ATS.
                    </p>
                </div>
            </header>

            {/* ── Pipeline Container ──────────────────── */}
            <div className="flex flex-col gap-0">

                {!hasApiKey && (
                    <div className="bg-primary text-foreground p-4 md:p-6 font-jetbrains text-sm md:text-base font-bold uppercase tracking-wider flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-2 md:border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mb-8">
                        <div className="flex items-center gap-3">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0 hidden md:block"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                            <span className="opacity-95 leading-relaxed">
                                <span className="md:hidden">✨ </span>Primeiro acesso? Vá até as configurações e adicione uma API Key gratuitamente.
                            </span>
                        </div>
                        <button
                            type="button"
                            onClick={onOpenSettings}
                            className="w-full md:w-auto shrink-0 bg-foreground text-primary px-6 py-3 border-2 border-foreground hover:bg-background hover:text-foreground active:scale-95 transition-all font-black flex items-center justify-center gap-2"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            Configurações
                        </button>
                    </div>
                )}

                {/* ══ STEP 1 — File Upload ══════════════ */}
                <section className="relative">
                    {/* Step label */}
                    <div className="flex items-center gap-4 mb-4">
                        <span className="w-10 h-10 border-4 border-foreground bg-primary text-foreground font-jetbrains font-black text-lg flex items-center justify-center shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] shrink-0">
                            1
                        </span>
                        <div>
                            <h2 className="font-space font-black text-2xl md:text-3xl uppercase tracking-tight leading-none">
                                Matriz Fonte
                            </h2>
                            <p className="font-jetbrains font-bold text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                                Seu currículo em formato PDF
                            </p>
                        </div>
                    </div>

                    {/* Upload area */}
                    <FileUpload file={file} onFileSelect={onFileSelect} />
                </section>

                {/* Connector */}
                <div className="flex items-center gap-0 my-6 md:my-8">
                    <div className="w-10 flex justify-center shrink-0">
                        <div className="w-[3px] h-12 bg-foreground/15" />
                    </div>
                </div>

                {/* ══ STEP 2 — Job Description ══════════ */}
                <section className="relative">
                    {/* Step label */}
                    <div className="flex items-center gap-4 mb-4">
                        <span className="w-10 h-10 border-4 border-foreground bg-foreground text-background font-jetbrains font-black text-lg flex items-center justify-center shadow-[3px_3px_0px_0px_hsl(var(--primary))] shrink-0">
                            2
                        </span>
                        <div>
                            <h2 className="font-space font-black text-2xl md:text-3xl uppercase tracking-tight leading-none">
                                Vaga Alvo
                            </h2>
                            <p className="font-jetbrains font-bold text-[10px] uppercase tracking-widest text-muted-foreground mt-1">
                                Potencializa a precisão da análise
                            </p>
                        </div>
                    </div>

                    <JobInput value={jobDescription} onChange={onChangeJobDescription} />
                </section>
            </div>

            {/* ── Action Bar ─────────────────────────── */}
            <div className="mt-8 md:mt-12">
                {/* Hazard tape */}
                <div className="w-full h-2 bg-[repeating-linear-gradient(45deg,hsl(var(--primary)),hsl(var(--primary))_8px,hsl(var(--foreground))_8px,hsl(var(--foreground))_16px)]" />

                <button
                    type="button"
                    className={`
                        w-full h-20 md:h-24 lg:h-28 flex items-center justify-center gap-4 md:gap-6
                        font-space font-black text-2xl md:text-3xl lg:text-4xl uppercase tracking-tight
                        border-4 border-foreground border-t-0
                        transition-all duration-200 group
                        ${file && hasApiKey
                            ? 'bg-primary text-foreground hover:bg-foreground hover:text-primary active:scale-[0.98] cursor-pointer shadow-[0_8px_0px_0px_rgba(0,0,0,1)] hover:shadow-[0_4px_0px_0px_rgba(0,0,0,1)] active:shadow-none active:translate-y-2'
                            : 'bg-muted text-muted-foreground cursor-not-allowed'
                        }
                    `}
                    onClick={onAnalyze}
                    disabled={!file || !hasApiKey}
                >
                    {file && hasApiKey ? (
                        <>
                            <span>Processar Análise</span>
                            <svg className="w-8 h-8 md:w-10 md:h-10 group-hover:translate-x-2 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3.5">
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <polyline points="15 5 22 12 15 19" />
                            </svg>
                        </>
                    ) : file && !hasApiKey ? (
                        <span className="flex items-center gap-3 text-xl md:text-2xl">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Aguardando chave de api
                        </span>
                    ) : (
                        <span className="flex items-center gap-3 text-xl md:text-2xl">
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                            </svg>
                            Aguardando Documento
                        </span>
                    )}
                </button>
            </div>

            {/* ── Info Banners ────────────────────────── */}
            <div className="mt-4 flex flex-col gap-2">
                <div className="bg-foreground text-primary px-4 py-3 font-jetbrains text-[11px] font-bold uppercase tracking-wider flex items-center gap-3 border-2 border-foreground">
                    <span className="w-2 h-2 bg-primary rounded-full animate-pulse shrink-0" />
                    <span className="opacity-80">
                        Processamento Avançado via IA Local — tempo estimado ~30s. Não feche a aba.
                    </span>
                </div>
                <div className="bg-muted text-muted-foreground px-4 py-3 font-jetbrains text-[10px] font-bold uppercase tracking-wider flex items-center gap-3 border-2 border-foreground/20">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                    <span className="opacity-80">
                        Privacidade Garantida: Seus arquivos e dados são processados inteiramente no seu navegador e não são armazenados em nossos servidores.
                    </span>
                </div>
            </div>
        </div>
    );
};
