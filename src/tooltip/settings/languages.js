const AVAILABLE_LANGUAGES_KEY = 'availableLanguages';
const SELECTED_LANGUAGE_KEY = 'selectedLanguage';
const DEFAULT_LANGUAGE_CODE = 'en'; // Default to English

let cachedLanguages = null;
let cachedSelectedLanguage = null;

/**
 * Fetches available languages from storage or a provided source.
 * @param {Function} fetcher - Function to fetch languages if not in cache/storage.
 * @returns {Promise<Array<{code: string, name: string}>>}
 */
export async function getAvailableLanguages(fetcher) {
  if (cachedLanguages) {
    return cachedLanguages;
  }

  const stored = await browser.storage.local.get(AVAILABLE_LANGUAGES_KEY);

  if (stored[AVAILABLE_LANGUAGES_KEY]) {
    cachedLanguages = stored[AVAILABLE_LANGUAGES_KEY];

    return cachedLanguages;
  }

  if (fetcher) {
    try {
      const languages = await fetcher();
      cachedLanguages = languages;
      await browser.storage.local.set({ [AVAILABLE_LANGUAGES_KEY]: languages });

      return languages;
    } catch (error) {
      console.error("Failed to fetch and store languages:", error);

      return []; // Return empty on error
    }
  }

  return [];
}

/**
 * Returns the currently selected language.
 * @returns {Promise<string>}
 */
export async function getSelectedLanguage() {
  if (cachedSelectedLanguage) {
    return cachedSelectedLanguage;
  }

  const stored = await browser.storage.local.get(SELECTED_LANGUAGE_KEY);
  if (stored[SELECTED_LANGUAGE_KEY]) {
    cachedSelectedLanguage = stored[SELECTED_LANGUAGE_KEY];
    return cachedSelectedLanguage;
  }

  // If no language is selected, set and return default
  await setSelectedLanguage(DEFAULT_LANGUAGE_CODE);
  return DEFAULT_LANGUAGE_CODE;
}

/**
 * Sets the selected language.
 * @param {string} langCode - The language code to set.
 */
export async function setSelectedLanguage(langCode) {
  cachedSelectedLanguage = langCode;
  await browser.storage.local.set({ [SELECTED_LANGUAGE_KEY]: langCode });
}

/**
 * Clears cached languages and selected language.
 * Useful for testing or re-fetching.
 */
export function clearLanguageCache() {
  cachedLanguages = null;
  cachedSelectedLanguage = null;
}

