const STORAGE_KEY = 'app_settings';

const DEFAULT_SETTINGS = {
    provider: 'google',
    apiKey: '',
    model: 'gemini-3-flash-preview'
};

export const getSettings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return DEFAULT_SETTINGS;
        return { ...DEFAULT_SETTINGS, ...JSON.parse(stored) };
    } catch {
        return DEFAULT_SETTINGS;
    }
};

export const saveSettings = (settings) => {
    const currentSettings = getSettings();
    const newSettings = { ...currentSettings, ...settings };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    return newSettings;
};
