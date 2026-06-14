import assert from 'node:assert/strict';
import test from 'node:test';

import {
    buildWhatsappUrl,
    getContactItemLink,
    normalizeExternalUrl,
    splitContactItems
} from '../src/services/contactLinkService.js';

test('splitContactItems separates contact fields joined with pipes', () => {
    assert.deepEqual(
        splitContactItems(['ana@example.com | linkedin.com/in/ana | github.com/ana']),
        ['ana@example.com', 'linkedin.com/in/ana', 'github.com/ana']
    );
});

test('normalizeExternalUrl makes social and portfolio links clickable', () => {
    assert.equal(normalizeExternalUrl('linkedin.com/in/ana'), 'https://linkedin.com/in/ana');
    assert.equal(normalizeExternalUrl('github.com/ana'), 'https://github.com/ana');
    assert.equal(normalizeExternalUrl('https://portfolio.dev'), 'https://portfolio.dev');
});

test('getContactItemLink supports email and portfolio contact items', () => {
    assert.equal(getContactItemLink('ana@example.com'), 'mailto:ana@example.com');
    assert.equal(getContactItemLink('behance.net/ana'), 'https://behance.net/ana');
});

test('buildWhatsappUrl requires country code and area code', () => {
    assert.equal(buildWhatsappUrl('(11) 99999-0000'), '');
    assert.equal(buildWhatsappUrl('+55 11 99999-0000'), 'https://wa.me/5511999990000');
});

test('getContactItemLink only turns the phone into WhatsApp when explicitly marked', () => {
    assert.equal(
        getContactItemLink('+55 11 99999-0000', { phone: '+55 11 99999-0000', phoneIsWhatsapp: false }),
        ''
    );
    assert.equal(
        getContactItemLink('+55 11 99999-0000', { phone: '+55 11 99999-0000', phoneIsWhatsapp: true }),
        'https://wa.me/5511999990000'
    );
});
