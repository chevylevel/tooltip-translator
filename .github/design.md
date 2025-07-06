# Project Design Context

## Tech Stack

- **Platform:** Firefox WebExtension API
- **Frontend:** Vanilla JavaScript (content scripts, UI logic)
- **Styling:** CSS (modular, per-feature)
- **Persistence:** `browser.storage.local` (WebExtension API) for language list and user preferences
- **Translation Service:** External translation API (must support both translation and language list endpoints)
- **Build Tool:** Vite
- **Testing:** (Optional) Jest or Mocha for unit tests

## Architectural Strategy

A modular, event-driven monolith using the WebExtension API and vanilla JavaScript.

- **Content Script Layer:** Handles DOM events, text selection, and UI injection (button, tooltip).
- **UI Modules:** Separate modules for button and tooltip logic, each responsible for rendering and event handling.
- **Translation Service Module:** Handles API requests for translation and language list, with caching and error handling.
- **Persistence Layer:** Uses `browser.storage.local` for storing the language list and user preferences (selected language).
- **Error Handling:** UI modules display error messages in the tooltip if the translation service or language list is unavailable.

## Key Modules and Responsibilities

- **Button Module:**
  - Renders and positions the translate button near the selected text.
  - Handles button click events to trigger the tooltip.

- **Tooltip Module:**
  - Renders the tooltip with original text, translation, and language dropdown.
  - Handles dropdown selection, error display, and closing logic.

- **Translation Service Module:**
  - Fetches available languages (on first use or when needed).
  - Fetches translations for the selected text and language.
  - Handles API errors and provides fallback logic.

- **Persistence Module:**
  - Saves and retrieves the language list and user’s selected language using `browser.storage.local`.

## Deployment & Runtime Environment

- **Build:** Vite is used for bundling and building the extension.
- **Target Browser:** Firefox (WebExtension API, Manifest v3).
- **Runtime:** Content scripts injected into web pages, background script for extension lifecycle.
- **Permissions:**
  - `storage` (for saving preferences and language list)
  - `activeTab` and `<all_urls>` (for content script injection)
  - Network access to translation API

## Non-Functional Requirements

- **Performance:**
  - UI must appear and respond within 200ms of user action.
  - Language list and user preferences must be cached locally to minimize API calls.

- **Reliability:**
  - Graceful error handling for network/API failures (clear error messages in tooltip).
  - Fallback to English and refetch language list if user’s preferred language is unavailable.

- **Usability:**
  - UI must not obscure selected text or extend outside the viewport.
  - Tooltip and button must be easily dismissible.

- **Security:**
  - Only necessary permissions are requested.
  - No user data is sent to third parties except for translation requests.

## Assumptions & Constraints

- The translation API provides both translation and a list of supported target languages.
- The extension is only required to support Firefox (other browsers may require adaptation).
- No frameworks are used in content scripts to maximize compatibility and minimize bundle size.
- User’s selected language and language list are stored per-browser profile.
