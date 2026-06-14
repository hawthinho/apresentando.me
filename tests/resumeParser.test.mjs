import assert from 'node:assert/strict';
import test from 'node:test';

import {
    formatCombinedToLatex,
    formatCoverLetterToLatex,
    formatResumeToLatex,
    formatResumeToText,
    parseResumeText
} from '../src/services/resumeParser.js';

const resumeData = {
    contact: {
        name: 'Ana Souza',
        email: 'ana@example.com',
        phone: '(11) 99999-0000',
        linkedin: 'linkedin.com/in/anasouza',
        portfolio: 'github.com/anasouza',
        location: 'Sao Paulo, SP'
    },
    summary: 'Desenvolvedora fullstack com foco em produtos B2B.',
    experiences: [
        {
            role: 'Desenvolvedora Fullstack',
            company: 'Acme',
            startDate: 'Jan/2021',
            endDate: 'Presente',
            bullets: ['Implementou APIs com Node.js', 'Reduziu tempo de carregamento em 30%']
        }
    ],
    skills: {
        hard: ['React', 'Node.js', 'SQL'],
        soft: ['Comunicacao', 'Lideranca']
    },
    projects: [
        {
            name: 'API de Finanças',
            url: 'github.com/anasouza/financas',
            description: 'Projeto pessoal com autenticação e APIs REST.',
            bullets: ['Construiu 12 endpoints com testes automatizados']
        }
    ],
    education: [
        { degree: 'Bacharelado em Sistemas', institution: 'Universidade X', year: '2020' }
    ],
    certificates: [
        { name: 'AWS Cloud Practitioner', institution: 'AWS', year: '2023' }
    ],
    languages: [
        { language: 'Ingles', level: 'Avancado' }
    ]
};

test('formatResumeToText and parseResumeText preserve core resume sections', () => {
    const text = formatResumeToText(resumeData);
    const parsed = parseResumeText(text);

    assert.equal(parsed.contact.name, resumeData.contact.name);
    assert.equal(parsed.contact.email, resumeData.contact.email);
    assert.equal(parsed.experiences[0].role, resumeData.experiences[0].role);
    assert.equal(parsed.experiences[0].bullets.length, 2);
    assert.deepEqual(parsed.skills.hard, resumeData.skills.hard);
    assert.deepEqual(parsed.skills.soft, resumeData.skills.soft);
    assert.equal(parsed.projects[0].name, resumeData.projects[0].name);
    assert.equal(parsed.projects[0].url, resumeData.projects[0].url);
    assert.equal(parsed.projects[0].bullets.length, 1);
    assert.equal(parsed.education[0].institution, resumeData.education[0].institution);
    assert.equal(parsed.certificates[0].name, resumeData.certificates[0].name);
    assert.equal(parsed.languages[0].language, resumeData.languages[0].language);
});

test('formatted resume text follows the ATS classic section order', () => {
    const text = formatResumeToText(resumeData);

    const experienceIndex = text.indexOf('EXPERIÊNCIA PROFISSIONAL');
    const projectsIndex = text.indexOf('PROJETOS');
    const educationIndex = text.indexOf('FORMAÇÃO ACADÊMICA');
    const skillsIndex = text.indexOf('COMPETÊNCIAS');

    assert.ok(experienceIndex < projectsIndex);
    assert.ok(projectsIndex < educationIndex);
    assert.ok(educationIndex < skillsIndex);
});

test('LaTeX formatters escape reserved characters', () => {
    const latex = formatResumeToLatex({
        ...resumeData,
        summary: 'Impacto em receita & margem com reducao de custo de 15%.'
    });

    assert.match(latex, /receita \\& margem/);
    assert.match(latex, /15\\%/);

    const letterLatex = formatCoverLetterToLatex('Olá & obrigado.\n\nResultados de 20%.');
    assert.match(letterLatex, /\\&/);
    assert.match(letterLatex, /20\\%/);
});

test('LaTeX resume uses ATS classic single-column text flow', () => {
    const latex = formatResumeToLatex(resumeData);
    const projectsIndex = latex.indexOf('\\sectiontitle{Projetos}');
    const educationIndex = latex.indexOf('\\sectiontitle{Formação}');
    const skillsIndex = latex.indexOf('\\sectiontitle{Habilidades}');

    assert.match(latex, /\\usepackage\{cmap\}/);
    assert.match(latex, /\\usepackage\{lmodern\}/);
    assert.match(latex, /\\sectiontitle\{Projetos\}/);
    assert.ok(projectsIndex < educationIndex);
    assert.ok(educationIndex < skillsIndex);
    assert.doesNotMatch(latex, /\\hfill/);
    assert.doesNotMatch(latex, /\\cdot/);
    assert.doesNotMatch(latex, /xcolor|hyperref|titlesec/);
});

test('formatCombinedToLatex inserts cover letter before resume body', () => {
    const resumeLatex = formatResumeToLatex(resumeData);
    const combined = formatCombinedToLatex(resumeLatex, 'Prezados,\n\nTenho interesse na vaga.');

    assert.ok(combined.indexOf('Prezados') < combined.indexOf('Resumo'));
    assert.match(combined, /\\newpage/);
});
