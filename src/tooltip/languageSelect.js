import {
  getAvailableLanguages,
  getSelectedLanguage,
  setSelectedLanguage
} from './settings/languages';
import { requestTranslation } from './translation';

/**
 * Renders a dropdown for selecting the target language.
 * @param {Object} options - Options for the dropdown
 * @param {Array<{code: string, name: string}>} options.languages - List of language objects
 * @param {string} options.selected - Currently selected language
 * @param {function} options.onChange - Callback when language changes
 */
function createLanguageSelect({ languages, selected, onChange }) {
  const select = document.createElement('select');
  select.className = 'language-select-dropdown translate-tooltip__lang-select';

  languages.forEach(lang => {
    const option = document.createElement('option');
    option.value = lang.code;
    option.textContent = lang.name;
    if (lang.code === selected) option.selected = true;
    select.appendChild(option);
  });

  select.addEventListener('change', (e) => {
    onChange(e.target.value);
  });

  return select;
}

export async function getLanguageSelect({ originalText, translationTextEl }) {
  const languages = await getAvailableLanguages(requestAvailableLanguages);
  let selectedLang = await getSelectedLanguage();

  if (!languages || languages.length === 0) return null;
  // Check if the selected language is still available, otherwise reset to default
  if (!languages.some(lang => lang.code === selectedLang)) {
    selectedLang = 'en'; // Fallback to English
    await setSelectedLanguage(selectedLang);
  }

  const langSelect = createLanguageSelect({
    languages: languages.map(l => ({ code: l.code, name: l.name })),
    selected: selectedLang,
    onChange: async (newLang) => {
      await setSelectedLanguage(newLang);
      requestTranslation(originalText, newLang, translationTextEl);
    }
  });
  // Insert language select before translation section
  return langSelect;
}

async function requestAvailableLanguages() {
  const response = await chrome.runtime.sendMessage({ type: 'GET_LANGUAGES' });

  if (response && response.languages) {
    return response.languages;
  } else {
    console.error("Failed to fetch languages from background script:", response.error);

    return [];
  }
}
