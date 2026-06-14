import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildKeywordTransferBrief,
    extractImportantJobKeywords,
    improveKeywordCoverage
} from '../src/services/jobKeywordService.js';

test('extractImportantJobKeywords highlights relevant ATS terms from a job description', () => {
    const keywords = extractImportantJobKeywords(`
        Requisitos: experiência com React, TypeScript, Node.js, APIs REST, SQL e testes automatizados.
        Atuação em squads ágeis com Scrum, descoberta de produto e métricas de funil.
        Desejável conhecimento em AWS e Docker.
    `);

    assert.ok(keywords.includes('React'));
    assert.ok(keywords.includes('TypeScript'));
    assert.ok(keywords.includes('Node.js'));
    assert.ok(keywords.includes('APIs REST'));
    assert.ok(keywords.includes('SQL'));
    assert.ok(keywords.includes('Testes automatizados'));
    assert.ok(keywords.includes('Scrum'));
    assert.ok(keywords.includes('AWS'));
    assert.ok(keywords.includes('Docker'));
});

test('buildKeywordTransferBrief formats the keyword checklist for the optimizer prompt', () => {
    const brief = buildKeywordTransferBrief('Vaga para Product Designer com Figma, Design System e testes de usabilidade.');

    assert.match(brief, /1\./);
    assert.match(brief, /Figma/);
    assert.match(brief, /Design System/);
    assert.match(brief, /Testes de usabilidade/);
});

test('improveKeywordCoverage adds only job keywords already supported by the original resume', () => {
    const originalResume = `
        Ana Souza
        Desenvolvedora Fullstack
        Experiência com React, TypeScript, Node.js, SQL e testes automatizados.
    `;

    const optimizedData = {
        contact: { name: 'Ana Souza' },
        summary: 'Desenvolvedora fullstack com foco em produtos digitais.',
        experiences: [
            {
                role: 'Desenvolvedora Fullstack',
                company: 'Acme',
                bullets: ['Construiu interfaces e serviços para produtos B2B.']
            }
        ],
        skills: { hard: ['React'], soft: [] },
        projects: [],
        education: [],
        certificates: [],
        languages: []
    };

    const enhanced = improveKeywordCoverage(
        optimizedData,
        originalResume,
        'Buscamos pessoa com React, TypeScript, Node.js, SQL, testes automatizados, AWS e Docker.'
    );

    const hardSkills = enhanced.skills.hard.join(' | ');
    const supportedKeywords = ['React', 'TypeScript', 'Node.js', 'SQL', 'Testes automatizados'];
    const coveredSupportedKeywords = supportedKeywords.filter((keyword) => hardSkills.includes(keyword));

    assert.ok(coveredSupportedKeywords.length >= 4);
    assert.doesNotMatch(hardSkills, /AWS|Docker/);
});

test('improveKeywordCoverage accepts common singular and plural keyword variants', () => {
    const enhanced = improveKeywordCoverage(
        {
            summary: 'Desenvolvedor backend.',
            experiences: [],
            skills: { hard: [], soft: [] },
            projects: [],
            education: [],
            certificates: [],
            languages: []
        },
        'Projeto com API REST em Node.js.',
        'Vaga com foco em APIs REST e Node.js.'
    );

    assert.match(enhanced.skills.hard.join(' | '), /APIs REST|Node\.js/);
});
