import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

function slugify(str: string): string {
  return str
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const CATEGORIES = [
  { name: "Coding & Development", slug: "coding-development", icon: "💻", order: 1 },
  { name: "Business Strategy", slug: "business-strategy", icon: "🎯", order: 2 },
  { name: "Business Operations", slug: "business-operations", icon: "⚙️", order: 3 },
  { name: "Business Finance", slug: "business-finance", icon: "📊", order: 4 },
  { name: "Personal Finance", slug: "personal-finance", icon: "💰", order: 5 },
  { name: "Human Resources", slug: "human-resources", icon: "👥", order: 6 },
  { name: "Marketing & Growth", slug: "marketing-growth", icon: "📈", order: 7 },
  { name: "Sales", slug: "sales", icon: "🤝", order: 8 },
  { name: "Content & Writing", slug: "content-writing", icon: "✍️", order: 9 },
];

const TAGS = [
  { name: "Productivity", slug: "productivity", color: "#3b82f6" },
  { name: "Analysis", slug: "analysis", color: "#8b5cf6" },
  { name: "Templates", slug: "templates", color: "#f59e0b" },
  { name: "Strategy", slug: "strategy", color: "#10b981" },
  { name: "Finance", slug: "finance", color: "#06b6d4" },
  { name: "Writing", slug: "writing", color: "#ec4899" },
  { name: "Coding", slug: "coding", color: "#14b8a6" },
  { name: "HR", slug: "hr", color: "#f97316" },
  { name: "Marketing", slug: "marketing", color: "#6366f1" },
  { name: "Sales", slug: "sales-tag", color: "#84cc16" },
  { name: "Planning", slug: "planning", color: "#ef4444" },
  { name: "Communication", slug: "communication", color: "#a855f7" },
  { name: "Leadership", slug: "leadership", color: "#0ea5e9" },
  { name: "Operations", slug: "operations", color: "#d97706" },
];

interface PromptDef {
  title: string;
  description: string;
  content: string;
  category: string;
  tags: string[];
  isFeatured?: boolean;
}

const PROMPTS: PromptDef[] = [
  // ── CODING & DEVELOPMENT ──────────────────────────────────────────────────
  {
    title: "Full-Stack Code Review",
    description: "Comprehensive code review covering quality, security, performance, and best practices.",
    category: "coding-development",
    tags: ["coding", "analysis"],
    isFeatured: true,
    content: `You are an expert senior software engineer conducting a thorough code review. Analyse the following code and provide structured feedback:

**1. Code Quality**
- Identify code smells, anti-patterns, and readability issues
- Suggest refactoring opportunities with specific examples
- Evaluate naming conventions and overall structure

**2. Security**
- Identify vulnerabilities (SQL injection, XSS, CSRF, insecure dependencies)
- Check input validation, authentication, and authorisation logic
- Flag hardcoded secrets or sensitive data exposures

**3. Performance**
- Identify bottlenecks, N+1 queries, or inefficiencies
- Suggest caching strategies and optimisation opportunities
- Review memory management

**4. Best Practices**
- Check error handling and logging completeness
- Assess test coverage gaps
- Review documentation quality

**5. Prioritised Action List**
Rank every finding as Critical / High / Medium / Low and provide a specific fix for each.

---
Code to review:
[PASTE CODE HERE]

Language / Framework: [SPECIFY]
Context: [DESCRIBE WHAT THIS CODE DOES]`,
  },
  {
    title: "Systematic Debug Assistant",
    description: "Step-by-step debugging guide to isolate and fix any software bug quickly.",
    category: "coding-development",
    tags: ["coding", "productivity"],
    content: `You are an expert debugger. Help me systematically resolve the following bug using this structured approach:

**Step 1 – Reproduce & Isolate**
- Confirm the exact steps to reproduce the bug
- Identify the smallest code path that triggers it
- Clarify expected vs actual behaviour

**Step 2 – Hypothesis Generation**
- List the top 3–5 most likely root causes ranked by probability
- For each hypothesis, explain the evidence that supports or contradicts it

**Step 3 – Diagnostic Plan**
- Suggest specific log statements, breakpoints, or tests to confirm the root cause
- Propose a safe way to test each hypothesis without breaking other functionality

**Step 4 – Fix & Verify**
- Provide the corrected code with an explanation of what changed and why
- Suggest a regression test to prevent this bug from recurring

---
Bug description: [DESCRIBE THE BUG]
Error message / stack trace: [PASTE HERE]
Relevant code: [PASTE HERE]
Environment: [OS, language, framework, version]`,
  },
  {
    title: "API Documentation Generator",
    description: "Generate clear, developer-friendly API documentation from code or spec.",
    category: "coding-development",
    tags: ["coding", "writing"],
    content: `You are a technical writer specialising in developer documentation. Generate clear, complete API documentation for the following endpoint(s):

For each endpoint provide:

### [METHOD] /path
**Description:** What this endpoint does and when to use it.

**Authentication:** Required auth method and headers.

**Request Parameters:**
| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|

**Request Body Example:**
\`\`\`json
{}
\`\`\`

**Response (200 OK):**
\`\`\`json
{}
\`\`\`

**Error Responses:**
| Status Code | Meaning | Resolution |
|-------------|---------|------------|

**Code Example:**
\`\`\`javascript
// Example API call
\`\`\`

**Notes:** Edge cases, rate limits, or important caveats.

---
Endpoint(s) to document: [PASTE CODE OR SPEC]
Target audience: [junior devs / external partners / internal team]`,
  },
  {
    title: "SQL Query Optimiser",
    description: "Analyse and optimise slow SQL queries with clear explanations.",
    category: "coding-development",
    tags: ["coding", "analysis"],
    content: `You are a database performance expert. Analyse the following SQL query and provide a complete optimisation report:

**1. Query Analysis**
- Explain what the query currently does (plain English)
- Identify performance problems (missing indexes, full table scans, subquery issues, etc.)
- Estimate the performance impact of each problem

**2. Execution Plan Review**
- Suggest how to run EXPLAIN / EXPLAIN ANALYZE for this query
- Interpret the key bottlenecks in the execution plan

**3. Optimised Query**
Provide the rewritten, optimised SQL with comments explaining each change.

**4. Indexing Recommendations**
List any indexes to create, with the exact CREATE INDEX statements.

**5. Schema Improvements**
If the schema itself is contributing to slowness, suggest structural changes.

---
SQL Query:
\`\`\`sql
[PASTE QUERY HERE]
\`\`\`

Database: [PostgreSQL / MySQL / SQL Server / etc.]
Table sizes (approx.): [DESCRIBE]
Current query runtime: [TIME]`,
  },
  {
    title: "Unit Test Generator",
    description: "Generate comprehensive unit tests covering happy paths, edge cases, and error conditions.",
    category: "coding-development",
    tags: ["coding", "productivity"],
    content: `You are a test-driven development expert. Generate a complete unit test suite for the following code:

**Coverage requirements:**
1. Happy path tests – expected inputs producing expected outputs
2. Edge cases – empty inputs, boundary values, maximum/minimum values
3. Error conditions – invalid inputs, null/undefined, exceptions
4. Integration points – mocked dependencies with both success and failure scenarios

**For each test:**
- Use descriptive test names following the pattern: "should [expected behaviour] when [condition]"
- Arrange / Act / Assert structure
- One assertion concept per test
- Mock external dependencies appropriately

**Also provide:**
- A coverage summary showing which branches are tested
- Any gaps in testability and how to refactor the code to improve them

---
Code to test:
[PASTE CODE HERE]

Testing framework: [Jest / Vitest / PyTest / etc.]
Language: [SPECIFY]`,
  },
  {
    title: "System Architecture Review",
    description: "Evaluate a system design for scalability, reliability, and security.",
    category: "coding-development",
    tags: ["coding", "strategy", "analysis"],
    content: `You are a principal software architect. Review the following system architecture and provide expert analysis:

**1. Scalability Assessment**
- Identify bottlenecks that will emerge at 10x / 100x current load
- Evaluate data storage choices and partitioning strategies
- Assess horizontal vs vertical scaling options

**2. Reliability & Resilience**
- Single points of failure and how to eliminate them
- Failover and disaster recovery gaps
- Data consistency and transaction handling

**3. Security Posture**
- Network security and trust boundaries
- Data encryption at rest and in transit
- Authentication, authorisation, and secrets management

**4. Operational Readiness**
- Observability: logging, metrics, tracing
- Deployment strategy and rollback capability
- On-call runbook requirements

**5. Recommendations**
Ranked list of improvements with estimated effort (S/M/L) and business impact.

---
Architecture description / diagram: [DESCRIBE OR PASTE DIAGRAM TEXT]
Current scale: [users, requests/sec, data volume]
Key constraints: [budget, team size, timeline]`,
  },
  {
    title: "Code Refactoring Planner",
    description: "Create a safe, incremental refactoring plan for legacy or messy code.",
    category: "coding-development",
    tags: ["coding", "planning"],
    content: `You are a senior engineer who specialises in technical debt reduction. Create a safe, incremental refactoring plan for the following code:

**1. Current State Assessment**
- What is this code doing and what are its key responsibilities?
- What are the primary problems (coupling, complexity, duplication, etc.)?
- Risk level: what breaks if this goes wrong?

**2. Refactoring Goals**
Define the target state in terms of:
- Readability and maintainability improvements
- Performance gains
- Testability improvements

**3. Step-by-Step Refactoring Plan**
Break the work into safe, independently deployable steps.
For each step:
- What to change
- How to verify nothing broke (tests, manual checks)
- Estimated time
- Rollback plan

**4. Quick Wins**
List 2–3 changes that can be done in under 30 minutes with high impact.

---
Code to refactor:
[PASTE CODE HERE]

Known constraints: [cannot change the API contract / must remain backward compatible / etc.]`,
  },
  {
    title: "Security Vulnerability Audit",
    description: "Identify and prioritise security vulnerabilities in code or infrastructure.",
    category: "coding-development",
    tags: ["coding", "analysis"],
    content: `You are a cybersecurity expert conducting a security audit. Perform a thorough security review of the following:

**Vulnerability Assessment** (check for each):
- Injection attacks (SQL, NoSQL, OS command, LDAP)
- Broken authentication and session management
- Sensitive data exposure (PII, credentials, keys)
- XML/JSON external entity attacks
- Broken access control and privilege escalation
- Security misconfiguration
- Cross-site scripting (XSS) and CSRF
- Using components with known vulnerabilities
- Insufficient logging and monitoring

**For each finding provide:**
- Severity: Critical / High / Medium / Low / Informational
- CWE or OWASP reference
- Exact location in code / config
- Proof of concept (how it could be exploited)
- Remediation steps with corrected code example

**Summary Report:**
- Total findings by severity
- Top 3 most urgent fixes
- Estimated remediation effort

---
Code / configuration to audit:
[PASTE HERE]

Environment: [production / staging / cloud provider]`,
  },

  // ── BUSINESS STRATEGY ────────────────────────────────────────────────────
  {
    title: "SWOT Analysis Framework",
    description: "Generate a structured SWOT analysis for a business, product, or decision.",
    category: "business-strategy",
    tags: ["strategy", "analysis"],
    isFeatured: true,
    content: `You are a strategic business consultant. Conduct a comprehensive SWOT analysis for the following:

**STRENGTHS** (internal, positive)
- Core competencies and competitive advantages
- Unique resources, assets, or capabilities
- Strong financial position or brand equity
- Talented team or proprietary technology

**WEAKNESSES** (internal, negative)
- Capability gaps or resource constraints
- Process inefficiencies or quality issues
- Weak brand presence or market position
- Financial vulnerabilities

**OPPORTUNITIES** (external, positive)
- Emerging market trends or unmet customer needs
- Competitive gaps to exploit
- Technology shifts enabling new business models
- Regulatory or economic tailwinds

**THREATS** (external, negative)
- Competitive pressures and new market entrants
- Regulatory or compliance risks
- Economic headwinds or market shifts
- Technology disruption risks

**Strategic Implications**
- SO Strategies: Use strengths to capture opportunities
- WO Strategies: Overcome weaknesses by leveraging opportunities
- ST Strategies: Use strengths to mitigate threats
- WT Strategies: Minimise weaknesses and avoid threats

**Top 3 Priority Actions** based on this analysis.

---
Business / product / decision to analyse: [DESCRIBE]
Industry: [SPECIFY]
Current stage: [startup / growth / mature]`,
  },
  {
    title: "Competitive Analysis Report",
    description: "Deep analysis of competitors to identify your strategic positioning.",
    category: "business-strategy",
    tags: ["strategy", "analysis"],
    content: `You are a market intelligence analyst. Prepare a comprehensive competitive analysis report:

**Market Overview**
- Market size and growth rate
- Key trends shaping the competitive landscape
- Customer segments and their primary needs

**Competitor Profiles** (for each competitor)
| Dimension | Our Company | Competitor A | Competitor B | Competitor C |
|-----------|-------------|--------------|--------------|--------------|
| Market share | | | | |
| Pricing | | | | |
| Product strengths | | | | |
| Product weaknesses | | | | |
| Target customer | | | | |
| Distribution | | | | |
| Brand perception | | | | |

**Competitive Positioning Map**
Describe where each player sits on the key dimensions that customers care most about.

**Gaps & Opportunities**
- Underserved customer segments
- Feature or service gaps competitors haven't addressed
- Pricing white space

**Strategic Recommendations**
- Where to compete vs where to avoid
- Differentiation strategy
- Quick wins to strengthen competitive position

---
Our company: [DESCRIBE]
Key competitors: [LIST]
Market / industry: [SPECIFY]`,
  },
  {
    title: "OKR Setting Workshop",
    description: "Create well-structured Objectives and Key Results for a team or company.",
    category: "business-strategy",
    tags: ["strategy", "planning", "productivity"],
    content: `You are an OKR coach. Help me set effective Objectives and Key Results for the following period:

**OKR Design Principles**
- Objectives: Inspiring, qualitative, time-bound (what we want to achieve)
- Key Results: Measurable, binary or percentage-based (how we know we achieved it)
- Aim for 3–5 KRs per Objective
- Score 0.7 = success; 1.0 = exceptional

**For each Objective:**

**Objective:** [Ambitious, motivating goal]

| Key Result | Baseline | Target | Owner |
|------------|----------|--------|-------|
| KR1: [Metric] increases from X to Y | | | |
| KR2: [Metric] increases from X to Y | | | |
| KR3: [Metric] increases from X to Y | | | |

**Initiatives** (projects that will drive each KR)

**Dependencies & Risks**

**Check-in Cadence** (weekly / bi-weekly)

**Common OKR Mistakes to Avoid:**
- Activities mistaken for outcomes
- Too many OKRs (max 3 objectives per team)
- KRs that cannot be measured
- Sandbagging targets

---
Team / department: [SPECIFY]
Time period: [Q1 2025 / H1 2025 / etc.]
Company strategy context: [DESCRIBE TOP PRIORITIES]
Previous quarter performance: [OPTIONAL]`,
  },
  {
    title: "Market Entry Strategy",
    description: "Build a go-to-market strategy for entering a new market or launching a product.",
    category: "business-strategy",
    tags: ["strategy", "planning", "marketing"],
    content: `You are a go-to-market strategist. Develop a comprehensive market entry strategy:

**1. Market Assessment**
- Total addressable market (TAM), serviceable addressable market (SAM), serviceable obtainable market (SOM)
- Customer segmentation and ideal customer profile (ICP)
- Key buying triggers and decision-making process
- Regulatory or compliance requirements

**2. Value Proposition**
- Core problem being solved
- Our unique solution and differentiation
- Quantified customer value (time saved, cost reduced, revenue gained)
- Key messaging for each customer segment

**3. Channel Strategy**
- Primary distribution channels (direct, partner, marketplace, etc.)
- Customer acquisition strategy for each channel
- Channel economics (CAC, expected conversion rates)

**4. Pricing Strategy**
- Pricing model options and recommendation
- Competitive pricing context
- Upsell/expansion revenue paths

**5. Launch Roadmap**
- Phase 1 (0–3 months): Pilot / soft launch
- Phase 2 (3–6 months): Scale
- Phase 3 (6–12 months): Optimise

**6. Success Metrics & Milestones**

---
Product / service: [DESCRIBE]
Target market: [geography, industry, company size]
Budget: [APPROXIMATE]
Timeline: [DESIRED LAUNCH DATE]`,
  },
  {
    title: "Strategic Risk Assessment",
    description: "Identify, assess, and create mitigation plans for business risks.",
    category: "business-strategy",
    tags: ["strategy", "analysis", "planning"],
    content: `You are a risk management consultant. Conduct a comprehensive strategic risk assessment:

**Risk Identification**
Analyse risks across these categories:
- Strategic risks (competition, market shifts, M&A)
- Operational risks (process failures, key person dependency)
- Financial risks (cash flow, credit, currency)
- Compliance & regulatory risks
- Technology & cybersecurity risks
- Reputational risks

**Risk Register**
| Risk | Category | Likelihood (1–5) | Impact (1–5) | Risk Score | Owner |
|------|----------|-----------------|--------------|------------|-------|

**Risk Matrix**
Plot each risk on a 5×5 likelihood vs impact matrix and identify the top priority quadrant.

**Mitigation Plans** (for high-priority risks):
For each risk score ≥ 15:
- Mitigation strategy (avoid / reduce / transfer / accept)
- Specific actions and timeline
- Residual risk after mitigation
- Early warning indicators

**Risk Monitoring Plan**
- Metrics to track each risk
- Review frequency
- Escalation triggers

---
Business / project: [DESCRIBE]
Industry: [SPECIFY]
Key concerns: [ANY SPECIFIC RISKS YOU ARE AWARE OF]`,
  },
  {
    title: "Business Model Canvas",
    description: "Map out or evaluate a complete business model using the canvas framework.",
    category: "business-strategy",
    tags: ["strategy", "planning"],
    content: `You are a business design consultant. Complete a Business Model Canvas analysis:

**1. Customer Segments**
Who are we creating value for? What are our most important customers?

**2. Value Propositions**
What value do we deliver? Which customer problems are we solving? What bundles of products/services are we offering?

**3. Channels**
How do we reach our Customer Segments? How are our channels integrated? Which ones work best and are most cost-efficient?

**4. Customer Relationships**
What type of relationship does each segment expect? Which ones have we established? How costly are they?

**5. Revenue Streams**
For what value are our customers willing to pay? What are the pricing mechanisms?

**6. Key Resources**
What Key Resources do our Value Propositions require? (Physical, intellectual, human, financial)

**7. Key Activities**
What Key Activities do our Value Propositions require?

**8. Key Partnerships**
Who are our Key Partners? What Key Resources are we acquiring from partners?

**9. Cost Structure**
What are the most important costs? Which Key Resources and Activities are most expensive?

**Analysis & Recommendations**
- Strongest elements of the business model
- Vulnerabilities and gaps
- Top 3 improvements to increase profitability or defensibility

---
Business / product to analyse: [DESCRIBE]`,
  },
  {
    title: "Quarterly Business Review (QBR) Prep",
    description: "Structure and prepare a compelling Quarterly Business Review presentation.",
    category: "business-strategy",
    tags: ["strategy", "communication", "planning"],
    content: `You are a business performance consultant. Help me prepare a compelling Quarterly Business Review (QBR):

**Executive Summary** (1 slide)
- Key achievements this quarter
- Overall performance vs targets
- Top 3 priorities for next quarter

**Performance Dashboard**
For each key metric:
| Metric | Q Target | Q Actual | Variance | Trend |
|--------|----------|----------|----------|-------|

**What Went Well**
- Top 3 wins with quantified impact
- What drove these results (replicable insights)

**What Needs Improvement**
- Honest assessment of misses
- Root cause analysis (not excuses)
- Specific corrective actions with owners and deadlines

**Key Learnings**
- What we learned about our customers, market, or operations
- How we are adapting our approach

**Next Quarter Plan**
- Objectives with measurable targets
- Top initiatives and resource requirements
- Risks and mitigation plans

**Asks / Decisions Needed**
- Specific decisions or support required from leadership

---
Business unit / team: [SPECIFY]
Quarter: [Q? YYYY]
Key metrics to cover: [LIST]
Audience: [CEO / Board / Investors / etc.]`,
  },

  // ── BUSINESS OPERATIONS ───────────────────────────────────────────────────
  {
    title: "Standard Operating Procedure (SOP) Writer",
    description: "Create clear, step-by-step SOPs for any business process.",
    category: "business-operations",
    tags: ["operations", "templates", "productivity"],
    isFeatured: true,
    content: `You are an operations excellence consultant. Write a comprehensive Standard Operating Procedure (SOP) for the following process:

**SOP Header**
- Process Name:
- SOP Number:
- Version:
- Effective Date:
- Owner:
- Approved By:

**1. Purpose**
Why this process exists and what it achieves.

**2. Scope**
What is included and excluded. Which teams or roles this applies to.

**3. Roles & Responsibilities**
| Role | Responsibilities |
|------|-----------------|

**4. Prerequisites**
Tools, access, materials, or knowledge required before starting.

**5. Step-by-Step Procedure**
For each step:
- **Step [N]: [Step Name]**
  - Action: [Exact action to take]
  - How to: [Detailed instructions]
  - Expected output: [What success looks like]
  - If something goes wrong: [Escalation path]

**6. Quality Checks**
Key checkpoints to verify the process was completed correctly.

**7. Common Mistakes & How to Avoid Them**

**8. Related Documents & Resources**

---
Process to document: [DESCRIBE IN DETAIL]
Current pain points: [WHAT GOES WRONG TODAY]`,
  },
  {
    title: "Process Optimisation Analysis",
    description: "Identify bottlenecks and inefficiencies in a business process and redesign it.",
    category: "business-operations",
    tags: ["operations", "analysis", "productivity"],
    content: `You are a process improvement specialist (Lean / Six Sigma). Analyse and optimise the following business process:

**1. Current State Mapping**
Map the process as-is:
- All steps in sequence
- Time taken for each step
- Who performs each step
- Handoff points between people/teams
- Decision points and their outcomes

**2. Waste Identification** (using Lean TIMWOOD framework)
- Transportation: unnecessary movement of information/materials
- Inventory: work queued or waiting
- Motion: unnecessary actions
- Waiting: idle time between steps
- Overproduction: doing more than needed
- Over-processing: unnecessary steps
- Defects: errors requiring rework

**3. Root Cause Analysis**
For the top 3 bottlenecks, use the 5 Whys to find root causes.

**4. Future State Design**
Redesigned process with:
- Steps eliminated or automated
- Estimated time savings
- Quality improvement expected

**5. Implementation Roadmap**
Quick wins (this week) / Short-term (1 month) / Long-term (3 months)

---
Process to optimise: [DESCRIBE]
Current average time to complete: [TIME]
Frequency: [How often this process runs]
Main pain points: [DESCRIBE]`,
  },
  {
    title: "KPI Dashboard Design",
    description: "Design the right KPIs and metrics dashboard for a team or business function.",
    category: "business-operations",
    tags: ["operations", "analysis", "planning"],
    content: `You are a business intelligence consultant. Design a KPI framework and dashboard for the following function:

**1. Strategic Alignment**
Map each KPI to a specific business objective:
| Business Objective | KPI | Why This Metric Matters |
|-------------------|-----|------------------------|

**2. KPI Definitions** (for each metric)
- **Name:** [Metric name]
- **Definition:** [Exact calculation]
- **Data Source:** [Where the data comes from]
- **Frequency:** [Daily / Weekly / Monthly]
- **Owner:** [Who is accountable]
- **Target:** [What good looks like]
- **Threshold:** [When to escalate / investigate]

**3. Leading vs Lagging Indicators**
Balance the dashboard with both:
- Lagging: Revenue, profit, customer satisfaction (outcomes)
- Leading: Pipeline, activity metrics, early warning signals

**4. Dashboard Layout**
Recommend the visual structure: executive summary, drill-down sections, alert indicators.

**5. Common Pitfalls to Avoid**
- Vanity metrics with no actionable insight
- Too many KPIs (recommend max 8–10)
- Metrics that can be gamed

---
Business function: [sales / operations / finance / HR / etc.]
Team size: [NUMBER]
Key business goals: [DESCRIBE]
Current reporting tools: [Excel / Tableau / Power BI / etc.]`,
  },
  {
    title: "Meeting Agenda Builder",
    description: "Create structured, time-boxed meeting agendas that drive decisions.",
    category: "business-operations",
    tags: ["operations", "communication", "productivity"],
    content: `You are a meeting facilitator. Create a structured, effective meeting agenda:

**Meeting Details**
- Purpose: [What decision or outcome is needed]
- Duration: [TIME]
- Required attendees: [ROLES]
- Optional attendees: [ROLES]
- Pre-read / preparation required: [LIST]

**Agenda**
| Time | Item | Owner | Type | Expected Output |
|------|------|-------|------|----------------|
| 0:00–0:05 | Welcome & context | Facilitator | Info | Shared understanding |
| 0:05–0:?? | [Agenda item 1] | [Owner] | Discussion/Decision/Update | [Output] |
| ... | | | | |
| Last 5 min | Summary & next steps | Facilitator | Action | Clear owners + deadlines |

**Decision Framework**
For each decision item, clarify:
- What decision needs to be made?
- Who has final authority (RACI)?
- What information is needed to decide?

**Post-Meeting Actions Template**
| Action | Owner | Due Date |
|--------|-------|----------|

**Ground Rules** (optional but recommended for recurring meetings)

---
Meeting type: [weekly standup / strategy review / project kickoff / etc.]
Key topics to cover: [LIST]
Desired outcome: [DECISION / ALIGNMENT / UPDATE]`,
  },
  {
    title: "Vendor Evaluation Scorecard",
    description: "Evaluate and compare vendors objectively with a weighted scoring framework.",
    category: "business-operations",
    tags: ["operations", "analysis", "templates"],
    content: `You are a procurement specialist. Build a vendor evaluation framework for the following purchase:

**Evaluation Criteria** (weighted by importance)
| Criteria | Weight | Description |
|----------|--------|-------------|
| Product/Service Quality | ??% | Does it meet our requirements? |
| Pricing & Total Cost of Ownership | ??% | All-in cost over contract period |
| Vendor Stability & Reputation | ??% | Financial health, references, track record |
| Support & SLA | ??% | Response times, escalation paths |
| Implementation & Onboarding | ??% | Time to value, transition risk |
| Scalability & Roadmap | ??% | Can they grow with us? |
| Security & Compliance | ??% | Data protection, certifications |

**Scoring Matrix** (score each vendor 1–5 per criterion)
| Criterion | Weight | Vendor A | Vendor B | Vendor C |
|-----------|--------|----------|----------|----------|
| [Criterion] | ??% | Score | Score | Score |
| **Weighted Total** | 100% | | | |

**Reference Check Questions**
1. How long have you used this vendor?
2. What problems have you encountered and how were they handled?
3. Would you renew the contract? Why / why not?

**Risk Assessment** for each shortlisted vendor.

**Recommendation** with justification.

---
What you are procuring: [SOFTWARE / SERVICE / HARDWARE / etc.]
Budget range: [APPROXIMATE]
Contract length: [DESIRED TERM]
Critical requirements: [LIST NON-NEGOTIABLES]`,
  },
  {
    title: "Project Status Report",
    description: "Write a clear, concise project status report for stakeholders.",
    category: "business-operations",
    tags: ["operations", "communication", "templates"],
    content: `You are a project manager. Write a professional project status report:

**Project:** [NAME]
**Report Date:** [DATE]
**Project Manager:** [NAME]
**Overall Status:** 🟢 On Track / 🟡 At Risk / 🔴 Off Track

---

**Executive Summary** (3 sentences max)
Current state of the project, key achievement this period, and top concern.

**Progress This Period**
- ✅ [Completed milestone or deliverable]
- ✅ [Completed milestone or deliverable]
- 🔄 [In progress item — X% complete]

**Upcoming Milestones**
| Milestone | Due Date | Status | Owner |
|-----------|----------|--------|-------|

**Budget Summary**
| | Planned | Actual | Variance |
|--|---------|--------|---------|
| Spend to date | | | |
| Forecast to complete | | | |

**Risks & Issues**
| Item | Type | Impact | Mitigation |
|------|------|--------|------------|

**Decisions Required**
List any decisions needed from stakeholders before the next period.

**Next Period Plan**
Top 3 priorities for the coming week/fortnight.

---
Project context: [BRIEF DESCRIPTION]
Reporting period: [DATES]
Key stakeholders: [LIST]`,
  },

  // ── BUSINESS FINANCE ─────────────────────────────────────────────────────
  {
    title: "Financial Statements Analyser",
    description: "Interpret P&L, balance sheet, and cash flow statements to extract business insights.",
    category: "business-finance",
    tags: ["finance", "analysis"],
    isFeatured: true,
    content: `You are a CFO-level financial analyst. Analyse the following financial statements and provide a comprehensive assessment:

**1. Profitability Analysis**
- Gross margin trend and drivers
- Operating margin analysis
- EBITDA and net margin commentary
- Revenue quality (recurring vs one-time)

**2. Liquidity & Solvency**
- Current ratio and quick ratio
- Cash conversion cycle
- Debt-to-equity ratio
- Interest coverage ratio

**3. Cash Flow Quality**
- Operating cash flow vs net income (cash conversion)
- Free cash flow calculation and trend
- Cash flow sufficiency for operations and growth

**4. Key Ratios Summary**
| Ratio | Formula | Value | Industry Benchmark | Assessment |
|-------|---------|-------|-------------------|------------|

**5. Red Flags**
- Warning signs that require investigation
- Accounting policy concerns

**6. Overall Assessment**
- Business health score (1–10) with justification
- Top 3 financial priorities for management
- 12-month outlook based on trends

---
Financial statements: [PASTE OR DESCRIBE]
Industry: [SPECIFY]
Period covered: [DATES]`,
  },
  {
    title: "Annual Budget Planner",
    description: "Build a structured annual budget with zero-based thinking and scenario planning.",
    category: "business-finance",
    tags: ["finance", "planning", "templates"],
    content: `You are a financial planning expert. Help me build a rigorous annual budget:

**1. Revenue Budget**
For each revenue stream:
| Revenue Stream | Prior Year | Assumptions | Budget Year | Growth % |
|----------------|------------|-------------|-------------|----------|

Key assumptions to document:
- Pricing changes
- Volume growth drivers
- New products/markets
- Customer churn assumptions

**2. Cost Budget** (zero-based approach — justify every line)
| Cost Category | Prior Year | Justification | Budget Year | Change % |
|--------------|------------|---------------|-------------|----------|
| COGS | | | | |
| Salaries & Benefits | | | | |
| Rent & Facilities | | | | |
| Marketing | | | | |
| Technology | | | | |
| [Other] | | | | |

**3. Headcount Plan**
| Department | Current HC | Planned HC | New Roles | Timing |
|------------|-----------|-----------|-----------|--------|

**4. Capital Expenditure Plan**

**5. Scenario Analysis**
- Base case (most likely)
- Upside case (+15% revenue)
- Downside case (−20% revenue)

**6. Monthly Cash Flow Projection**

---
Business type: [DESCRIBE]
Prior year revenue: [AMOUNT]
Key strategic initiatives for the year: [LIST]`,
  },
  {
    title: "Cash Flow Management Plan",
    description: "Diagnose cash flow problems and create a 13-week cash flow forecast.",
    category: "business-finance",
    tags: ["finance", "planning", "analysis"],
    content: `You are a cash flow management expert. Help me improve and forecast our cash position:

**1. Cash Flow Diagnosis**
Identify the root causes of cash flow problems:
- Revenue timing issues (slow collections, seasonality)
- Cost structure issues (fixed costs too high)
- Working capital inefficiencies (inventory, receivables, payables)
- Growth-related cash burn

**2. Working Capital Optimisation**
| Lever | Current Performance | Improvement Action | Cash Impact |
|-------|--------------------|--------------------|------------|
| Accounts Receivable (DSO) | | | |
| Accounts Payable (DPO) | | | |
| Inventory (DIO) | | | |

**3. 13-Week Cash Flow Forecast**
| Week | Opening Balance | Cash In | Cash Out | Closing Balance | Minimum Required |
|------|----------------|---------|---------|-----------------|-----------------|

**4. Cash Reserve Strategy**
- Recommended minimum cash buffer (typically 8–12 weeks of operating costs)
- Lines of credit to establish
- Investment policy for excess cash

**5. Immediate Actions** (next 30 days to improve cash position)

---
Current monthly revenue: [AMOUNT]
Current cash balance: [AMOUNT]
Biggest cash pain points: [DESCRIBE]`,
  },
  {
    title: "ROI Analysis Framework",
    description: "Calculate and present the ROI for any investment or initiative.",
    category: "business-finance",
    tags: ["finance", "analysis"],
    content: `You are a financial analyst. Perform a comprehensive ROI analysis for the following investment:

**1. Investment Summary**
- Total investment amount (include all costs: implementation, training, ongoing)
- Timeline to full implementation
- Who is affected and how

**2. Benefit Identification**
For each benefit, quantify it in dollar terms:

| Benefit | Type | Calculation Method | Annual Value |
|---------|------|--------------------|--------------|
| Cost savings | Hard | [Specific calculation] | $ |
| Revenue increase | Hard | [Specific calculation] | $ |
| Productivity gains | Soft | [Hours saved × fully-loaded rate] | $ |
| Risk reduction | Soft | [Probability × impact] | $ |

**3. Financial Metrics**
- **Simple ROI:** (Total Benefits − Total Costs) / Total Costs × 100
- **Payback Period:** Total Investment / Annual Net Benefit
- **NPV** (3-year): Using [discount rate]%
- **IRR:** Internal rate of return

**4. Sensitivity Analysis**
What if benefits come in at 75% / 50% of projected? Show break-even point.

**5. Non-Financial Benefits**
Qualitative benefits that are hard to quantify but still real.

**6. Recommendation**
Go / No-Go with clear reasoning.

---
Investment being evaluated: [DESCRIBE]
Investment cost: [AMOUNT]
Expected timeline: [PERIOD]`,
  },
  {
    title: "Cost Reduction Strategy",
    description: "Systematically identify and prioritise cost reduction opportunities.",
    category: "business-finance",
    tags: ["finance", "strategy", "operations"],
    content: `You are a cost transformation expert. Develop a structured cost reduction programme:

**1. Cost Baseline Analysis**
Map all costs by category and identify:
- Fixed vs variable costs
- Essential vs discretionary spend
- Internal vs external costs
- Cost trends over the past 3 years

**2. Opportunity Identification**
Analyse each cost category for reduction potential:
| Category | Current Cost | Reduction Potential | Method | Complexity | Timeline |
|----------|-------------|--------------------|----|---------|---------|

**Reduction Methods:**
- Renegotiate contracts
- Consolidate vendors
- Automate manual processes
- Offshore / nearshore activities
- Eliminate low-value activities
- Right-size teams
- Reduce waste

**3. Prioritisation Matrix**
Plot each opportunity on: Savings Potential vs Implementation Difficulty

**4. Implementation Roadmap**
| Initiative | Saving | One-time Cost | Payback | Owner | Start Date |
|------------|--------|---------------|---------|-------|------------|

**5. Savings Target**
- Year 1 target: $X (X% of cost base)
- Year 2 target: $X (compounding from Year 1 actions)

**6. Governance & Tracking**
Monthly savings tracking mechanism and accountability structure.

---
Total annual cost base: [AMOUNT]
Target saving: [AMOUNT or %]
Areas off-limits: [ANY CONSTRAINTS]`,
  },

  // ── PERSONAL FINANCE ──────────────────────────────────────────────────────
  {
    title: "Personal Budget Planner",
    description: "Build a realistic monthly budget and identify savings opportunities.",
    category: "personal-finance",
    tags: ["finance", "planning", "productivity"],
    isFeatured: true,
    content: `You are a personal finance coach. Help me build a realistic, sustainable monthly budget:

**1. Income Summary**
| Income Source | Amount (After Tax) | Frequency |
|--------------|-------------------|-----------|

**2. Essential Expenses (Needs)**
| Category | Monthly Amount | % of Income |
|----------|----------------|-------------|
| Rent / Mortgage | | |
| Utilities | | |
| Groceries | | |
| Transport | | |
| Insurance | | |
| Debt repayments | | |
| **Total Needs** | | |

**3. Discretionary Spending (Wants)**
| Category | Current | Recommended | Saving |
|----------|---------|-------------|--------|
| Dining & entertainment | | | |
| Subscriptions | | | |
| Shopping | | | |
| Hobbies | | | |

**4. Savings & Investments**
Apply the 50/30/20 rule as a starting benchmark:
- 50% Needs | 30% Wants | 20% Savings/Investments

**5. Budget Gaps & Recommendations**
- Am I living within my means? By how much?
- Top 3 areas to cut back
- Savings rate improvement plan

**6. 3-Month Action Plan**
Specific steps to reach the target budget.

---
Monthly take-home income: [AMOUNT]
Current biggest spending challenges: [DESCRIBE]
Financial goals: [DESCRIBE]`,
  },
  {
    title: "Debt Repayment Accelerator",
    description: "Create a strategic debt repayment plan using avalanche or snowball method.",
    category: "personal-finance",
    tags: ["finance", "planning"],
    content: `You are a debt management specialist. Create an optimised debt repayment plan:

**1. Debt Inventory**
| Debt | Balance | Interest Rate | Min Payment | Type |
|------|---------|---------------|-------------|------|

**2. Strategy Comparison**

**Avalanche Method** (highest interest rate first — mathematically optimal):
- Order to pay off debts
- Total interest saved vs minimum payments
- Time to debt-free date

**Snowball Method** (smallest balance first — psychologically motivating):
- Order to pay off debts
- Quick wins timeline
- Time to debt-free date

**Recommendation:** [Which strategy suits this situation and why]

**3. Payment Plan**
| Month | Debt Focus | Extra Payment | Balance After |
|-------|------------|---------------|---------------|

**4. Accelerators** (ways to pay off faster)
- Round up all minimum payments
- Apply any windfalls to highest-priority debt
- Negotiate interest rates
- Balance transfer opportunities

**5. Milestones & Motivation**
Key dates when debts will be fully paid off.

---
Monthly income after essentials: [AMOUNT]
Extra amount available for debt: [AMOUNT]
List all debts: [BALANCE, RATE, MINIMUM PAYMENT]`,
  },
  {
    title: "Investment Portfolio Builder",
    description: "Design a personal investment portfolio aligned with goals and risk tolerance.",
    category: "personal-finance",
    tags: ["finance", "planning", "strategy"],
    content: `You are an independent financial planner. Help me design a sound investment portfolio:

**1. Investor Profile**
- Investment timeline: [SHORT < 3yr / MEDIUM 3–10yr / LONG > 10yr]
- Risk tolerance: [CONSERVATIVE / MODERATE / AGGRESSIVE]
- Liquidity needs: [% needed accessible within 1 year]

**2. Asset Allocation Recommendation**
| Asset Class | Allocation % | Rationale |
|-------------|--------------|-----------|
| Equities (domestic) | | |
| Equities (international) | | |
| Fixed income / Bonds | | |
| Real estate (REITs) | | |
| Cash & equivalents | | |
| Alternative assets | | |

**3. Implementation Plan**
- Recommended account types (tax-advantaged vs taxable)
- Specific low-cost index fund / ETF suggestions for each allocation
- Dollar-cost averaging strategy

**4. Rebalancing Strategy**
- Rebalancing trigger (drift > X%) or time-based (annual)
- Tax-efficient rebalancing approach

**5. Common Mistakes to Avoid**
- Market timing
- Panic selling
- Neglecting fees
- Under-diversification

**6. 12-Month Milestones**

---
Amount to invest: [LUMP SUM / MONTHLY AMOUNT]
Investment goal: [RETIREMENT / PROPERTY / EDUCATION / WEALTH BUILDING]
Timeline: [YEARS]
Current investments: [IF ANY]`,
  },
  {
    title: "Emergency Fund Calculator",
    description: "Calculate your ideal emergency fund size and create a plan to build it.",
    category: "personal-finance",
    tags: ["finance", "planning"],
    content: `You are a financial security expert. Help me build a robust emergency fund:

**1. Emergency Fund Sizing**
Calculate your target based on risk profile:

| Factor | Your Situation | Months Recommended |
|--------|---------------|-------------------|
| Job security | [stable / moderate / variable] | |
| Number of income earners | [1 / 2] | |
| Dependants | [none / children / elderly] | |
| Health considerations | [good / chronic conditions] | |
| Homeowner | [yes / no] | |
| **Recommended buffer** | | **[X] months** |

**2. Monthly Essential Expenses Calculation**
(Rent + utilities + food + insurance + debt minimums = baseline)
Target amount = Monthly essentials × Recommended months

**3. Current Gap**
Target amount − Current savings = Gap to fill

**4. Savings Plan**
| Monthly savings | Months to goal |
|-----------------|---------------|
| Current rate | |
| Accelerated rate | |
| Aggressive rate | |

**5. Where to Keep Your Emergency Fund**
- High-yield savings account (recommended)
- Money market fund
- Short-term government bonds

**6. Rules for Using & Rebuilding**
What counts as a real emergency and how to replenish after using it.

---
Monthly essential expenses: [AMOUNT]
Current emergency savings: [AMOUNT]
Monthly amount available to save: [AMOUNT]`,
  },
  {
    title: "Retirement Planning Blueprint",
    description: "Calculate your retirement number and build a roadmap to financial independence.",
    category: "personal-finance",
    tags: ["finance", "planning", "strategy"],
    content: `You are a retirement planning expert. Build a comprehensive retirement plan:

**1. Retirement Target Calculation**
- Desired annual retirement income: [AMOUNT]
- Using the 4% safe withdrawal rule: Nest egg needed = Annual income × 25
- Your retirement target: $[CALCULATED]

**2. Current Position**
| Account | Current Balance | Monthly Contribution | Expected Return |
|---------|----------------|---------------------|----------------|
| Superannuation / 401k | | | 7% |
| Other investments | | | |
| Property equity | | | |

**3. Projected Balance at Retirement**
Using compound interest projections at 7% average annual return:
| Years to Retirement | Projected Balance | Gap to Target |
|--------------------|------------------|---------------|

**4. Contribution Strategy**
- Minimum to be on track
- Recommended to achieve target
- Catch-up strategies if behind

**5. Tax Optimisation**
- Tax-advantaged account maximisation
- Tax-efficient investment strategies
- Withdrawal sequencing in retirement

**6. Risk Management**
- Insurance requirements (life, income protection)
- Portfolio de-risking timeline as retirement approaches

---
Current age: [AGE]
Target retirement age: [AGE]
Current total savings: [AMOUNT]
Monthly savings capacity: [AMOUNT]`,
  },

  // ── HUMAN RESOURCES ───────────────────────────────────────────────────────
  {
    title: "Job Description Writer",
    description: "Write compelling, inclusive job descriptions that attract top talent.",
    category: "human-resources",
    tags: ["hr", "writing", "templates"],
    isFeatured: true,
    content: `You are a talent acquisition specialist. Write a compelling, inclusive job description:

**Job Title:** [TITLE]
**Department:** [DEPARTMENT]
**Location:** [CITY / REMOTE / HYBRID]
**Reports To:** [MANAGER TITLE]

**About the Company** (2–3 sentences, values-led)
[Company description emphasising culture and mission]

**The Opportunity**
A compelling paragraph explaining why this role matters and what the person will achieve — not just a list of duties.

**What You Will Do** (responsibilities)
- Lead [key responsibility]
- Own [key responsibility]
- Collaborate with [teams] to [outcome]
- [5–7 bullet points maximum]

**What We Are Looking For**
*Must-have:*
- [Non-negotiable requirement]
- [Non-negotiable requirement]

*Nice-to-have (not required):*
- [Preferred but not essential]

**What We Offer**
- Salary range: [RANGE] (be transparent — it increases applications)
- [Key benefit 1]
- [Key benefit 2]
- [Flexible working / leave / development budget]

**Inclusive Language Review**
Check this JD for: gendered language, unnecessary degree requirements, culture-fit jargon that excludes diverse candidates.

---
Role to write for: [TITLE]
Key outcomes the person must achieve in year 1: [LIST]
Must-have skills: [LIST]
Company values / culture: [DESCRIBE]`,
  },
  {
    title: "Interview Question Generator",
    description: "Generate role-specific, behavioural, and technical interview questions.",
    category: "human-resources",
    tags: ["hr", "templates"],
    content: `You are a talent assessment expert. Generate a structured interview question set for the following role:

**Interview Structure** (recommended 60-minute format)
- Opening & rapport building: 5 min
- Structured questions: 40 min
- Candidate questions: 10 min
- Close & next steps: 5 min

**Behavioural Questions** (STAR format: Situation, Task, Action, Result)
5 questions targeting the core competencies for this role:

1. "Tell me about a time when [core competency scenario]..."
   - What we're assessing: [COMPETENCY]
   - Green flags: [WHAT GOOD LOOKS LIKE]
   - Red flags: [WATCH OUT FOR]

**Technical / Functional Questions**
3–5 questions to assess role-specific knowledge:

**Situational Questions** (hypothetical)
2–3 questions: "What would you do if..."

**Culture & Values Questions**
2 questions to assess fit with company values (without asking illegal questions)

**Questions to AVOID** (legal compliance)
Do not ask about: age, family status, religion, national origin, disability, pregnancy

**Scoring Rubric**
| Competency | 1 (Below) | 2 (Meets) | 3 (Exceeds) |
|------------|-----------|-----------|-------------|

---
Role: [TITLE]
Core competencies required: [LIST 4–5]
Technical skills to assess: [LIST]
Company values: [LIST]`,
  },
  {
    title: "Performance Review Writer",
    description: "Write fair, specific, and actionable performance reviews for any role.",
    category: "human-resources",
    tags: ["hr", "writing", "communication"],
    content: `You are an HR consultant specialising in performance management. Write a balanced, constructive performance review:

**Employee:** [NAME]
**Role:** [TITLE]
**Review Period:** [DATES]
**Manager:** [NAME]

**Overall Performance Rating:** [Exceptional / Exceeds Expectations / Meets Expectations / Needs Improvement]

**1. Key Achievements** (specific, quantified where possible)
- [Achievement 1: what was done and what was the impact]
- [Achievement 2]
- [Achievement 3]

**2. Strengths** (backed by specific examples)
Strength 1: [Name the strength]
Evidence: [Specific behaviour or outcome that demonstrates this]
Impact: [How this benefited the team/company]

**3. Development Areas** (constructive, not punitive)
Area 1: [Specific behaviour to improve]
Context: [Why this matters for their role]
Support offered: [Training, mentoring, resources]
Success measure: [How improvement will be recognised]

**4. Goal Review**
| Goal | Target | Actual | Assessment |
|------|--------|--------|------------|

**5. Goals for Next Period**
| Goal | Success Metric | Timeline | Support Needed |
|------|----------------|----------|----------------|

**6. Career Development Discussion**
Short-term aspiration and how the company can support growth.

---
Employee context: [BRIEF DESCRIPTION OF ROLE AND TENURE]
Key achievements this period: [LIST]
Main development areas: [LIST]`,
  },
  {
    title: "Employee Onboarding Plan",
    description: "Create a structured 30-60-90 day onboarding plan for a new hire.",
    category: "human-resources",
    tags: ["hr", "planning", "templates"],
    content: `You are an employee experience specialist. Design a comprehensive onboarding plan:

**Pre-Start (Before Day 1)**
- [ ] Send welcome email with first-day logistics
- [ ] Set up laptop, accounts, and access
- [ ] Assign onboarding buddy
- [ ] Schedule first-week meetings
- [ ] Prepare workstation and welcome gift

**Day 1**
| Time | Activity | Owner |
|------|----------|-------|
| 9:00 | Welcome & office tour | Manager |
| 10:00 | IT setup & systems access | IT |
| 11:00 | HR paperwork & policies | HR |
| 12:00 | Lunch with team | Team |
| 14:00 | Role overview & expectations | Manager |

**First 30 Days — Learn**
Goals: Understand the role, team, and company
- Week 1: Orientation, culture, key tools
- Week 2: Meet all key stakeholders
- Week 3: Shadow team members
- Week 4: Review and 30-day check-in

**Days 31–60 — Contribute**
Goals: Start delivering independently
- Take ownership of [specific tasks]
- Complete [training/certification]
- 60-day formal check-in against role expectations

**Days 61–90 — Lead**
Goals: Full productivity, identify improvements
- Own [key responsibility] end-to-end
- Present [deliverable] to team/manager
- 90-day performance conversation

**Success Metrics**
How will we know this hire is succeeding at 90 days?

---
Role being onboarded: [TITLE]
Department: [DEPARTMENT]
Key tools and systems: [LIST]`,
  },
  {
    title: "Salary Benchmarking Analysis",
    description: "Research and analyse market compensation data for any role.",
    category: "human-resources",
    tags: ["hr", "analysis", "finance"],
    content: `You are a compensation specialist. Conduct a salary benchmarking analysis:

**1. Role Definition**
Clarify the role level and scope to ensure accurate benchmarking:
- Role title and equivalent titles in the market
- Level (individual contributor vs manager vs director)
- Scope (budget, team size, revenue responsibility)
- Location (city/country — compensation varies significantly)

**2. Market Data Sources to Check**
- Glassdoor, LinkedIn Salary Insights, Payscale
- Industry salary surveys (e.g., Mercer, Willis Towers Watson)
- Recruitment agencies (request benchmark reports)
- Peer companies' job postings

**3. Compensation Components to Benchmark**
| Component | P25 | P50 (Median) | P75 | P90 |
|-----------|-----|-------------|-----|-----|
| Base salary | | | | |
| Target bonus | | | | |
| Total cash | | | | |
| Equity/Options | | | | |
| Total comp | | | | |

**4. Internal Pay Equity Check**
Compare the benchmarked range to existing employees in the same role to identify:
- Pay compression issues
- Gender / demographic pay gaps
- Outliers requiring attention

**5. Recommendation**
- Proposed salary range for this role
- Positioning rationale (P50 / P75 etc.)
- Adjustment budget if current employee is below market

---
Role to benchmark: [TITLE]
Location: [CITY / COUNTRY]
Industry: [SPECIFY]
Current salary being paid (if reviewing existing role): [AMOUNT]`,
  },
  {
    title: "Workplace Conflict Resolution Guide",
    description: "Navigate and resolve workplace conflicts with a structured mediation approach.",
    category: "human-resources",
    tags: ["hr", "communication", "leadership"],
    content: `You are an HR mediator and workplace conflict resolution specialist. Guide me through resolving the following conflict:

**1. Situation Assessment**
Understand the conflict before acting:
- Who are the parties involved?
- What is the visible issue vs the underlying interest?
- How long has this been going on?
- What is the impact on the team and business?

**2. Individual Conversations** (before bringing parties together)
Questions to ask each party privately:
- "Help me understand the situation from your perspective."
- "What outcome would you like to see?"
- "What have you already tried?"
- "What does the other person need to understand about your perspective?"

**3. Mediation Session Structure**
- Ground rules: respect, no interruptions, focus on behaviour not character
- Each party shares their perspective (uninterrupted)
- Identify common ground
- Generate options together
- Agree on specific commitments

**4. Resolution Agreement**
Document:
- What each party agrees to do differently
- How they will handle future disagreements
- Follow-up date (2–4 weeks)

**5. When to Escalate**
Escalate to formal HR process if:
- Allegations of harassment or discrimination
- Repeated violations despite resolution
- Irreconcilable differences requiring structural changes

---
Conflict situation: [DESCRIBE]
Parties involved: [ROLES]
Impact so far: [DESCRIBE]`,
  },

  // ── MARKETING & GROWTH ────────────────────────────────────────────────────
  {
    title: "Marketing Campaign Brief",
    description: "Write a complete marketing campaign brief to align creative, digital, and sales teams.",
    category: "marketing-growth",
    tags: ["marketing", "planning", "strategy"],
    isFeatured: true,
    content: `You are a marketing strategist. Write a comprehensive marketing campaign brief:

**Campaign Overview**
- Campaign Name:
- Campaign Objective: [Awareness / Lead Gen / Retention / Revenue]
- Campaign Period:
- Total Budget:

**Target Audience**
Primary persona:
- Who they are (demographics, role, industry)
- Their biggest pain points
- What motivates their purchase decisions
- Where they spend their time online

**The Problem We're Solving**
One clear sentence describing the customer pain this campaign addresses.

**Campaign Message**
- Core message (one sentence): [THE MOST IMPORTANT THING TO COMMUNICATE]
- Supporting messages (2–3 bullets)
- Tone: [Professional / Conversational / Urgent / Inspirational]

**Channels & Tactics**
| Channel | Objective | Format | Budget | KPI |
|---------|-----------|--------|--------|-----|
| LinkedIn Ads | | | | |
| Email | | | | |
| Content/SEO | | | | |
| [Other] | | | | |

**Creative Requirements**
- Key assets needed (copy, design, video, etc.)
- Brand guidelines summary

**Success Metrics**
| KPI | Target |
|-----|--------|

**Campaign Timeline**
| Date | Milestone |
|------|-----------|

---
Product/service being promoted: [DESCRIBE]
Target customer: [DESCRIBE]
Key differentiator vs competitors: [DESCRIBE]`,
  },
  {
    title: "Customer Persona Builder",
    description: "Build a detailed ideal customer persona to focus marketing and product decisions.",
    category: "marketing-growth",
    tags: ["marketing", "strategy", "analysis"],
    content: `You are a customer insights specialist. Build a detailed customer persona:

**Persona Name:** [Create a fictional name, e.g., "Strategic Sarah"]
**Role:** [Job title and industry]

**Demographics**
- Age range:
- Location:
- Education:
- Income/company size:

**Professional Context**
- Day-to-day responsibilities
- Key performance metrics they're judged on
- Biggest professional challenges
- Tools and platforms they use daily

**Goals & Motivations**
- Primary goal in their role
- What success looks like for them
- Career aspirations
- What keeps them up at night

**Pain Points**
- Frustrations with current solutions
- Problems they've been unable to solve
- Things they wish existed

**Buying Behaviour**
- How they discover solutions (channels, communities)
- Who influences their decisions
- Typical buying process and timeline
- Budget authority and approval process
- Key objections to purchasing

**How We Help This Persona**
- Primary value proposition for this persona
- The message that will resonate most
- Best channel to reach them

---
Product/service: [DESCRIBE]
Existing customer data or interviews to draw from: [DESCRIBE OR PASTE]`,
  },
  {
    title: "Content Strategy & Calendar",
    description: "Build a 90-day content strategy and editorial calendar for any brand.",
    category: "marketing-growth",
    tags: ["marketing", "planning", "writing"],
    content: `You are a content marketing strategist. Develop a 90-day content strategy:

**1. Content Goals**
| Goal | Metric | 90-Day Target |
|------|--------|--------------|
| Brand awareness | Impressions/reach | |
| Lead generation | Leads from content | |
| SEO / organic traffic | Sessions | |
| Engagement | Comments, shares | |

**2. Audience & Topics**
Core topics (content pillars):
1. [Pillar 1] — covers [audience pain point]
2. [Pillar 2] — covers [audience pain point]
3. [Pillar 3] — covers [audience pain point]

**3. Content Mix**
| Format | Frequency | Channel | Purpose |
|--------|-----------|---------|---------|
| Long-form blog | 2×/month | Website | SEO + authority |
| LinkedIn posts | 3×/week | LinkedIn | Awareness |
| Newsletter | 1×/week | Email | Nurture |
| Video/Reels | 1×/week | Social | Engagement |
| Case study | 1×/month | Website | Conversion |

**4. 90-Day Editorial Calendar**
[Week-by-week content plan with topics, formats, and channels]

**5. Content Production Workflow**
Briefing → Drafting → Review → Approval → Scheduling → Distribution

**6. Repurposing Strategy**
How to get maximum value from each piece of content.

---
Brand / company: [DESCRIBE]
Target audience: [DESCRIBE]
Current content assets: [DESCRIBE]
Budget: [AMOUNT or TEAM SIZE]`,
  },
  {
    title: "Email Campaign Sequence",
    description: "Write a multi-email nurture sequence to convert leads into customers.",
    category: "marketing-growth",
    tags: ["marketing", "writing", "communication"],
    content: `You are a conversion copywriter. Write a high-converting email nurture sequence:

**Sequence Overview**
- Goal: [Convert leads to customers / Onboard new users / Re-engage dormant leads]
- Length: [5–7 emails recommended]
- Cadence: [Days between emails]

---

**Email 1 — Welcome (Day 0)**
Subject line options (A/B test):
1. [Option A]
2. [Option B]
Preview text:

Body:
[Personal, warm opening. Deliver the promised value immediately. Single clear CTA.]

---

**Email 2 — Problem Agitation (Day 2)**
Subject: [Speak to the pain point]
Body: [Deepen their awareness of the problem. Build urgency. Light touch on solution.]

---

**Email 3 — Solution Introduction (Day 4)**
Subject: [Introduce your solution]
Body: [Present your solution clearly. Focus on transformation, not features. Social proof.]

---

**Email 4 — Social Proof (Day 7)**
Subject: [Customer result / testimonial]
Body: [Real story. Before → After. Relevant to their situation. CTA to learn more.]

---

**Email 5 — Objection Handling (Day 10)**
Subject: [Address the #1 objection]
Body: [Acknowledge the objection, reframe it, provide evidence.]

---

**Email 6 — Urgency / Offer (Day 14)**
Subject: [Time-sensitive]
Body: [Clear offer. Specific deadline or scarcity. Strong CTA.]

---
Product/service: [DESCRIBE]
Target audience: [PERSONA]
Primary CTA: [WHAT YOU WANT THEM TO DO]`,
  },
  {
    title: "SEO Content Brief",
    description: "Create a detailed SEO content brief to rank for a target keyword.",
    category: "marketing-growth",
    tags: ["marketing", "writing", "strategy"],
    content: `You are an SEO content strategist. Create a detailed content brief to rank for the following keyword:

**Target Keyword:** [PRIMARY KEYWORD]
**Secondary Keywords:** [RELATED TERMS]
**Search Intent:** [Informational / Commercial / Transactional / Navigational]

**1. SERP Analysis**
Analyse the current top 10 results:
- What content types are ranking? (guides, listicles, product pages)
- Average word count of top results
- Common headings and subtopics covered
- Content gaps (what's missing from current results)

**2. Article Outline**

Title options (include primary keyword, under 60 characters):
1. [Option A]
2. [Option B]

Meta description (under 160 characters):

H1: [Final article title]
Introduction: Hook + problem statement + what reader will learn

H2: [Main section 1]
  H3: [Subsection]
  H3: [Subsection]

H2: [Main section 2]
...

Conclusion + CTA

**3. Content Requirements**
- Target word count: [BASED ON SERP ANALYSIS]
- Must-include topics: [LIST]
- Internal links: [RELATED PAGES TO LINK TO]
- External authority links to include
- Featured snippet opportunity: [YES/NO + FORMAT]

**4. On-Page SEO Checklist**
Primary keyword in: title, H1, first 100 words, meta description, URL

---
Target keyword: [KEYWORD]
Domain: [YOUR WEBSITE]
Audience: [DESCRIBE]`,
  },

  // ── SALES ────────────────────────────────────────────────────────────────
  {
    title: "Sales Outreach Email",
    description: "Write personalised, high-response cold outreach emails.",
    category: "sales",
    tags: ["sales-tag", "writing", "communication"],
    isFeatured: true,
    content: `You are an expert B2B sales copywriter. Write a personalised cold outreach email that gets replies:

**Principles for effective cold email:**
- One clear idea per email
- Personalised opening (reference something specific about them)
- Lead with their problem, not your product
- Credibility without bragging
- Single, low-friction CTA
- Under 150 words ideally

---

**Email Variants to Write:**

**Version A — Problem-Led**
Subject: [Pattern interrupt / question / insight]

Hi [First Name],

[Personalised opening that shows research — reference their company, a recent post, a challenge in their industry]

[One-sentence bridge to the problem you solve]

[Proof point — who else you've helped with this problem, with specific result]

[Soft CTA — are you open to a 15-minute call? Or: does this resonate?]

[Name]

---

**Version B — Results-Led**
Subject: [Specific result for a company like theirs]

Hi [First Name],

[Specific result you achieved for a similar company]

[How it's relevant to them]

[CTA]

---
**Follow-up sequence:**
Day 3: [Brief bump]
Day 7: [Different angle / new insight]
Day 14: [Break-up email]

---
Your company / product: [DESCRIBE]
Target prospect: [ROLE, INDUSTRY, COMPANY SIZE]
The #1 problem you solve: [DESCRIBE]`,
  },
  {
    title: "Discovery Call Framework",
    description: "Structure a consultative discovery call to deeply understand client needs.",
    category: "sales",
    tags: ["sales-tag", "communication", "templates"],
    content: `You are a consultative sales expert. Design a discovery call framework:

**Pre-Call Research Checklist**
- [ ] Review LinkedIn profile of each attendee
- [ ] Read the company's website and recent news
- [ ] Check their social media for recent priorities
- [ ] Research their industry challenges
- [ ] Review any prior interactions in CRM

**Call Structure (45–60 minutes)**

**Opening (5 min)**
Set the agenda and make them feel in control:
"I'd like to understand your situation first, then we can see if and how we might be able to help. Does that work for you?"

**Business Context (10 min)**
- "What prompted you to take this call today?"
- "What does success look like for your team this year?"
- "What are the top 1–2 priorities you're working on right now?"

**Problem Exploration (15 min — SPIN Questions)**
Situation: "How do you currently handle [relevant process]?"
Problem: "What are the biggest challenges with that approach?"
Implication: "What does it cost you if this problem isn't solved?"
Need-payoff: "If you could [solve the problem], what would that mean for you?"

**Solution Alignment (10 min)**
- Share relevant case study
- Demonstrate understanding of their problem
- Explain how you help — focused on their specific situation

**Qualification (5 min)**
- Decision-making process and timeline
- Budget range and approval process
- Key stakeholders involved

**Next Steps (5 min)**
Always end with a specific, scheduled next step.

---
Your product/service: [DESCRIBE]
Typical prospect: [ROLE AND INDUSTRY]`,
  },
  {
    title: "Proposal Writer",
    description: "Write a persuasive, professional business proposal that wins deals.",
    category: "sales",
    tags: ["sales-tag", "writing", "templates"],
    content: `You are a proposal writing expert. Write a compelling business proposal:

**Cover Page**
Company logo | Prepared for: [CLIENT] | Prepared by: [YOUR COMPANY] | Date

---

**Executive Summary** (½ page — most important section)
- The client's situation and problem (show you listened)
- Your recommended solution in one paragraph
- Expected business impact (quantified)
- Why choose us (one-sentence differentiator)

---

**Understanding Your Challenge**
Demonstrate you deeply understand their specific situation:
- Current state
- The problem this is causing
- What solving it would mean for their business

---

**Our Proposed Solution**
- What we will do (scope of work)
- How we will do it (methodology)
- Timeline and key milestones
- What is included and excluded (scope boundaries)

---

**Why [Your Company]**
- Relevant experience (specific, similar clients)
- Team credentials
- Differentiation vs alternatives

---

**Investment**
| Item | Description | Fee |
|------|-------------|-----|
| Phase 1 | | |
| Phase 2 | | |
| **Total** | | |

Payment terms. What's included. Optional add-ons.

---

**Next Steps**
Clear action: "To proceed, please sign below / reply to accept / schedule kick-off call by [DATE]"

---
Client: [DESCRIBE]
Solution being proposed: [DESCRIBE]
Key client goals from discovery: [LIST]`,
  },
  {
    title: "Objection Handling Playbook",
    description: "Create ready-to-use responses for every common sales objection.",
    category: "sales",
    tags: ["sales-tag", "communication"],
    content: `You are a sales training expert. Build a comprehensive objection handling playbook:

**Framework: Feel, Felt, Found + Bridge to CTA**
1. Acknowledge (show empathy, don't argue)
2. Clarify (ask if you can explore the concern)
3. Respond (address the real underlying concern)
4. Confirm (check the objection is resolved)
5. Advance (move to the next step)

---

**Objection 1: "It's too expensive"**
Root cause: They don't see the value equalling the price.
Response: "I understand cost is important. May I ask — when you say it's too expensive, is it the absolute number, or is it about the return you'd get?"
[Then quantify the ROI specific to their situation]

**Objection 2: "We're happy with our current solution"**
Root cause: Status quo bias / risk aversion.
Response: "That's great that it's working. Many of our best customers said the same thing before switching. What would need to change about your current situation for you to consider alternatives?"

**Objection 3: "We don't have the budget right now"**
Root cause: Genuine budget constraint OR a priority issue.
Response: "I understand. Is the budget truly not available, or is this more about whether this is a priority compared to other investments?"

**Objection 4: "I need to think about it"**
Root cause: Missing information OR hidden objection.
Response: "Absolutely, take the time you need. To help me prepare better information — what specific aspects are you still thinking through?"

**Objection 5: "We need to involve [others]"**
Response: [Frame it as a positive step, offer to help prepare internal presentation]

**[Add your top 3 specific objections here]**

---
Your product/service: [DESCRIBE]
Top objections you currently face: [LIST]`,
  },
  {
    title: "Sales Pipeline Review",
    description: "Conduct a rigorous pipeline review to forecast accurately and accelerate deals.",
    category: "sales",
    tags: ["sales-tag", "analysis", "strategy"],
    content: `You are a sales director. Conduct a structured pipeline review:

**Pipeline Health Assessment**
For each deal in the pipeline, evaluate:

| Deal | Stage | Value | Close Date | Next Action | Risk Flag |
|------|-------|-------|------------|------------|-----------|

**Deal Qualification (MEDDIC)**
For each significant deal, assess:
- **M**etrics: What measurable outcome does the buyer want?
- **E**conomic Buyer: Have we spoken to the person with budget authority?
- **D**ecision Criteria: What are the official and unofficial criteria?
- **D**ecision Process: What are the steps to approval?
- **I**dentify Pain: Is there a compelling event creating urgency?
- **C**hampion: Do we have an internal advocate?

**Deal Risk Flags**
- No activity for 2+ weeks
- Only one stakeholder engaged
- Discount requested early
- Evaluation running over scheduled timeline
- Champion left the company

**Forecast Categories**
- Commit: High confidence (>85%) will close this period
- Best Case: Likely but not certain (50–85%)
- Pipeline: Possible (25–50%)

**Coaching Opportunities**
For each deal, what specific help does the rep need?

**Actions to Accelerate Top Deals**
| Deal | Stuck Point | Recommended Action | Owner | Deadline |
|------|------------|-------------------|-------|----------|

---
Current pipeline: [DESCRIBE KEY DEALS]
Sales target for period: [AMOUNT]
Current forecast: [AMOUNT]`,
  },

  // ── CONTENT & WRITING ─────────────────────────────────────────────────────
  {
    title: "Executive Summary Writer",
    description: "Write a concise, compelling executive summary for any document or report.",
    category: "content-writing",
    tags: ["writing", "communication", "templates"],
    isFeatured: true,
    content: `You are a business writing expert. Write a compelling executive summary:

**Executive Summary Principles:**
- Maximum 1 page (300–500 words)
- Written for busy decision-makers who may only read this section
- Lead with the conclusion, not the journey
- Every sentence earns its place
- Quantify impact wherever possible

**Structure:**

**Opening Statement** (1–2 sentences)
What is this document about and why does it matter to the reader right now?

**Situation** (2–3 sentences)
The context and background the reader needs to understand the issue.

**Problem / Opportunity** (2–3 sentences)
The specific challenge being addressed or opportunity being pursued. What happens if we don't act?

**Recommendation / Findings** (3–4 sentences)
The core conclusion or recommendation. Be direct — avoid hedging.

**Key Evidence** (3–5 bullet points)
The most compelling facts, data points, or insights supporting the recommendation.

**Implementation / Next Steps** (2–3 sentences)
What needs to happen, by whom, and by when.

**Impact** (1–2 sentences)
The expected outcome if the recommendation is implemented.

---
Document to summarise: [PASTE OR DESCRIBE THE FULL DOCUMENT]
Target audience: [WHO WILL READ THIS]
Desired outcome: [WHAT SHOULD THEY DO AFTER READING]`,
  },
  {
    title: "Professional Business Report",
    description: "Structure and write a clear, professional business report on any topic.",
    category: "content-writing",
    tags: ["writing", "communication", "templates"],
    content: `You are a business communications expert. Help me write a professional business report:

**Report Header**
- Title:
- Prepared by:
- Prepared for:
- Date:
- Confidentiality: [If applicable]

---

**Table of Contents**
[Auto-generated based on sections]

---

**1. Executive Summary**
[Key findings and recommendations — 200 words max]

**2. Introduction**
- Background and context
- Purpose of this report
- Scope and limitations
- Methodology (how information was gathered)

**3. Findings**
[Numbered sections for each major finding]
3.1 [Finding 1 with supporting data]
3.2 [Finding 2 with supporting data]
3.3 [Finding 3 with supporting data]

**4. Analysis**
Interpret what the findings mean. Connect evidence to conclusions.

**5. Options / Alternatives**
If relevant, present alternative courses of action with pros and cons.

**6. Recommendations**
Clear, actionable recommendations in priority order:
1. [Recommendation] — rationale — expected outcome
2. [Recommendation] — rationale — expected outcome

**7. Implementation Plan**
| Action | Owner | Timeline | Resources Required |
|--------|-------|----------|-------------------|

**8. Appendices**
[Supporting data, charts, full datasets]

---
Topic / subject of report: [DESCRIBE]
Key questions to answer: [LIST]
Audience and purpose: [DESCRIBE]`,
  },
  {
    title: "LinkedIn Thought Leadership Post",
    description: "Write engaging LinkedIn posts that build authority and generate leads.",
    category: "content-writing",
    tags: ["writing", "marketing", "communication"],
    content: `You are a LinkedIn content strategist. Write a high-performing thought leadership post:

**LinkedIn Algorithm Principles:**
- Hook in the first 1–2 lines (before "see more")
- Short paragraphs (1–3 lines max)
- Personal + Professional = most engagement
- End with a question or strong opinion to drive comments
- 150–300 words is the sweet spot

**Post Frameworks:**

**Framework 1 — Contrarian Take**
Line 1: State a common belief.
Line 2: Challenge it.
Lines 3–8: Your argument with evidence.
Line 9: The real lesson.
CTA: "What do you think?"

**Framework 2 — Story + Lesson**
Line 1: Hook (intriguing statement or result)
Lines 2–6: Tell the story (brief, specific, human)
Lines 7–9: The lesson extracted
CTA: "Have you experienced this?"

**Framework 3 — List / How-To**
Line 1: Promise (X things I learned about Y)
Lines 2–8: Numbered insights with brief explanation
Last line: The meta-lesson tying it together
CTA: Save this for when you need it.

---

**Write 3 post variations** for the following topic using different frameworks:

Topic: [DESCRIBE]
Your angle / perspective: [WHAT'S YOUR UNIQUE TAKE]
Your industry / expertise: [DESCRIBE]
Goal: [Awareness / Lead gen / Hiring / Partnership]`,
  },
  {
    title: "Company Newsletter Writer",
    description: "Write an engaging company or team newsletter people actually want to read.",
    category: "content-writing",
    tags: ["writing", "communication", "templates"],
    content: `You are an internal communications specialist. Write an engaging company newsletter:

**Newsletter Principles:**
- Lead with what's most relevant to readers, not what's most important to leadership
- Be human and conversational — avoid corporate speak
- Mix information with inspiration
- Keep it scannable — headers, bullets, short paragraphs
- Always include a clear call to action

---

**[COMPANY NAME] Newsletter — [MONTH/QUARTER YEAR]**

**📌 What's happening this week/month**
2–3 sentence overview of the most important thing happening right now.

**🏆 Wins to Celebrate**
- [Team or individual win with specific detail]
- [Team or individual win with specific detail]

**📊 Business Update** (numbers people care about)
- Revenue / target progress: [X]
- Key metric: [X]
- [1–2 other relevant metrics]

**👥 People News**
- New joiners: [Names and roles]
- Promotions or milestones
- Departures (if appropriate to share)

**📅 Coming Up**
- [Upcoming event or deadline 1]
- [Upcoming event or deadline 2]

**💡 Featured Story / Spotlight**
[One person, team, or project deserving the spotlight — tell a brief human story]

**🔗 Resources & Reading**
[1–2 articles or tools worth sharing]

**A message from [Name]:**
[Genuine, brief note — not a corporate monologue]

---
Company size and context: [DESCRIBE]
Key news this period: [LIST]
Tone: [Formal / Conversational / Energetic]`,
  },
  {
    title: "Press Release Writer",
    description: "Write a newsworthy press release in proper AP style format.",
    category: "content-writing",
    tags: ["writing", "communication", "marketing"],
    content: `You are a PR specialist. Write a professional press release:

**Press Release Format:**

FOR IMMEDIATE RELEASE
[OR: EMBARGOED UNTIL: DATE/TIME]

---

**[HEADLINE — Present tense, active voice, newsworthy angle, under 100 characters]**

**[Subheadline — One sentence expanding on the headline]**

[CITY, STATE — DATE] — [Company name], [brief description of company], today announced [what happened].

**[Opening paragraph]**
The most important facts: Who, What, When, Where, Why. Answer these in the first paragraph. Don't bury the lead.

**[Second paragraph — significance]**
Why this matters. Context, market significance, or impact on customers.

**[Quote from executive]**
"[Compelling, forward-looking quote that adds insight rather than just restating facts]," said [Name], [Title] at [Company].

**[Third paragraph — details]**
Supporting details, features, timeline, partnerships, or data.

**[Customer/partner quote (if applicable)]**
"[Quote from relevant third party]," said [Name], [Title] at [Partner Company].

**[Boilerplate]**
About [Company]: [Standard 3-sentence company description used in all press releases]

**Media Contact:**
[Name] | [Title] | [Email] | [Phone]

---
News to announce: [DESCRIBE]
Company: [NAME AND BRIEF DESCRIPTION]
Quote to include from: [EXECUTIVE NAME AND TITLE]`,
  },
];

async function main() {
  console.log("🌱 Seeding Excelsior Prompt Library...");

  // Clear existing data (order matters for foreign key constraints)
  console.log("🗑️  Clearing existing prompts, categories, and tags...");
  await prisma.commentVote.deleteMany();
  await prisma.comment.deleteMany();
  await prisma.promptVote.deleteMany();
  await prisma.promptReport.deleteMany();
  await prisma.userPromptExample.deleteMany();
  await prisma.pinnedPrompt.deleteMany();
  await prisma.changeRequest.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.promptConnection.deleteMany();
  await prisma.promptTag.deleteMany();
  await prisma.promptVersion.deleteMany();
  await prisma.prompt.deleteMany();
  await prisma.categorySubscription.deleteMany();
  await prisma.category.deleteMany();
  await prisma.tag.deleteMany();
  console.log("✅ Cleared existing data");

  // Create admin user — password must be set via ADMIN_SEED_PASSWORD env var
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!seedPassword) {
    console.error("❌ ADMIN_SEED_PASSWORD is not set. Add it to .env before running this seed.");
    process.exit(1);
  }
  const password = await bcrypt.hash(seedPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@excelsior.com" },
    update: {},
    create: {
      email: "admin@excelsior.com",
      username: "excelsior",
      name: "Excelsior Consultancy",
      password,
      role: "ADMIN",
      locale: "en",
    },
  });
  console.log("✅ Admin user ready");

  // Create categories
  const categoryIdMap = new Map<string, string>();
  for (const cat of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, icon: cat.icon, order: cat.order },
      create: { name: cat.name, slug: cat.slug, icon: cat.icon, order: cat.order },
    });
    categoryIdMap.set(cat.slug, created.id);
  }
  console.log(`✅ Created ${CATEGORIES.length} categories`);

  // Create tags
  const tagIdMap = new Map<string, string>();
  for (const tag of TAGS) {
    const created = await prisma.tag.upsert({
      where: { slug: tag.slug },
      update: { name: tag.name, color: tag.color },
      create: { name: tag.name, slug: tag.slug, color: tag.color },
    });
    tagIdMap.set(tag.slug, created.id);
  }
  console.log(`✅ Created ${TAGS.length} tags`);

  // Create prompts
  let created = 0;
  for (const p of PROMPTS) {
    const slug = slugify(p.title);
    const categoryId = categoryIdMap.get(p.category) ?? null;
    const tagLinks = p.tags
      .filter((t) => tagIdMap.has(t))
      .map((t) => ({ tagId: tagIdMap.get(t)! }));

    const prompt = await prisma.prompt.create({
      data: {
        title: p.title,
        slug,
        description: p.description,
        content: p.content,
        type: "TEXT",
        authorId: admin.id,
        categoryId,
        isFeatured: p.isFeatured ?? false,
        featuredAt: p.isFeatured ? new Date() : null,
        tags: { create: tagLinks },
      },
    });

    await prisma.promptVersion.create({
      data: {
        promptId: prompt.id,
        version: 1,
        content: p.content,
        changeNote: "Initial version",
        createdBy: admin.id,
      },
    });

    created++;
  }

  console.log(`✅ Created ${created} curated prompts`);
  console.log("\n🎉 Excelsior seeding complete!");
  console.log("\n📋 Admin credentials:");
  console.log("   Email: admin@excelsior.com");
  console.log("   Password: [set via ADMIN_SEED_PASSWORD env var]");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
