# CLAUDE.md — Jules Villarta
> Personal instruction file for Claude. Load this at the start of any session to restore full context.

> ⚠️ **Always use the latest version of this file.** After any session where updates are made, download the updated CLAUDE.md and replace your saved copy. For claude.ai — paste this file plus your filled project template at the start of every session. For Claude Code — replace `~/.claude/CLAUDE.md` with the latest version so it auto-loads.

---

## Who I Am

**Jules Villarta** — mechanical engineer (BS), MBA, 20+ years in HR practice.  
Owner of **Excelsior Consultancy Services**, Talisay City, Cebu, Philippines (est. 2018).  
I serve SMEs across the Philippines, US, and Latin America.  
I build operational software and internal tools using an AI-assisted vibe coding approach.

**Positioning:** AI Systems Engineer and Builder

I design the systems that run your business. Then I build them. Most developers start from the code. I start from the business problem. With over 20 years of business and HR practice behind every decision, I diagnose the operation, design the system, and use AI as the execution layer. The result is software that actually fits how a business works.

---

## My Team

| Name | Role | Location | Specialty |
|------|------|----------|-----------|
| Sajeel Baig | Web Developer | Pakistan | WordPress, site conversions |
| Andrew Daugdaug | Web Developer | Cebu | Zapier, servers, databases |
| Riche Almagro | QA Consultant | Cebu | Quality assurance |

---

## My Tech Stack

- **Frontend:** Next.js 14, TypeScript, React, Tailwind CSS
- **Backend/DB:** Supabase or Neon (PostgreSQL) — used interchangeably depending on project; confirm which is active at session start
- **Hosting/Deploy:** Vercel, GitHub
- **AI/Automation:** Anthropic API, Zapier, Resend (email)
- **Cron/Uptime:** cron.org — used to keep services active and schedule background jobs
- **Terminal:** Git Bash on Windows
- **CMS/No-code:** WordPress (via Sajeel)

---

## My Vibe Coding Methodology

> *"You don't need to know everything to build something real. You need clarity, structure, and the discipline to keep iterating."*
> — Jules Villarta, Excelsior Consultancy Services

How I build operational software — without memorizing syntax. Claude must follow these 8 principles in every build session.

| # | Principle | Rule |
|---|-----------|------|
| 01 | **Propose Before You Build** | No code until the plan is clear. Always define scope, architecture, and sequence first. Eliminate wasted cycles — keep the build intentional. |
| 02 | **Feature Branches, Always** | Every new feature lives on its own Git branch. Nothing touches master until it's tested and stable. The production build is always protected. |
| 03 | **Real Database From Day One** | Supabase from the start — not JSON, not local workarounds. Scalable data structure is a foundation, never an afterthought. |
| 04 | **Push-to-Deploy Pipeline** | Test at localhost first — iterate until stable. Then Git Bash → push → Vercel auto-deploys. Only skip localhost if Jules explicitly requests a direct deploy. |
| 05 | **One AI, Fully Mastered** | Standardized on Claude across architecture, code, copy, and strategy. Deep fluency with one tool beats shallow use of many. |
| 06 | **Document As You Go** | SOPs, changelogs, and briefs are built alongside the product — not written after the fact. The work and its documentation grow together. |
| 07 | **Iteration Is The Real Skill** | Clear communication and precise problem framing produce better software than memorized syntax. The first output is always a starting point. |
| 08 | **Security and Vulnerability Checks by Default** | Every deployment passes basic security validation before release. Environment variables stay protected, dependencies get audited, database rules are reviewed, and production exposure is minimized from day one. |

**My workflow today:** Git Bash → Claude → Supabase → Vercel

**Practical security checklist per deployment:**
- Supabase RLS for database security
- Git branches for isolated testing
- Vercel environment variable protection
- npm audit for dependency vulnerabilities
- GitHub secret scanning
- Middleware and authentication guards
- HTTPS and deployment isolation

---

## How I Work with Claude

- **Give me exact terminal commands** — no ambiguity, no placeholders
- **Step-by-step guidance** — I work in Git Bash and follow instructions precisely
- **Show full code blocks** — don't truncate or summarize code
- **Tell me the file and line** — always specify where changes go
- **Flag breaking changes** — warn me before anything that could break production
- **Step-by-step: ask first** — For business, strategy, and concepts, skip the basics. For technical tasks (Git Bash commands, terminal navigation, code explanations), ask "Do you need step-by-step guidance?" and wait for a yes or no before proceeding. I am not an IT professional and I vibe code, so I don't always understand every line Claude writes.
- **Vibe coding style** — I describe what I want in plain language, you translate to code
- **Prefer single-file solutions** unless architecture clearly demands otherwise
- **Localhost first, deploy last** — always provide a way to test at `localhost` before pushing to Vercel. Only deploy directly if I explicitly say so. Corrections and iterations happen locally until I approve for final deploy. — before marking anything done, flag any exposed env variables, missing RLS rules, unprotected routes, or unaudited dependencies. Don't wait for me to ask.
- **Documentation on every project** — maintain or prompt me to update: `CHANGELOG.md` (what changed and why), `DOCS.md` or `/docs` folder (how the system works), and workflow notes (SOPs, process steps). Build these alongside the code, not after.

---

## My Brand System (Excelsior)

| Element | Value |
|---------|-------|
| Primary Color | Navy `#0d1117` |
| Accent Color | Gold `#b8975a` |
| Heading Font | Cormorant Garamond |
| Body Font | Jost |
| Tone | Luxury, authoritative, precise |

Apply this consistently across all Excelsior properties.

---

## Active Projects

### excelsiorblueprint.com
- **Repo:** `jules-excelsior/ghl-mastery` (master branch)
- **Platform:** Business Operations Mastery — digital course + community
- **Stack:** Next.js 14, Supabase, Vercel
- **Access tiers:** Free (M1–2), Core (M1–16), Pro (M1+)
- **Pending:** Restore M18+M21 lessons, LessonTemplate.tsx updates, extend Pro to M21, merge feat/module-17a, student journey test, real testimonials, Career Ops integration in M18

### Lex (Excelsior Messenger Bot)
- **URL:** excelsior-messenger-bot.vercel.app
- **Features:** Lead capture, lead scoring, Supabase persistence, Resend email notifications, web chat widget
- **Status:** Deployed; web widget pending Meta App Review

### julesvillarta.com
- Personal portfolio — Apple-style scroll animations, JSON-LD schemas, OG image, hamburger nav
- Brand narrative: "Operational software builder & AI systems strategist"

### ai-productbuilder.com
- Secondary personal brand site

### excelsior-consultancy.com
- Main company site — 7 service lines including HR Consulting, AI Solutions & Automation, Business Operations Consulting (ATG methodology)
- SEO strategy implemented: keyword tiers, LocalBusiness schema, blog calendar, robots.txt

### Career Ops (career-ops-web-beta.vercel.app)
- Seven-dimension job evaluator + pipeline tracker
- Integrated into excelsiorblueprint.com

### Southroads by CCF
- Luxury automotive repair website (Talisay City)
- Features: logo-matched animations, before/after photo gallery, mobile responsive

---

## Books on Amazon

Two published books by Jules Villarta, available on Amazon. Reference these accurately in any content, bios, or marketing copy.

| Title | Description | Amazon URL |
|-------|-------------|------------|
| **The Excelsior Standard** | The full framework behind the Align, Transform, and Grow (ATG) methodology. Practical steps, models, and execution guides for business owners. | amazon.com/dp/B0GTNH1KMK |
| **Claude Power User's** | Guide to using Claude as a power user. Positioned alongside Excelsior's AI tools and methodology. | amazon.com/dp/B0GX5DCY5D |

Both books are also linked from excelsior-consultancy.com/business under the Business Assessment Tool page.

---



| Type | Detail |
|------|--------|
| **Education** | BS Mechanical Engineering, Masters in Business Administration (MBA) |
| **Experience** | 20+ years in HR practice, full-time consultant |
| **Certification** | Entrepreneurship in Emerging Economies — edX Verified Certificate |
| **Certification** | Business Strategy Specialization — U.Va. Darden School, Coursera |
| **Certification** | Google Project Management: Professional Certificate — Google, Coursera |

**Positioning (julesvillarta.com):** HR Consultant & Business Operations Expert · Operational Software Builder & Business Systems Designer

> "I Design the Systems That Run Your Business. Then I Build Them."

---

## Portfolio (julesvillarta.com)

These are live products — do not contradict or misrepresent them in any content or copy.

| Project | Description | URL |
|---------|-------------|-----|
| **Lex** | Branded AI assistant for Excelsior — handles client inquiries 24/7, zero staffing cost | excelsior-consultancy.com |
| **Excelsior HR Advisor** | AI-powered HR advisor for Philippine labor law. 6 domains. Freemium SaaS (₱799/mo Pro) | excelsiorhrconsulting.com |
| **Business Operations Mastery** | 26-module training platform, 190+ lessons, 130+ templates, 3-tier access | excelsiorblueprint.com |
| **Remote Ops Mastery** | 9-module course for Filipino VAs/freelancers, 3 pricing tiers (₱499/₱1,499/₱3,999) | remoteopsmastery.com |
| **Excelsior Standard Diagnostic Scorecard** | 5-minute business readiness assessment using ATG framework — pre-qualifies leads | — |
| **Excelsior Financial Dashboard** | Custom financial visibility system replacing $500–$1,200/yr SaaS spend | excelsiordashboard.com |

**Proof points (use only as estimates in copy):**
- Training platform launched 60–70% faster than typical outsourced build
- Discovery call efficiency improved — unqualified leads reduced 30–40%
- Avoided $500–$1,200 in annual SaaS costs
- Two revenue-generating digital products with zero ongoing fulfillment cost

---

## Capabilities & Services (julesvillarta.com)

- Operational software design and AI-assisted development
- Internal platforms, dashboards, and business portals
- HR systems, onboarding tools, and people operations software
- Process diagnosis, workflow design, and implementation
- AI agents, decision tools, and reporting systems
- Revenue system design and digital product deployment

**Five problems I solve:**
1. Operational Drag — manual work, unclear processes, owner dependency
2. Revenue Gaps — expertise not structured into scalable revenue systems
3. Lead Quality Issues — lack of filtering and pre-qualification
4. Capacity Limits — growth constrained by headcount instead of systems
5. Disconnected Workflows — tools creating friction instead of flow

**Approach:** Diagnose → Design → Deploy (ATG framework — Align, Transform, Grow)

---

## My Business Context

**Excelsior Consultancy Services**
- HQ: Zone 5 Dumlog, Talisay City, Cebu, Philippines
- Extension: Basement 1, Horizons 101, General Maxilom Ave., Cebu City
- Operating since: 2018 (registered Philippine business)
- Markets: Philippines, US, Latin America
- Mobile: +639190760425
- Email: info@excelsior-consultancy.com
- Meta Ads account: `51960794`
- AI Bot as service: Messenger Bot installation is a client-facing offering with defined pricing tiers, onboarding form, and service contract
- Book Now: calendly.com/excelsiorconsultancys/30min

**Tagline:** *Align. Transform. Grow.*
**ATG Framework:**
- **Align** — understand the business, align goals with tailored strategies
- **Transform** — reshape outdated systems into efficient, future-ready processes
- **Grow** — build partnerships, grow sustainably

**Mission:** Empower businesses with strategic insights, expert guidance, and tailored solutions that drive efficiency, sustainability, and success.

**Vision:** Become a trusted and leading business consultancy delivering comprehensive, innovative, data-driven solutions locally and internationally.

---

## Excelsior Services (excelsior-consultancy.com/service)

7 core service lines — use these exactly as listed when writing proposals, bios, or any content.

| # | Service | Stack / Tags |
|---|---------|-------------|
| 01 | **Business Operations Consulting** | SOPs, Process Design, ATG Methodology, Ops Strategy |
| 02 | **Digital Product Development** | Next.js, Supabase, Vercel, Full-Stack |
| 03 | **AI Application Development** | Claude API, AI Agents, Workflow Automation, Custom Tooling |
| 04 | **Web Development** | WordPress, Custom Dev, Landing Pages, Enhancements |
| 05 | **Business Tools & Systems Integration** | HubSpot, Notion, Zapier, Google Workspace, Slack |
| 06 | **Online Training Programs** | Business Ops, Digital Tools, Self-Paced, Tiered Access |
| 07 | **HR Consulting** | HR Compliance, Quality Systems, KPIs & Metrics, Performance Management — backed by nearly 2 decades of hands-on HR practice across retail, manufacturing, healthcare, hospitality, trade |

---

## Excelsior Portfolio (excelsior-consultancy.com/portfolio)

**Key metrics:** 6,700+ organic followers grown · 4 AI-built products · 40% sales growth Q1 · 20+ years experience

### Digital Products & Education

| Product | Description | Pricing |
|---------|-------------|---------|
| **Remote Ops Mastery** | 9-module course for VAs, freelancers, small business owners. Covers client acquisition, Facebook Ads, HR, finance, business setup, agency scaling. 6 templates included. | Starter ₱499 / Core ₱1,499 / Pro ₱3,999 |
| **Business Operations Mastery** | Full-stack course platform. 17 modules, 85+ lessons, 85+ templates. Three pillars: business productivity tools, VA systems, HR operations. Auth, progress tracking, community forum, 3 tiers. | Free / Core / Pro |

### Social Media Management

| Client | Description | Result |
|--------|-------------|--------|
| **Mindset & Minerals** | Full TikTok & Facebook account management for lifestyle/wellness brand. Strategy, content, trend optimization, engagement. | 6,700+ followers grown organically |
| **Superbe PH** | TikTok content and account management for Philippine-based brand. Local market focus. | Content creation, audience engagement |

### Web Development & Design
Professional business website development led by Sajeel Baig. Full scope: design, content coordination, SEO optimization, UX improvements.

### Business Operations & Consulting

| Project | Description | Result |
|---------|-------------|--------|
| **Grocery & Convenience Mart Setup** | Ground-up retail build in Mactan, Cebu. Land acquisition, construction management, recruitment, POS, inventory, LGU compliance. | 40% sales growth Q1 · Full LGU compliance |
| **QMS Implementation** | Quality Management Systems for local and international clients, led by Riche Almagro. ISO certification, internal audits, system design. | Certifications achieved · Global client scope |

### Vibe Coded Products (Built by Jules)

| Product | Stack | Description |
|---------|-------|-------------|
| **Remote Ops Mastery** | Gumroad, PDF, Excel, Claude AI | Conceived, structured, and launched solo. Every component built and iterated using AI tools. |
| **Business Operations Mastery** | Next.js 14, Supabase, Vercel, Claude AI | Full-stack course platform built solo. Dev team available for WordPress conversion. |
| **Excelsior Chat Agent** | React, Vercel, Claude API, Secure Proxy | Branded multi-agent AI chat app. Secure API proxy architecture. Client-facing. |
| **Excelsior Financial Dashboard** | React, Supabase, Vercel, Claude AI | Real-time financial dashboard. Revenue, sales, expenses, P&L. Multi-client, multi-user. |

### Client Testimonials (use verbatim if needed)
- **RL (US)** — praised thorough cost/sales analysis, strategic sales forecasting, and business expansion projections
- **Cydel Ferolino, GM Southroads by CCF** — praised HR advice, recruitment strategy, and team-building seminar
- **Theodore KS (US)** — praised custom website development precision and user-friendly design
- **Caren Iwayan, RC Family Grocery** — praised grocery mart setup expertise and government reportorial compliance guidance

---

## Full Excelsior Team

Use this when team members need to be mentioned in content, proposals, or bios. Match exactly what is on the live site.

| Name | Role | Background |
|------|------|------------|
| **Jules Villarta** | Principal Consultant | 20+ years HR, admin, business management. 5 years international experience. BS ME, MBA. Founder of Excelsior. |
| **Keene Paolo Villarta** | Operations Officer | Coordinates staffing and day-to-day operations. DaVinci Resolve specialist, video editor for US-based client. |
| **Riche Almagro** | QA Consultant | 20+ years in quality systems, safety management, shipyard ops. ECE + MBA. Worked in PH, Kazakhstan, Malaysia. |
| **Atty. Francis Ocampo** | Legal Consultant | Registered Philippine lawyer, BS Accountancy (USC). Finance background at Keppel Kazakhstan. Corporate and compliance law. |
| **Mirza Sajeel Baig** | Web Developer | 5+ years WordPress & Shopify. Custom themes, Liquid, PHP, HTML, CSS, JS. Pakistan-based. |
| **Andrew Daugdaug** | IT Consultant | Web hosting, website admin, e-commerce, Microsoft 365, DNS, Nginx, IaaS. Cebu-based. Also vibe coder. |
| **Trisha Layaguin** | Admin Officer | Travel arrangements, ticketing, Philippine passport and visa processing. |
| **Lormilo Galo** | Real Estate Consultant | Strategic development and project execution. Former roles at Ayala Land, Landco Pacific, Genvi Development Corp. |

**Social channels:**
- LinkedIn: linkedin.com/in/excelsiorconsultancyservices
- Facebook: facebook.com/excelsiorconsultancyservices
- Instagram: instagram.com/excelsiorcebu
- Twitter/X: x.com/excelsiorcebu
- TikTok: tiktok.com/@excelsiorcebu88

---

## Content & Writing Style

- **Tone:** Professional, precise, no fluff
- **Format:** Use tables and code blocks liberally; use bullet lists sparingly in prose
- **Documents:** I produce business documents (contracts, onboarding forms, SOPs) — match formal Philippines business English
- **Technical writing:** Clear, sequential, numbered steps for dev work
- **Marketing copy:** Luxury positioning, benefit-led, authoritative — not hype
- **No robotic language:** Avoid overused AI words and phrases such as: delve, leverage, synergy, empower, utilize, seamlessly, cutting-edge, game-changer, robust, holistic, ecosystem, streamline, transformative, unlock, elevate, groundbreaking, tailored solutions, in today's fast-paced world, it's important to note, absolutely, certainly, of course, I'd be happy to, and similar filler phrases
- **No em-dashes as sentence connectors:** Do not use — (em dash) to join clauses in natural prose. Use plain sentence structure instead. Em dashes are only acceptable in tables or technical references.

---

## Databases & Key References

| Project | Database | Key Tables |
|---------|----------|------------|
| excelsiorblueprint.com | Supabase | lessons, modules, user_access, forum_posts |
| Lex bot | Supabase | leads, conversations, messages |
| excelsior-consultancy.com | — | Static/CMS |

---

## Personal Context

- Based in Cebu, Philippines (Philippine Standard Time, UTC+8)
- Interests: Philippine equities investing, built personal finance tools (Cash Flow, Investment Tracker, Net Worth workbook)
- Background blend: engineering precision + business strategy + HR depth

---

## Claude Code Project Structure

Use this folder structure for every Claude Code project. It keeps things clean, scalable, and production-ready.

```
my_project/
├── CLAUDE.md                  ← Project memory & rules
├── .claude/
│   ├── settings.json          ← Permissions & hooks
│   ├── settings.local.json    ← Local overrides (not committed)
│   └── commands/
│       ├── review.md          ← /review slash command
│       ├── deploy.md          ← /deploy slash command
│       ├── test-all.md        ← /test-all slash command
│       └── bootstrap.md       ← /bootstrap slash command
├── skills/                    ← Auto-activated skills (SKILL.md per skill)
├── agents/                    ← Subagent definitions
├── docs/
│   ├── architecture.md        ← System design overview
│   ├── api-reference.md       ← API endpoints & usage
│   └── onboarding.md          ← How to get started on this project
├── CHANGELOG.md               ← What changed and why
├── README.md                  ← Project overview
├── .env.example               ← Safe env variable template (no real values)
└── .gitignore
```

**Key rules:**
- Never commit `.env` or secrets — use `.env.example` with placeholder values only
- Keep `docs/` updated alongside every feature build (Principle 06)
- `CLAUDE.local.md` is personal and never committed — add to `.gitignore`

---

## Slash Commands (.claude/commands/)

Set these up once per project in Claude Code. They trigger reusable workflows.

| Command | Purpose |
|---------|---------|
| `/review` | Run a code review — check logic, security, naming, and structure |
| `/deploy` | Pre-deploy checklist — env vars, RLS, branch check, localhost verified |
| `/test-all` | Run through all test cases at localhost before pushing |
| `/bootstrap` | Set up a new project — scaffold folders, install deps, init DB |

---

## Hook Events (Claude Code)

Configured in `.claude/settings.json`. These run automatically at key moments.

| Hook | Trigger | Purpose |
|------|---------|---------|
| `PreToolUse` | Before any tool runs | Block unsafe actions |
| `PostToolUse` | After any write | Auto lint check |
| `SessionStart` | On launch | Load project context |
| `SessionEnd` | On close | Save session summary |
| `PreCommit` | Before git commit | Scan for exposed secrets |
| `Notification` | On events | Slack/webhook alerts |

---

## Context Management (Claude Code)

Monitor context usage during long sessions and act accordingly.

| Usage | Action |
|-------|--------|
| 0–60% | Work normally |
| 50–70% | Monitor usage — start wrapping up long threads |
| 70–80% | Run `/compact` to compress context |
| 80%+ | Clear mandatory — start a fresh session with updated CLAUDE.md |

---

## Commit Conventions

Use conventional commits on all projects. This feeds directly into CHANGELOG.md automatically.

```
feat: add lead scoring to Lex bot
fix: resolve RLS infinite recursion on user_access table
chore: update dependencies, run npm audit
docs: update architecture.md with new API routes
refactor: simplify LessonTemplate.tsx component
security: rotate Supabase service key, update env vars
```

**Format:** `type: short description (present tense, lowercase)`
**Types:** feat, fix, chore, docs, refactor, security, style, test

---

## File Naming & Folder Conventions

- Components: `PascalCase.tsx` (e.g. `LessonTemplate.tsx`)
- Utilities & helpers: `camelCase.ts` (e.g. `authGuard.ts`)
- API routes: `kebab-case` (e.g. `/api/lead-score`)
- Database files/scripts: `snake_case.sql` (e.g. `seed_lessons.sql`)
- Docs and changelogs: `UPPERCASE.md` (e.g. `CHANGELOG.md`, `README.md`)
- Environment files: `.env`, `.env.example` — never `.env.local` committed

---

## Review Checklist (Before Every Merge or Deploy)

Run through this before pushing to Vercel or merging to master.

- [ ] Tested at localhost — no errors
- [ ] No secrets or API keys in code or logs
- [ ] Supabase RLS rules checked
- [ ] Environment variables in Vercel — not hardcoded
- [ ] npm audit run — no critical vulnerabilities
- [ ] CHANGELOG.md updated with conventional commit summary
- [ ] Branch is feature branch — not committing directly to master
- [ ] docs/ updated if architecture or API changed

---

## How to Use This File

### claude.ai (this interface)
Paste both files at the start of every session:
1. This file (CLAUDE.md) — your global profile
2. The filled project template (CLAUDE-template.md) — project-specific rules

### Claude Code (desktop/local)
No pasting needed. Place files in the right folders and they load automatically.

**Global profile — do once, works everywhere:**
```
~/.claude/CLAUDE.md
```
Copy this file there. Claude Code loads it at the start of every session, for every project.

**Per project — do once per repo:**
```
C:/Users/Jules/projects/excelsiorblueprint/CLAUDE.md
C:/Users/Jules/projects/lex-bot/CLAUDE.md
C:/Users/Jules/projects/julesvillarta/CLAUDE.md
```
Save your filled project template as `CLAUDE.md` in each project root. Claude Code merges it with your global profile automatically.

**Optional — private local notes (not committed to Git):**
```
/your-project/CLAUDE.local.md
```
Add `CLAUDE.local.md` to `.gitignore`. Use for sandbox URLs, local test data, personal notes.

---

## Session Startup Checklist

When I start a new session, remind me to share:
1. Which project I'm working on
2. Current branch (`git branch`)
3. Any error messages in full
4. Relevant file paths
5. Which database is active — Supabase or Neon
6. Whether cron.org ping is set up for this project

---

*Last updated: May 2026*

---

## This Project — Excelsior Prompt Library

**What it is:** A searchable AI prompt library web app. Fork of the open-source `prompts.chat` project, rebranded for Excelsior with 93 curated business and operations prompts.

**Repo:** `jules-excelsior/Excelsior-Prompt-Library-fix`
**Local path:** `C:\Users\jules\projects\Excelsior-Prompt-Library-fix`
**Live URL:** jules-excelsior.github.io/Excelsior-Prompt-Library/

**Stack (different from usual Supabase projects):**
- Next.js 16, React 19, TypeScript, Tailwind CSS v4
- **Database:** Neon (PostgreSQL) via **Prisma** ORM
- **Auth:** NextAuth v5 (not Supabase Auth)
- **AI:** OpenAI API
- **Storage:** AWS S3
- **Testing:** Vitest
- **Error tracking:** Sentry
- **Hosting:** GitHub Pages (static) + Vercel (app)

**Key commands:**
```bash
npm run dev              # Start dev server at localhost:3000
npm run db:studio        # Open Prisma Studio (DB browser)
npm run db:seed-excelsior  # Seed Excelsior prompts
npm run build            # prisma generate + next build
npm run test             # Run Vitest tests
```

**Active branches:** `main`

**What Jules customized:**
- Excelsior rebrand — logo, colors, landing page
- 93 curated prompts seeded via `prisma/seed-excelsior-v2.ts`
- Removed third-party ads and irrelevant content
- Admin email set to excelsiorconsultancys@gmail.com

**Database:** Neon (not Supabase) — confirm `DATABASE_URL` and `DIRECT_URL` are set in `.env`
