export const COVER_LETTER_STYLES = [
    {
        id: 'direta',
        label: 'Direta e objetiva',
        description: 'Curta, clara e voltada para recrutadores que leem rápido.',
        prompt: 'Use um tom direto, objetivo e seguro. Priorize clareza, aderência à vaga e evidências concretas em poucos parágrafos.'
    },
    {
        id: 'consultiva',
        label: 'Consultiva',
        description: 'Conecta sua experiência aos problemas do negócio.',
        prompt: 'Use um tom consultivo e analítico. Mostre como as experiências do currículo ajudam a resolver desafios prováveis da vaga.'
    },
    {
        id: 'humana',
        label: 'Humana e natural',
        description: 'Mais próxima, fluida e com menos cara de texto corporativo.',
        prompt: 'Use um tom humano, natural e maduro. Escreva como uma pessoa competente se apresentando com presença, sem formalidade excessiva.'
    },
    {
        id: 'executiva',
        label: 'Executiva',
        description: 'Mais sênior, com foco em impacto, decisão e responsabilidade.',
        prompt: 'Use um tom executivo e maduro. Destaque impacto, responsabilidade, colaboração com liderança e contribuição estratégica.'
    },
    {
        id: 'criativa',
        label: 'Criativa',
        description: 'Boa para produto, design, marketing e funções com portfólio.',
        prompt: 'Use um tom criativo, elegante e profissional. Valorize repertório, processo, pensamento de produto e cuidado com experiência.'
    }
];

export const getCoverLetterStyle = (styleId) => (
    COVER_LETTER_STYLES.find((style) => style.id === styleId) || COVER_LETTER_STYLES[0]
);
