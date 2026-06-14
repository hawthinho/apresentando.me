import assert from 'node:assert/strict';
import test from 'node:test';

import { buildResumePdfFilename, sanitizeFilenamePart } from '../src/services/downloadFilenameService.js';

test('buildResumePdfFilename uses name and first role from structured resume data', () => {
    const filename = buildResumePdfFilename({
        contact: { name: 'Ana Souza' },
        experiences: [
            { role: 'Desenvolvedora Fullstack', company: 'Acme' }
        ]
    });

    assert.equal(filename, 'Currículo - Ana Souza - Desenvolvedora Fullstack.pdf');
});

test('buildResumePdfFilename detects a role from the experience section in resume text', () => {
    const filename = buildResumePdfFilename(`Lucas Andrade Ferreira
lucas@example.com | github.com/lucas

RESUMO PROFISSIONAL
Desenvolvedor com foco em APIs REST e SQL Server.

EXPERIÊNCIA PROFISSIONAL
Desenvolvedor .NET Júnior | TechSolutions | 03/2024 - 02/2025
- Desenvolvi endpoints REST em ASP.NET Core.
`);

    assert.equal(filename, 'Currículo - Lucas Andrade Ferreira - Desenvolvedor .NET Júnior.pdf');
});

test('buildResumePdfFilename prefers a header role when the resume has one below the name', () => {
    const filename = buildResumePdfFilename(`Maria Oliveira
UX/UI Designer
São Paulo, SP | maria@example.com

EXPERIÊNCIA PROFISSIONAL
Product Designer | Acme | 2023 - Presente
`);

    assert.equal(filename, 'Currículo - Maria Oliveira - UX UI Designer.pdf');
});

test('sanitizeFilenamePart removes characters that break downloaded file names', () => {
    assert.equal(sanitizeFilenamePart('UX/UI Designer: Produto * Growth?'), 'UX UI Designer Produto Growth');
});
