import React from 'react';

export class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error('ErrorBoundary caught:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minHeight: '100vh',
                    padding: '2rem',
                    background: 'var(--surface-page, #F5F5F7)',
                    fontFamily: 'Figtree, sans-serif',
                    textAlign: 'center',
                    gap: '1rem'
                }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        borderRadius: '50%',
                        background: 'rgba(239, 68, 68, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: '0.5rem'
                    }}>
                        <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <line x1="15" y1="9" x2="9" y2="15" />
                            <line x1="9" y1="9" x2="15" y2="15" />
                        </svg>
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary, #1A1A1A)', margin: 0 }}>
                        Algo deu errado
                    </h1>
                    <p style={{ fontSize: '1rem', color: 'var(--text-secondary, #6B7280)', maxWidth: '400px', margin: 0 }}>
                        Ocorreu um erro inesperado. Por favor, recarregue a página para tentar novamente.
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            marginTop: '0.5rem',
                            padding: '0.75rem 1.5rem',
                            background: 'var(--action-strong, #0F766E)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '8px',
                            fontSize: '1rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            fontFamily: 'inherit'
                        }}
                    >
                        Recarregar Página
                    </button>
                </div>
            );
        }

        return this.props.children;
    }
}
