import React, { useState, useRef, useCallback } from 'react';

export const FileUpload = ({ file, onFileSelect }) => {
    const [dragActive, setDragActive] = useState(false);
    const [error, setError] = useState('');
    const inputRef = useRef(null);
    const dropRef = useRef(null);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
        else if (e.type === 'dragleave') setDragActive(false);
    }, []);

    const validateFile = (f) => {
        if (!f) return false;
        if (f.type !== 'application/pdf') {
            setError('FORMATO INVÁLIDO — APENAS ARQUIVOS .PDF');
            return false;
        }
        if (f.size > 10 * 1024 * 1024) {
            setError('ARQUIVO EXCEDE 10MB — COMPRIMA E TENTE NOVAMENTE');
            return false;
        }
        setError('');
        return true;
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files?.[0]) {
            const f = e.dataTransfer.files[0];
            if (validateFile(f)) onFileSelect?.(f);
        }
    }, [onFileSelect]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files?.[0]) {
            const f = e.target.files[0];
            if (validateFile(f)) onFileSelect?.(f);
        }
    };

    const onButtonClick = () => inputRef.current?.click();

    const formatFileSize = (bytes) => {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
    };

    const removeFile = (e) => {
        e.stopPropagation();
        onFileSelect?.(null);
        if (inputRef.current) inputRef.current.value = '';
        setError('');
    };

    return (
        <div className="w-full h-full flex flex-col flex-1">
            <input ref={inputRef} type="file" accept=".pdf" className="hidden" onChange={handleChange} id="file-upload-input" />

            <div
                ref={dropRef}
                className={`
                    w-full flex-1 flex flex-col relative overflow-hidden cursor-pointer
                    transition-all duration-300 ease-out min-h-[260px] md:min-h-[300px] lg:min-h-[360px]
                    focus-within:ring-4 focus-within:ring-primary
                    ${error
                        ? 'border-4 border-destructive bg-destructive/5'
                        : dragActive
                            ? 'border-4 border-primary bg-foreground shadow-[inset_0_0_0_6px_hsl(var(--primary))]'
                            : file
                                ? 'border-4 border-foreground bg-background'
                                : 'border-4 border-dashed border-foreground/25 bg-background hover:border-foreground hover:bg-muted/30'
                    }
                `}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                onClick={!file ? onButtonClick : undefined}
                role="button"
                tabIndex={0}
                aria-label="Upload de currículo em PDF"
                onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onButtonClick(); }}
            >
                {/* Scanner line — empty state only */}
                {!file && !dragActive && (
                    <>
                        <div className="absolute top-0 left-0 w-full h-[3px] bg-primary z-20 opacity-40" style={{ animation: 'scanner 4s cubic-bezier(0.4,0,0.2,1) infinite' }} />
                        <style>{`
                            @keyframes scanner {
                                0% { top: 0%; opacity: 0; }
                                8% { opacity: 0.6; }
                                92% { opacity: 0.6; }
                                100% { top: 100%; opacity: 0; }
                            }
                        `}</style>
                    </>
                )}

                {/* Corner stamp */}
                <div className="absolute bottom-3 right-3 font-space font-black text-[10px] uppercase tracking-[0.3em] text-foreground/10 pointer-events-none select-none rotate-[-8deg]">
                    .PDF
                </div>

                {!file ? (
                    /* ── Empty State ────────────────────────── */
                    <div className="flex-1 flex flex-col items-center justify-center text-center p-6 md:p-10 lg:p-14 relative z-10 group">
                        {/* Upload icon */}
                        <div className={`
                            mb-8 w-20 h-20 flex items-center justify-center
                            border-4 border-foreground transition-all duration-300
                            ${dragActive
                                ? 'bg-primary text-foreground scale-110 shadow-none rotate-3'
                                : 'bg-white text-foreground shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] group-hover:bg-primary group-hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] group-hover:-translate-y-1'
                            }
                        `}>
                            {dragActive ? (
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="square" d="M12 3v12M12 3l-4 4M12 3l4 4" />
                                    <path d="M4 15v4a1 1 0 001 1h14a1 1 0 001-1v-4" />
                                </svg>
                            ) : (
                                <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                                    <path strokeLinecap="square" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                                </svg>
                            )}
                        </div>

                        <h3 className={`font-space font-black uppercase tracking-tight leading-none transition-colors duration-200 ${dragActive ? 'text-3xl md:text-5xl text-primary' : 'text-2xl md:text-4xl lg:text-5xl text-foreground'}`}>
                            {dragActive ? 'SOLTE AGORA' : 'ARRASTE SEU CV'}
                        </h3>

                        <p className="font-jetbrains text-[10px] md:text-[11px] lg:text-xs font-bold uppercase tracking-widest text-muted-foreground mt-4 group-hover:text-foreground transition-colors">
                            ou clique para selecionar • PDF até 10MB
                        </p>

                        {/* Decorative dashes */}
                        <div className="mt-6 flex items-center gap-2 text-foreground/15">
                            {[...Array(7)].map((_, i) => (
                                <div key={i} className="w-4 h-[3px] bg-current" />
                            ))}
                        </div>
                    </div>
                ) : (
                    /* ── File Loaded State ─────────────────── */
                    <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-10 lg:p-12 relative z-10 animate-in fade-in zoom-in-95 duration-300">
                        {/* Receipt Card */}
                        <div className="w-full max-w-sm lg:max-w-md bg-white border-4 border-foreground shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
                            {/* Corner fold */}
                            <div className="absolute top-0 right-0 w-0 h-0 border-l-[28px] border-l-transparent border-t-[28px] border-t-foreground/10" />

                            {/* Status bar */}
                            <div className="bg-primary border-b-4 border-foreground px-4 py-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <span className="w-2.5 h-2.5 bg-foreground animate-pulse" />
                                    <span className="font-jetbrains font-black text-[10px] uppercase tracking-widest text-foreground">
                                        Documento Carregado
                                    </span>
                                </div>
                                <svg className="w-5 h-5 text-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3}>
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>

                            {/* File info */}
                            <div className="p-6 flex flex-col items-center text-center">
                                <div className="bg-foreground text-primary p-3 mb-4 border-2 border-foreground">
                                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                        <polyline points="14 2 14 8 20 8" />
                                        <line x1="16" y1="13" x2="8" y2="13" />
                                        <line x1="16" y1="17" x2="8" y2="17" />
                                    </svg>
                                </div>

                                <span className="font-space font-black uppercase text-lg md:text-xl leading-tight truncate w-full max-w-[280px]">
                                    {file.name}
                                </span>

                                <div className="flex items-center gap-3 mt-3">
                                    <span className="font-jetbrains text-[10px] font-bold bg-foreground text-background px-2 py-0.5 uppercase">
                                        {formatFileSize(file.size)}
                                    </span>
                                    <span className="font-jetbrains text-[10px] font-bold border-2 border-foreground px-2 py-0.5 uppercase">
                                        PDF
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Remove button */}
                        <button
                            className="mt-4 w-full max-w-sm flex items-center justify-center gap-2 border-4 border-foreground bg-white text-foreground font-jetbrains font-black text-xs uppercase px-4 py-3 hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none"
                            onClick={removeFile}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                <line x1="18" y1="6" x2="6" y2="18" />
                                <line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                            Remover e Selecionar Outro
                        </button>
                    </div>
                )}
            </div>

            {/* Error feedback */}
            {error && (
                <div className="mt-3 border-l-[6px] border-destructive bg-white text-destructive font-jetbrains font-bold uppercase text-[11px] p-3 flex items-center gap-3 shadow-[3px_3px_0px_0px_rgba(239,68,68,1)] animate-in slide-in-from-top-2">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                        <line x1="12" y1="9" x2="12" y2="13" />
                        <line x1="12" y1="17" x2="12.01" y2="17" />
                    </svg>
                    {error}
                </div>
            )}
        </div>
    );
};
