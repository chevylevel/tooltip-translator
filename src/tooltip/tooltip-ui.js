import { getLanguageSelect } from './languageSelect';
import { getSelectedLanguage } from './settings/languages';
import {
  createTranslationSection,
  requestTranslation
} from './translation';

// Internal state
let currentTooltip = null;

/**
 * Initializes the Tooltip Controller and sets up event listeners.
 */
function initializeTooltipController() {
  // Nothing to do for initialization in this simple version
  // TODO: Could add global event listeners here if needed in future versions
}

function mousedownListener(e) {
  if (!currentTooltip.contains(e.target)) {
    removeTooltip();
  }
}

/**
 * Shows a translation tooltip for the selected text.
 * @param {DOMRect} selectionRect - The bounding rect of the selected text.
 * @param {string} originalText - The text to translate and display.
 * @returns {Object} An object with methods to control the tooltip.
 */
async function showTranslation(selectionRect, originalText) {
  // Remove any existing tooltip
  // TODO: Check if currentTooltip exists, remove it if it does
  if (currentTooltip) {
    removeTooltip();
  }

  // Create new tooltip
  const tooltip = document.createElement("div");
  tooltip.className = "translate-tooltip translate-ui";

  document.body.appendChild(tooltip);

  // Add content to tooltip first to get dimensions
  await appendTooltipContent(tooltip, originalText);

  // Place tooltip above or below text depending on available space
  positionTooltip(tooltip, selectionRect);

  currentTooltip = tooltip;

  // Setup click-away listener
  document.addEventListener("mousedown", mousedownListener);

  return {
    remove: removeTooltip,
  };
}

function positionTooltip(tooltip, selectionRect) {
  const OFFSET = 6;
  const tooltipRect = tooltip.getBoundingClientRect();
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Horizontal positioning
  let x = selectionRect.left + selectionRect.width / 2 - tooltipRect.width / 2;
  if (x < 0) {
    x = OFFSET;
  } else if (x + tooltipRect.width > viewportWidth) {
    x = viewportWidth - tooltipRect.width - OFFSET;
  }

  // Vertical positioning
  let y;
  const spaceBelow = viewportHeight - selectionRect.bottom;
  const spaceAbove = selectionRect.top;

  if (spaceBelow >= tooltipRect.height + OFFSET) {
    // Position below
    y = selectionRect.bottom + OFFSET;
  } else if (spaceAbove >= tooltipRect.height + OFFSET) {
    // Position above
    y = selectionRect.top - tooltipRect.height - OFFSET;
  } else {
    // Fallback to below if not enough space either way
    y = selectionRect.bottom + OFFSET;
  }

  // Set position styles
  tooltip.style.left = `${x + window.scrollX}px`;
  tooltip.style.top = `${y + window.scrollY}px`;
}

async function appendTooltipContent(tooltip, originalText) {
  // Create content container
  const content = document.createElement("div");
  content.className = "translate-tooltip__content";

  // Original text section
  const originalSection = document.createElement("div");
  originalSection.className = "translate-tooltip__original";

  const originalTextEl = document.createElement("div");
  originalTextEl.className = "translate-tooltip__text";
  originalTextEl.textContent = originalText;

  originalSection.appendChild(originalTextEl);
  content.appendChild(originalSection);

  // Translation section
  const translationSection = createTranslationSection();
  const translationTextEl = translationSection.querySelector(".translate-tooltip__text");
  const selectedLanguage = await getSelectedLanguage();
  await requestTranslation(originalText, selectedLanguage, translationTextEl);
  content.appendChild(translationSection);

  const langSelect = await getLanguageSelect({ originalText, translationTextEl });

  if (langSelect) {
    content.insertBefore(langSelect, translationSection);
  } else {
    const errorMessage = document.createElement("div");
    errorMessage.className = "translate-tooltip__error-message";
    errorMessage.textContent = "Error. Please try again later";
    content.insertBefore(errorMessage, translationSection);
  }

  tooltip.appendChild(content);

  // Setup close button
  const closeButton = document.createElement("button");
  closeButton.className = "translate-tooltip__close";
  closeButton.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14">
      <path d="M18 6L6 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>`;
  closeButton.setAttribute("aria-label", "Close");
  closeButton.onclick = () => {
    removeTooltip();
  };

  tooltip.appendChild(closeButton);
}

/**
 * Removes the currently visible tooltip, if any.
 */
function removeTooltip() {
  if (currentTooltip) {
    document.body.removeChild(currentTooltip);
    currentTooltip = null;
    document.removeEventListener("mousedown", mousedownListener);
  }
}

export { initializeTooltipController, showTranslation, removeTooltip };
