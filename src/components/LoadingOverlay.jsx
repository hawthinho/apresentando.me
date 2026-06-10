import React, { useState, useEffect } from 'react';

const STEPS = [
    { id: 'extract', label: 'Extraindo conteúdo do PDF' },
    { id: 'structure', label: 'Analisando estrutura do currículo' },
    { id: 'ai', label: 'Análise inteligente por IA' },
    { id: 'match', label: 'Calculando Match Score' },
    { id: 'report', label: 'Gerando relatório final' }
];

export const LoadingOverlay = () => {
    const [currentStepIndex, setCurrentStepIndex] = useState(0);

    useEffect(() => {
        // Artificial delay to let the animations play out nicely as requested
        const interval = setInterval(() => {
            setCurrentStepIndex((prev) => {
                if (prev < STEPS.length - 1) return prev + 1;
                return prev;
            });
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="loading-overlay-root">
            <div className="loading-card">
                {/* Scanning Animation */}
                <div className="scanner-container">
                    <div className="document-outline">
                        <div className="document-lines">
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                            <div className="line"></div>
                        </div>
                        <div className="scan-line"></div>
                    </div>
                </div>

                <h2 className="loading-title">Analisando seu Perfil</h2>

                <div className="loading-steps">
                    {STEPS.map((step, index) => {
                        const isCompleted = index < currentStepIndex;
                        const isCurrent = index === currentStepIndex;

                        return (
                            <div key={step.id} className={`loading-step ${isCompleted ? 'completed' : ''} ${isCurrent ? 'current' : ''}`}>
                                <div className="step-indicator">
                                    {isCompleted ? (
                                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4">
                                            <polyline points="20 6 9 17 4 12"></polyline>
                                        </svg>
                                    ) : isCurrent ? (
                                        <div className="step-dot-active"></div>
                                    ) : (
                                        <div className="step-dot"></div>
                                    )}
                                </div>
                                <span className="step-label">{step.label}</span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <style>{`
        .loading-overlay-root {
          position: fixed;
          inset: 0;
          min-height: 100dvh;
          padding: 1.5rem;
          box-sizing: border-box;
          background-color: rgba(15, 118, 110, 0.32);
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.4s ease-out;
        }

        .loading-card {
          background-color: hsl(var(--background));
          border-radius: 0;
          padding: 2rem;
          width: min(92vw, 440px);
          box-sizing: border-box;
          box-shadow: 8px 8px 0 rgba(0, 0, 0, 1);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border: 4px solid hsl(var(--foreground));
        }

        .loading-title {
            font-size: 1.5rem;
            font-weight: 800;
            color: hsl(var(--foreground));
            margin-bottom: 2rem;
            letter-spacing: 0;
            text-align: center;
        }

        /* Scanner Animation */
        .scanner-container {
            width: 120px;
            height: 150px;
            margin-bottom: 2rem;
            position: relative;
        }

        .document-outline {
            width: 100%;
            height: 100%;
            border: 3px solid hsl(var(--foreground));
            border-radius: 0;
            background-color: hsl(var(--muted));
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
        }

        .document-lines .line {
            height: 4px;
            background-color: hsl(var(--foreground) / 0.25);
            border-radius: 2px;
        }

        .line:nth-child(1) { width: 80%; }
        .line:nth-child(2) { width: 90%; }
        .line:nth-child(3) { width: 70%; }
        .line:nth-child(4) { width: 85%; }

        .scan-line {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 4px;
            background: linear-gradient(to bottom, transparent, hsl(var(--primary)), transparent);
            box-shadow: 0 0 15px hsl(var(--primary));
            animation: scan 2s infinite ease-in-out;
        }

        @keyframes scan {
            0% { top: 0; }
            50% { top: 100%; }
            100% { top: 0; }
        }

        /* Steps Styling */
        .loading-steps {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .loading-step {
          display: flex;
          align-items: center;
          gap: 1rem;
          opacity: 0.4;
          transition: all 0.3s ease;
        }

        .loading-step.current {
          opacity: 1;
          transform: translateX(4px);
        }

        .loading-step.completed {
          opacity: 0.8;
          color: hsl(var(--foreground));
        }

        .step-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: hsl(var(--muted));
          flex-shrink: 0;
        }

        .completed .step-indicator {
          background-color: hsl(var(--primary));
          color: #0d3509;
        }

        .current .step-indicator {
          background-color: hsl(var(--foreground));
        }

        .step-dot-active {
            width: 8px;
            height: 8px;
            background-color: white;
            border-radius: 50%;
            animation: pulse 1s infinite alternate;
        }

        .step-dot {
            width: 6px;
            height: 6px;
            background-color: hsl(var(--foreground) / 0.5);
            border-radius: 50%;
        }

        .step-label {
          font-size: 0.9375rem;
          font-weight: 600;
          color: hsl(var(--foreground));
        }

        @media (max-width: 520px) {
          .loading-card {
            padding: 1.5rem;
          }

          .scanner-container {
            width: 96px;
            height: 120px;
          }

          .loading-title {
            font-size: 1.25rem;
          }
        }

        .completed .step-label {
          font-weight: 500;
        }

        @keyframes pulse {
            from { transform: scale(0.8); opacity: 0.6; }
            to { transform: scale(1.2); opacity: 1; }
        }

        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
        </div>
    );
};
