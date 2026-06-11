import React from 'react';

export const DonationBanner = () => {
  return (
    <section className="w-full mt-8 mb-4">
      <div
        className="bg-primary text-primary-foreground border-4 border-foreground p-4 md:p-6 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] flex flex-col md:flex-row items-center justify-between gap-4 transition-transform hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] duration-200"
        role="complementary"
        aria-label="Doação"
      >
        <div className="space-y-1 text-center md:text-left flex-1">
          <h2 className="text-xl md:text-2xl font-space font-black uppercase tracking-tight">
            O SISTEMA É DE GRAÇA, MAS AS MINHAS OLHEIRAS NÃO.
          </h2>
          <p className="font-jetbrains text-xs md:text-sm font-bold uppercase opacity-90 max-w-2xl leading-relaxed">
            CURTIU O PROJETO? ELE DEU UM TRABALHO PARA FICAR PRONTO. QUER MANDAR UM PIX PARA FINANCIAR MEU CAFÉ (E MINHA TERAPIA)? VOCÊ AINDA GANHA O PASSAPORTE VIP PARA O CÉU DOS VIBECODERS.
          </p>
        </div>

        <a
          href="https://livepix.gg/hawth"
          target="_blank"
          rel="noopener noreferrer"
          className="shrink-0 group relative inline-flex items-center justify-center bg-background text-foreground border-4 border-foreground px-6 py-3 font-jetbrains font-bold text-sm uppercase transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] active:scale-95 overflow-hidden"
          aria-label="Fazer uma doação via LivePix"
        >
          <span className="relative z-10 flex items-center gap-2">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            PAGAR TERAPIA
          </span>
          {/* Brutalist hover fill effect */}
          <div className="absolute inset-0 bg-foreground translate-y-[100%] group-hover:translate-y-0 transition-transform duration-200 ease-in-out" />
          <span className="absolute inset-0 z-10 flex items-center justify-center gap-2 text-background opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" strokeLinejoin="miter">
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            MANDAR PIX!
          </span>
        </a>
      </div>
    </section>
  );
};
