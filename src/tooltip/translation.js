export function createTranslationSection(translationText) {
  const translationSection = document.createElement("div");
  translationSection.className = "translate-tooltip__translation";
  const translationTextEl = document.createElement("div");
  translationTextEl.className = "translate-tooltip__text";
  translationTextEl.textContent = translationText;
  translationSection.appendChild(translationTextEl);

  return translationSection;
}

/**
 * Sends a translation request to the background script and updates the UI.
 */
export function requestTranslation(text, targetLang, translationTextEl) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: 'TRANSLATE_TEXT', text, targetLang },
      (response) => {
        if (chrome.runtime.lastError) {
          translationTextEl.textContent = "[Translation error]";
          return reject(new Error(chrome.runtime.lastError.message));
        }

        if (!response?.translated[0]?.text) {
          translationTextEl.textContent = "[Translation error]";
          return reject(new Error("Translation failed"));
        }

        translationTextEl.textContent = response.translated[0]?.text;
        resolve();
      }
    );
  });
}
