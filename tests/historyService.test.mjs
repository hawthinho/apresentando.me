import assert from 'node:assert/strict';
import test from 'node:test';

import {
    clearAnalysisHistory,
    deleteAnalysis,
    getAnalysisHistory,
    saveAnalysis,
    updateAnalysis
} from '../src/services/historyService.js';

const createStorage = () => {
    const store = new Map();
    return {
        getItem: (key) => store.has(key) ? store.get(key) : null,
        setItem: (key, value) => store.set(key, String(value)),
        removeItem: (key) => store.delete(key),
        clear: () => store.clear()
    };
};

test('history service saves, updates and deletes analyses in localStorage', () => {
    globalThis.localStorage = createStorage();

    const saved = saveAnalysis({
        fileName: 'cv.pdf',
        atsScore: 82,
        matchScore: 70,
        data: { atsScore: 82 },
        resumeText: 'Resume text',
        jobDescription: 'Job text'
    });

    assert.equal(getAnalysisHistory().length, 1);
    assert.equal(getAnalysisHistory()[0].fileName, 'cv.pdf');

    updateAnalysis(saved.id, { optimizedContent: 'Optimized resume' });
    assert.equal(getAnalysisHistory()[0].optimizedContent, 'Optimized resume');

    deleteAnalysis(saved.id);
    assert.deepEqual(getAnalysisHistory(), []);
});

test('history service can clear all saved analyses', () => {
    globalThis.localStorage = createStorage();

    saveAnalysis({
        fileName: 'one.pdf',
        atsScore: 90,
        data: {},
        resumeText: 'one'
    });
    saveAnalysis({
        fileName: 'two.pdf',
        atsScore: 70,
        data: {},
        resumeText: 'two'
    });

    clearAnalysisHistory();
    assert.deepEqual(getAnalysisHistory(), []);
});
