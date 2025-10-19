import axios from 'axios';

const candidates = [
  (import.meta.env.VITE_LIBRETRANSLATE_URL || '').replace(/\/+$/, ''),
  'https://libretranslate.com',
  'https://libretranslate.de',
  'https://translate.argosopentech.com',
].filter(Boolean);

export async function translateText(text, targetLang = 'fr', fromLang = '') {
  if (!text?.trim()) return '';

  let lastErr;
  for (const base of candidates) {
    try {
      const url = `${base}/translate`;
      const res = await axios.post(
        url,
        {
          q: text,
          source: fromLang || 'auto',
          target: targetLang,
          format: 'text',
        },
        { headers: { 'Content-Type': 'application/json' }, timeout: 10000 }
      );
      return res.data?.translatedText || 'No translation found.';
    } catch (err) {
      lastErr = err;
      const status = err?.response?.status;
      const data = err?.response?.data;
      console.warn(`[LibreTranslate] failed at ${base}`, { status, data, message: err.message });
    }
  }
  throw new Error(lastErr?.message || 'Unable to translate text.');
}
