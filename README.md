---
title: Nursing Council Agent
emoji: 🩺
colorFrom: purple
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
license: mit
x-lfs: true
---

# Nursing Council Agent

> **Part of [AI in Nursing Education: A Multimodal Learning Toolkit](https://practicedev.cloud/)**

[![Hugging Face Spaces](https://img.shields.io/badge/🤗%20Hugging%20Face-Spaces-blue)](https://huggingface.co/spaces/NurseCitizenDeveloper/Nursing-Council-Agent-V2)
[![AI in Nursing Education: A Multimodal Learning Toolkit](https://img.shields.io/badge/📚%20AI%20in%20Nursing-Toolkit-purple)](https://practicedev.cloud/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
![GitHub last commit](https://img.shields.io/github/last-commit/ClinyQAi/nursing-council-agent)

![Nursing Council Agent App](app_screenshot.png)

## About

The **Nursing Council Agent** is an AI-powered multi-perspective peer review tool designed specifically for nursing education. It leverages the "**Council of Models**" approach—originally pioneered by [Andrej Karpathy](https://github.com/karpathy/llm-council)—to provide comprehensive, balanced feedback on educational content.

This project demonstrates how **Generative AI** can enhance quality assurance in curriculum design while promoting the "**Nurse as Citizen Developer**" movement, empowering nursing professionals to build bespoke AI tools without deep software engineering expertise.

### Key Features

- 🎓 **Multi-Perspective Review**: Three AI personas (Academic, Clinical Mentor, Student Advocate) provide diverse feedback
- 🔑 **Bring Your Own Key (BYOK)**: Use your own API keys for OpenAI, Anthropic, Google Gemini, or DeepSeek
- 💾 **Persistent History**: Conversations saved securely via Azure Blob Storage
- 📄 **Export to PDF**: Generate professional feedback reports
- 🎭 **Custom Roles**: Add specialized reviewers (e.g., "Dementia Specialist", "Public Health Lead")
- 🔐 **Enterprise Ready**: Azure AD authentication for organizational security

## The Council Approach

Instead of asking one AI for feedback, the **Nursing Council** convenes three AI "experts" who each bring a different perspective:

| Role | Focus |
|------|-------|
| 🎓 **The Academic** | NMC Standards alignment, evidence-based practice, scholarly rigor |
| 🏥 **The Clinical Mentor** | Ward realism, clinical applicability, compassionate care |
| 👩‍🎓 **The Student Advocate** | Accessibility, clarity, diverse learning needs |

The **Head of Nursing Education** (Chairman) then synthesizes their feedback into actionable recommendations.

## Quick Start

### Hugging Face Spaces (Easiest)
Visit the [Live Demo](https://huggingface.co/spaces/NurseCitizenDeveloper/Nursing-Council-Agent-V2) and use the Settings ⚙️ icon to configure your own API key.

### Local Development (GitHub Codespaces)
1. **Fork this repository** to your GitHub account.
2. Click the green **"Code"** button → **"Open with Codespaces"**.
3. Create a `.env` file with your credentials.
4. Run `./start.sh` and make port **8001** public.

### Azure Deployment
This repository is optimized for **Azure Container Apps**:
- `AZURE_OPENAI_API_KEY` / `AZURE_OPENAI_ENDPOINT`: For LLM access
- `AZURE_STORAGE_CONNECTION_STRING`: For persistent history
- Enable **Easy Auth** (Microsoft provider) for enterprise security

## How It Works

![How Nursing Council Works](how_it_works.png)

## Citation

If you use this software in your research or practice, please cite it as:

> Lincoln Gombedza. (2025). Nursing Council Agent (Version 2.0.0) [Computer software]. https://github.com/ClinyQAi/nursing-council-agent

## License

MIT License - See [LICENSE](LICENSE) for details.

---

## About the Author

**Lincoln Gombedza** is a **Registered Learning Disability Nurse (RNLD)** and **Practice Educator** with a passion for leveraging AI to enhance nursing education and clinical practice. As the founder of Nursing Citizen Development, Lincoln champions the "Nurse as Citizen Developer" movement—empowering healthcare professionals to build their own AI-powered tools.

## Acknowledgements

This project would not be possible without the contributions of the open-source community:

- **[Andrej Karpathy](https://github.com/karpathy)** – For the original [llm-council](https://github.com/karpathy/llm-council) concept that inspired this adaptation
- **[LiteLLM](https://github.com/BerriAI/litellm)** – For providing unified LLM provider abstraction
- **[Hugging Face](https://huggingface.co)** – For hosting and community support
- **[Foundation of Nursing Studies (FoNS)](https://fons.org)** – For person-centred care principles that inform the review criteria
- **The NMC (Nursing and Midwifery Council)** – For standards that guide quality nursing education

Special thanks to all nursing educators and students who provided feedback during development.

---

**Built with ❤️ by Lincoln Gombedza @ [Nursing Citizen Development](https://practicedev.cloud)**

*Part of the [AI in Nursing Education: A Multimodal Learning Toolkit](https://practicedev.cloud/)*

