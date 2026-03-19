import React, { useState, useEffect } from 'react';

const STEPS = [
    { id: 'extract', label: 'Extraindo conteúdo do PDF' },
    { id: 'structure', label: 'Analisando estrutura do currículo' },
    { id: 'gemini', label: 'Análise Inteligente Gemini' },
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
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(15, 118, 110, 0.4); /* Subtle teal tint */
          backdrop-filter: blur(12px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
          animation: fadeIn 0.4s ease-out;
        }

        .loading-card {
          background-color: var(--surface-card);
          border-radius: var(--radius-2xl);
          padding: var(--space-12);
          width: 90%;
          max-width: 480px;
          box-shadow: var(--shadow-xl);
          display: flex;
          flex-direction: column;
          align-items: center;
          border: 1px solid var(--border-subtle);
        }

        .loading-title {
            font-size: 1.5rem;
            font-weight: 800;
            color: var(--text-primary);
            margin-bottom: var(--space-8);
            letter-spacing: -0.5px;
        }

        /* Scanner Animation */
        .scanner-container {
            width: 120px;
            height: 150px;
            margin-bottom: var(--space-8);
            position: relative;
        }

        .document-outline {
            width: 100%;
            height: 100%;
            border: 3px solid var(--border-default);
            border-radius: var(--radius-lg);
            background-color: var(--surface-subtle);
            position: relative;
            overflow: hidden;
            display: flex;
            flex-direction: column;
            gap: 12px;
            padding: 16px;
        }

        .document-lines .line {
            height: 4px;
            background-color: var(--border-subtle);
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
            background: linear-gradient(to bottom, transparent, var(--action-primary), transparent);
            box-shadow: 0 0 15px var(--action-primary);
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
          gap: var(--space-4);
        }

        .loading-step {
          display: flex;
          align-items: center;
          gap: var(--space-4);
          opacity: 0.4;
          transition: all 0.3s ease;
        }

        .loading-step.current {
          opacity: 1;
          transform: translateX(4px);
        }

        .loading-step.completed {
          opacity: 0.8;
          color: var(--action-strong);
        }

        .step-indicator {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: var(--surface-subtle);
          flex-shrink: 0;
        }

        .completed .step-indicator {
          background-color: var(--action-primary);
          color: #0d3509;
        }

        .current .step-indicator {
          background-color: var(--action-strong);
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
            background-color: var(--text-muted);
            border-radius: 50%;
        }

        .step-label {
          font-size: 0.9375rem;
          font-weight: 600;
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
