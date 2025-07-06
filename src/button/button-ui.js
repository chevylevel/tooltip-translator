// ButtonController.js

// Internal state
let currentButton = null;

/**
 * Initializes the Button Controller and sets up event listeners.
 */
function initializeButtonController() {
  // Nothing to do for initialization in this simple version
  // TODO: Could add global event listeners here if needed in future versions
}

/**
 * Shows a translate button for the selected text.
 * @param {DOMRect} selectionRect - The bounding rect of the selected text.
 * @param {Object} cursor - The cursor position when text was selected.
 * @param {Function} onClick - Callback function when button is clicked.
 * @returns {Object} An object with methods to control the button.
 */
export function showTranslateButton(selectionRect, cursor, onClick) {
  // Remove any existing button
  if (currentButton) {
    removeButton();
  }

  // Create new button
  const button = document.createElement('button');
  button.className = 'translate-button translate-ui';

  // Add button to DOM
  document.body.appendChild(button);

  // Add content to button (icon)
  appendButtonContent(button);

  // Position button
  positionButton(button, selectionRect, cursor);

  // Setup event listeners
  setupButtonEvents(button, onClick);

  // Store reference to current button
  currentButton = button;

  // Return control object
  return {
    remove: removeButton
  };
}

/**
 * Appends content to the button.
 * @param {HTMLElement} button - The button element.
 */
function appendButtonContent(button) {
  const icon = document.createElement('img');
  icon.src = browser.runtime.getURL('icon.svg')
  icon.className = 'translate-button__icon';
  button.appendChild(icon);
}

/**
 * Positions the button based on selectionRect and cursor.
 * @param {HTMLElement} button - The button element.
 * @param {DOMRect} selectionRect - The bounding rect of the selected text.
 * @param {Object} cursor - The cursor position when text was selected.
 */
function positionButton(button, selectionRect, cursor) {
  const { x, y } = calculateButtonPosition(
    selectionRect,
    cursor,
    button
  );

  button.style.left = `${x + window.scrollX}px`;
  button.style.top = `${y + window.scrollY}px`;
}

/**
 * Sets up event listeners for the button.
 * @param {HTMLElement} button - The button element.
 * @param {Function} onClick - Callback function when button is clicked.
 */
function setupButtonEvents(button, onClick) {
  function onDocumentClick(e) {
    if (!button.contains(e.target)) {
      removeButton();
    }
  }

  function handleClick() {
    removeButton();
    onClick();
  }

  button.addEventListener('click', handleClick);
  document.addEventListener('mousedown', onDocumentClick, true);

  // Store the document click handler on the button for later removal
  button._documentClickHandler = onDocumentClick;
}

/**
 * Removes the currently visible button, if any.
 */
function removeButton() {
  if (currentButton) {
    // Remove the document click event listener
    if (currentButton._documentClickHandler) {
      document.removeEventListener('mousedown', currentButton._documentClickHandler, true);
    }
    // Remove from DOM
    currentButton.remove();
    // Clear reference
    currentButton = null;
  }
}

/**
 * Calculates the optimal button position based on selection rect and cursor.
 * @param {DOMRect} selectionRect - The bounding rect of the selected text.
 * @param {Object} cursor - The cursor position when text was selected.
 * @param {HTMLElement} button - The button element.
 * @returns {Object} The x and y coordinates for positioning.
 */
function calculateButtonPosition(selectionRect, cursor, button) {
  const OFFSET = 2;
  const buttonRect = button.getBoundingClientRect();

  // Determine horizontal position based on cursor and selection
  const isCursorWithinSelectionRect = cursor.x >= selectionRect.left
    && cursor.x <= selectionRect.right;
  let x = isCursorWithinSelectionRect
    ? cursor.x - buttonRect.width / 2
    : (cursor.x < selectionRect.left
      ? selectionRect.left - buttonRect.width / 2
      : selectionRect.right - buttonRect.width / 2
    );

  // Determine vertical position based on cursor and selection
  const selectionCenterY = selectionRect.top + selectionRect.height / 2;
  let y = cursor.y < selectionCenterY
    ? selectionRect.top - buttonRect.height - OFFSET
    : selectionRect.bottom + OFFSET;

  // Clamp to viewport (basic)
  x = Math.max(0, Math.min(x, window.innerWidth - buttonRect.width));
  y = Math.max(0, Math.min(y, window.innerHeight - buttonRect.height));

  return { x, y };
}

// Export button controller functions
export { initializeButtonController, removeButton };
