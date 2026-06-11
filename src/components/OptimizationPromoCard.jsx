import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

export const OptimizationPromoCard = ({
    onOptimize,
    badge = "UPGRADE DO SISTEMA",
    title = <>TRANSFORME SUA ANÁLISE EM <br/><span className="bg-primary text-foreground px-2 inline-block -rotate-2 mt-2">CONTRATAÇÃO.</span></>,
    description = "Não seja descartado por algoritmos genéricos. Nossa IA reescreve e formata seu currículo para superar os filtros ATS mais exigentes do mercado global.",
    benefits = [
        "Otimização automática de palavras-chave",
        "Reescrita algorítmica de experiências",
        "Design LaTeX premium blindado",
        "Checklist alinhado à Gupy"
    ],
    initialCount = null
}) => {
    const [count, setCount] = useState(initialCount);

    useEffect(() => {
        if (initialCount === null) return;
        const interval = setInterval(() => {
            if (Math.random() > 0.6) setCount(prev => prev + 1);
        }, 4000);
        return () => clearInterval(interval);
    }, [initialCount]);

    return (
        <div className="w-full mt-12 bg-foreground text-background border-4 border-primary p-8 md:p-16 relative overflow-hidden group shadow-[12px_12px_0px_0px_rgba(212,255,0,1)] mb-12">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '32px 32px' }}></div>
            
            <div className="relative z-10 flex flex-col lg:flex-row gap-12 lg:gap-24 items-center">
                <div className="flex-1 w-full">
                    <div className="flex flex-col md:flex-row md:items-center gap-4 mb-8">
                        <span className="inline-block self-start font-jetbrains font-bold text-[10px] uppercase tracking-widest bg-primary text-foreground px-3 py-1 border-2 border-primary">
                            {badge}
                        </span>
                        {initialCount !== null && (
                            <span className="font-jetbrains font-bold text-xs uppercase tracking-widest flex items-center gap-2 text-primary border-2 border-primary/30 px-3 py-1">
                                <span className="w-2 h-2 bg-primary animate-pulse relative before:absolute before:bg-primary before:w-4 before:h-4 before:-left-1 before:-top-1 before:animate-ping before:opacity-50"></span>
                                {count.toLocaleString()} otimizações hoje
                            </span>
                        )}
                    </div>

                    <h2 className="font-space font-black text-4xl md:text-6xl uppercase tracking-tighter leading-[0.85] mb-6 text-white text-balance">
                        {title}
                    </h2>
                    <p className="font-jetbrains text-sm md:text-base text-background/80 md:w-5/6 leading-relaxed uppercase font-bold border-l-4 border-primary pl-4 my-8">
                        {description}
                    </p>

                    <div className="mt-8 flex flex-col gap-4">
                        {benefits.slice(0, 4).map((benefit, i) => (
                            <div key={i} className="flex items-center gap-3">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" className="text-primary shrink-0"><polyline points="20 6 9 17 4 12"></polyline></svg>
                                <span className="font-jetbrains font-bold uppercase text-xs md:text-sm tracking-widest text-[#F4F4F0]">{benefit}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="w-full lg:w-[450px] shrink-0 border-4 border-foreground bg-white text-foreground p-8 md:p-10 flex flex-col justify-center relative transform lg:rotate-2 shadow-[-12px_12px_0px_0px_rgba(212,255,0,1)] mx-auto lg:mx-0">
                    <span className="font-jetbrains font-bold text-[10px] uppercase tracking-widest text-muted-foreground border-b-2 border-foreground pb-2 self-start mb-6">Ação recomendada</span>

                    <Button onClick={onOptimize} className="w-full rounded-none min-h-[5rem] py-4 bg-primary hover:bg-black hover:text-primary text-foreground border-4 border-foreground font-jetbrains font-black uppercase text-lg sm:text-lg md:text-2xl tracking-wider transition-all shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1.5 active:translate-x-1.5 active:shadow-none mt-2 whitespace-normal h-auto leading-tight md:leading-normal text-center">
                        OTIMIZAR CURRÍCULO
                    </Button>

                    <div className="mt-8 flex items-center justify-center gap-2 font-jetbrains font-bold text-[10px] uppercase text-muted-foreground bg-muted py-2 px-2 border-2 border-dashed border-muted-foreground text-center">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
                        Otimização instantânea via IA
                    </div>
                </div>
            </div>
        </div>
    );
};
