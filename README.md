# Base64Coder — Encode, Decode & JWT Inspector

![Base64Coder Logo](assets/images/icons/b64c128.png)

> The ultimate Chrome extension for developers. Encode/decode text, inspect JWT tokens, and convert images to Base64 — all from your browser. No external websites needed.

[![Available on Chrome Web Store](https://img.shields.io/badge/Chrome-Install-4285F4?logo=googlechrome&logoColor=white)](https://chromewebstore.google.com/detail/base64coder-encode-decode/ebgonfpmppfndacngpbmgajldoabnjkm)
![Version](https://img.shields.io/badge/version-1.28-blue)
![Privacy](https://img.shields.io/badge/privacy-100%25_local-success)

---

## ✨ Features

- **🔤 Encode / Decode** — Convert text to and from Base64 instantly.
- **🔐 JWT Inspector** — Decode JSON Web Tokens and inspect their header, payload, and signature details.
- **🖼️ Image to Base64** — Drag & drop or select an image file to get its Base64 representation.
- **📋 Context Menu Integration** — Right-click on selected text anywhere in the browser to encode or decode it.
- **⚡ Lightning Fast** — All processing happens locally in your browser. Nothing is sent to a server.
- **🔒 100% Private** — Your data never leaves your machine. Fully offline-capable.

## 🚀 Installation

1. Visit the [Chrome Web Store listing](https://chromewebstore.google.com/detail/base64coder-encode-decode/ebgonfpmppfndacngpbmgajldoabnjkm).
2. Click **"Add to Chrome"**.
3. Pin the extension to your toolbar for quick access.

## 🖱️ Usage

### Popup
Click the Base64Coder icon in your toolbar to open the popup, where you can:

- Type or paste text into the input area and switch between **Encode** / **Decode** modes.
- Paste a JWT to automatically detect and decode it.
- Upload an image file to convert it to a Base64 data URI.

### Context Menu
Select any text on a webpage, right-click, and choose:
- **"Base64 Encode"** — Quickly encode the selected text.
- **"Base64 Decode"** — Quickly decode the selected text.

## 🛠️ Development

This repository contains the **landing page** for the Base64Coder Chrome extension.

### Project Structure

```
├── index.html          # Main landing page
├── styles.css          # Styles and layout
├── script.js           # Interactive functionality
├── assets/
│   └── images/
│       ├── icons/      # Extension icons (16px, 32px, 48px, 128px)
│       └── screenshots/ # Extension screenshots
└── README.md           # This file
```

### Run Locally

Simply open `index.html` in any modern browser — no build tools required.

```bash
# Clone the repository
git clone https://github.com/rodewitsch/base-64-coder-site.git

# Open the landing page
cd base-64-coder-site
start index.html
```

## 📄 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details (if applicable).

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/rodewitsch/base-64-coder-site/issues).

---

<p align="center">Made with ❤️ for developers everywhere.</p>
