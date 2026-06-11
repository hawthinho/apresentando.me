export const PROVIDERS = {
    google: {
        id: 'google',
        label: 'Google Gemini',
        shortLabel: 'Gemini',
        billingLabel: 'Cota gratuita + uso pago',
        defaultModel: 'gemini-3.1-flash-lite',
        apiKeyLabel: 'Gemini API Key',
        docsUrl: 'https://aistudio.google.com/apikey',
        docsSteps: [
            'Acesse Google AI Studio.',
            'Entre em Get API key.',
            'Crie ou copie uma chave existente.'
        ],
        models: [
            {
                id: 'gemini-3.1-flash-lite',
                label: 'Gemini 3.1 Flash-Lite',
                badge: 'Recomendado',
                billing: 'Cota gratuita + uso pago',
                description: 'Modelo padrão para análise rápida, menor custo e boa latência.'
            }
        ]
    },
    openrouter: {
        id: 'openrouter',
        label: 'OpenRouter',
        shortLabel: 'OpenRouter',
        billingLabel: 'Roteador grátis/pago',
        defaultModel: 'openrouter/free',
        apiKeyLabel: 'OpenRouter API Key',
        docsUrl: 'https://openrouter.ai/keys',
        docsSteps: [
            'Crie uma conta em OpenRouter.',
            'Abra Keys e gere uma chave.',
            'Use OpenRouter Free para testes ou escolha um modelo pago.'
        ],
        models: [
            {
                id: 'openrouter/free',
                label: 'OpenRouter Free Router',
                badge: 'Grátis',
                billing: 'Grátis com limites e variação de modelo',
                description: 'Escolhe automaticamente um modelo gratuito compatível; ideal para testes.'
            },
            {
                id: 'deepseek/deepseek-v4-pro',
                label: 'DeepSeek V4 Pro via OpenRouter',
                badge: 'Pago',
                billing: 'Pago por token via OpenRouter',
                description: 'Roteamento OpenRouter para DeepSeek V4 Pro com modelo fixo.'
            },
            {
                id: 'z-ai/glm-5.1',
                label: 'Z.ai GLM 5.1 via OpenRouter',
                badge: 'Pago',
                billing: 'Pago por token via OpenRouter',
                description: 'Roteamento OpenRouter para GLM 5.1 com modelo fixo.'
            }
        ]
    },
    deepseek: {
        id: 'deepseek',
        label: 'DeepSeek',
        shortLabel: 'DeepSeek',
        billingLabel: 'Pago por token',
        defaultModel: 'deepseek-v4-pro',
        apiKeyLabel: 'DeepSeek API Key',
        docsUrl: 'https://platform.deepseek.com/api_keys',
        baseUrl: 'https://api.deepseek.com/chat/completions',
        docsSteps: [
            'Acesse a plataforma DeepSeek.',
            'Abra API keys e crie uma chave.',
            'Garanta saldo ou créditos ativos antes de usar.'
        ],
        models: [
            {
                id: 'deepseek-v4-pro',
                label: 'DeepSeek V4 Pro',
                badge: 'Pago',
                billing: 'Pago por token',
                description: 'Modelo premium com contexto amplo e raciocínio forte.'
            },
            {
                id: 'deepseek-v4-flash',
                label: 'DeepSeek V4 Flash',
                badge: 'Pago',
                billing: 'Pago por token',
                description: 'Alternativa mais econômica para análises frequentes.'
            }
        ]
    },
    zai: {
        id: 'zai',
        label: 'Z.ai',
        shortLabel: 'Z.ai',
        billingLabel: 'Pago por token',
        defaultModel: 'glm-5.1',
        apiKeyLabel: 'Z.ai API Key',
        docsUrl: 'https://z.ai/model-api',
        baseUrl: 'https://api.z.ai/api/paas/v4/chat/completions',
        docsSteps: [
            'Acesse Z.ai Model API.',
            'Entre em API Keys e gere uma chave.',
            'Use a API geral para este app, não o endpoint exclusivo de Coding Plan.'
        ],
        models: [
            {
                id: 'glm-5.1',
                label: 'GLM 5.1',
                badge: 'Pago',
                billing: 'Pago por token',
                description: 'Modelo flagship da Z.ai para tarefas longas e escrita mais refinada.'
            }
        ]
    }
};

export const getProviderList = () => Object.values(PROVIDERS);

export const getProvider = (providerId) => PROVIDERS[providerId] || PROVIDERS.google;

export const getModelOptions = (providerId) => getProvider(providerId).models;

export const getDefaultModelForProvider = (providerId) => getProvider(providerId).defaultModel;

export const getModelOption = (providerId, modelId) => {
    const provider = getProvider(providerId);
    return provider.models.find((model) => model.id === modelId) || provider.models[0];
};
