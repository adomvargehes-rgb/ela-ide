export interface LegalDocument {
  id: string;
  title: string;
  category: "license" | "terms" | "privacy" | "ip" | "ai" | "third-party";
  summary: string;
  lastUpdated: string;
  sections: {
    heading: string;
    content: string;
  }[];
}

export const LEGAL_DOCUMENTS: LegalDocument[] = [
  {
    id: "proprietary-license",
    title: "Proprietary Software License Agreement (EULA)",
    category: "license",
    summary: "Governs the use, access, and distribution of ELA IDE as a closed-source, proprietary software product.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Grant of Proprietary License",
        content: `ELA IDE is a proprietary, closed-source software platform owned exclusively by [OWNER / COMPANY NAME] ("Licensor"). This Software is licensed, not sold. Subject to your strict compliance with this Agreement, Licensor grants you a limited, personal, non-exclusive, non-transferable, revocable, and non-sublicensable license to access and use ELA IDE solely for your internal or personal software development purposes.

All rights, titles, and interests not expressly granted to you under this Agreement are strictly and exclusively reserved by [OWNER / COMPANY NAME].`,
      },
      {
        heading: "2. Prohibited Uses and Distribution",
        content: `Except as expressly authorized in writing by [OWNER / COMPANY NAME], you shall not:
(a) Copy, duplicate, reproduce, distribute, republish, download, display, post, or transmit ELA IDE or any part thereof in any form or by any means;
(b) Sell, resell, rent, lease, sublicense, loan, distribute, assign, or otherwise commercially exploit ELA IDE or make it available to any third party on a software-as-a-service (SaaS), service bureau, or timesharing basis;
(c) Modify, translate, adapt, merge, or create derivative works of any part of ELA IDE;
(d) Remove, alter, cover, or obscure any copyright, trademark, patent, or other proprietary rights notices displayed on or within ELA IDE.`,
      },
      {
        heading: "3. Strict Reverse Engineering Prohibition",
        content: `To the maximum extent permitted by applicable law, you agree NOT to:
(a) Decompile, disassemble, reverse engineer, decrypt, extract, or otherwise attempt to derive or reconstruct the source code, underlying ideas, algorithms, file formats, or programming interfaces of ELA IDE;
(b) Circumvent, disable, or defeat any security controls, licensing checks, rate limiters, or digital rights management technologies implemented in ELA IDE;
(c) Use automated scraping, spiders, crawlers, or extraction tools to capture, replicate, or harvest proprietary workflows, UI layouts, or prompt engineering implementations.`,
      },
      {
        heading: "4. Termination and Remedies",
        content: `This License is effective until terminated. Your rights under this License will terminate automatically without notice if you fail to comply with any term hereof. Upon termination, you must immediately cease all access and use of ELA IDE. 

Licensor reserves the right to seek all remedies available at law and in equity for violations of this Agreement, including immediate injunctive relief, monetary damages, and attorney's fees.`,
      },
    ],
  },
  {
    id: "ip-policy",
    title: "Intellectual Property Protection Policy",
    category: "ip",
    summary: "Defines ownership of ELA IDE's architecture, UI/UX designs, trademarks, trade secrets, and proprietary workflows.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Scope of Proprietary Intellectual Property",
        content: `All intellectual property rights in and to ELA IDE—including but not limited to its software architecture, backend routers, client-side application code, user interface designs, visual layouts, typography systems, color schemes, animations, agent choreographies, system prompts, documentation, and product branding—are the sole and exclusive property of [OWNER / COMPANY NAME].

These materials are protected by national and international copyright laws, trademark laws, trade secret legislation, and international intellectual property treaties.`,
      },
      {
        heading: "2. Trade Secrets and Confidential Information",
        content: `The internal data routing mechanisms, token usage tracking algorithms, automated provider failover logic, multi-model orchestration pipelines, and system prompt engineering embedded within ELA IDE constitute valuable trade secrets and confidential information of [OWNER / COMPANY NAME]. Unauthorized access, disclosure, or utilization of these trade secrets is strictly prohibited.`,
      },
      {
        heading: "3. Prohibition on Commercial Imitation and Cloning",
        content: `You may not create, publish, or distribute any software application, web platform, desktop tool, or extension that imitates, replicates, or copies the distinctive look, feel, user journey, proprietary interface design, or architectural workflows of ELA IDE in a manner likely to cause confusion or misappropriate Licensor's proprietary innovations.`,
      },
      {
        heading: "4. Trademark Notices",
        content: `"ELA IDE", the ELA IDE logo, and associated branding marks are proprietary trademarks of [OWNER / COMPANY NAME]. No trademark or service mark license is granted herein. You may not use Licensor's trademarks without prior express written permission.`,
      },
    ],
  },
  {
    id: "ai-usage-policy",
    title: "AI Intellectual Property and Acceptable Usage Policy",
    category: "ai",
    summary: "Clarifies boundaries between proprietary ELA AI implementations, third-party AI models, user code ownership, and safety.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Ownership of AI Workflows vs. Third-Party Foundation Models",
        content: `(a) ELA IDE Proprietary Workflows: The system prompts, context aggregation heuristics, agent execution steps, diff generation logic, and multi-model router implementations designed specifically for ELA IDE represent original intellectual property owned by [OWNER / COMPANY NAME].
(b) Third-Party Foundation Models: ELA IDE provides unified routing to external AI models and APIs (including Google Gemini, Google Gemma, Meta Llama, DeepSeek, Anthropic Claude, OpenAI, and Mistral). [OWNER / COMPANY NAME] does NOT claim ownership of any third-party foundation models, weights, or provider infrastructure. All third-party models remain the intellectual property of their respective providers and are governed by their respective terms and licenses.`,
      },
      {
        heading: "2. User Code Ownership",
        content: `As between you and [OWNER / COMPANY NAME], you retain full ownership, copyright, and intellectual property rights in the software code, files, and creative projects you author, generate, or modify using ELA IDE ("User Artifacts"). 

Subject to applicable third-party model provider terms, ELA IDE asserts NO intellectual property claim over user-created software applications developed within the IDE.`,
      },
      {
        heading: "3. Acceptable AI Use and Prohibited Activities",
        content: `You agree to use ELA IDE's AI assistant exclusively for lawful development activities. You expressly agree NOT to use ELA IDE to:
(a) Generate malware, ransomware, viruses, keyloggers, or malicious exploitation tools;
(b) Violate the rights, privacy, or security of any third party;
(c) Engage in illegal surveillance, fraud, phishing, or financial manipulation;
(d) Exceed, bypass, or abuse API rate limits or automated quota controls.`,
      },
    ],
  },
  {
    id: "terms-of-service",
    title: "Terms of Service",
    category: "terms",
    summary: "Governs platform accounts, service availability, warranties, limitations of liability, and cloud storage terms.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Acceptance of Terms",
        content: `By creating an account, accessing, or using ELA IDE, you agree to be bound by these Terms of Service. If you do not agree to these terms, you may not access or use the platform.`,
      },
      {
        heading: "2. Account Security and User Responsibility",
        content: `You are responsible for maintaining the confidentiality of your credentials and API keys. Any activity originating from your account or associated API tokens is your sole legal and financial responsibility. You must notify [OWNER / COMPANY NAME] immediately of any suspected unauthorized access.`,
      },
      {
        heading: "3. Disclaimer of Warranties",
        content: `ELA IDE AND ALL ASSOCIATED SERVICES ARE PROVIDED ON AN "AS IS" AND "AS AVAILABLE" BASIS, WITHOUT WARRANTIES OF ANY KIND, WHETHER EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE. [OWNER / COMPANY NAME] SPECIFICALLY DISCLAIMS ALL IMPLIED WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND NON-INFRINGEMENT.

WE DO NOT WARRANT THAT ELA IDE WILL BE ERROR-FREE, UNINTERRUPTED, OR FREE OF VULNERABILITIES, OR THAT CODE GENERATED BY AI ASSISTANTS WILL BE BUG-FREE OR SUITABLE FOR PRODUCTION DEPLOYMENT WITHOUT INDEPENDENT HUMAN VERIFICATION.`,
      },
      {
        heading: "4. Limitation of Liability",
        content: `TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL [OWNER / COMPANY NAME], ITS AFFILIATES, OFFICERS, OR AGENTS BE LIABLE FOR ANY INDIRECT, PUNITIVE, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR EXEMPLARY DAMAGES, INCLUDING LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, ARISING OUT OF OR IN CONNECTION WITH YOUR ACCESS TO OR INABILITY TO USE ELA IDE.`,
      },
      {
        heading: "5. Governing Law and Jurisdiction",
        content: `These Terms shall be governed by and construed in accordance with the substantive laws of [JURISDICTION / COUNTRY], without regard to its conflict of law principles. Any legal disputes arising under this agreement shall be submitted to the exclusive jurisdiction of the competent courts of [JURISDICTION / COUNTRY].`,
      },
    ],
  },
  {
    id: "privacy-policy",
    title: "Privacy and Data Protection Policy",
    category: "privacy",
    summary: "Explains how user data, source code, API keys, and session information are handled with zero-code-retention standards.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Information We Collect",
        content: `We collect only information necessary to deliver and secure ELA IDE:
(a) Account Information: Email address, display name, and authentication tokens provided via Supabase Auth or OAuth providers.
(b) Operational Telemetry: Anonymized request counts, token consumption statistics, and error diagnostic logs to ensure service reliability.
(c) Local / Cloud Workspaces: Project files and settings you intentionally sync to cloud storage (Cloudflare R2 or encrypted database storage).`,
      },
      {
        heading: "2. Source Code Privacy and Zero-Training Commitment",
        content: `[OWNER / COMPANY NAME] DOES NOT SELL, RENT, OR MONETIZE YOUR PRIVATE SOURCE CODE OR PROJECT ARTIFACTS. 

Your source code is NOT used to train proprietary machine learning models without your explicit opt-in consent. When you submit prompts to AI providers via ELA IDE, data transmission is conducted strictly in accordance with each respective foundation model provider's developer data privacy policies.`,
      },
      {
        heading: "3. API Key Security",
        content: `Third-party API keys provided by users (BYOK) are stored locally in secure browser storage or encrypted database vaults. Server-side platform secrets are secured through Cloudflare Worker encrypted secrets. Raw API keys are never exposed in client bundles or public API responses.`,
      },
    ],
  },
  {
    id: "third-party-licenses",
    title: "Third-Party Licenses and Open-Source Attributions",
    category: "third-party",
    summary: "Lists all open-source libraries and third-party dependencies utilized under permissive open-source licenses.",
    lastUpdated: "November 2026",
    sections: [
      {
        heading: "1. Notice of Open-Source Components",
        content: `ELA IDE incorporates certain open-source software libraries under permissive licenses. These libraries remain the intellectual property of their respective authors and copyright holders. 

NOTICE: The inclusion of these open-source libraries does NOT grant any license, permission, or right in ELA IDE's proprietary, closed-source application codebase, UI designs, or branding.`,
      },
      {
        heading: "2. Key Third-Party Packages and Licenses",
        content: `The following open-source packages are acknowledged with gratitude:

• Monaco Editor: Copyright (c) Microsoft Corporation. Licensed under the MIT License.
• React & React-DOM: Copyright (c) Meta Platforms, Inc. and affiliates. Licensed under the MIT License.
• Next.js: Copyright (c) Vercel, Inc. Licensed under the MIT License.
• Tailwind CSS: Copyright (c) Tailwind Labs, Inc. Licensed under the MIT License.
• Lucide Icons: Copyright (c) Lucide Contributors. Licensed under the ISC License.
• Xterm.js: Copyright (c) Microsoft Corporation. Licensed under the MIT License.
• JSZip: Copyright (c) Stuart Knightley, David Duponchel, Franz Buchinger, António Afonso. Licensed under the MIT License.
• Supabase Client SDK: Copyright (c) Supabase, Inc. Licensed under the MIT License.`,
      },
      {
        heading: "3. Third-Party Foundation Models and APIs",
        content: `ELA IDE routes to third-party AI APIs developed by external companies. All trademarks, service marks, and model weights belong to their respective creators:
• Google Gemini & Gemma: Google LLC / Alphabet Inc.
• Llama Models: Meta Platforms, Inc.
• Claude Models: Anthropic PBC
• GPT Models: OpenAI, Inc.
• Groq LPU Inference Engine: Groq, Inc.
• DeepSeek Models: DeepSeek AI`,
      },
    ],
  },
];
