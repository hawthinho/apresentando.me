import React, { useEffect, useState } from 'react';
import { getDefaultModelForProvider, getModelOption, getModelOptions, getProvider, getProviderList } from '../services/providerConfig';
import { clearSettings, getSettings, saveSettings } from '../services/settingsService';

export const SettingsView = ({ onBack }) => {
    const [settings, setSettings] = useState(getSettings());
    const [saved, setSaved] = useState(false);

    const provider = getProvider(settings.provider);
    const modelOptions = getModelOptions(provider.id);
    const selectedModel = getModelOption(provider.id, settings.model);
    const currentApiKey = settings.apiKeys?.[provider.id] || '';

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    const handleProviderChange = (providerId) => {
        const nextModel = settings.models?.[providerId] || getDefaultModelForProvider(providerId);
        const nextApiKey = settings.apiKeys?.[providerId] || '';
        setSettings({
            ...settings,
            provider: providerId,
            apiKey: providerId === 'google' ? nextApiKey : '',
            apiKeys: nextApiKey ? { [providerId]: nextApiKey } : {},
            model: nextModel,
            models: {
                ...(settings.models || {}),
                [providerId]: nextModel
            }
        });
    };

    const handleModelChange = (modelId) => {
        setSettings({
            ...settings,
            model: modelId,
            models: {
                ...(settings.models || {}),
                [provider.id]: modelId
            }
        });
    };

    const handleApiKeyChange = (apiKey) => {
        setSettings({
            ...settings,
            apiKey: provider.id === 'google' ? apiKey : '',
            apiKeys: apiKey ? { [provider.id]: apiKey } : {}
        });
    };

    const handleSave = (e) => {
        e.preventDefault();
        const savedSettings = saveSettings(settings);
        setSettings(savedSettings);
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    const handleClearSettings = () => {
        if (window.confirm('Apagar a API Key ativa e os modelos salvos neste navegador?')) {
            setSettings(clearSettings());
            setSaved(false);
        }
    };

    return (
        <div className="w-full flex flex-col mt-8 animate-in fade-in slide-in-from-bottom-12 duration-500 max-w-5xl mx-auto mb-24">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 mb-8 border-b-4 border-foreground">
                <div>
                    <span className="inline-block font-jetbrains font-bold text-[10px] uppercase tracking-widest bg-foreground text-primary px-3 py-1 mb-4 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Painel de Controle
                    </span>
                    <h1 className="font-space font-black text-5xl md:text-6xl uppercase tracking-tighter leading-none mb-2">
                        Configuração de <br/><span className="bg-foreground text-primary px-3 pt-2 pb-1 inline-block mt-3 mb-2 shadow-[4px_4px_0px_0px_rgba(212,255,0,1)]">Motor IA.</span>
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

            <form onSubmit={handleSave} className="bg-background border-4 border-foreground w-full shadow-[12px_12px_0px_0px_rgba(212,255,0,1)] flex flex-col relative bg-white p-6 md:p-10 lg:p-12">
                <div className="flex flex-col gap-10">
                    <section className="flex flex-col gap-4">
                        <div>
                            <label className="font-space font-black text-2xl uppercase tracking-tighter">
                                Provedor Principal
                            </label>
                            <p className="font-jetbrains font-bold text-xs text-muted-foreground uppercase mt-2">
                                Escolha onde a análise e a geração serão executadas.
                            </p>
                            <div className="mt-4 border-2 border-foreground bg-primary/20 p-3 font-jetbrains text-[10px] font-black uppercase leading-relaxed flex items-start gap-3">
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" className="mt-0.5 shrink-0">
                                    <rect x="3" y="11" width="18" height="10" rx="2"></rect>
                                    <path d="M7 11V8a5 5 0 0 1 10 0v3"></path>
                                </svg>
                                <span>Trava ativa: somente {provider.shortLabel} usa API Key agora. Ao salvar outro provedor, qualquer chave anterior é removida deste navegador.</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {getProviderList().map((item) => {
                                const isActive = item.id === provider.id;
                                return (
                                    <button
                                        key={item.id}
                                        type="button"
                                        onClick={() => handleProviderChange(item.id)}
                                        className={`text-left border-4 p-4 min-h-36 transition-all ${isActive ? 'border-primary bg-foreground text-background shadow-[6px_6px_0px_0px_rgba(212,255,0,1)] -translate-y-1' : 'border-foreground bg-white hover:bg-muted shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]'}`}
                                    >
                                        <div className="flex flex-col items-start gap-3">
                                            <span className={`font-space font-black uppercase text-xl tracking-tighter break-words ${isActive ? 'text-primary' : 'text-foreground'}`}>{item.shortLabel}</span>
                                            <span className={`font-jetbrains font-black uppercase text-[9px] px-2 py-1 border-2 leading-tight max-w-full whitespace-normal ${isActive ? 'border-primary text-primary' : 'border-foreground text-foreground'}`}>
                                                {item.billingLabel}
                                            </span>
                                        </div>
                                        <p className={`font-jetbrains font-bold text-[11px] uppercase leading-relaxed mt-4 ${isActive ? 'text-background/80' : 'text-muted-foreground'}`}>
                                            {item.label}
                                        </p>
                                    </button>
                                );
                            })}
                        </div>
                    </section>

                    <section className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-8 border-t-2 border-dashed border-foreground/30 pt-8">
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-2">
                                <label className="font-space font-black text-2xl uppercase tracking-tighter">
                                    Modelo
                                </label>
                                <div className="relative w-full">
                                    <select
                                        className="h-16 w-full border-4 border-foreground px-4 pr-12 font-jetbrains font-bold uppercase focus:outline-none focus:ring-4 focus:ring-primary/20 bg-background transition-shadow appearance-none cursor-pointer text-xs md:text-sm truncate"
                                        value={selectedModel.id}
                                        onChange={(e) => handleModelChange(e.target.value)}
                                    >
                                        {modelOptions.map((model) => (
                                            <option key={model.id} value={model.id}>{model.label} - {model.badge}</option>
                                        ))}
                                    </select>
                                    <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-foreground">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="6 9 12 15 18 9"></polyline></svg>
                                    </div>
                                </div>

                                <div className="border-4 border-foreground bg-[#F4F4F0] p-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="flex flex-wrap items-center gap-3">
                                        <span className="font-space font-black uppercase text-xl tracking-tighter">{selectedModel.label}</span>
                                        <span className={`font-jetbrains font-black uppercase text-[10px] px-2 py-1 border-2 border-foreground ${selectedModel.badge === 'Pago' ? 'bg-destructive text-destructive-foreground' : 'bg-primary text-foreground'}`}>
                                            {selectedModel.badge}
                                        </span>
                                    </div>
                                    <p className="font-jetbrains font-bold text-xs uppercase leading-relaxed text-muted-foreground mt-3">
                                        {selectedModel.description}
                                    </p>
                                    <p className="font-jetbrains font-black text-[10px] uppercase tracking-widest mt-4">
                                        Custo: {selectedModel.billing}
                                    </p>
                                </div>
                            </div>

                            <div className="flex flex-col gap-2">
                                <label className="font-space font-black text-2xl uppercase tracking-tighter flex items-center gap-3">
                                    {provider.apiKeyLabel}
                                    {!currentApiKey && <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse" title="API Key é necessária"></span>}
                                </label>
                                <div className="bg-muted text-muted-foreground p-3 border-l-4 border-foreground font-jetbrains font-bold text-[10px] uppercase mb-2 flex items-center gap-3 mt-2">
                                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="shrink-0"><path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"></path></svg>
                                    <span>Apenas a chave do provedor ativo fica salva no Local Storage. Curriculo e vaga sao enviados somente ao provedor escolhido.</span>
                                </div>
                                <input
                                    type="password"
                                    placeholder={`Insira sua ${provider.apiKeyLabel}...`}
                                    className="h-16 border-4 border-foreground px-4 font-jetbrains font-bold placeholder:text-muted-foreground focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-foreground"
                                    value={currentApiKey}
                                    onChange={(e) => handleApiKeyChange(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <aside className="border-4 border-foreground bg-white p-5 font-jetbrains text-sm relative shadow-[4px_4px_0px_0px_rgba(212,255,0,1)] h-fit">
                            <div className="absolute -top-3 -left-1 bg-foreground text-primary px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest border-2 border-foreground">
                                Como obter a chave
                            </div>
                            <h4 className="font-space font-black uppercase text-xl mb-3 mt-2 leading-none tracking-tighter">{provider.label}</h4>
                            <ol className="list-decimal list-inside space-y-2 text-xs font-bold uppercase leading-relaxed">
                                {provider.docsSteps.map((step) => (
                                    <li key={step}>{step}</li>
                                ))}
                            </ol>
                            <a
                                href={provider.docsUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="mt-5 h-12 w-full bg-foreground text-primary border-2 border-foreground font-jetbrains font-black uppercase text-xs flex items-center justify-center hover:bg-primary hover:text-foreground transition-colors"
                            >
                                Abrir painel de API Key
                            </a>
                        </aside>
                    </section>

                    <div className="pt-8 border-t-2 border-dashed border-foreground/30 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6">
                        <button
                            type="button"
                            onClick={handleClearSettings}
                            className="h-14 px-6 rounded-none border-4 border-foreground bg-white text-foreground hover:bg-destructive hover:text-destructive-foreground font-jetbrains font-black uppercase text-xs shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center gap-3"
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M3 6h18"></path><path d="M8 6V4h8v2"></path><path d="M19 6l-1 14H6L5 6"></path></svg>
                            Apagar chave salva
                        </button>

                        {saved && (
                            <span className="font-jetbrains font-bold uppercase text-primary bg-foreground px-3 py-1 text-xs tracking-widest animate-pulse border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                Salvo com sucesso!
                            </span>
                        )}
                        <button
                            type="submit"
                            className="h-14 px-8 rounded-none border-4 border-foreground bg-foreground text-primary hover:bg-black font-jetbrains font-black uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none transition-all flex items-center justify-center gap-3"
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
