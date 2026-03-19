const STORAGE_KEY = 'analysis_history';
const MAX_HISTORY_ITEMS = 50;

const getStorageKey = () => STORAGE_KEY;

export const getAnalysisHistory = () => {
    try {
        const stored = localStorage.getItem(getStorageKey());
        if (!stored) return [];
        return JSON.parse(stored);
    } catch {
        return [];
    }
};

export const saveAnalysis = (analysis) => {
    const history = getAnalysisHistory();

    const newEntry = {
        id: Date.now(),
        fileName: analysis.fileName || 'Currículo.pdf',
        date: new Date().toISOString(),
        atsScore: analysis.atsScore,
        matchScore: analysis.matchScore,
        data: analysis.data,
        resumeText: analysis.resumeText,
        jobDescription: analysis.jobDescription
    };

    // Add to beginning and limit size
    const updatedHistory = [newEntry, ...history].slice(0, MAX_HISTORY_ITEMS);

    localStorage.setItem(getStorageKey(), JSON.stringify(updatedHistory));

    return newEntry;
};

export const deleteAnalysis = (analysisId) => {
    const history = getAnalysisHistory();
    const updatedHistory = history.filter(item => item.id !== analysisId);

    localStorage.setItem(getStorageKey(), JSON.stringify(updatedHistory));
};

export const updateAnalysis = (analysisId, updates) => {
    const history = getAnalysisHistory();
    const updatedHistory = history.map(item => {
        if (item.id === analysisId) {
            return { ...item, ...updates };
        }
        return item;
    });

    localStorage.setItem(getStorageKey(), JSON.stringify(updatedHistory));
};

export const formatHistoryDate = (isoDate) => {
    const date = new Date(isoDate);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Agora mesmo';
    if (diffMins < 60) return `Há ${diffMins} min`;
    if (diffHours < 24) return `Há ${diffHours}h`;
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;

    return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
    });
};
