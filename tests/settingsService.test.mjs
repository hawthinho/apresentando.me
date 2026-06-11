import assert from 'node:assert/strict';
import test from 'node:test';

import {
    clearSettings,
    getActiveAiDescriptor,
    getSelectedModelForSettings,
    getSettings,
    saveSettings
} from '../src/services/settingsService.js';

const createStorage = () => {
    const store = new Map();
    return {
        getItem: (key) => store.has(key) ? store.get(key) : null,
        setItem: (key, value) => store.set(key, String(value)),
        removeItem: (key) => store.delete(key),
        clear: () => store.clear()
    };
};

test('settings service defaults Gemini to 3.1 Flash-Lite', () => {
    globalThis.localStorage = createStorage();

    const settings = clearSettings();

    assert.equal(settings.provider, 'google');
    assert.equal(settings.model, 'gemini-3.1-flash-lite');
    assert.equal(getSelectedModelForSettings(settings), 'gemini-3.1-flash-lite');
});

test('settings service migrates old Gemini models to the current default', () => {
    globalThis.localStorage = createStorage();

    const saved = saveSettings({
        provider: 'google',
        model: 'gemini-3.5-flash',
        models: {
            google: 'gemini-3.5-flash'
        }
    });

    assert.equal(saved.model, 'gemini-3.1-flash-lite');
    assert.equal(saved.models.google, 'gemini-3.1-flash-lite');
    assert.equal(getSettings().model, 'gemini-3.1-flash-lite');
});

test('settings service keeps only the active provider API key', () => {
    globalThis.localStorage = createStorage();

    const saved = saveSettings({
        provider: 'openrouter',
        apiKey: 'legacy-google-key',
        apiKeys: {
            google: 'google-key',
            openrouter: 'openrouter-key',
            deepseek: 'deepseek-key'
        },
        model: 'openrouter/free',
        models: {
            google: 'gemini-3.1-flash-lite',
            openrouter: 'openrouter/free'
        }
    });

    assert.deepEqual(saved.apiKeys, { openrouter: 'openrouter-key' });
    assert.equal(saved.apiKey, 'openrouter-key');
    assert.equal(getSelectedModelForSettings(saved), 'openrouter/free');
});

test('settings service exposes the active AI descriptor for history badges', () => {
    globalThis.localStorage = createStorage();

    const saved = saveSettings({
        provider: 'deepseek',
        apiKeys: {
            deepseek: 'deepseek-key'
        },
        model: 'deepseek-v4-pro',
        models: {
            deepseek: 'deepseek-v4-pro'
        }
    });

    assert.deepEqual(getActiveAiDescriptor(saved), {
        providerId: 'deepseek',
        providerLabel: 'DeepSeek',
        providerName: 'DeepSeek',
        modelId: 'deepseek-v4-pro',
        modelLabel: 'DeepSeek V4 Pro'
    });
});
