import { getDefaultModelForProvider, getModelOption, getProvider } from './providerConfig.js';

const STORAGE_KEY = 'app_settings';

const DEFAULT_SETTINGS = {
    provider: 'google',
    apiKey: '',
    apiKeys: {},
    model: 'gemini-3.1-flash-lite',
    models: {}
};

export { DEFAULT_SETTINGS };

const normalizeSettings = (settings = {}) => {
    const provider = getProvider(settings.provider).id;
    const apiKeys = { ...(settings.apiKeys || {}) };

    if (settings.apiKey && !apiKeys.google) {
        apiKeys.google = settings.apiKey;
    }

    const models = { ...(settings.models || {}) };
    const requestedModel = models[provider] || settings.model || getDefaultModelForProvider(provider);
    const selectedModel = getModelOption(provider, requestedModel).id;
    models[provider] = selectedModel;

    return {
        ...DEFAULT_SETTINGS,
        ...settings,
        provider,
        apiKeys,
        models,
        model: selectedModel,
        apiKey: apiKeys[provider] || ''
    };
};

export const getSettings = () => {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (!stored) return normalizeSettings(DEFAULT_SETTINGS);
        return normalizeSettings(JSON.parse(stored));
    } catch {
        return normalizeSettings(DEFAULT_SETTINGS);
    }
};

export const saveSettings = (settings) => {
    const currentSettings = getSettings();
    const newSettings = normalizeSettings({ ...currentSettings, ...settings });
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newSettings));
    return newSettings;
};

export const clearSettings = () => {
    localStorage.removeItem(STORAGE_KEY);
    return getSettings();
};

export const getApiKeyForSettings = (settings = getSettings()) => {
    const normalized = normalizeSettings(settings);
    return normalized.apiKeys?.[normalized.provider] || '';
};

export const getSelectedModelForSettings = (settings = getSettings()) => {
    const normalized = normalizeSettings(settings);
    return normalized.models?.[normalized.provider] || normalized.model || getDefaultModelForProvider(normalized.provider);
};
