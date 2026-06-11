import React from 'react';

export const StrengthsSection = ({ strengths }) => {
    return (
        <div className="bg-white border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-8 lg:p-12 mt-12 lg:mt-16 relative">
            <div className="absolute -top-5 left-8 bg-primary text-foreground font-jetbrains font-black text-xs px-4 py-2 uppercase tracking-widest border-4 border-foreground flex items-center gap-2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
                </svg>
                Pontos fortes identificados
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mt-6">
                {strengths.map((s, i) => (
                    <div key={i} className="flex items-start gap-4 p-4 border-2 border-foreground hover:bg-muted transition-colors group">
                        <div className="w-10 h-10 shrink-0 bg-foreground text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-foreground transition-colors border-2 border-foreground">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div>
                            <span className="font-space font-black uppercase text-lg block mb-1">{s.title}</span>
                            <span className="font-jetbrains text-sm text-muted-foreground">{s.description}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
