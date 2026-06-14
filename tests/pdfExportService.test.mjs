import assert from 'node:assert/strict';
import { rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import test from 'node:test';

import { generateResumePDF } from '../src/services/pdfExportService.js';

test('generateResumePDF adds clickable contact link annotations', () => {
    const filename = join(tmpdir(), `apresentando-contact-links-${Date.now()}.pdf`);

    try {
        const doc = generateResumePDF(`Ana Souza
ana@example.com | +55 11 99999-0000 | linkedin.com/in/anasouza | github.com/anasouza

RESUMO
Designer de produto.
`, filename, null, {
            contact: {
                phone: '+55 11 99999-0000',
                phoneIsWhatsapp: true
            }
        });

        const pdf = Buffer.from(doc.output('arraybuffer')).toString('latin1');

        assert.match(pdf, /\/URI \(mailto:ana@example\.com\)/);
        assert.match(pdf, /\/URI \(https:\/\/wa\.me\/5511999990000\)/);
        assert.match(pdf, /\/URI \(https:\/\/linkedin\.com\/in\/anasouza\)/);
        assert.match(pdf, /\/URI \(https:\/\/github\.com\/anasouza\)/);
    } finally {
        rmSync(filename, { force: true });
    }
});
