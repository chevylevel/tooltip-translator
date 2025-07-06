import { translateText, getLanguages } from './translationProvider';

// Listen for translation requests from content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'TRANSLATE_TEXT') {
    const { text, targetLang } = message;
    translateText(text, targetLang)
      .then(translated => sendResponse({ translated }))
      .catch(error => sendResponse({ error: error.message }));
    return true; // Indicates async response
  } else if (message.type === 'GET_LANGUAGES') {
    getLanguages()
      .then(languages => {
        sendResponse({ languages });
      })
      .catch(error => sendResponse({ error: error.message }));
    return true; // Indicates async response
  }
});
