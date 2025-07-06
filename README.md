# Tooltip Translator

A browser extension for translating selected text via a tooltip popup.

## Requirements

- **Operating System:** macOS, Windows, or Linux
- **Node.js:** version 18.x or higher
- **npm:** version 9.x or higher

## Installing Node.js and npm

1. Download and install Node.js from the official website: https://nodejs.org/
2. Verify installation:
   ```sh
   node -v
   npm -v
   ```

## Build Instructions

1. Clone the repository:
   ```sh
   git clone https://github.com/chevylevel/tooltip-translator.git
   cd tooltip-translator
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Build the project:
   ```sh
   npm run build
   ```

4. For development with automatic rebuild:
   ```sh
   npm run watch
   ```

## Running in Firefox

1. Make sure Firefox Developer Edition is installed.
2. Start the extension:
   ```sh
   npm run start:firefox
   ```

## Packaging for Distribution

```sh
npm run package
```

## Notes

- Firefox Developer Edition is required for running and testing the extension.
- All commands should be run from the project root directory.
- Update the repository URL in the instructions to match your GitHub repository.
