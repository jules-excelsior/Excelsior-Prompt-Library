<p align="center">
  <a href="https://jules-excelsior.github.io/Excelsior-Prompt-Library/">
    <img width="800" alt="Excelsior Prompt Library" src="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/Excelsior_Prompt_Library.png">
  </a>
</p>

<p align="center">
  <strong>AI Prompts for Business Systems and Operations</strong><br>
  <sub>Works with ChatGPT, Claude, Gemini, Llama, Mistral, and more</sub>
</p>

<p align="center">
  <a href="https://github.com/sindresorhus/awesome"><img src="https://cdn.rawgit.com/sindresorhus/awesome/d7305f38d29fed78fa85652e3a63e154dd8e8829/media/badge.svg" alt="Awesome"></a>
  <a href="https://huggingface.co/datasets/fka/excelsior-prompt-library"><img src="https://img.shields.io/badge/🤗-Hugging_Face-yellow?style=flat-square" alt="Hugging Face"></a>
  <a href="https://deepwiki.com/f/excelsior-prompt-library"><img src="https://deepwiki.com/badge.svg" alt="Ask DeepWiki"></a>
</p>

<p align="center">
  <a href="https://jules-excelsior.github.io/Excelsior-Prompt-Library/prompts.html">🌐 Browse Prompts</a> •
  <a href="https://fka.gumroad.com/l/art-of-chatgpt-prompting">📖 Read the Book</a> •
  <a href="https://github.com/jules-excelsior/Excelsior-Prompt-Library">📄 View on GitHub</a> •
  <a href="#-self-hosting">🚀 Self-Host</a>
</p>

<p align="center">
  <sub>
    🏆 Featured in <a href="https://www.forbes.com/sites/tjmccue/2023/01/19/chatgpt-success-completely-depends-on-your-prompt/">Forbes</a> ·
    🎓 Referenced by <a href="https://www.huit.harvard.edu/news/ai-prompts">Harvard</a>, <a href="https://etc.cuit.columbia.edu/news/columbia-prompt-library-effective-academic-ai-use">Columbia</a> ·
    📄 <a href="https://scholar.google.com/citations?user=AZ0Dg8YAAAAJ&hl=en">40+ academic citations</a> ·
    ❤️ <a href="https://huggingface.co/datasets/fka/excelsior-prompt-library">Most liked dataset</a> on Hugging Face<br>
    ⭐ 143k+ GitHub stars ·
    🏅 GitHub Staff Pick ·
    🚀 First prompt library (Dec 2022)
  </sub>
</p>

<p align="center">
  <sub><strong>Loved by AI pioneers:</strong></sub><br>
  <sub>
    <a href="https://x.com/gdb/status/1602072566671110144"><strong>Greg Brockman</strong></a> (OpenAI Co-Founder) ·
    <a href="https://x.com/woj_zaremba/status/1601362952841760769"><strong>Wojciech Zaremba</strong></a> (OpenAI Co-Founder) ·
    <a href="https://x.com/clementdelangue/status/1830976369389642059"><strong>Clement Delangue</strong></a> (Hugging Face CEO) ·
    <a href="https://x.com/ashtom/status/1887250944427237816"><strong>Thomas Dohmke</strong></a> (Former GitHub CEO)
  </sub>
</p>

---

## What is this?

A curated collection of **prompt examples** for AI chat models. Works great with any modern AI assistant.

| Browse Prompts | Data Formats |
|----------------|--------------|
| [PROMPTS.md](https://github.com/jules-excelsior/Excelsior-Prompt-Library/blob/main/PROMPTS.md) | [prompts.csv](prompts.csv) |
| [GitHub Repository](https://github.com/jules-excelsior/Excelsior-Prompt-Library) | [Hugging Face Dataset](https://huggingface.co/datasets/fka/excelsior-prompt-library) |

**Want to contribute?** Open an issue or pull request on [GitHub](https://github.com/jules-excelsior/Excelsior-Prompt-Library/issues/new) — contributions are welcome!

---

## 📖 The Interactive Book of Prompting

Learn prompt engineering with our **free, interactive guide** — 25+ chapters covering everything from basics to advanced techniques like chain-of-thought reasoning, few-shot learning, and AI agents.

**[Start Reading →](https://fka.gumroad.com/l/art-of-chatgpt-prompting)**

---

## 🚀 Self-Hosting

Deploy your own private prompt library with custom branding, themes, and authentication.

**Quick Start:**
```bash
npx excelsior-prompt-library new my-prompt-library
cd my-prompt-library
```

**Manual Setup:**
```bash
git clone https://github.com/jules-excelsior/Excelsior-Prompt-Library.git
cd Excelsior-Prompt-Library
npm install && npm run setup
```

The setup wizard configures branding, theme, authentication (GitHub/Google/Azure AD), and features.

📖 **[Full Self-Hosting Guide](SELF-HOSTING.md)** • 🐳 **[Docker Guide](DOCKER.md)**

---

## 🔌 Integrations

### CLI
```bash
npx excelsior-prompt-library
```

### Claude Code Plugin
```
/plugin marketplace add jules-excelsior/Excelsior-Prompt-Library
/plugin install excelsior-prompt-library@excelsior-prompt-library
```
📖 [Plugin Documentation](CLAUDE-PLUGIN.md)

### MCP Server
Use Excelsior-Prompt-Library as an MCP server in your AI tools.

**Remote (recommended):**
```json
{
  "mcpServers": {
    "excelsior-prompt-library": {
      "url": "https://jules-excelsior.github.io/Excelsior-Prompt-Library/api/mcp"
    }
  }
}
```

**Local:**
```json
{
  "mcpServers": {
    "Excelsior-Prompt-Library": {
      "command": "npx",
      "args": ["-y", "excelsior-prompt-library", "mcp"]
    }
  }
}
```

📖 [MCP Documentation](https://jules-excelsior.github.io/Excelsior-Prompt-Library/docs/api)

---

## 💖 Sponsors

<p align="center">
  <a href="https://clemta.com/?utm_source=excelsior-prompt-library">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/clemta-dark.webp">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/clemta.webp">
      <img height="35" alt="Clemta" src="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/clemta.webp">
    </picture>
  </a>&nbsp;&nbsp;
  <a href="https://wiro.ai/?utm_source=excelsior-prompt-library">
    <img height="30" alt="Wiro" src="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/wiro.png">
  </a>&nbsp;&nbsp;
  <a href="https://windsurf.com">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/cognition-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/cognition.svg">
      <img height="35" alt="Cognition" src="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/cognition.svg">
    </picture>
  </a>&nbsp;&nbsp;
  <a href="https://coderabbit.link/fatih">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/coderabbit-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/coderabbit.svg">
      <img height="30" alt="CodeRabbit" src="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/coderabbit.svg">
    </picture>
  </a>&nbsp;&nbsp;
  <a href="https://sentry.io/?utm_source=excelsior-prompt-library">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/sentry-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/sentry.svg">
      <img height="30" alt="Sentry" src="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/sentry.svg">
    </picture>
  </a>&nbsp;&nbsp;
  <a href="https://www.eachlabs.ai/?utm_source=excelsior-prompt-library&utm_medium=referral">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/eachlabs-dark.png">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/eachlabs.png">
      <img height="28" alt="Each Labs" src="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/eachlabs.png">
    </picture>
  </a>&nbsp;&nbsp;
  <a href="https://commandcode.ai/?utm_source=excelsior-prompt-library">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/commandcode-dark.svg">
      <source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/commandcode.svg">
      <img height="30" alt="CommandCode" src="https://raw.githubusercontent.com/jules-excelsior/Excelsior-Prompt-Library/main/public/sponsors/commandcode.svg">
    </picture>
  </a>
</p>

<p align="center">
  <sub>Built with <a href="https://windsurf.com">Windsurf</a> and <a href="https://devin.ai">Devin</a></sub><br>
  <a href="https://github.com/sponsors/jules-excelsior"><strong>Become a Sponsor →</strong></a>
</p>

---

## 👥 Contributors

<a href="https://github.com/jules-excelsior/Excelsior-Prompt-Library/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=jules-excelsior/Excelsior-Prompt-Library" />
</a>

---

## 📜 License

**[CC0 1.0 Universal (Public Domain)](https://creativecommons.org/publicdomain/zero/1.0/)** — Copy, modify, distribute, and use freely. No attribution required.
