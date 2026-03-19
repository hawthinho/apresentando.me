import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../services/settingsService';

export const SettingsView = ({ onBack }) => {
    const [settings, setSettings] = useState(getSettings());
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleSave = (e) => {
        e.preventDefault();
        saveSettings(settings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="w-full flex flex-col mt-8 animate-in fade-in slide-in-from-bottom-12 duration-500 max-w-4xl mx-auto mb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b-4 border-foreground">
                <div>
                    <span className="inline-block font-jetbrains font-bold text-[10px] uppercase tracking-widest bg-foreground text-primary px-3 py-1 mb-4 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Painel de Controle
                    </span>
                    <h1 className="font-space font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none">
                        Configuração de <br/><span className="text-primary italic border-b-4 border-primary pb-1 pr-4 inline-block mt-2">Motor IA.</span>
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

            <form onSubmit={handleSave} className="bg-background border-4 border-foreground w-full shadow-[12px_12px_0px_0px_rgba(212,255,0,1)] flex flex-col relative bg-white p-8 md:p-12">
                <div className="flex flex-col gap-8">
                    
                    <div className="flex flex-col gap-2 relative">
                        <label className="font-space font-black text-2xl uppercase tracking-tighter">
                            Provedor Principal
                        </label>
                        <p className="font-jetbrains font-bold text-xs text-muted-foreground uppercase mb-2">
                            Selecione a tecnologia de inteligência artificial
                        </p>
                        <select 
                            className="h-16 border-4 border-foreground px-4 font-jetbrains font-bold uppercase focus:outline-none focus:ring-4 focus:ring-primary/20 bg-background transition-shadow appearance-none cursor-pointer"
                            value={settings.provider}
                            onChange={(e) => setSettings({...settings, provider: e.target.value})}
                        >
                            <option value="google">Google Generative AI (Gemini)</option>
                        </select>
                        <div className="absolute right-6 top-[84px] pointer-events-none text-foreground">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                        </div>
                    </div>

                    <div className="flex flex-col gap-2">
                        <label className="font-space font-black text-2xl uppercase tracking-tighter flex items-center gap-3">
                            Chave de Acesso (API Key)
                            {!settings.apiKey && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title="API Key é necessária"></span>}
                        </label>
                        <div className="bg-muted text-muted-foreground p-3 border-l-4 border-foreground font-jetbrains font-bold text-[10px] uppercase mb-4 flex items-center gap-3 mt-2">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                            <span>Sua chave é salva EXCLUSIVAMENTE no Local Storage do navegador. Nenhum dado é enviado aos nossos servidores.</span>
                        </div>

                        {settings.provider === 'google' && (
                            <div className="bg-white border-4 border-foreground p-5 font-jetbrains text-sm mb-4 relative shadow-[4px_4px_0px_0px_rgba(212,255,0,1)]">
                                <div className="absolute -top-3 -left-1 bg-foreground text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-2 border-foreground">
                                    Tutorial Rápido
                                </div>
                                <h4 className="font-space font-black uppercase text-xl mb-2 mt-1 leading-none tracking-tighter">Não tem uma chave? É grátis!</h4>
                                <ol className="list-decimal list-inside space-y-1 text-xs font-bold uppercase">
                                    <li>Acesse <a href="https://aistudio.google.com" target="_blank" rel="noopener noreferrer" className="underline decoration-2 decoration-foreground hover:bg-foreground hover:text-white transition-all px-1">aistudio.google.com</a></li>
                                    <li>Faça login com sua conta Google</li>
                                    <li>No menu, clique em <strong className="bg-foreground text-primary px-1">Get API key</strong> e depois <strong className="bg-foreground text-primary px-1">Create API key</strong></li>
                                </ol>
                            </div>
                        )}
                        <input 
                            type="password"
                            placeholder="Insira sua API Key..."
                            className="h-16 border-4 border-foreground px-4 font-jetbrains font-bold placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-foreground"
                            value={settings.apiKey}
                            onChange={(e) => setSettings({...settings, apiKey: e.target.value})}
                            required
                        />
                    </div>

                    <div className="mt-8 pt-8 border-t-2 border-dashed border-foreground/30 flex justify-end items-center gap-6">
                        {saved && (
                            <span className="font-jetbrains font-bold uppercase text-primary bg-foreground px-3 py-1 text-xs tracking-widest animate-pulse border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                Salvo com sucesso!
                            </span>
                        )}
                        <button 
                            type="submit" 
                            className="h-14 px-8 rounded-none border-4 border-foreground bg-foreground text-primary hover:bg-black font-jetbrains font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center gap-3"
                        >
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                            Gravar Configuração
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};
