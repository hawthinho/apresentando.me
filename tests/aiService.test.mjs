import assert from 'node:assert/strict';
import test from 'node:test';

import { sanitizeCoverLetterText, sanitizeGeneratedText, stripAiDashMarks } from '../src/services/textSanitizer.js';

test('stripAiDashMarks removes em and en dash punctuation from generated prose', () => {
    const text = 'Tenho experiencia em produto \u2014 especialmente em B2B \u2013 e foco em resultado. Atuei de 2020\u20132024.';

    const sanitized = stripAiDashMarks(text);

    assert.equal(sanitized, 'Tenho experiencia em produto, especialmente em B2B, e foco em resultado. Atuei de 2020 a 2024.');
    assert.doesNotMatch(sanitized, /[\u2014\u2013]/);
});

test('sanitizeGeneratedText recursively cleans generated AI payloads', () => {
    const payload = {
        screeningReason: 'Formato claro \u2014 com ajustes pequenos.',
        strengths: [
            { title: 'Clareza \u2013 ATS', description: 'Seções bem marcadas \u2014 leitura simples.' }
        ],
        untouched: 91
    };

    const sanitized = sanitizeGeneratedText(payload);

    assert.deepEqual(sanitized, {
        screeningReason: 'Formato claro, com ajustes pequenos.',
        strengths: [
            { title: 'Clareza, ATS', description: 'Seções bem marcadas, leitura simples.' }
        ],
        untouched: 91
    });
    assert.doesNotMatch(JSON.stringify(sanitized), /[\u2014\u2013]/);
});

test('sanitizeCoverLetterText removes pushy scheduling closes and formats paragraphs', () => {
    const letter = 'Prezado time de Produto da Serasa Experian, Meu nome é Flávio e trabalho com UX. Conduzi pesquisas com usuários e protótipos de alta fidelidade. Gostaria de agendar uma conversa de 30 minutos para apresentar como posso gerar valor imediato. Agradeço a atenção e fico no aguardo de um retorno.';

    const sanitized = sanitizeCoverLetterText(letter);

    assert.match(sanitized, /^Olá, time de Produto da Serasa Experian\./);
    assert.doesNotMatch(sanitized, /agendar|30 minutos|fico no aguardo|valor imediato/i);
    assert.match(sanitized, /\n\n/);
});
