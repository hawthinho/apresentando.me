const KNOWN_URL_PATTERN = /(https?:\/\/|www\.|linkedin\.com|github\.com|gitlab\.com|behance\.net|dribbble\.com|figma\.com|notion\.site|medium\.com|[a-z0-9-]+\.[a-z]{2,})/i;
const EMAIL_PATTERN = /^[^\s@|]+@[^\s@|]+\.[^\s@|]+$/;

export const splitContactItems = (contactInfo = []) => String(contactInfo.join(' | '))
    .split('|')
    .map((item) => item.trim())
    .filter(Boolean);

export const normalizeExternalUrl = (value = '') => {
    const text = String(value).trim();
    if (!KNOWN_URL_PATTERN.test(text)) return '';
    if (/^https?:\/\//i.test(text)) return text;
    if (/^www\./i.test(text)) return `https://${text}`;
    return `https://${text}`;
};

export const normalizePhoneDigits = (phone = '') => {
    const digits = String(phone).replace(/\D/g, '');
    if (digits.startsWith('00')) return digits.slice(2);
    return digits;
};

export const buildWhatsappUrl = (phone = '') => {
    const digits = normalizePhoneDigits(phone);
    if (digits.length < 12 || digits.length > 15) return '';
    return `https://wa.me/${digits}`;
};

export const getContactItemLink = (item = '', contact = {}) => {
    const text = String(item).trim();
    if (!text) return '';

    if (EMAIL_PATTERN.test(text)) return `mailto:${text}`;

    const itemDigits = normalizePhoneDigits(text);
    const contactPhoneDigits = normalizePhoneDigits(contact.phone);
    if (
        contact.phoneIsWhatsapp &&
        itemDigits &&
        contactPhoneDigits &&
        itemDigits === contactPhoneDigits
    ) {
        return buildWhatsappUrl(contact.phone);
    }

    return normalizeExternalUrl(text);
};
