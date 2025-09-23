# Ethical Dev Tools

[![Version](https://img.shields.io/visual-studio-marketplace/v/AnkitMalikTools.ethical-dev-tools.svg)](https://marketplace.visualstudio.com/items?itemName=AnkitMalikTools.ethical-dev-tools)
[![Installs](https://img.shields.io/visual-studio-marketplace/i/AnkitMalikTools.ethical-dev-tools.svg)](https://marketplace.visualstudio.com/items?itemName=AnkitMalikTools.ethical-dev-tools)
[![Ratings](https://img.shields.io/visual-studio-marketplace/r/AnkitMalikTools.ethical-dev-tools.svg)](https://marketplace.visualstudio.com/items?itemName=AnkitMalikTools.ethical-dev-tools)

**Ethical Dev Tools** is a collection of essential utilities for Visual Studio Code, designed to boost your productivity and streamline your development workflow. This extension provides a Diff Checker, Base64 Encoder/Decoder, YAML Validator, JWT Tool for creating, decoding, and verifying JSON Web Tokens (JWTs), and an Epoch Tool for timestamp conversions. More tools coming soon!


## Features

### Diff Checker
Easily compare two files or text snippets with the intuitive side-by-side diff checker. Quickly identify changes and merge code with confidence.

### Base64 Encoder/Decoder
Encode and decode Base64 strings directly within VS Code. No need to switch to a browser or other tools for this common task.

### YAML Validator
Validate YAML syntax and structure instantly. Perfect for configuration files, Docker Compose, Kubernetes manifests, and CI/CD pipelines. Get immediate feedback on syntax errors with detailed error messages.

### JWT Tool (Create, Decode & Verify JWT)
Create, decode, and verify JSON Web Tokens (JWT) directly in VS Code. Supports all major algorithms (HS256, RS256, ES256, and more). Instantly sign, inspect, and validate JWTs for authentication, authorization, and secure API development. Choose algorithm, input payload and secret, and get your JWT in seconds.

### Epoch Tool
Convert between Unix timestamps (epoch time) and human-readable dates effortlessly. Convert epoch timestamps to readable dates in UTC, ISO, and local formats. Convert human-readable dates back to epoch timestamps in both seconds and milliseconds. Perfect for debugging, API development, and working with time-based data.



![Ethical Dev Tools Demo](https://github.com/ankitmalikg2/ethical-dev-tools/raw/main/media/dev-tools-working.gif)  
*Demo of the Diff Viewer, Base64 Tool, and more in action.*

## Installation

1.  Open the **Extensions** sidebar in VS Code.
2.  Search for `Ethical Dev Tools`.
3.  Click **Install**.

Alternatively, you can install the extension from the [VS Code Marketplace](https://marketplace.visualstudio.com/items?itemName=AnkitMalikTools.ethical-dev-tools).


## Usage

### Diff Checker
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
2. Run the `Ethical Dev Tools: Create Diff View` command.

### Base64 Tool
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
2. Run the `Ethical Dev Tools: Base64 Tool` command.

### YAML Validator
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
2. Run the `Ethical Dev Tools: YAML Validator` command.
3. Paste your YAML content and click "Validate YAML" to check syntax.

### JWT Tool
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
2. Run the `Ethical Dev Tools: JWT Tool` command.
3. Switch between "Decode JWT" and "Create JWT" tabs.
4. For creation, enter your payload (JSON), secret, and select the desired algorithm (HS256, RS256, etc.).
5. Instantly copy, inspect, and validate JWTs for your authentication and API workflows.

### Epoch Tool
1. Open the Command Palette (`Ctrl+Shift+P` or `Cmd+Shift+P` on Mac).
2. Run the `Ethical Dev Tools: Epoch Tool` command.
3. Convert epoch timestamps to human-readable dates or vice versa.
4. View current Unix timestamp in real-time.



## Why Use Ethical Dev Tools?
- All-in-one developer toolkit for file comparison, encoding, YAML, JWT, and timestamp workflows
- No need for external websites or tools—everything runs locally in VS Code
- Secure, privacy-friendly, and open source
- Designed for productivity and modern developer needs

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for details on each release.


## Contributing

Contributions are welcome! Please see the [contributing guidelines](https://github.com/ankitmalikg2/ethical-dev-tools/blob/main/CONTRIBUTING.md) for more information.

---

**Keywords:** JWT, JSON Web Token, JWT Tool, VS Code JWT, decode JWT, create JWT, verify JWT, sign JWT, JWT algorithm, HMAC, RSA, ECDSA, PS256, HS256, RS256, ES256, authentication, authorization, developer tools, YAML, diff, base64, epoch, timestamp, unix time, date converter, productivity, secure API
