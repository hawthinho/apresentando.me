import React, { useState } from 'react';
import { Button } from '@/components/ui/button';

const EditorSectionHeader = ({ title, icon, section, isExpanded, onToggle }) => (
    <div
        className={`flex items-center justify-between p-6 cursor-pointer border-b-4 border-foreground transition-colors ${isExpanded ? 'bg-primary text-foreground' : 'bg-white hover:bg-muted'}`}
        onClick={() => onToggle(section)}
    >
        <div className="flex items-center gap-4">
            <div className="shrink-0 flex items-center justify-center">
                {icon}
            </div>
            <h3 className="font-space font-black text-xl md:text-2xl uppercase tracking-tighter">{title}</h3>
        </div>
        <button className={`shrink-0 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square">
                <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
        </button>
    </div>
);

export const ResumeEditor = ({ resumeData, onUpdate, onBack, onSave }) => {
    const [data, setData] = useState(resumeData);

    const [hardSkillsText, setHardSkillsText] = useState(
        (resumeData?.skills?.hard || []).join(', ')
    );
    const [softSkillsText, setSoftSkillsText] = useState(
        (resumeData?.skills?.soft || []).join(', ')
    );

    const [expandedSections, setExpandedSections] = useState({
        contact: true,
        summary: true,
        experiences: true,
        skills: true,
        education: true,
        certificates: true,
        languages: true
    });

    const toggleSection = (section) => {
        setExpandedSections(prev => ({
            ...prev,
            [section]: !prev[section]
        }));
    };

    const updateField = (path, value) => {
        const newData = JSON.parse(JSON.stringify(data));
        const parts = path.split('.');
        let current = newData;
        for (let i = 0; i < parts.length - 1; i++) {
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        setData(newData);
        onUpdate?.(newData);
    };

    const updateArrayItem = (arrayPath, index, field, value) => {
        const newData = JSON.parse(JSON.stringify(data));
        const parts = arrayPath.split('.');
        let current = newData;
        for (const part of parts) {
            current = current[part];
        }
        current[index][field] = value;
        setData(newData);
        onUpdate?.(newData);
    };

    const addArrayItem = (arrayPath, template) => {
        const newData = JSON.parse(JSON.stringify(data));
        const parts = arrayPath.split('.');
        let current = newData;
        for (const part of parts) {
            current = current[part];
        }
        current.push(template);
        setData(newData);
        onUpdate?.(newData);
    };

    const removeArrayItem = (arrayPath, index) => {
        const newData = JSON.parse(JSON.stringify(data));
        const parts = arrayPath.split('.');
        let current = newData;
        for (const part of parts) {
            current = current[part];
        }
        current.splice(index, 1);
        setData(newData);
        onUpdate?.(newData);
    };

    const addBullet = (expIndex) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData.experiences[expIndex].bullets.push('');
        setData(newData);
        onUpdate?.(newData);
    };

    const updateBullet = (expIndex, bulletIndex, value) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData.experiences[expIndex].bullets[bulletIndex] = value;
        setData(newData);
        onUpdate?.(newData);
    };

    const removeBullet = (expIndex, bulletIndex) => {
        const newData = JSON.parse(JSON.stringify(data));
        newData.experiences[expIndex].bullets.splice(bulletIndex, 1);
        setData(newData);
        onUpdate?.(newData);
    };

    const inputClasses = "w-full bg-background border-2 border-foreground p-4 font-jetbrains text-sm focus:outline-none focus:ring-4 focus:ring-primary shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all";
    const labelClasses = "block font-space font-black uppercase tracking-tighter text-sm mb-2 text-foreground";
    const sectionContainerClasses = "mb-8 border-4 border-foreground bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]";
    const removeBtnClasses = "w-full md:w-auto h-12 shrink-0 border-2 border-destructive bg-destructive/10 text-destructive hover:bg-destructive hover:text-white font-jetbrains font-bold text-xs uppercase px-4 transition-colors flex justify-center items-center gap-2";
    const addBtnClasses = "w-full mt-6 h-12 border-2 border-dashed border-foreground bg-background hover:bg-primary hover:border-solid hover:border-foreground text-foreground font-jetbrains font-black text-sm uppercase transition-all flex justify-center items-center gap-2";

    return (
        <div className="w-full max-w-5xl lg:max-w-7xl mx-auto flex flex-col mt-8 animate-in fade-in slide-in-from-bottom-12 duration-500 mb-24 px-4 md:px-0">
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 lg:pb-10 mb-8 border-b-4 border-foreground">
                <div>
                    <span className="inline-block font-jetbrains font-bold text-[10px] uppercase tracking-widest bg-primary text-foreground px-3 py-1 mb-4 border-2 border-foreground shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        Modo de edição manual
                    </span>
                    <h1 className="font-space font-black text-5xl md:text-6xl lg:text-7xl uppercase tracking-tighter leading-none">
                        Editor de <br/><span className="text-background bg-foreground px-2 inline-block mt-2 rotate-1">registros.</span>
                    </h1>
                </div>
                <Button
                    onClick={onBack}
                    className="self-start md:self-auto rounded-none bg-white hover:bg-muted text-foreground border-4 border-foreground font-jetbrains font-black uppercase shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1.5 active:translate-x-1.5 active:shadow-none transition-all flex items-center gap-3 h-14 md:px-8 shrink-0"
                >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M19 12H5M12 19l-7-7 7-7" /></svg>
                    Voltar
                </Button>
            </header>

            <div className="flex flex-col gap-6">
                
                {/* Contact Info */}
                <div className={sectionContainerClasses}>
                    <EditorSectionHeader title="Informações de contato" section="contact" isExpanded={expandedSections.contact} onToggle={toggleSection} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>} />
                    {expandedSections.contact && (
                        <div className="p-6 md:p-8 bg-[#F4F4F0]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Nome completo</label>
                                    <input type="text" className={inputClasses} value={data.contact.name} onChange={(e) => updateField('contact.name', e.target.value)} placeholder="Seu nome completo" />
                                </div>
                                <div>
                                    <label className={labelClasses}>E-mail</label>
                                    <input type="email" className={inputClasses} value={data.contact.email} onChange={(e) => updateField('contact.email', e.target.value)} placeholder="seu@email.com" />
                                </div>
                                <div>
                                    <label className={labelClasses}>Telefone</label>
                                    <input type="tel" className={inputClasses} value={data.contact.phone} onChange={(e) => updateField('contact.phone', e.target.value)} placeholder="(11) 99999-9999" />
                                </div>
                                <div>
                                    <label className={labelClasses}>LinkedIn</label>
                                    <input type="text" className={inputClasses} value={data.contact.linkedin} onChange={(e) => updateField('contact.linkedin', e.target.value)} placeholder="linkedin.com/in/seu-perfil" />
                                </div>
                                <div className="md:col-span-2 lg:col-span-1">
                                    <label className={labelClasses}>Portfólio / GitHub</label>
                                    <input type="text" className={inputClasses} value={data.contact.portfolio || ''} onChange={(e) => updateField('contact.portfolio', e.target.value)} placeholder="github.com/usuario" />
                                </div>
                                <div className="md:col-span-2">
                                    <label className={labelClasses}>Localização</label>
                                    <input type="text" className={inputClasses} value={data.contact.location} onChange={(e) => updateField('contact.location', e.target.value)} placeholder="Cidade, Estado" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Professional Summary */}
                <div className={sectionContainerClasses}>
                    <EditorSectionHeader title="Resumo profissional" section="summary" isExpanded={expandedSections.summary} onToggle={toggleSection} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg>} />
                    {expandedSections.summary && (
                        <div className="p-6 md:p-8 bg-[#F4F4F0]">
                            <label className={labelClasses}>Descrição</label>
                            <textarea className={`${inputClasses} h-40 resize-y`} value={data.summary} onChange={(e) => updateField('summary', e.target.value)} placeholder="Descreva seu perfil profissional..." />
                        </div>
                    )}
                </div>

                {/* Experiences */}
                <div className={sectionContainerClasses}>
                    <EditorSectionHeader title="Experiência profissional" section="experiences" isExpanded={expandedSections.experiences} onToggle={toggleSection} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><rect x="2" y="7" width="20" height="14"></rect><path d="M16 21V5h-8v16"></path></svg>} />
                    {expandedSections.experiences && (
                        <div className="p-6 md:p-8 bg-[#F4F4F0] flex flex-col gap-8">
                            {data.experiences.map((exp, expIndex) => (
                                <div key={expIndex} className="bg-white border-4 border-foreground p-6 md:p-8 relative mt-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="absolute -top-4 -left-4 bg-primary text-foreground border-2 border-foreground font-jetbrains font-black text-xs px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                        Experiência #{expIndex + 1}
                                    </div>
                                    <div className="absolute top-2 right-2">
                                        <button className="text-foreground hover:text-destructive transition-colors p-2" onClick={() => removeArrayItem('experiences', expIndex)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-x-8 gap-y-6 mt-4">
                                        <div className="lg:col-span-2">
                                            <label className={labelClasses}>Cargo</label>
                                            <input type="text" className={inputClasses} value={exp.role} onChange={(e) => updateArrayItem('experiences', expIndex, 'role', e.target.value)} placeholder="Desenvolvedor sênior" />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <label className={labelClasses}>Empresa</label>
                                            <input type="text" className={inputClasses} value={exp.company} onChange={(e) => updateArrayItem('experiences', expIndex, 'company', e.target.value)} placeholder="Empresa exemplo" />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <label className={labelClasses}>Data de início</label>
                                            <input type="text" className={inputClasses} value={exp.startDate} onChange={(e) => updateArrayItem('experiences', expIndex, 'startDate', e.target.value)} placeholder="Mai/2021" />
                                        </div>
                                        <div className="lg:col-span-2">
                                            <label className={labelClasses}>Data de fim</label>
                                            <input type="text" className={inputClasses} value={exp.endDate} onChange={(e) => updateArrayItem('experiences', expIndex, 'endDate', e.target.value)} placeholder="Presente" />
                                        </div>
                                    </div>

                                    <div className="mt-8 border-t-2 border-dashed border-foreground/50 pt-6">
                                        <label className={labelClasses}>Atividades e conquistas</label>
                                        <div className="flex flex-col gap-4 mt-4">
                                            {exp.bullets.map((bullet, bulletIndex) => (
                                                <div key={bulletIndex} className="flex flex-col md:flex-row gap-4 items-start">
                                                    <span className="font-jetbrains font-bold text-primary text-2xl mt-1 shrink-0">•</span>
                                                    <textarea className={`${inputClasses} h-24 resize-y`} value={bullet} onChange={(e) => updateBullet(expIndex, bulletIndex, e.target.value)} placeholder="Descrição da conquista..." />
                                                    <button className={removeBtnClasses} onClick={() => removeBullet(expIndex, bulletIndex)}>Remover</button>
                                                </div>
                                            ))}
                                            <button className={addBtnClasses} onClick={() => addBullet(expIndex)}>+ Nova atividade</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                            <button
                                className="w-full mt-6 h-16 border-4 border-foreground bg-primary text-foreground hover:bg-foreground hover:text-primary font-jetbrains font-black text-sm uppercase transition-all flex justify-center items-center gap-2 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] active:translate-y-1 active:translate-x-1 active:shadow-none"
                                onClick={() => addArrayItem('experiences', { role: '', company: '', startDate: '', endDate: '', bullets: [''] })}
                            >
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
                                Adicionar experiência completa
                            </button>
                        </div>
                    )}
                </div>

                {/* Skills */}
                <div className={sectionContainerClasses}>
                    <EditorSectionHeader title="Competências" section="skills" isExpanded={expandedSections.skills} onToggle={toggleSection} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><circle cx="12" cy="12" r="10"></circle><line x1="14.31" y1="8" x2="20.05" y2="17.94"></line><line x1="9.69" y1="8" x2="21.17" y2="8"></line><line x1="7.38" y1="12" x2="13.12" y2="2.06"></line><line x1="9.69" y1="16" x2="3.95" y2="6.06"></line><line x1="14.31" y1="16" x2="2.83" y2="16"></line><line x1="16.62" y1="12" x2="10.88" y2="21.94"></line></svg>} />
                    {expandedSections.skills && (
                        <div className="p-6 md:p-8 bg-[#F4F4F0] flex flex-col gap-6">
                            <div>
                                <label className={labelClasses}>Hard skills (técnicas) <span className="text-[10px] lowercase text-muted-foreground ml-2 tracking-normal font-jetbrains">Separadas por vírgula</span></label>
                                <input type="text" className={inputClasses} value={hardSkillsText} onChange={(e) => setHardSkillsText(e.target.value)} onBlur={(e) => {
                                        const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        updateField('skills.hard', skills);
                                }} placeholder="React, Node.js, SQL..." />
                            </div>
                            <div>
                                <label className={labelClasses}>Soft skills (comportamentais) <span className="text-[10px] lowercase text-muted-foreground ml-2 tracking-normal font-jetbrains">Separadas por vírgula</span></label>
                                <input type="text" className={inputClasses} value={softSkillsText} onChange={(e) => setSoftSkillsText(e.target.value)} onBlur={(e) => {
                                        const skills = e.target.value.split(',').map(s => s.trim()).filter(Boolean);
                                        updateField('skills.soft', skills);
                                }} placeholder="Comunicação, Liderança..." />
                            </div>
                        </div>
                    )}
                </div>

                {/* Education */}
                <div className={sectionContainerClasses}>
                    <EditorSectionHeader title="Formação acadêmica" section="education" isExpanded={expandedSections.education} onToggle={toggleSection} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M22 10v6M2 10l10-5 10 5-10 5z"></path><path d="M6 12v5c3 3 9 3 12 0v-5"></path></svg>} />
                    {expandedSections.education && (
                        <div className="p-6 md:p-8 bg-[#F4F4F0] flex flex-col gap-8">
                            {data.education.map((edu, eduIndex) => (
                                <div key={eduIndex} className="bg-white border-4 border-foreground p-6 md:p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                    <div className="absolute top-2 right-2">
                                        <button className="text-foreground hover:text-destructive transition-colors p-2" onClick={() => removeArrayItem('education', eduIndex)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                        <div className="lg:col-span-1"><label className={labelClasses}>Grau / curso</label><input type="text" className={inputClasses} value={edu.degree} onChange={(e) => updateArrayItem('education', eduIndex, 'degree', e.target.value)} /></div>
                                        <div className="lg:col-span-1"><label className={labelClasses}>Instituição</label><input type="text" className={inputClasses} value={edu.institution} onChange={(e) => updateArrayItem('education', eduIndex, 'institution', e.target.value)} /></div>
                                        <div className="lg:col-span-1"><label className={labelClasses}>Ano de formação</label><input type="text" className={inputClasses} value={edu.year} onChange={(e) => updateArrayItem('education', eduIndex, 'year', e.target.value)} /></div>
                                    </div>
                                </div>
                            ))}
                            <button className={addBtnClasses} onClick={() => addArrayItem('education', { degree: '', institution: '', year: '' })}>+ Expandir formação acadêmica</button>
                        </div>
                    )}
                </div>

                {/* Certificates */}
                <div className={sectionContainerClasses}>
                    <EditorSectionHeader title="Certificações" section="certificates" isExpanded={expandedSections.certificates} onToggle={toggleSection} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><path d="M10 2v7.31"></path><path d="M14 2v7.31"></path><rect x="4" y="2" width="16" height="20"></rect><path d="M8 13h8"></path><path d="M8 17h8"></path></svg>} />
                    {expandedSections.certificates && (
                        <div className="p-6 md:p-8 bg-[#F4F4F0] flex flex-col gap-8">
                            {data.certificates.map((cert, certIndex) => (
                                <div key={certIndex} className="bg-white border-4 border-foreground p-6 md:p-8 relative shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                                     <div className="absolute top-2 right-2">
                                        <button className="text-foreground hover:text-destructive transition-colors p-2" onClick={() => removeArrayItem('certificates', certIndex)}>
                                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                                        <div className="lg:col-span-1"><label className={labelClasses}>Nome</label><input type="text" className={inputClasses} value={cert.name} onChange={(e) => updateArrayItem('certificates', certIndex, 'name', e.target.value)} /></div>
                                        <div className="lg:col-span-1"><label className={labelClasses}>Instituição</label><input type="text" className={inputClasses} value={cert.institution} onChange={(e) => updateArrayItem('certificates', certIndex, 'institution', e.target.value)} /></div>
                                        <div className="lg:col-span-1"><label className={labelClasses}>Data</label><input type="text" className={inputClasses} value={cert.year} onChange={(e) => updateArrayItem('certificates', certIndex, 'year', e.target.value)} /></div>
                                    </div>
                                </div>
                            ))}
                            <button className={addBtnClasses} onClick={() => addArrayItem('certificates', { name: '', institution: '', year: '' })}>+ Adicionar certificação</button>
                        </div>
                    )}
                </div>

                {/* Languages */}
                <div className={sectionContainerClasses}>
                    <EditorSectionHeader title="Idiomas" section="languages" isExpanded={expandedSections.languages} onToggle={toggleSection} icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square"><circle cx="12" cy="12" r="10"></circle><line x1="2" y1="12" x2="22" y2="12"></line><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path></svg>} />
                    {expandedSections.languages && (
                        <div className="p-6 md:p-8 bg-[#F4F4F0] flex flex-col gap-6">
                            {data.languages.map((lang, langIndex) => (
                                <div key={langIndex} className="bg-white border-4 border-foreground p-6 flex flex-col md:flex-row gap-6 items-end relative shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                                     <div className="w-full md:w-1/2">
                                        <label className={labelClasses}>Idioma</label>
                                        <input type="text" className={inputClasses} value={lang.language} onChange={(e) => updateArrayItem('languages', langIndex, 'language', e.target.value)} />
                                    </div>
                                    <div className="w-full md:w-1/2">
                                        <label className={labelClasses}>Nível</label>
                                        <select className={inputClasses} value={lang.level} onChange={(e) => updateArrayItem('languages', langIndex, 'level', e.target.value)}>
                                            <option value="">Selecione</option>
                                            <option value="Básico">Básico</option>
                                            <option value="Intermediário">Intermediário</option>
                                            <option value="Avançado">Avançado</option>
                                            <option value="Fluente">Fluente</option>
                                            <option value="Nativo">Nativo</option>
                                        </select>
                                    </div>
                                    <button className={removeBtnClasses} onClick={() => removeArrayItem('languages', langIndex)}>Excluir</button>
                                </div>
                            ))}
                            <button className={addBtnClasses} onClick={() => addArrayItem('languages', { language: '', level: '' })}>+ Adicionar idioma</button>
                        </div>
                    )}
                </div>

            </div>

            {/* Save Button */}
            <div className="flex justify-center md:justify-end mt-12 mb-24">
                <Button 
                    className="w-full md:w-auto h-20 px-12 bg-primary text-foreground border-4 border-foreground font-jetbrains font-black uppercase text-xl md:text-2xl shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] hover:bg-black hover:text-primary active:translate-y-2 active:translate-x-2 active:shadow-none transition-all rounded-none"
                    onClick={() => onSave?.(data)}
                >
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="square" className="mr-4"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><polyline points="17 21 17 13 7 13 7 21"></polyline><polyline points="7 3 7 8 15 8"></polyline></svg>
                    Salvar alterações
                </Button>
            </div>
        </div>
    );
};
