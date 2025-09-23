# Copilot Instructions for Ethical Dev Tools

## Overview
Ethical Dev Tools is a Visual Studio Code extension providing a suite of developer utilities: a side-by-side diff checker, Base64 encoder/decoder, and YAML validator. The extension is implemented in TypeScript and uses webviews for interactive tools.

## Architecture & Key Files
- `src/extension.ts`: Main entry point. Registers VS Code commands and manages webview panels for each tool.
- `src/diffView.html`, `src/base64Tool.html`, `src/yamlValidator.html`: Webview UIs for each tool. Communicate with the extension via `postMessage`.
- `package.json`: Declares extension commands, sidebar, and scripts for build/test.
- `media/`: Contains icons and demo assets.

## Developer Workflows
- **Build:**
  - Compile TypeScript: `npm run compile`
  - Watch mode: `npm run watch`
- **Lint:**
  - Run ESLint: `npm run lint`
- **Test:**
  - Run tests: `npm test`
- **Debug:**
  - Use VS Code's extension debugging (F5) to launch and test webviews interactively.

## Commands & Features
- `Ethical Dev Tools: Create Diff View` (`ethical-dev-tools.createDiff`): Opens a webview for file/text diffing.
- `Ethical Dev Tools: Base64 Tool` (`ethical-dev-tools.base64Tool`): Opens a webview for Base64 encode/decode.
- `Ethical Dev Tools: YAML Validator` (`ethical-dev-tools.yamlValidator`): Opens a webview for YAML validation.

## Patterns & Conventions
- **Webview Communication:**
  - Webviews send messages to the extension using `postMessage`. The extension listens for commands (e.g., `findDiff`, `validateYaml`) and responds with actions or error messages.
- **Panel Management:**
  - Only one panel per tool is open at a time. Reveals existing panels if already open.
- **Resource Loading:**
  - Webviews load HTML from `src/` and restrict local resource roots for security.
- **Strict TypeScript:**
  - `tsconfig.json` enforces strict type-checking.

## Integration & Dependencies
- Uses `js-yaml` for YAML parsing and validation.
- Uses `jsonwebtoken` for JWT-related features (future expansion).
- No backend or network dependencies; all logic runs locally in the extension host.

## Examples
- See `src/extension.ts` for command registration and webview setup.
- See `src/diffView.html` for the diff tool UI and message passing pattern.

## Additional Notes
- All tools are accessible via the Command Palette.
- The extension is designed for easy addition of new tools—follow the pattern in `extension.ts` and add a new HTML file in `src/`.

---
For more details, see `README.md` and `CHANGELOG.md`.
