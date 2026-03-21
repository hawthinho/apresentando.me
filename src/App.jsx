import React, { useState, useEffect } from 'react';
import './index.css';

import { AnalysisCard } from './components/AnalysisCard';
import { Navbar } from './components/Navbar';

import { ResultsView } from './components/ResultsView';
import { LoadingOverlay } from './components/LoadingOverlay';
import { ResumeEditor } from './components/ResumeEditor';
import { HistoryView } from './components/HistoryView';
import { OptimizationView } from './components/OptimizationView';
import { SettingsView } from './components/SettingsView';
import { DonationBanner } from './components/DonationBanner';

import { analyzeResume } from './services/aiService';
import { extractTextFromPdf } from './services/pdfService';
import { getAnalysisHistory, saveAnalysis, updateAnalysis } from './services/historyService';

/* ── Error Toast ─────────────────────────────────────────── */
const ErrorToast = ({ message, onDismiss }) => {
  if (!message) return null;

  React.useEffect(() => {
    const timer = setTimeout(onDismiss, 6000);
    return () => clearTimeout(timer);
  }, [message, onDismiss]);

  return (
    <div className="fixed bottom-4 right-4 z-[100] bg-destructive text-destructive-foreground border-4 border-foreground p-4 font-jetbrains font-bold uppercase shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3 animate-in slide-in-from-bottom-5" role="alert">
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="12" />
        <line x1="12" y1="16" x2="12.01" y2="16" />
      </svg>
      <span className="flex-1">{message}</span>
      <button onClick={onDismiss} className="hover:text-background transition-colors" aria-label="Fechar">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>
    </div>
  );
};

function App() {
  const [file, setFile] = useState(null);
  const [jobDescription, setJobDescription] = useState('');
  const [view, setView] = useState('upload'); // 'upload', 'results', 'editor', 'history', 'optimization', 'settings'
  const [analysisData, setAnalysisData] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const [editingResumeData, setEditingResumeData] = useState(null);

  const [history, setHistory] = useState([]);
  const [activeAnalysisId, setActiveAnalysisId] = useState(null);

  useEffect(() => {
    setHistory(getAnalysisHistory());
  }, [view]);

  const handleOpenEditor = (resumeData) => {
    setEditingResumeData(resumeData);
    setView('editor');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveEditedResume = (updatedData) => {
    setEditingResumeData(updatedData);
    if (activeAnalysisId) {
        updateAnalysis(activeAnalysisId, { editedResumeData: updatedData });
        setHistory(getAnalysisHistory());
    }
    setView('optimization');
  };

  const handleCloseEditor = () => {
    setView('optimization');
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError('POR FAVOR, FORNEÇA UM ARQUIVO DE CURRÍCULO [PDF].');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const text = await extractTextFromPdf(file);
      setResumeText(text);

      const result = await analyzeResume(text, jobDescription);
      await new Promise(resolve => setTimeout(resolve, 3000));

      setAnalysisData(result);
      setEditingResumeData(null);

      const savedItem = saveAnalysis({
        fileName: file?.name || 'Currículo.pdf',
        atsScore: result.atsScore,
        matchScore: result.matchScore,
        data: result,
        resumeText: text,
        jobDescription
      });
      setActiveAnalysisId(savedItem.id);
      setHistory(getAnalysisHistory());

      setView('results');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setError(err.message || 'ERRO DE SISTEMA NO PROCESSAMENTO DA IA.');
      if (err.message && err.message.includes('API')) {
          setTimeout(() => setView('settings'), 3000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-jetbrains selection:bg-primary selection:text-primary-foreground relative">
      <ErrorToast message={error} onDismiss={() => setError(null)} />

      <Navbar 
          onOpenHistory={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView('history');
          }} 
          onOpenSettings={() => {
              window.scrollTo({ top: 0, behavior: 'smooth' });
              setView('settings');
          }}
      />

      <main className={`pt-8 pb-16 px-4 md:px-8 lg:px-12 mx-auto transition-all duration-300 ${view === 'results' || view === 'editor' ? 'max-w-[90rem]' : 'max-w-6xl'}`}>
        {view === 'upload' && (
          <AnalysisCard
            file={file}
            onFileSelect={setFile}
            jobDescription={jobDescription}
            onChangeJobDescription={setJobDescription}
            onAnalyze={handleAnalyze}
          />
        )}

        {view === 'settings' && (
            <SettingsView onBack={() => setView('upload')} />
        )}

        {view === 'results' && (() => {
            const activeItem = history.find(item => item.id === activeAnalysisId);
            return (
                <ResultsView
                    data={analysisData}
                    resumeText={resumeText}
                    jobDescription={jobDescription}
                    onBack={() => setView('upload')}
                    onOpenEditor={handleOpenEditor}
                    editedResumeData={editingResumeData}
                    isOptimized={!!activeItem?.optimizedContent}
                    onNavigateOptimization={() => {
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                        setView('optimization');
                    }}
                />
            );
        })()}

        {view === 'history' && (
            <HistoryView 
                history={history} 
                onSelectAnalysis={(item) => {
                    setAnalysisData(item.data);
                    setResumeText(item.resumeText);
                    setJobDescription(item.jobDescription || '');
                    setActiveAnalysisId(item.id);
                    setEditingResumeData(item.editedResumeData || null);
                    setView('results');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                }} 
                onBack={() => setView('upload')} 
            />
        )}

        {view === 'optimization' && (() => {
            const activeItem = history.find(item => item.id === activeAnalysisId);
            return (
                <OptimizationView 
                    resumeText={resumeText} 
                    jobDescription={jobDescription} 
                    onOpenEditor={handleOpenEditor} 
                    editedResumeData={editingResumeData} 
                    initialOptimizedContent={activeItem?.optimizedContent}
                    initialLatexCode={activeItem?.latexCode}
                    initialImprovements={activeItem?.improvements}
                    initialImpact={activeItem?.impact}
                    initialCoverLetter={activeItem?.coverLetter}
                    onOptimizationComplete={(optData) => {
                        if (activeAnalysisId) {
                            updateAnalysis(activeAnalysisId, optData);
                            setHistory(getAnalysisHistory());
                        }
                    }}
                    onBack={() => setView('results')} 
                />
            );
        })()}
        
        {view === 'editor' && (
          <ResumeEditor
            resumeData={editingResumeData}
            onUpdate={setEditingResumeData}
            onBack={handleCloseEditor}
            onSave={handleSaveEditedResume}
          />
        )}

        <DonationBanner />

        {/* Footer */}
        <footer className="w-full mt-12 pt-8 pb-4 border-t-2 border-foreground/10 flex flex-col items-center justify-center gap-2">
            <span className="font-jetbrains text-xs md:text-sm font-bold uppercase tracking-widest text-muted-foreground text-center">
                vibecodado com ❤️
            </span>
            <a 
                href="https://github.com/hawthinho/apresentando.me" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="mt-2 font-jetbrains text-xs font-black uppercase tracking-widest bg-primary text-primary-foreground border-4 border-foreground px-6 py-2 hover:bg-background hover:text-foreground hover:-translate-y-1 hover:shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] transition-all flex items-center justify-center gap-3"
            >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="square" strokeLinejoin="bevel">
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
                VER NO GITHUB
            </a>
        </footer>
      </main>

      {isLoading && <LoadingOverlay />}
    </div>
  );
}

export default App;
