import React from 'react';

const getProbColor = (p) => {
    if (p === 'Alta') return 'text-primary';
    if (p === 'Média') return 'text-orange-500';
    return 'text-destructive';
};

export const ScoreSection = ({ score, probability, reason }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const normalizedScore = Math.max(0, Math.min(100, score || 0));
    const offset = circumference * (1 - normalizedScore / 100);

    const getStrokeColor = (s) => s >= 80 ? 'stroke-primary' : s >= 50 ? 'stroke-orange-500' : 'stroke-destructive';

    return (
        <div className="flex flex-col md:flex-row gap-6 lg:gap-10 w-full">
            {/* Gauge Card */}
            <div className="flex-1 bg-white border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 lg:p-12 flex flex-col items-center justify-center relative">
                <div className="absolute top-0 left-0 bg-foreground text-background font-jetbrains font-bold text-[10px] lg:text-xs px-3 py-1 uppercase tracking-widest flex items-center gap-2">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M12 2v20M2 12h20" />
                    </svg>
                    ATS SCORE
                </div>
                
                <div className="relative mt-8">
                    <svg className="w-56 h-56 -rotate-90 drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]" viewBox="0 0 160 160">
                        <circle className="stroke-foreground fill-transparent" strokeWidth="16" cx="80" cy="80" r={radius} />
                        <circle
                            className={`${getStrokeColor(normalizedScore)} fill-transparent transition-all duration-1000 ease-out`}
                            strokeWidth="16" strokeLinecap="square" cx="80" cy="80" r={radius}
                            strokeDasharray={circumference} strokeDashoffset={offset}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-white m-4 rounded-full border-4 border-foreground">
                        <span className="font-space font-black text-6xl tracking-tighter leading-none mt-2">{score || 0}</span>
                        <span className="font-jetbrains text-sm font-bold text-foreground">/ 100</span>
                    </div>
                </div>
                <div className="mt-8 font-jetbrains font-black text-2xl tracking-widest uppercase border-b-4 border-foreground pb-1 inline-block">
                    {normalizedScore >= 80 ? 'EXCELENTE' : normalizedScore >= 50 ? 'BOM' : 'OTIMIZAR'}
                </div>
            </div>

            {/* Status Card */}
            <div className="flex-1 bg-foreground text-background border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 lg:p-12 flex flex-col relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10">
                    <svg width="200" height="200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
                        <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
                    </svg>
                </div>
                
                <div className="inline-block bg-background text-foreground font-jetbrains font-bold text-[10px] lg:text-xs px-3 py-1 uppercase tracking-widest self-start mb-6">
                    Status da Triagem
                </div>
                
                <div>
                    <div className={`font-space font-black text-6xl uppercase tracking-tighter ${getProbColor(probability)}`}>
                        {probability}
                    </div>
                    <div className="font-jetbrains font-bold text-xs text-muted-foreground uppercase tracking-widest mt-2">
                        Probabilidade de Leitura ATS
                    </div>
                </div>

                <div className="mt-8 border-t-2 border-dashed border-background/20 pt-6 flex-1 z-10">
                    <h3 className="font-jetbrains font-black text-primary uppercase text-sm mb-3">Diagnóstico de Formato</h3>
                    <p className="font-jetbrains text-sm md:text-base leading-relaxed text-background/90">{reason}</p>
                </div>

                <div className="mt-8 flex flex-col gap-3 z-10">
                    <div className="flex items-center gap-3 font-jetbrains text-xs font-bold uppercase">
                        <div className="bg-primary text-foreground p-1 border-2 border-background">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        Perfeita leitura ATS
                    </div>
                    <div className="flex items-center gap-3 font-jetbrains text-xs font-bold uppercase">
                        <div className="bg-primary text-foreground p-1 border-2 border-background">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12"></polyline></svg>
                        </div>
                        Estrutura padrão identificada
                    </div>
                </div>
            </div>
        </div>
    );
};
