// translationProvider.js
// Service for interacting with translation provider (mock implementation)
const MS_ENDPOINT = 'https://api.cognitive.microsofttranslator.com';
const MS_LANGUAGES_ENDPOINT = `${MS_ENDPOINT}/languages`;
const MS_TRANSLATE_ENDPOINT = `${MS_ENDPOINT}/translate`;

const commonUrlSearchParams = new URLSearchParams({
  'api-version': '3.0',
});

const API_KEY = '';

/**
 * Translates text to the target language (mock).
 * @param {string} text - The text to translate.
 * @param {string} targetLang - The target language code.
 * @returns {Promise<string>} - Promise resolving to the translated text.
 */
export async function translateText(text, targetLang) {
  const urlSearchParams = new URLSearchParams([
    ...commonUrlSearchParams.entries(),
    ['to', targetLang]
  ]);

  try {
    const response = await fetch(`${MS_TRANSLATE_ENDPOINT}?${urlSearchParams}`, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': API_KEY,
        'Content-Type': 'application/json',
        'Ocp-Apim-Subscription-Region': 'westeurope'
      },
      body: JSON.stringify([{ Text: text }])
    });

    if (!response.ok) throw new Error('Failed to fetch translation');
    const data = await response.json();
    const translations = data[0].translations;
    // Convert to array of { code, name }
    return translations.map(({ to, text }) => ({ code: to, text }));
  } catch (error) {
    console.error('Error fetching translation from Microsoft Translator:', error);
    return [];
  }
}

/**
 * Fetches supported languages from Microsoft Translator Text API.
 * @returns {Promise<Array<{code: string, name: string}>>}
 */
export async function getLanguages() {
  const urlSearchParams = new URLSearchParams([
    ...commonUrlSearchParams.entries(),
    ['scope', 'translation']
  ]);

  try {
    const response = await fetch(new URL(`${MS_LANGUAGES_ENDPOINT}?${urlSearchParams}`));
    if (!response.ok) throw new Error('Failed to fetch languages');
    const data = await response.json();
    const languages = data.translation;
    // Convert to array of { code, name }
    return Object.entries(languages).map(([code, info]) => ({ code, name: info.name }));
  } catch (error) {
    console.error('Error fetching languages from Microsoft Translator:', error);
    return [];
  }
}
