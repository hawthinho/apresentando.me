import assert from 'node:assert/strict';
import test from 'node:test';

import {
    clearSettings,
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
