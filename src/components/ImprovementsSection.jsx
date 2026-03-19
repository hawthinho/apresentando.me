import React from 'react';

export const ImprovementsSection = ({ keywordOps, tips }) => {
    return (
        <div className="w-full flex flex-col md:flex-row gap-6 lg:gap-10 mt-12 lg:mt-16 mb-12 lg:mb-16">
            {/* Keywords */}
            <div className="flex-1 bg-background border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex flex-col relative overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-16 border-l-4 border-b-4 border-foreground bg-primary pointer-events-none"></div>
                <div className="p-8 lg:p-12 pb-4 lg:pb-6">
                    <span className="inline-block font-jetbrains font-bold text-[10px] lg:text-xs uppercase tracking-widest bg-foreground text-primary px-3 py-1 mb-4 border-2 border-foreground shadow-[2px_2px_0px_rgba(212,255,0,1)]">Keywords Pivotais</span>
                    <h3 className="font-space font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter leading-tight mb-8">Lexicon de <br/><span className="bg-foreground text-primary px-3 pt-2 pb-1 inline-block mt-3 mb-2 shadow-[4px_4px_0px_0px_rgba(212,255,0,1)]">Conversão.</span></h3>
                </div>
                
                <div className="flex-1 px-8 lg:px-12 pb-8 lg:pb-12 flex flex-col gap-3">
                    {keywordOps.map((op, i) => (
                        <div key={i} className="flex items-center gap-4 border-2 border-foreground bg-white p-3 hover:translate-x-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all group">
                            <div className="shrink-0 w-8 h-8 rounded-full border-2 border-foreground flex items-center justify-center bg-primary text-foreground group-hover:scale-110 transition-transform">
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path></svg>
                            </div>
                            <div className="flex-1 font-jetbrains font-bold uppercase text-xs md:text-sm truncate">{op}</div>
                            <span className="text-[10px] uppercase tracking-widest font-black bg-foreground text-primary px-2 py-0.5 ml-2 border-2 border-foreground">REC</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tips */}
            <div className="flex-1 bg-foreground text-background border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(212,255,0,1)] flex flex-col relative p-8 lg:p-12">
                <span className="inline-block font-jetbrains font-bold text-[10px] lg:text-xs uppercase tracking-widest bg-primary text-foreground px-3 py-1 mb-4 self-start">Plano de Ação Tático</span>
                <h3 className="font-space font-black text-3xl md:text-4xl lg:text-5xl uppercase tracking-tighter leading-tight mb-8 text-white">Conselhos de <br/><span className="text-primary italic border-b-4 border-primary pb-1">Especialista.</span></h3>
                
                <div className="flex flex-col gap-8 flex-1 justify-center">
                    {tips.map((tip, i) => (
                        <div key={i} className="flex gap-4 group items-start">
                            <div className="font-space font-black text-5xl md:text-6xl text-primary opacity-50 group-hover:opacity-100 transition-opacity leading-none mt-1 shrink-0">
                                0{i+1}
                            </div>
                            <p className="font-jetbrains text-sm md:text-base leading-relaxed text-background/90 group-hover:text-white transition-colors uppercase font-medium">
                                {tip}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
