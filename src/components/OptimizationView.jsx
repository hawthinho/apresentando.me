import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { optimizeResume, generateCoverLetter } from '../services/aiService';
import { generateResumePDF, generateCoverLetterPDF } from '../services/pdfExportService';
import { parseResumeText, formatResumeToText, formatResumeToLatex, formatCoverLetterToLatex, formatCombinedToLatex } from '../services/resumeParser';
export const OptimizationView = ({ resumeText, jobDescription, onOpenEditor, editedResumeData, onBack, initialOptimizedContent, initialLatexCode, initialImprovements, initialImpact, initialCoverLetter, onOptimizationComplete }) => {
    const [step, setStep] = useState(initialOptimizedContent ? 'success' : 'config'); // config, processing, success
    const [improvements, setImprovements] = useState(initialImprovements || null);
    const [impact, setImpact] = useState(initialImpact || null);
    const [aggressiveness, setAggressiveness] = useState(2); // 1, 2, 3
    const [optimizedContent, setOptimizedContent] = useState(initialOptimizedContent || null);
    const [latexCode, setLatexCode] = useState(initialLatexCode || '');
    const [showLatex, setShowLatex] = useState(false);
    const [showEditedLatex, setShowEditedLatex] = useState(false);
    const [parsedResume, setParsedResume] = useState(null);
    const [loadingStepIndex, setLoadingStepIndex] = useState(0);
    const [lastEditedAt, setLastEditedAt] = useState(null);

    // Cover Letter state
    const [coverLetter, setCoverLetter] = useState(initialCoverLetter || null);
    const [isGeneratingCoverLetter, setIsGeneratingCoverLetter] = useState(false);
    const [showCoverLetterLatex, setShowCoverLetterLatex] = useState(false);
    const [isEditingCoverLetter, setIsEditingCoverLetter] = useState(false);

    const LOADING_STEPS = [
        { id: 'analyze', label: 'Analisando compatibilidade' },
        { id: 'keywords', label: 'Injetando palavras-chave' },
        { id: 'rewrite', label: 'Reescrevendo descrições' },
        { id: 'format', label: 'Ajustando formatação ATS' },
        { id: 'finalize', label: 'Gerando versão final' }
    ];

    useEffect(() => {
        if (step === 'processing') {
            setLoadingStepIndex(0);
            const interval = setInterval(() => {
                setLoadingStepIndex((prev) => {
                    if (prev < LOADING_STEPS.length - 1) return prev + 1;
                    return prev;
                });
            }, 1500);
            return () => clearInterval(interval);
        }
    }, [step]);

    useEffect(() => {
        if (editedResumeData) {
            setParsedResume(editedResumeData);
            setLastEditedAt(new Date());
        }
    }, [editedResumeData]);


    const levels = {
        1: {
            title: "Conservador",
            desc: "Correções precisas de gramática e formatação. Mantém a essência original do seu texto, apenas polindo para profissionalismo.",
            promptType: "low",
            icon: "Shield"
        },
        2: {
            title: "Equilibrado",
            desc: "Reescrita estratégica de pontos-chave e sumário. Aumenta o impacto das suas conquistas e alinha habilidades com a vaga.",
            promptType: "medium",
            icon: "Scale"
        },
        3: {
            title: "Agressivo",
            desc: "Transformação total focada em conversão. Reescreve narrativa e tom para vender você como a única escolha possível.",
            promptType: "high",
            icon: "Zap"
        }
    };

    const handleOptimize = async () => {
        setStep('processing');
        try {
            const result = await optimizeResume(resumeText, jobDescription, levels[aggressiveness].promptType);
            
            const resumeData = result.resumeData;
            const generatedText = formatResumeToText(resumeData);
            const generatedLatex = formatResumeToLatex(resumeData);

            setOptimizedContent(generatedText);
            setLatexCode(generatedLatex);
            setParsedResume(resumeData);
            setImprovements(result.improvements || []);
            setImpact(result.impact || null);
            setLastEditedAt(null);

            if (onOptimizationComplete) {
                onOptimizationComplete({ 
                    optimizedContent: generatedText, 
                    latexCode: generatedLatex,
                    improvements: result.improvements,
                    impact: result.impact
                });
            }

            setStep('success');
        } catch (error) {
            console.error(error);
            setStep('config');
            alert("Ocorreu um erro ao otimizar. Tente novamente.");
        }
    };

    const handleDownloadPDF = () => {
        generateResumePDF(optimizedContent, 'curriculo_otimizado.pdf');
    };

    const handleCopyLatex = () => {
        navigator.clipboard.writeText(latexCode);
        alert("Código LaTeX copiado!");
    };

    const handleEditResume = () => {
        if (!parsedResume) {
            const parsed = parseResumeText(optimizedContent);
            setParsedResume(parsed);
            onOpenEditor(parsed);
        } else {
            onOpenEditor(parsedResume);
        }
    };

    const handleDownloadEditedPDF = () => {
        if (!parsedResume) return;
        const updatedContent = formatResumeToText(parsedResume);
        generateResumePDF(updatedContent, 'curriculo_editado.pdf');
    };

    const api_clipboard_writeText = (text) => {
        navigator.clipboard.writeText(text);
        alert("Conteúdo copiado! Cole no Prism para gerar o LaTeX.");
    };

    const handleGenerateCoverLetter = async () => {
        setIsGeneratingCoverLetter(true);
        try {
            const letter = await generateCoverLetter(resumeText, jobDescription);
            setCoverLetter(letter);
            if (onOptimizationComplete) {
                onOptimizationComplete({
                    optimizedContent,
                    latexCode,
                    improvements,
                    impact,
                    coverLetter: letter
                });
            }
        } catch (error) {
            console.error(error);
            alert("Erro ao gerar a carta de apresentação.");
        } finally {
            setIsGeneratingCoverLetter(false);
        }
    };

    const handleDownloadCoverLetterPDF = () => {
        if (!coverLetter) return;
        generateCoverLetterPDF(coverLetter);
    };

    const steps = [
        { id: 'config', label: 'Configuração', num: 1 },
        { id: 'processing', label: 'Processamento', num: 2 },
        { id: 'success', label: 'Resultado Final', num: 3 }
    ];

    const getCurrentStepIndex = () => {
        if (step === 'config') return 0;
        if (step === 'processing') return 1;
        return 2;
    };

    return (
        <div className="w-full flex flex-col mt-8 md:mt-12 animate-in fade-in slide-in-from-bottom-12 duration-500 max-w-5xl lg:max-w-[70rem] mx-auto mb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 lg:pb-10 mb-8 border-b-4 border-foreground">
                <div>
                    <span className="inline-block font-jetbrains font-bold text-[10px] uppercase tracking-widest bg-foreground text-primary px-3 py-1 mb-4 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Modo de Substituição
                    </span>
                    <h1 className="font-space font-black text-5xl md:text-6xl lg:text-7xl xl:text-8xl uppercase tracking-tighter leading-none">
                        Parâmetros de <br/><span className="text-primary italic border-b-4 border-primary pb-1 pr-4 inline-block mt-2">Otimização.</span>
                    </h1>
                </div>
                <button
                    onClick={onBack}
                    className="self-start md:self-auto rounded-none bg-white hover:bg-muted text-foreground border-4 border-foreground font-jetbrains font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1.5 active:translate-x-1.5 active:shadow-none transition-all flex items-center gap-3 h-14 px-8 shrink-0"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Voltar
                </button>
            </header>

            <div className="bg-background border-4 border-foreground w-full shadow-[12px_12px_0px_0px_rgba(212,255,0,1)] flex flex-col relative bg-white">
                <div className="border-b-4 border-foreground p-8 md:p-12 relative overflow-hidden bg-white">
                    <h2 className="font-space font-black text-2xl md:text-3xl uppercase tracking-tighter leading-none text-foreground/50">Progresso do Override</h2>

                    {/* Stepper Grid */}
                    <div className="grid grid-cols-3 gap-4 mt-6">
                        {steps.map((s, index) => {
                            const currentIndex = getCurrentStepIndex();
                            const isActive = index === currentIndex;
                            const isCompleted = index < currentIndex;
                            return (
                                <div key={s.id} className="flex flex-col gap-2">
                                    <div className="flex items-center gap-2">
                                        <div className={`w-8 h-8 flex items-center justify-center border-2 border-foreground font-jetbrains font-black text-xs ${isActive ? 'bg-primary text-foreground scale-110 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]' : isCompleted ? 'bg-foreground text-background' : 'bg-background text-foreground/50'}`}>
                                            {isCompleted ? '✓' : s.num}
                                        </div>
                                        <div className={`h-1 flex-1 ${isCompleted ? 'bg-foreground' : 'bg-foreground/20'}`}></div>
                                    </div>
                                    <span className={`font-jetbrains font-bold text-[10px] uppercase tracking-widest ${isActive ? 'text-foreground' : 'text-foreground/50'}`}>{s.label}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* MODAL BODY */}
                <div className="p-8 md:p-12 bg-[#F4F4F0] flex-1">
                    {step === 'config' && (
                        <div className="flex flex-col gap-8">
                            <div className="font-jetbrains font-bold text-sm uppercase md:w-2/3 border-l-4 border-primary pl-4 text-muted-foreground">
                                Defina o nível de interferência algorítmica no seu documento original.
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
                                {[1, 2, 3].map(level => {
                                    const isSelected = aggressiveness === level;
                                    return (
                                        <div 
                                            key={level} 
                                            className={`border-4 cursor-pointer transition-all duration-200 p-6 flex flex-col gap-4 relative overflow-hidden ${isSelected ? 'border-primary bg-foreground text-background shadow-[8px_8px_0px_0px_rgba(212,255,0,1)] -translate-y-1' : 'border-foreground bg-white hover:border-primary hover:shadow-[4px_4px_0px_0px_rgba(212,255,0,1)]'}`}
                                            onClick={() => setAggressiveness(level)}
                                        >
                                            {isSelected && (
                                                <div className="absolute top-0 right-0 w-16 h-16 border-l-4 border-b-4 border-primary bg-foreground/50"></div>
                                            )}
                                            <div className={`font-space font-black text-2xl uppercase tracking-tighter ${isSelected ? 'text-primary' : 'text-foreground'}`}>
                                                {levels[level].title}
                                            </div>
                                            <p className={`font-jetbrains text-xs leading-relaxed font-bold uppercase ${isSelected ? 'text-background/80' : 'text-muted-foreground'}`}>
                                                {levels[level].desc}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>

                            <div className="mt-8 flex justify-end gap-4 border-t-2 border-foreground/30 pt-8">
                                <Button className="h-14 px-8 rounded-none border-4 border-foreground bg-primary text-foreground hover:bg-foreground hover:text-primary font-jetbrains font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none" onClick={handleOptimize}>
                                    Iniciar Override
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 ml-2"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                                </Button>
                            </div>
                        </div>
                    )}

                    {step === 'processing' && (
                        <div className="flex flex-col items-center justify-center py-12">
                            <div className="relative w-32 h-32 flex items-center justify-center mb-8">
                                <div className="absolute inset-0 border-4 border-muted rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin"></div>
                                <div className="absolute inset-0 border-4 border-foreground rounded-full border-b-transparent animate-[spin_2s_linear_infinite_reverse]"></div>
                                <span className="font-space font-black text-xl text-foreground">{(loadingStepIndex / (LOADING_STEPS.length - 1) * 100).toFixed(0)}%</span>
                            </div>

                            <h3 className="font-space font-black text-3xl uppercase tracking-tighter mb-8">Executando Rotinas</h3>

                            <div className="w-full max-w-md flex flex-col gap-4">
                                {LOADING_STEPS.map((s, index) => {
                                    const isCompleted = index < loadingStepIndex;
                                    const isCurrent = index === loadingStepIndex;
                                    return (
                                        <div key={s.id} className={`flex items-center gap-4 p-3 border-2 transition-all ${isCurrent ? 'border-primary bg-primary/10 scale-105' : isCompleted ? 'border-foreground/20 opacity-50' : 'border-transparent opacity-30'}`}>
                                            <div className={`w-6 h-6 flex items-center justify-center ${isCompleted ? 'text-primary' : isCurrent ? 'text-foreground animate-pulse' : 'text-foreground/30'}`}>
                                                {isCompleted ? <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4"><polyline points="20 6 9 17 4 12"></polyline></svg> : <div className="w-2 h-2 bg-currentColor rounded-full" />}
                                            </div>
                                            <span className="font-jetbrains font-bold uppercase text-xs tracking-widest">{s.label}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="flex flex-col gap-8">
                            <div className="bg-primary text-foreground p-8 border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                <h3 className="font-space font-black text-4xl uppercase tracking-tighter">Currículo Reconstruído.</h3>
                                <p className="font-jetbrains font-bold uppercase text-sm lg:text-base mt-4">Sua nova versão profissional está encriptada e pronta para emissão.</p>
                            </div>

                            <div className="bg-[#D4FF00] text-foreground p-4 md:p-6 border-4 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] font-jetbrains font-bold text-xs md:text-sm uppercase flex items-start md:items-center gap-4">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="shrink-0 mt-1 md:mt-0"><path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path><line x1="12" y1="9" x2="12" y2="13"></line><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>
                                <span>ATENÇÃO: SEUS DADOS EXISTEM APENAS NO SEU NAVEGADOR! Faça o download dos currículos gerados, pois eles serão excluídos permanentemente se você limpar o cache do navegador.</span>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10 mt-4">
                                {/* Core Version */}
                                <div className="border-4 border-foreground bg-white p-6 lg:p-8 flex flex-col gap-4 relative">
                                    <div className="absolute -top-4 -left-4 bg-foreground text-background font-jetbrains font-black text-[10px] uppercase px-3 py-1">Versão Original (IA)</div>
                                    
                                    <Button className="w-full h-16 lg:h-20 mt-4 rounded-none bg-foreground text-primary hover:bg-black font-jetbrains font-black uppercase tracking-widest border-2 border-foreground" onClick={handleDownloadPDF}>
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        Baixar PDF Final
                                    </Button>

                                    <div className="border-2 border-foreground hover:bg-muted transition-colors mt-2">
                                        <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setShowLatex(!showLatex)}>
                                            <span className="font-jetbrains font-bold uppercase text-xs">Exibir Código LaTeX</span>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transform transition-transform ${showLatex ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                        </div>
                                        {showLatex && (
                                            <div className="p-4 border-t-2 border-foreground bg-[#F4F4F0]">
                                                <textarea readOnly value={latexCode} className="w-full h-32 bg-foreground text-primary font-jetbrains text-xs p-4 resize-none mb-4 focus:outline-none" />
                                                <div className="flex gap-4">
                                                    <Button variant="outline" className="flex-1 rounded-none border-2 border-foreground font-jetbrains uppercase text-[10px] font-bold" onClick={handleCopyLatex}>Copiar Código</Button>
                                                    <a href="https://prism.openai.com/" target="_blank" rel="noopener noreferrer" className="flex-1">
                                                        <Button className="w-full rounded-none border-2 border-foreground bg-primary hover:bg-foreground hover:text-primary text-foreground font-jetbrains uppercase text-[10px] font-bold">Ir para Prism ↗</Button>
                                                    </a>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {!lastEditedAt && (
                                        <Button variant="outline" className="w-full h-12 mt-2 rounded-none border-2 border-dashed border-foreground font-jetbrains font-bold uppercase text-xs hover:bg-muted" onClick={handleEditResume}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            Editar Manualmente
                                        </Button>
                                    )}
                                </div>

                                {/* Edited Version */}
                                {lastEditedAt && (
                                    <div className="border-4 border-primary bg-white p-6 lg:p-8 flex flex-col gap-4 relative shadow-[8px_8px_0px_0px_rgba(212,255,0,1)]">
                                        <div className="absolute -top-4 -left-4 bg-primary text-foreground font-jetbrains font-black text-[10px] uppercase px-3 py-1 flex flex-col">
                                            <span>Versão Editada</span>
                                            <span className="font-normal opacity-70 border-t border-foreground/30 mt-1 pt-1">{lastEditedAt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                                        </div>
                                        
                                        <Button className="w-full h-16 lg:h-20 mt-4 rounded-none bg-primary text-foreground hover:bg-foreground hover:text-primary font-jetbrains font-black uppercase tracking-widest border-2 border-foreground" onClick={handleDownloadEditedPDF}>
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                            Baixar PDF Editado
                                        </Button>

                                        <div className="border-2 border-foreground hover:bg-muted transition-colors mt-2">
                                            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setShowEditedLatex(!showEditedLatex)}>
                                                <span className="font-jetbrains font-bold uppercase text-xs">Exibir Código LaTeX Editado</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transform transition-transform ${showEditedLatex ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                            </div>
                                            {showEditedLatex && (
                                                <div className="p-4 border-t-2 border-foreground bg-[#F4F4F0]">
                                                    <textarea readOnly value={formatResumeToLatex(parsedResume)} className="w-full h-32 bg-foreground text-primary font-jetbrains text-xs p-4 resize-none mb-4 focus:outline-none" />
                                                    <div className="flex gap-4">
                                                        <Button variant="outline" className="flex-1 rounded-none border-2 border-foreground font-jetbrains uppercase text-[10px] font-bold" onClick={() => {
                                                                navigator.clipboard.writeText(formatResumeToLatex(parsedResume));
                                                                alert("Código LaTeX copiado!");
                                                            }}>Copiar Código</Button>
                                                        <a href="https://prism.openai.com/" target="_blank" rel="noopener noreferrer" className="flex-1">
                                                            <Button className="w-full rounded-none border-2 border-foreground bg-primary hover:bg-foreground hover:text-primary text-foreground font-jetbrains uppercase text-[10px] font-bold">Ir para Prism ↗</Button>
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <Button variant="outline" className="w-full h-12 mt-2 rounded-none border-2 border-dashed border-foreground font-jetbrains font-bold uppercase text-xs hover:bg-muted" onClick={handleEditResume}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                            Editar Novamente
                                        </Button>
                                    </div>
                                )}
                            </div>
                            
                            {improvements && improvements.length > 0 && impact && (
                                <div className="border-4 border-foreground bg-white p-8 px-8 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(212,255,0,1)]">
                                    <div>
                                        <h4 className="font-space font-black text-2xl uppercase tracking-tighter text-primary border-b-4 border-foreground pb-2 flex items-center gap-3">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                                            O que mudou?
                                        </h4>
                                        <ul className="mt-8 flex flex-col gap-4">
                                            {improvements.map((imp, idx) => (
                                                <li key={idx} className="flex gap-4 font-jetbrains text-sm leading-relaxed items-start">
                                                    <span className="text-primary font-bold mt-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] border-2 border-foreground bg-white w-6 h-6 flex items-center justify-center shrink-0">→</span> 
                                                    {imp}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className="mt-6 pt-8 border-t-2 border-dashed border-foreground/30">
                                        <h4 className="font-space font-black text-2xl uppercase tracking-tighter text-foreground mb-6 flex items-center gap-3">
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                                            Seu impacto no mercado
                                        </h4>
                                        <p className="font-jetbrains text-sm leading-relaxed whitespace-pre-line">{impact}</p>
                                    </div>
                                </div>
                            )}

                            {/* Cover Letter Section */}
                            <div className="mt-8">
                                {!coverLetter && !isGeneratingCoverLetter && (
                                    <div className="border-4 border-foreground bg-primary/10 p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                        <div>
                                            <h4 className="font-space font-black text-2xl uppercase tracking-tighter border-b-2 border-foreground pb-1 inline-block">Potencialize sua aplicação</h4>
                                            <p className="font-jetbrains text-sm mt-3 font-bold text-foreground/80">Gerar uma Carta de Apresentação (Cover Letter) sob medida baseada neste currículo otimizado e na vaga desejada.</p>
                                        </div>
                                        <Button className="shrink-0 h-14 px-8 rounded-none border-4 border-foreground bg-primary text-foreground hover:bg-foreground hover:text-primary font-jetbrains font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none" onClick={handleGenerateCoverLetter}>
                                            Gerar Carta
                                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="w-5 h-5 ml-2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                        </Button>
                                    </div>
                                )}

                                {isGeneratingCoverLetter && (
                                    <div className="border-4 border-foreground bg-background p-8 flex flex-col items-center justify-center gap-4 border-dashed shadow-none opacity-70">
                                        <div className="w-8 h-8 border-4 border-primary rounded-full border-t-foreground animate-spin"></div>
                                        <span className="font-jetbrains font-bold uppercase tracking-widest text-xs animate-pulse">Forjando Carta Estratégica...</span>
                                    </div>
                                )}

                                {coverLetter && (
                                    <div className="border-4 border-foreground bg-white p-8 flex flex-col gap-6 relative shadow-[8px_8px_0px_0px_rgba(212,255,0,1)] animate-in fade-in slide-in-from-bottom-4">
                                        <div className="absolute -top-4 -left-4 bg-primary text-foreground font-jetbrains font-black text-[10px] uppercase px-3 py-1">Cover Letter Gerada</div>
                                        
                                        {!isEditingCoverLetter ? (
                                            <div className="font-jetbrains text-sm leading-relaxed whitespace-pre-line bg-muted/30 p-6 border-2 border-dashed border-foreground/30 min-h-[200px]">
                                                {coverLetter}
                                            </div>
                                        ) : (
                                            <textarea 
                                                className="w-full h-64 bg-[#F4F4F0] text-foreground font-jetbrains text-sm p-6 resize-y focus:outline-none border-4 border-foreground"
                                                value={coverLetter}
                                                onChange={(e) => setCoverLetter(e.target.value)}
                                                onBlur={(e) => {
                                                    if (onOptimizationComplete) {
                                                        onOptimizationComplete({ optimizedContent, latexCode, improvements, impact, coverLetter: e.target.value });
                                                    }
                                                }}
                                            />
                                        )}

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <Button className="w-full h-14 rounded-none bg-foreground text-primary hover:bg-black font-jetbrains font-black uppercase tracking-widest border-2 border-foreground" onClick={handleDownloadCoverLetterPDF}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                                Baixar PDF da Carta
                                            </Button>
                                            <Button variant="outline" className="w-full h-14 rounded-none border-2 border-dashed border-foreground font-jetbrains font-bold uppercase text-xs hover:bg-muted" onClick={() => setIsEditingCoverLetter(!isEditingCoverLetter)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="mr-2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                                                {isEditingCoverLetter ? 'Finalizar Edição' : 'Editar Carta'}
                                            </Button>
                                        </div>

                                        {/* LaTeX de Cover Letter */}
                                        <div className="border-2 border-foreground hover:bg-muted transition-colors mt-2">
                                            <div className="flex items-center justify-between p-4 cursor-pointer" onClick={() => setShowCoverLetterLatex(!showCoverLetterLatex)}>
                                                <span className="font-jetbrains font-bold uppercase text-xs">Exibir Código LaTeX da Carta</span>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`transform transition-transform ${showCoverLetterLatex ? 'rotate-180' : ''}`}><path d="M6 9l6 6 6-6" /></svg>
                                            </div>
                                            {showCoverLetterLatex && (
                                                <div className="p-4 border-t-2 border-foreground bg-[#F4F4F0]">
                                                    <textarea readOnly value={formatCoverLetterToLatex(coverLetter)} className="w-full h-32 bg-foreground text-primary font-jetbrains text-xs p-4 resize-none mb-4 focus:outline-none" />
                                                    <div className="flex gap-4">
                                                        <Button variant="outline" className="flex-1 rounded-none border-2 border-foreground font-jetbrains uppercase text-[10px] font-bold" onClick={() => {
                                                                navigator.clipboard.writeText(formatCoverLetterToLatex(coverLetter));
                                                                alert("Código LaTeX copiado!");
                                                            }}>Copiar Código</Button>
                                                        <a href="https://prism.openai.com/" target="_blank" rel="noopener noreferrer" className="flex-1">
                                                            <Button className="w-full rounded-none border-2 border-foreground bg-primary hover:bg-foreground hover:text-primary text-foreground font-jetbrains uppercase text-[10px] font-bold">Ir para Prism ↗</Button>
                                                        </a>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {coverLetter && optimizedContent && (
                                    <div className="mt-8 border-4 border-foreground bg-[#D4FF00] p-8 flex flex-col gap-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                        <div>
                                            <h4 className="font-space font-black text-2xl uppercase tracking-tighter border-b-4 border-foreground pb-2 inline-flex items-center gap-3">
                                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path><polyline points="14 2 14 8 20 8"></polyline><line x1="16" y1="13" x2="8" y2="13"></line><line x1="16" y1="17" x2="8" y2="17"></line><polyline points="10 9 9 9 8 9"></polyline></svg>
                                                Exportação Única
                                            </h4>
                                            <p className="font-jetbrains text-sm mt-4 font-bold uppercase text-foreground/80">
                                                Baixe um único pacote contendo a Carta de Apresentação e o Currículo em um mesmo arquivo.
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                            <Button className="w-full h-16 rounded-none bg-foreground text-[#D4FF00] hover:bg-black font-jetbrains font-black uppercase tracking-widest border-2 border-foreground shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all duration-200" onClick={() => generateResumePDF(optimizedContent, 'documento_completo.pdf', coverLetter)}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-3"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
                                                Baixar PDF Único
                                            </Button>
                                            
                                            <Button variant="outline" className="w-full h-16 rounded-none border-4 border-foreground bg-white text-foreground hover:bg-muted font-jetbrains font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all duration-200" onClick={() => {
                                                const latex = formatCombinedToLatex(latexCode, coverLetter);
                                                navigator.clipboard.writeText(latex);
                                                alert("LaTeX do pacote unificado copiado! Cole no Prism.");
                                            }}>
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="mr-3"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path><rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect></svg>
                                                Copiar LaTeX Único
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
