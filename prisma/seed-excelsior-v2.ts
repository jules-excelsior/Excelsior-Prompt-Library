import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DIRECT_URL || process.env.DATABASE_URL } },
});

async function main() {
  console.log("🌱 Seeding Excelsior Prompt Library v2 — Structured OS Edition...");

  // Clear all data in FK-safe order
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
  await prisma.account.deleteMany();
  await prisma.session.deleteMany();
  await prisma.user.deleteMany();
  console.log("✓ Cleared existing data");

  // Admin user — password must be set via ADMIN_SEED_PASSWORD env var
  const seedPassword = process.env.ADMIN_SEED_PASSWORD;
  if (!seedPassword) {
    console.error("❌ ADMIN_SEED_PASSWORD is not set. Add it to .env before running this seed.");
    process.exit(1);
  }
  const hashedPassword = await bcrypt.hash(seedPassword, 10);
  const admin = await prisma.user.create({
    data: {
      name: "Excelsior Admin",
      email: "excelsiorconsultancys@gmail.com",
      username: "excelsior-admin",
      password: hashedPassword,
      role: "ADMIN",
      emailVerified: new Date(),
    },
  });
  console.log("✓ Created admin user");

  // ─── Categories ──────────────────────────────────────────────────────────────
  const categoryData = [
    { name: "HR Consulting",           slug: "hr-consulting",           description: "Strategic HR advisory, policies, memos, and compliance for Philippine businesses." },
    { name: "Labor Law Guidance",      slug: "labor-law-guidance",      description: "Philippine Labor Code, DOLE regulations, due process, and worker rights." },
    { name: "Employee Relations",      slug: "employee-relations",      description: "Conflict resolution, grievance handling, and workplace culture." },
    { name: "Recruitment",             slug: "recruitment",             description: "Job descriptions, interview scorecards, and onboarding frameworks." },
    { name: "Performance Management",  slug: "performance-management",  description: "KPIs, appraisals, PIPs, and feedback systems." },
    { name: "SME Operations",          slug: "sme-operations",          description: "SOPs, business diagnostics, and operational frameworks for SMEs." },
    { name: "Business Strategy",       slug: "business-strategy",       description: "Strategic planning, SWOT, market analysis, and growth roadmaps." },
    { name: "VA Operations",           slug: "va-operations",           description: "Virtual assistant management, task briefs, and delegation systems." },
    { name: "Social Media Content",    slug: "social-media-content",    description: "LinkedIn, Facebook, and content strategy for professional services." },
    { name: "Client Communication",    slug: "client-communication",    description: "Proposals, status reports, client emails, and meeting documentation." },
    { name: "Project Management",      slug: "project-management",      description: "Project charters, risk registers, and progress tracking." },
    { name: "SOP Creation",            slug: "sop-creation",            description: "Standard operating procedures and process documentation." },
    { name: "AI Automation",           slug: "ai-automation",           description: "AI workflow design, prompt optimization, and platform selection." },
    { name: "Market Research",         slug: "market-research",         description: "Market analysis, competitor research, and customer insights." },
    { name: "Financial Analysis",      slug: "financial-analysis",      description: "Cost analysis, salary benchmarking, ROI, and budget planning." },
    { name: "Executive Assistant",     slug: "executive-assistant",     description: "Executive support, meeting prep, summaries, and administrative workflows." },
    { name: "Sales & Persuasion",      slug: "sales-persuasion",        description: "Sales scripts, objection handling, pitch decks, and closing strategies." },
    { name: "Training & Development",  slug: "training-development",    description: "Learning modules, coaching frameworks, skill assessments, and onboarding programs." },
    { name: "Leadership & Coaching",   slug: "leadership-coaching",     description: "Leadership development, team management, 1-on-1s, and mentoring frameworks." },
    { name: "Email & Business Writing",slug: "email-writing",           description: "Professional emails, business letters, reports, and written communication." },
  ];

  const catMap: Record<string, string> = {};
  for (const c of categoryData) {
    const created = await prisma.category.create({ data: { name: c.name, slug: c.slug, description: c.description } });
    catMap[c.slug] = created.id;
  }
  console.log(`✓ Created ${categoryData.length} categories`);

  // ─── Tags ─────────────────────────────────────────────────────────────────────
  const tagNames = [
    "philippines","dole","labor-law","template","structured","chain",
    "claude-optimized","chatgpt-optimized","all-platforms","expert-mode",
    "sme","hr","recruitment","performance","compliance","strategy","operations",
    "communication","finance","automation","sop","va","social-media","executive",
    "project-management","employee-relations","disciplinary","onboarding","kpi",
    "memo","proposal","report","negative-instructions","variables",
    // Extended tags for new categories and prompts
    "client-management","ai-tools","sme-growth","systems","customer-insights",
    "market-research","leadership","hr-consulting","performance-management",
  ];
  const tagMap: Record<string, string> = {};
  for (const name of tagNames) {
    const t = await prisma.tag.create({ data: { name, slug: name } });
    tagMap[name] = t.id;
  }
  console.log(`✓ Created ${tagNames.length} tags`);

  // ─── Helper ───────────────────────────────────────────────────────────────────
  async function createPrompt(d: {
    title: string;
    description: string;
    content: string;
    categorySlug: string;
    tags: string[];
  }) {
    const slug = d.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
    return prisma.prompt.create({
      data: {
        title: d.title,
        slug,
        description: d.description,
        content: d.content,
        authorId: admin.id,
        categoryId: catMap[d.categorySlug],
        isFeatured: false,
        tags: {
          create: d.tags.filter(t => tagMap[t]).map(t => ({ tagId: tagMap[t] })),
        },
      },
    });
  }

  let count = 0;

  // ═══════════════════════════════════════════════════════════════════════════════
  // HR CONSULTING
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Notice to Explain (NTE) Memo Generator",
    description: "Generate a legally compliant NTE memo following Philippine due process (twin-notice rule). Fill in the variables and paste into Claude or ChatGPT.",
    categorySlug: "hr-consulting",
    tags: ["philippines","labor-law","dole","template","disciplinary","memo","hr","variables","negative-instructions"],
    content: `**PURPOSE**
Generate a Notice to Explain (NTE) memo that satisfies Philippine labor law due process requirements — giving the employee a proper opportunity to respond before any disciplinary action.

---

**ROLE**
Act as a Senior HR Consultant in the Philippines with 15 years of labor law and disciplinary procedure experience.

---

**CONTEXT**
- Company Name: {company_name}
- Industry: {industry}
- Employee Name: {employee_name}
- Employee Position: {employee_position}
- Date of Incident: {incident_date}
- Description of Incident: {incident_description}
- Company Policy or Rule Violated: {policy_violated}
- Previous Violations (if any): {previous_violations}

---

**INPUTS NEEDED**
Before generating, provide all context fields above.

---

**CONSTRAINTS**
- Follow the twin-notice rule under the Philippine Labor Code (Art. 297–299)
- This is a NOTICE, not a finding of guilt — the employee must be allowed to explain
- Tone: Formal, factual, and professional
- Word count: 350–500 words
- Do not cite US or foreign labor law

---

**OUTPUT FORMAT**
1. Memo Header (Company, Date, To, From, Subject)
2. Factual summary of the incident (what happened, when, where)
3. Specific policy or rule reference
4. Directive to submit written explanation within 5 working days
5. Statement of potential consequences if employee fails to respond
6. Signature block with acknowledgment line for employee

---

**QUALITY STANDARD**
- Cite the specific company policy or DOLE regulation violated
- Include a clear deadline (5 working days from receipt)
- Avoid generic boilerplate — make it specific to the actual incident
- Include an employee acknowledgment line for the HR 201 file

---

**NEGATIVE INSTRUCTIONS**
- Do NOT make a finding of guilt in this memo
- Do NOT use accusatory language — state facts only
- Do NOT reference US labor law or standards
- Do NOT skip the policy reference — it is legally required`,
  }); count++;

  await createPrompt({
    title: "Employee Handbook Generator",
    description: "Create a comprehensive, DOLE-compliant employee handbook tailored to your company size, industry, and Philippine employment law.",
    categorySlug: "hr-consulting",
    tags: ["philippines","labor-law","template","hr","sme","compliance","variables"],
    content: `**PURPOSE**
Produce a complete employee handbook that is legally compliant with Philippine labor law, reflects your company culture, and serves as the authoritative reference for all employment policies.

---

**ROLE**
Act as a Senior HR Consultant in the Philippines specializing in HR policy development and organizational culture for SMEs and mid-sized companies.

---

**CONTEXT**
- Company Name: {company_name}
- Industry: {industry}
- Company Size: {company_size} employees
- Location: {city_and_province}, Philippines
- Business Description: {business_description}
- Core Values: {company_values}
- Special Policies or Arrangements: {special_policies}

---

**INPUTS NEEDED**
All context fields above. Request one section at a time for a complete handbook.

---

**CONSTRAINTS**
- Comply with: Philippine Labor Code, RA 7877 (Anti-Sexual Harassment), RA 11313 (Safe Spaces Act), RA 10911 (Anti-Age Discrimination), RA 10173 (Data Privacy Act)
- Tone: Professional yet accessible; avoid HR jargon
- Audience: Mixed literacy levels — write plainly
- Flag sections that need legal review before implementation

---

**OUTPUT FORMAT**
Generate the handbook with these sections (one at a time if needed):
1. Welcome Message from Management
2. Company Profile — Vision, Mission, Core Values
3. Employee Classification and Work Arrangements
4. Compensation and Benefits (statutory vs. company-provided)
5. Work Hours, Attendance, and Leave Policies
6. Code of Conduct and Disciplinary Procedures
7. Grievance and Appeals Process
8. Data Privacy and Confidentiality (RA 10173)
9. Workplace Safety (DOLE OSH Standards, RA 11058)
10. Acknowledgment and Receipt Page (signed by employee)

---

**QUALITY STANDARD**
- Reference specific DOLE issuances or Labor Code articles throughout
- Distinguish clearly between statutory benefits and voluntary company benefits
- Include sample policy language that can be adapted
- Flag high-risk sections (disciplinary, termination) for legal review

---

**NEGATIVE INSTRUCTIONS**
- Do NOT copy US employee handbook language
- Do NOT use vague statements like "as required by law" — cite the actual law
- Do NOT include policies that fall below minimum Philippine labor standards`,
  }); count++;

  await createPrompt({
    title: "HR Policy Compliance Audit",
    description: "Identify compliance gaps in your HR policies against DOLE regulations and the Philippine Labor Code. Outputs a prioritized audit report.",
    categorySlug: "hr-consulting",
    tags: ["philippines","dole","compliance","hr","expert-mode","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Conduct a structured HR policy audit that identifies compliance gaps, legal exposure, and improvement opportunities — prioritized by risk level.

---

**ROLE**
Act as a Senior HR Auditor and Labor Law Consultant in the Philippines with expertise in DOLE inspection standards and employer compliance.

---

**CONTEXT**
- Company Name: {company_name}
- Industry: {industry}
- Number of Employees: {employee_count}
- Policies Under Review: {policy_list}
- Last Formal Audit: {last_audit_date}
- Known Concerns: {known_issues}

---

**CONSTRAINTS**
- Reference: Philippine Labor Code, DOLE Department Orders, and applicable special laws
- Risk levels: Critical (legal liability) → Major (best practice gap) → Minor (improvement)
- Tone: Objective, evidence-based, and actionable
- Output: Structured audit report

---

**OUTPUT FORMAT**
1. Executive Summary — 3 to 5 key findings
2. Audit Scope and Methodology
3. Findings Table:
   | Policy Area | Current Status | Gap Identified | Legal Reference | Risk Level | Recommendation |
4. Priority Action Plan — 30/60/90-day roadmap
5. Appendix: DOLE-required policies checklist

---

**QUALITY STANDARD**
- Every finding must cite the specific DOLE regulation or Labor Code article
- Risk justification required for each finding
- Recommendations must be specific, actionable, and time-bound
- Include estimated effort for each recommendation

---

**EXPERT MODE**
Challenge every policy assumption. Ask: Is this policy legally required, or just traditional? Is there a more recent DOLE issuance that supersedes this? What is the actual penalty if this gap is discovered in a DOLE inspection?

---

**NEGATIVE INSTRUCTIONS**
- Do NOT make assumptions without stating the basis
- Do NOT apply US HR audit frameworks — use Philippine DOLE standards only
- Do NOT recommend beyond what is legally required without flagging it as voluntary`,
  }); count++;

  await createPrompt({
    title: "HR Annual Health Check (Comprehensive Audit)",
    description: "A 6-pillar HR health check covering compliance, talent, performance, culture, operations, and strategy — with a maturity score and 90-day action plan.",
    categorySlug: "hr-consulting",
    tags: ["hr","compliance","philippines","expert-mode","structured","sme","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a comprehensive annual HR health check that gives leadership a clear picture of HR maturity, compliance risk, and strategic priorities across all six HR pillars.

---

**ROLE**
Act as a Senior HR Auditor and Strategic HR Consultant conducting an annual HR health check for a Philippine business.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Headcount: {headcount}
- HR Team Size: {hr_team_size}
- HR Systems in Use: {hr_systems}
- Known HR Challenges: {challenges}
- Last Formal HR Review: {last_review}
- Business Growth Stage: {growth_stage} (startup / growth / mature / scaling)

---

**CONSTRAINTS**
- Cover all 6 HR pillars: Compliance, Talent, Performance, Culture, Operations, Strategy
- Maturity scale: 1 (Ad hoc) → 5 (Optimized)
- Prioritize by business risk and impact
- Philippine regulatory context throughout
- Tone: Executive-ready — suitable for CEO or board presentation

---

**OUTPUT FORMAT**

**Overall HR Maturity Score: __ / 5**

**Pillar Scorecard:**
| Pillar | Score | Key Strengths | Critical Gaps | Priority |

Then for each of 6 pillars:
**[Pillar Name]**
- Rating and rationale
- Key findings (specific, not generic)
- Legal or business risk
- Recommendations (ranked by impact)

**90-Day Action Roadmap:**
| Priority | Action | Owner | Timeline | Resources Needed |

---

**QUALITY STANDARD**
- Every gap must have a Philippine legal or business justification
- Recommendations must be realistic for the company's size and resources
- Report must be presentable to the CEO or board without HR background

---

**NEGATIVE INSTRUCTIONS**
- Do NOT audit theoretical best practices — focus on practical implementation
- Do NOT recommend enterprise-scale HR solutions for an SME
- Do NOT present findings without clear prioritization`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // LABOR LAW GUIDANCE
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "DOLE Compliance Checklist Generator",
    description: "Generate a complete DOLE compliance checklist tailored to your company size, industry, and employment types — with risk ratings and legal references.",
    categorySlug: "labor-law-guidance",
    tags: ["philippines","dole","labor-law","compliance","template","hr","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a comprehensive DOLE compliance checklist that an employer can use to self-audit before a DOLE inspection, with legal references and risk ratings for every item.

---

**ROLE**
Act as a Philippine Labor Law Specialist with expertise in DOLE inspection standards and employer compliance requirements.

---

**CONTEXT**
- Company Name: {company_name}
- Industry: {industry}
- Number of Employees: {employee_count}
- Employment Types Present: {employment_types} (regular, contractual, project-based, seasonal, etc.)
- Business Location: {location}
- Specific Compliance Concerns: {concerns}

---

**CONSTRAINTS**
- Reference: Philippine Labor Code (PD 442), DOLE Department Orders, OSH Act (RA 11058), and relevant social protection laws
- Include mandatory government remittances (SSS, PhilHealth, Pag-IBIG, BIR)
- Flag items most commonly cited during DOLE inspections
- Use the current regional minimum wage applicable to the location

---

**OUTPUT FORMAT**
Checklist organized by compliance area. For each item:
☐ [Requirement] | Legal Basis | Risk: High / Medium / Low

Areas to cover:
1. Employment Documentation (contracts, 201 files, IDs)
2. Wage and Benefits (minimum wage, 13th month, holiday pay, overtime)
3. Working Hours and Overtime
4. Leave Benefits (SL, VL, ML, PL, Solo Parent, VAWC, Bereavement)
5. Safety and Health (OSH Act, RA 11058)
6. Social Protection Remittances (SSS, PhilHealth, Pag-IBIG)
7. Government Reportorial Requirements
8. Special Worker Categories (PWD, solo parents, night workers, minors)

---

**QUALITY STANDARD**
- Every item must cite a specific law, Department Order, or DOLE issuance
- High-risk items must include the potential DOLE penalty for non-compliance
- Include current minimum wage rates by region as the wage floor reference

---

**NEGATIVE INSTRUCTIONS**
- Do NOT include US OSHA or non-Philippine labor standards
- Do NOT cite outdated DOLE Department Orders — use the most recent applicable issuance
- Do NOT present this as legal advice — recommend legal counsel for complex cases`,
  }); count++;

  await createPrompt({
    title: "Separation Pay Calculator and Explainer",
    description: "Calculate Philippine separation pay entitlements and explain the legal basis — for authorized causes, redundancy, or retrenchment.",
    categorySlug: "labor-law-guidance",
    tags: ["philippines","labor-law","dole","template","compliance","hr","variables"],
    content: `**PURPOSE**
Calculate the correct separation pay entitlement under Philippine law and explain the legal basis, so the employer pays correctly and the employee understands their rights.

---

**ROLE**
Act as a Philippine Labor Law Consultant specializing in separation, termination, and final pay computations under the Labor Code and relevant DOLE issuances.

---

**CONTEXT**
- Employee Name: {employee_name}
- Position: {position}
- Date Hired: {date_hired}
- Date of Separation: {separation_date}
- Reason for Separation: {separation_reason}
- Basic Monthly Salary: PHP {monthly_salary}
- Employment Status: {employment_status} (regular / probationary / project-based)
- Other Benefits Included in Base Pay: {other_benefits}

---

**CONSTRAINTS**
- Apply Labor Code Articles 298–299 (authorized causes) or Article 300 (just causes)
- Computation formula: [1 month or ½ month salary × years of service]
- Fraction of at least 6 months counts as 1 year
- Include the 30-day final pay rule (DOLE Labor Advisory No. 06, Series of 2020)
- Add disclaimer: Guide only — recommend DOLE or legal counsel for disputes

---

**OUTPUT FORMAT**
1. Separation Classification (authorized cause / just cause / illegal dismissal risk)
2. Legal Basis (specific Labor Code article)
3. Computation Table:
   | Item | Formula | Amount |
4. Total Separation Package with final pay breakdown
5. Payment Timeline (deadline based on DOLE advisory)
6. Employee Rights and Remedies if not paid correctly

---

**QUALITY STANDARD**
- Clearly distinguish between separation pay (authorized cause) and remedies for illegal dismissal
- Flag if the scenario may carry illegal dismissal risk
- Include prescriptive periods (4 years for money claims, 1 year for illegal dismissal at NLRC)

---

**NEGATIVE INSTRUCTIONS**
- Do NOT apply US employment termination standards
- Do NOT make a definitive legal conclusion — flag contested cases for DOLE or NLRC
- Do NOT compute separation pay for just causes unless a CBA or contract provides for it`,
  }); count++;

  await createPrompt({
    title: "Just Cause Termination Process Guide",
    description: "Step-by-step guidance on the Philippine just cause termination process — from NTE to Notice of Decision — with due process requirements and legal risk flags.",
    categorySlug: "labor-law-guidance",
    tags: ["philippines","labor-law","dole","disciplinary","expert-mode","structured","hr","variables","negative-instructions"],
    content: `**PURPOSE**
Guide an employer through every step of the just cause termination process in the Philippines, ensuring due process is followed and legal exposure is minimized.

---

**ROLE**
Act as a Philippine Labor Law and HR Consultant specializing in disciplinary due process and just cause termination under the Labor Code.

---

**CONTEXT**
- Company: {company_name}
- Employee: {employee_name}, {position}
- Nature of Offense: {offense_description}
- Evidence Available: {evidence_list}
- Employee's Disciplinary History: {previous_violations}
- Company Policy Referenced: {policy_reference}
- Desired Outcome: {desired_outcome}

---

**CONSTRAINTS**
- Strictly follow the twin-notice rule (NTE → Administrative Hearing → Notice of Decision)
- Apply just cause grounds under Labor Code Article 297
- Tone: Procedural, factual, legally grounded
- Include legal risk flags at each step
- Timeline for each step must be specified

---

**OUTPUT FORMAT**
Step-by-step roadmap:
1. Step 1: First Notice (NTE) — content checklist, delivery methods, receipt documentation
2. Step 2: Administrative Hearing — how to conduct, employee rights, documentation required
3. Step 3: Evaluating the Employee's Defense — assessment framework
4. Step 4: Second Notice (Notice of Decision) — mandatory contents, timing
5. Step 5: Implementation — final pay computation, clearance process, HR file documentation
6. Risk Assessment — illegal dismissal exposure and mitigation at each step
7. Document Checklist — everything needed for the HR 201 file

---

**QUALITY STANDARD**
- Each step must cite the applicable Labor Code article or NLRC/Supreme Court jurisprudence
- Common due process violations (that result in illegal dismissal findings) must be explicitly flagged
- Provide sample language for each required notice

---

**NEGATIVE INSTRUCTIONS**
- Do NOT skip any step of the twin-notice rule — shortcutting is the #1 cause of illegal dismissal findings
- Do NOT advise termination before due process is completed
- Do NOT use language that suggests bad faith or predetermined outcome`,
  }); count++;

  await createPrompt({
    title: "Philippine Business Compliance Calendar",
    description: "Generate a 12-month compliance calendar covering DOLE, BIR, SSS, PhilHealth, and Pag-IBIG deadlines for a Philippine SME.",
    categorySlug: "labor-law-guidance",
    tags: ["philippines","compliance","dole","labor-law","template","sme","finance","variables"],
    content: `**PURPOSE**
Produce a 12-month compliance calendar that keeps a Philippine business on top of all government deadlines — preventing penalties and ensuring uninterrupted operations.

---

**ROLE**
Act as a Philippine Business Compliance Specialist covering DOLE, BIR, SSS, PhilHealth, Pag-IBIG, and SEC requirements for SMEs.

---

**CONTEXT**
- Company Name: {company_name}
- Industry: {industry}
- Number of Employees: {employee_count}
- Business Type: {business_type} (corporation / sole proprietorship / partnership)
- Registered Location: {location}
- Fiscal Year: {fiscal_year}
- Special Circumstances: {special_circumstances}

---

**CONSTRAINTS**
- Include all mandatory government deadlines for the specified fiscal year
- Organize by month and government agency
- Flag high-penalty deadlines prominently
- Note: Verify with agency websites as deadlines may change annually
- Include digital filing portals where available

---

**OUTPUT FORMAT**
12-Month Compliance Calendar.
For each month, a table:
| Due Date | Agency | Requirement | Applicable To | Penalty for Non-Compliance |

Critical annual deadlines to always include:
- 13th Month Pay: on or before December 24
- SSS R-3 / R-5 Forms: monthly
- PhilHealth RF-1: monthly
- Pag-IBIG: monthly
- BIR Withholding Tax: monthly and quarterly
- Annual ITR (BIR Form 1700/1701): April 15
- DOLE Annual Establishment Report: January 31
- SEC Annual Report (if corporation): within 120 days of fiscal year end

---

**QUALITY STANDARD**
- All deadlines must cite the specific agency circular or BIR Revenue Regulations
- Penalties must be quantified where the rate is fixed by law
- Include the relevant agency portal URL for digital filing

---

**NEGATIVE INSTRUCTIONS**
- Do NOT present this as legal or tax advice — recommend a licensed CPA for complex cases
- Do NOT use outdated deadlines — note the year the information applies to
- Do NOT list tax deadlines only — include all labor and social protection requirements`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // EMPLOYEE RELATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Workplace Conflict Resolution Advisor",
    description: "Get a structured, step-by-step conflict resolution plan for any workplace dispute — with mediation scripts and escalation paths.",
    categorySlug: "employee-relations",
    tags: ["hr","template","philippines","employee-relations","communication","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a structured workplace conflict resolution plan that resolves the issue fairly, protects the company legally, and preserves the working relationship where possible.

---

**ROLE**
Act as a Philippine HR Consultant and workplace mediator with expertise in employee relations and conflict resolution for SMEs and professional services firms.

---

**CONTEXT**
- Company: {company_name}
- Parties Involved: {party_a} and {party_b}
- Nature of Conflict: {conflict_description}
- Duration of Conflict: {duration}
- Impact on Operations: {operational_impact}
- Previous Resolution Attempts: {previous_attempts}
- Desired Outcome: {desired_outcome}

---

**CONSTRAINTS**
- Approach: Mediation-first before formal disciplinary action
- Tone: Neutral, empathetic, solution-focused
- Comply with RA 7877 (Anti-Sexual Harassment) and RA 11313 (Safe Spaces Act) if relevant
- Include escalation path if mediation fails
- Word count: 400–600 words

---

**OUTPUT FORMAT**
1. Conflict Analysis — root cause and contributing factors
2. Recommended Approach — mediation / formal grievance / coaching
3. Step-by-Step Resolution Plan with timeline and responsible parties
4. Mediation Script — key phrases and what NOT to say
5. Documentation Required at each step
6. Escalation Path — if mediation fails
7. Prevention Recommendations — how to stop recurrence

---

**QUALITY STANDARD**
- Distinguish between interpersonal conflict and policy or legal violations
- Mediation script must include specific language, not vague suggestions
- Flag if the situation potentially involves harassment or discrimination requiring legal escalation

---

**NEGATIVE INSTRUCTIONS**
- Do NOT take sides or assign blame before a proper investigation
- Do NOT offer generic advice like "communicate better" — provide specific, actionable steps
- Do NOT recommend termination as a first resort
- Do NOT proceed with formal action if mediation has not been attempted`,
  }); count++;

  await createPrompt({
    title: "Exit Interview Framework and Retention Analysis",
    description: "Design exit interview questions and analyze departure patterns to identify retention risks and actionable improvements.",
    categorySlug: "employee-relations",
    tags: ["hr","template","employee-relations","structured","variables"],
    content: `**PURPOSE**
Design an effective exit interview process and produce an analysis that identifies genuine retention risks and practical improvements — not just data collection.

---

**ROLE**
Act as an HR Analytics and Employee Experience Consultant helping Philippine businesses reduce voluntary turnover and improve retention.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Departing Employee Role: {role}
- Reason for Leaving (stated by employee): {stated_reason}
- Tenure: {tenure}
- Department: {department}
- Known Turnover Patterns: {turnover_pattern}

---

**CONSTRAINTS**
- Questions must be open-ended and non-confrontational
- Focus on actionable insights, not data collection for its own sake
- Protect employee confidentiality in the analysis report
- Include Philippine-specific factors (commute, regional salary gaps, career mobility)

---

**OUTPUT FORMAT**

**Part A — Exit Interview Questions (15 questions)**
Organized by theme: Role and Team | Company Culture | Management | Compensation | Career Growth | Overall

**Part B — Analysis Framework**
1. Key Themes Identified
2. Root Cause Analysis
3. Retention Risk Assessment by category (High / Medium / Low)
4. Philippine benchmark: typical turnover rates for this industry and role level
5. Recommended Actions — ranked by impact
6. Quick Wins (30 days) vs. Strategic Changes (90 days)

---

**QUALITY STANDARD**
- Questions must elicit honest responses, not defensive ones — test each question before use
- Analysis must identify patterns across multiple exits, not just one opinion
- Recommendations must be department-specific, not company-wide generalizations

---

**NEGATIVE INSTRUCTIONS**
- Do NOT ask leading questions that suggest the company was at fault
- Do NOT use exit data to shame managers — frame as systemic improvement
- Do NOT give generic "improve communication" recommendations without specific actions`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // RECRUITMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Job Description Builder (Philippines)",
    description: "Create a compelling, DOLE-compliant job description optimized for Philippine job platforms like JobStreet, LinkedIn, and Kalibrr.",
    categorySlug: "recruitment",
    tags: ["hr","recruitment","philippines","template","compliance","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a job description that attracts the right candidates, complies with Philippine anti-discrimination laws, and performs well on major job platforms.

---

**ROLE**
Act as a Senior HR Recruitment Specialist in the Philippines with expertise in talent acquisition and the Philippine labor market.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Job Title: {job_title}
- Department: {department}
- Reports To: {supervisor_title}
- Work Location: {work_location} (on-site / hybrid / remote)
- Employment Type: {employment_type}
- Salary Range: PHP {salary_range}
- Key Responsibilities: {key_responsibilities}
- Required Qualifications: {qualifications}
- Target Posting Platforms: {platforms}

---

**CONSTRAINTS**
- Comply with RA 10911 (Anti-Age Discrimination) — no age requirements unless BFOQ-justified
- Comply with RA 7277 (Magna Carta for PWD) — include equal opportunity statement
- No gender, civil status, height, weight, or appearance requirements
- Length: 400–600 words
- Always include the salary range — it builds trust and reduces unqualified applications

---

**OUTPUT FORMAT**
1. Job Title and Employment Classification
2. About the Company (2–3 sentences, values-forward)
3. Role Overview (1 paragraph)
4. Key Responsibilities (8–10 specific action-verb bullets)
5. Qualifications — Required vs. Preferred (keep to 8 items max)
6. What We Offer (salary, statutory + voluntary benefits, culture)
7. Equal Opportunity Statement
8. How to Apply (process, timeline, contact)

---

**QUALITY STANDARD**
- Responsibilities must use strong action verbs (Lead, Build, Manage — not "responsible for")
- Differentiate must-have vs. nice-to-have qualifications — do not list 20+ requirements
- Salary range included (best practice and legally recommended for transparency)
- Keywords optimized for Philippine job search behavior

---

**NEGATIVE INSTRUCTIONS**
- Do NOT include age, gender, or civil status requirements
- Do NOT list more than 10 required qualifications — it deters qualified candidates
- Do NOT use vague job titles like "All-Around" or "Rockstar"
- Do NOT write "competitive salary" without a range — candidates will move on`,
  }); count++;

  await createPrompt({
    title: "Structured Interview Scorecard",
    description: "Create a competency-based interview scorecard with behavioral questions, scoring rubric, and legal compliance built in.",
    categorySlug: "recruitment",
    tags: ["hr","recruitment","template","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a structured interview scorecard that ensures every candidate is assessed on the same criteria, reduces bias, and creates a defensible hiring decision.

---

**ROLE**
Act as a Talent Acquisition Specialist with expertise in competency-based interviewing and structured selection methods.

---

**CONTEXT**
- Company: {company_name}
- Job Title: {job_title}
- Key Competencies Required: {competencies}
- Technical Skills to Assess: {technical_skills}
- Culture Fit Criteria: {culture_criteria}
- Interview Format: {interview_format} (panel / one-on-one / sequential)
- Number of Interview Rounds: {rounds}

---

**CONSTRAINTS**
- Use STAR method (Situation, Task, Action, Result) for behavioral questions
- 2 behavioral questions + 1 situational question per competency
- Scoring scale: 1–5 with clear behavioral anchors for each level
- No illegal interview questions (RA 10911: no age; no civil status, family plans, religion)
- Design for a 45–60 minute interview maximum

---

**OUTPUT FORMAT**

**Section 1: Candidate Profile (screener pass/fail)**
**Section 2: Competency Matrix**
| Competency | Weight | Behavioral Question 1 | Behavioral Question 2 | Situational Question | Score (1–5) | Notes |

**Section 3: Technical Assessment** (3–5 questions)
**Section 4: Values and Culture Assessment** (3 questions)
**Section 5: Questions the Candidate Should Ask** (signals engagement)
**Section 6: Interviewer Recommendation**
| Strong Hire | Hire | On Hold | No Hire | — with required justification

**Section 7: Scoring Rubric**
For each competency, describe what a 1, 3, and 5 looks like behaviorally.

---

**QUALITY STANDARD**
- Behavioral anchors must describe specific observable behaviors at each score level
- Weightings must reflect actual job requirements (validated by hiring manager)
- "No Hire" threshold must be defined before interviews begin, not after

---

**NEGATIVE INSTRUCTIONS**
- Do NOT include illegal interview questions — age, religion, civil status, pregnancy
- Do NOT rely on gut feel — every score needs a behavioral evidence note
- Do NOT let one outstanding competency compensate for a critical failure in another`,
  }); count++;

  await createPrompt({
    title: "30-60-90 Day Onboarding Plan",
    description: "Create a structured onboarding plan that accelerates new hire integration, meets Philippine HR compliance requirements, and sets clear 90-day performance expectations.",
    categorySlug: "recruitment",
    tags: ["hr","onboarding","template","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a 30-60-90 day onboarding plan that turns a new hire into a productive, engaged team member — and meets all Philippine employer compliance requirements.

---

**ROLE**
Act as an HR and Organizational Development Specialist helping businesses create effective employee onboarding experiences.

---

**CONTEXT**
- Company: {company_name}
- New Employee: {employee_name}
- Role: {job_title}
- Department: {department}
- Start Date: {start_date}
- Direct Manager: {manager_name}
- Key Team Members: {team_members}
- Critical 90-Day Objectives: {objectives}

---

**CONSTRAINTS**
- Include statutory compliance tasks (SSS, PhilHealth, Pag-IBIG enrollment deadlines)
- Balance formal training, informal integration, and relationship building
- Flag activities requiring manager involvement vs. self-directed
- Include probationary period evaluation milestones

---

**OUTPUT FORMAT**

**Days 1–5: Foundation Week**
- Administrative setup checklist (government ID enrollment, system access, benefits)
- Company orientation schedule
- Team introduction plan
- Key documents to review

**Days 6–30: Learning Phase**
- Core process training schedule
- Shadowing and observation plan
- Key stakeholder meeting list
- 30-day manager check-in guide (with specific questions)

**Days 31–60: Contributing Phase**
- First independent deliverables
- Cross-functional exposure plan
- 60-day feedback session template

**Days 61–90: Performing Phase**
- Project ownership milestones
- Probationary period evaluation criteria
- 90-day review template

---

**QUALITY STANDARD**
- Every milestone must have a clear owner (manager / HR / new hire) and success metric
- Government enrollment deadlines must be included with specific timeframes
- Manager conversation guides must contain specific questions, not just topics

---

**NEGATIVE INSTRUCTIONS**
- Do NOT create a plan that relies entirely on self-study — manager involvement is essential
- Do NOT overwhelm the first week — prioritize what is necessary vs. informational
- Do NOT skip the relationship-building component — it predicts 90-day retention`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // PERFORMANCE MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "KPI Framework Builder",
    description: "Build a practical, SMART KPI framework for any role or department — with targets, measurement methods, and a scoring guide.",
    categorySlug: "performance-management",
    tags: ["hr","kpi","performance","template","structured","sme","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a practical KPI framework that links individual and team performance to business goals — with clear targets, measurement methods, and a scoring guide that managers can actually use.

---

**ROLE**
Act as a Performance Management Specialist and HR Consultant helping businesses implement results-driven KPI systems.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Role or Department: {role_or_department}
- Key Business Goals This Period: {business_goals}
- Current Performance Issues: {performance_issues}
- Available Data and Systems: {data_systems}
- Review Frequency: {review_frequency}

---

**CONSTRAINTS**
- Follow SMART criteria (Specific, Measurable, Achievable, Relevant, Time-bound)
- Maximum 5–7 KPIs per role — avoid KPI overload
- Balance leading indicators (activities) and lagging indicators (results)
- Tone: Practical and results-focused — avoid HR theory

---

**OUTPUT FORMAT**

**KPI Framework Table:**
| KPI Name | Category | Weight | Baseline | Target | Stretch Target | Measurement Method | Data Source | Review Frequency |

Categories: Financial / Operational / Customer / People / Innovation

**For each KPI, include:**
1. Definition and why it matters to the business
2. How to measure it (formula or data source)
3. Scoring guide:
   - 5 (Outstanding): Exceeds target by 20% or more
   - 4 (Exceeds): Meets or exceeds target
   - 3 (Meets): Within 10% of target
   - 2 (Needs Improvement): 11–20% below target
   - 1 (Unsatisfactory): More than 20% below target

---

**QUALITY STANDARD**
- Every KPI must be within the employee's direct control or significant influence
- Targets must be ambitious but achievable — benchmark against industry data where available
- Data collection method must be practical (who tracks it, when, how)

---

**NEGATIVE INSTRUCTIONS**
- Do NOT create KPIs that cannot be measured with available data
- Do NOT assign KPIs for work outside the employee's actual role
- Do NOT create more than 7 KPIs — focus on what truly matters
- Do NOT set vague targets like "improve communication" without a measurement`,
  }); count++;

  await createPrompt({
    title: "Performance Improvement Plan (PIP) Generator",
    description: "Create a structured, fair, and legally defensible Performance Improvement Plan that supports genuine improvement — not just documentation for termination.",
    categorySlug: "performance-management",
    tags: ["hr","performance","template","structured","philippines","labor-law","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a Performance Improvement Plan that gives an underperforming employee a genuine opportunity to meet expectations — while creating legally defensible documentation if further action becomes necessary.

---

**ROLE**
Act as a Senior HR Business Partner specializing in performance management and Philippine employment law.

---

**CONTEXT**
- Company: {company_name}
- Employee: {employee_name}, {position}
- Department: {department}
- Performance Issues Identified: {performance_issues}
- Duration of Issues: {duration}
- Previous Coaching and Feedback Provided: {previous_coaching}
- PIP Duration: {pip_duration} (typically 30–90 days)
- Support to Be Provided: {support_available}

---

**CONSTRAINTS**
- The PIP must be developmental in tone, not punitive
- Include measurable performance targets for each issue area
- Under Philippine law, consistently poor performance can be a just cause for termination (Art. 297) — PIP is the documented support phase
- Avoid language that could be construed as constructive dismissal
- PIP must be presented and discussed with the employee, not handed to them unilaterally

---

**OUTPUT FORMAT**
1. PIP Header — Employee, Manager, HR, Effective Date, Duration
2. Purpose Statement — development and support, not punishment
3. Performance Gap Summary:
   | Expected Standard | Actual Performance | Gap |
4. Improvement Targets (SMART goals for each gap)
5. Support Plan — training, coaching, tools, check-in schedule
6. Weekly Check-in Schedule with agenda template
7. Success Criteria — what "completion" looks like
8. Consequences if targets are not met — clearly and professionally stated
9. Acknowledgment Signatures — Employee, Manager, HR

---

**QUALITY STANDARD**
- Every target must have a specific deadline and a measurable success criterion
- Support plan must be genuine — include actual resources and manager time commitment
- Consequences must be stated clearly and without aggression

---

**NEGATIVE INSTRUCTIONS**
- Do NOT use the PIP as a paper trail for predetermined termination
- Do NOT set targets that are impossible within the timeframe
- Do NOT skip the acknowledgment signature — it is critical for the HR 201 file
- Do NOT present the PIP without a discussion — it must be explained to the employee`,
  }); count++;

  await createPrompt({
    title: "Annual Performance Review Generator",
    description: "Generate a balanced, evidence-based annual performance review with ratings, narrative commentary, and a development plan.",
    categorySlug: "performance-management",
    tags: ["hr","performance","template","structured","variables"],
    content: `**PURPOSE**
Produce a comprehensive annual performance review that is balanced, evidence-based, and useful for both the employee's development and the company's compensation and promotion decisions.

---

**ROLE**
Act as an HR Performance Management Specialist helping managers conduct fair, constructive, and well-documented annual performance reviews.

---

**CONTEXT**
- Company: {company_name}
- Employee: {employee_name}
- Position: {position}
- Review Period: {review_period}
- Manager: {manager_name}
- Key Achievements This Year: {achievements}
- Areas for Improvement: {improvement_areas}
- KPI Results: {kpi_results}
- Behavioral Observations: {behavioral_observations}

---

**CONSTRAINTS**
- Balance positive recognition and constructive feedback — both are required
- Every rating must be supported by a specific example or data point
- Assess the full review period — avoid recency bias
- Tone: Professional, fair, development-focused
- Include a forward-looking development plan

---

**OUTPUT FORMAT**

Rating Scale: 5 Outstanding | 4 Exceeds Expectations | 3 Meets Expectations | 2 Needs Improvement | 1 Unsatisfactory

1. Overall Performance Summary (1 paragraph with overall rating and narrative)
2. KPI Achievement Review:
   | Goal | Target | Actual Result | Rating (1–5) | Comments |
3. Core Competency Assessment (5 competencies with rating and specific behavioral evidence)
4. Key Achievements (3–5 specific highlights from the review period)
5. Development Areas (2–3 growth opportunities with specific suggestions, not criticisms)
6. Career Development Discussion Notes
7. Goals for Next Review Period (3–5 SMART goals)
8. Overall Performance Rating with written justification
9. Signature Block — Employee, Manager, HR (and date of discussion)

---

**QUALITY STANDARD**
- Every competency rating needs a specific behavioral example — no generic ratings
- Development areas must be framed as growth opportunities, not personal failures
- Goals for next period must connect to department or company objectives

---

**NEGATIVE INSTRUCTIONS**
- Do NOT let one strong area inflate all ratings (halo effect)
- Do NOT write vague development areas like "needs to improve communication"
- Do NOT link performance ratings to salary decisions within this document — keep them separate`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // SME OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "SME Business Diagnostic Framework",
    description: "Conduct a structured business diagnostic across Operations, Finance, HR, Marketing, and Technology — with a priority action matrix.",
    categorySlug: "sme-operations",
    tags: ["strategy","sme","template","expert-mode","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a structured business diagnostic that reveals the most critical constraints limiting the SME's growth, with a prioritized action plan that leadership can act on immediately.

---

**ROLE**
Act as a Business Operations Consultant with 15 years of SME advisory experience, specializing in organizational efficiency and growth strategy.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Business Size: {employee_count} employees, PHP {annual_revenue} annual revenue
- Years in Operation: {years}
- Primary Business Challenge: {main_challenge}
- Areas of Concern: {concern_areas}
- Business Goals (12 months): {goals}

---

**CONSTRAINTS**
- Use a structured framework: Operations, Finance, HR, Marketing, Technology
- Prioritize by impact × urgency
- Tone: Direct, analytical, no jargon
- Include Philippine market and regulatory context
- Output must be executive-ready

---

**OUTPUT FORMAT**
1. Executive Summary — 3 to 5 key findings
2. Diagnostic Scorecard (1–5 per area):
   | Business Area | Score | Top Issues | Priority |
3. Deep-Dive per Area:
   - Current State
   - Gap Identified
   - Business Impact (quantified where possible)
   - Root Cause
4. Priority Action Matrix:
   | Quick Wins (30 days) | Medium-Term (90 days) | Long-Term (12 months) |
5. Resource Requirements — people, budget, time estimates
6. Top 3 Constraints — the most limiting factors to address first

---

**EXPERT MODE**
Challenge the client's stated problems. Ask: Is this the real issue or a symptom? What assumptions are we making? What would need to be true for this recommendation to fail? What are the top 3 constraints — the things that, if removed, would unlock the most growth?

---

**NEGATIVE INSTRUCTIONS**
- Do NOT recommend expensive solutions without a realistic ROI
- Do NOT diagnose outside the stated scope without flagging it explicitly
- Do NOT give generic recommendations that apply to any business — be specific`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // SOP CREATION
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Standard Operating Procedure (SOP) Generator",
    description: "Create a clear, step-by-step SOP for any business process — formatted for easy employee execution with decision points and quality checkpoints.",
    categorySlug: "sop-creation",
    tags: ["sop","operations","template","structured","sme","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a Standard Operating Procedure that a new employee can follow without supervision — with clear steps, decision points, and quality checkpoints built in.

---

**ROLE**
Act as a Business Process Documentation Specialist helping businesses create practical, enforceable SOPs.

---

**CONTEXT**
- Company: {company_name}
- Process Name: {process_name}
- Department/Team: {department}
- Process Owner: {process_owner}
- Frequency: {frequency} (daily / weekly / monthly / as-needed)
- Key Inputs: {process_inputs}
- Key Outputs/Deliverables: {process_outputs}
- Systems and Tools Used: {systems}
- Known Pain Points: {pain_points}

---

**CONSTRAINTS**
- Language: Simple, clear, and action-oriented — write for someone new to the role
- Format: Numbered steps with decision points clearly marked
- Include quality checkpoints where errors are most likely to occur
- Length: 1–3 pages (comprehensive but not overwhelming)

---

**OUTPUT FORMAT**
1. SOP Title and Reference Number
2. Purpose and Scope
3. Responsibility Matrix (RACI: Responsible, Accountable, Consulted, Informed)
4. Required Resources — tools, systems, forms, access levels needed
5. Step-by-Step Procedure (numbered, with ↳ decision points branched clearly)
6. Quality Checkpoints — what to verify at each critical stage
7. Common Errors and How to Avoid Them
8. Exception Handling — what to do when the standard process fails or cannot be followed
9. Related Documents and References
10. Version History: | Date | Version | Change Made | Author |

---

**QUALITY STANDARD**
- Every step must be executable independently by a new employee
- Decision points must have clear criteria for each path (if X, then Y; if not, then Z)
- Include a "how do you know it's done correctly?" check for every critical step

---

**NEGATIVE INSTRUCTIONS**
- Do NOT write SOPs in paragraph form — numbered steps only
- Do NOT use acronyms or internal jargon without definition
- Do NOT ignore real exceptions — every SOP must include an exception handling section`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // BUSINESS STRATEGY
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "SWOT Analysis with Strategic Implications",
    description: "Generate a specific, evidence-based SWOT analysis with SO/WO/ST/WT strategies and prioritized recommendations — not a generic list.",
    categorySlug: "business-strategy",
    tags: ["strategy","sme","template","expert-mode","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a SWOT analysis that goes beyond a generic list — identifying specific strategic implications and concrete priorities the business can act on.

---

**ROLE**
Act as a Strategic Business Consultant with expertise in competitive analysis and business strategy for Philippine SMEs and professional services firms.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Business Model: {business_model}
- Key Products/Services: {products_services}
- Target Market: {target_market}
- Geographic Coverage: {coverage}
- Main Competitors: {competitors}
- Current Business Challenges: {challenges}

---

**CONSTRAINTS**
- Every SWOT item must be specific and evidence-based — not generic
- Include Philippine market context (economic trends, regulatory environment, labor market)
- Tone: Strategic and analytical
- Output must be decision-ready, not just descriptive

---

**OUTPUT FORMAT**
1. SWOT Matrix (structured grid)
2. Narrative Analysis — for each quadrant, 3–5 specific items with strategic implication
3. Cross-Strategies:
   - SO Strategies (use strengths to capture opportunities)
   - WO Strategies (overcome weaknesses to capture opportunities)
   - ST Strategies (use strengths to mitigate threats)
   - WT Strategies (minimize weaknesses to avoid threats)
4. Top 3 Strategic Priorities — ranked by impact and feasibility
5. Key Assumptions and Risks

---

**EXPERT MODE**
Challenge every SWOT factor: Is this a real strength or an untested assumption? Is this threat imminent or theoretical? What would need to be true for this opportunity to actually materialize? Identify the one constraint that, if removed, would unlock the most value.

---

**NEGATIVE INSTRUCTIONS**
- Do NOT list generic SWOT items that could apply to any company
- Do NOT present threats without corresponding mitigation strategies
- Do NOT make strategic recommendations without estimating the resources required`,
  }); count++;

  await createPrompt({
    title: "Client Onboarding Diagnostic (Consulting)",
    description: "Conduct a structured needs assessment for a new consulting client — uncovering stated and unstated challenges before recommending any solution.",
    categorySlug: "business-strategy",
    tags: ["template","communication","strategy","sme","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a structured client discovery framework that uncovers the real business problems — both stated and unstated — before any solution is proposed.

---

**ROLE**
Act as a Senior Business Consultant conducting a formal discovery and needs assessment for a new client engagement.

---

**CONTEXT**
- Client Company: {client_company}
- Industry: {industry}
- Company Size: {size}
- Primary Contact: {contact_name}, {contact_title}
- Reason for Engaging a Consultant: {engagement_reason}
- Business Challenges Stated: {stated_challenges}
- Previous Consulting Experience: {previous_consulting}
- Budget Range: {budget_range}
- Timeline Expectations: {timeline}

---

**CONSTRAINTS**
- Approach: Diagnostic before prescription — gather information before proposing solutions
- Balance understanding stated needs vs. uncovering unstated needs
- Include both diagnostic questions and early observations
- Tone: Consultative, professional, and curious

---

**OUTPUT FORMAT**
1. Client Profile Summary
2. Discovery Questions (20 organized by theme):
   - Organization and Culture
   - HR and People Management
   - Operations and Processes
   - Technology and Systems
   - Growth and Strategy
3. Red Flags to Watch For — common SME issues clients may not disclose upfront
4. Initial Hypothesis — clearly labeled as preliminary, not a conclusion
5. Recommended Diagnostic Scope — what to investigate further
6. Next Steps and Deliverables with timeline

---

**QUALITY STANDARD**
- Questions must uncover root causes, not just surface symptoms
- Red flags must be specific to the industry and Philippine SME context
- Initial hypothesis must be validated before any solution is presented

---

**NEGATIVE INSTRUCTIONS**
- Do NOT propose solutions before completing the diagnostic
- Do NOT make assumptions about company culture from the first meeting
- Do NOT over-commit to scope without proper data collection`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // VA OPERATIONS
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Virtual Assistant Task Brief Generator",
    description: "Create an unambiguous task brief for a VA or remote team member — with clear deliverables, done criteria, and negative instructions that prevent the most common errors.",
    categorySlug: "va-operations",
    tags: ["va","template","operations","communication","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a task brief clear enough for a VA to execute independently and correctly — without back-and-forth clarification.

---

**ROLE**
Act as an experienced Executive Director or Operations Manager who delegates work clearly and produces measurable outputs from remote team members.

---

**CONTEXT**
- Task Name: {task_name}
- VA Name: {va_name}
- Deadline: {deadline} (include date, time, and timezone)
- Priority Level: {priority} (Urgent / High / Normal / Low)
- Background/Context: {background}
- Specific Deliverable: {deliverable}
- Resources Available: {resources} (links, files, logins, templates)
- Quality Standard: {quality_standard}
- Communication Method: {communication}

---

**CONSTRAINTS**
- Language: Simple, direct, and unambiguous — write at the level of a first-time reader
- Include enough context for the VA to work without interrupting you
- Define exactly what "done" looks like — no subjective criteria
- Keep under 300 words total
- Include specific negative instructions to prevent the most common errors

---

**OUTPUT FORMAT**

**TASK BRIEF — {task_name}**

📋 **What needs to be done:**
[1–3 sentence description of the task]

🎯 **Deliverable:**
[File name, format, destination, word count or length — be exact]

📅 **Deadline:** {deadline}

📚 **Resources:**
[Links, files, logins, reference examples]

✅ **Done when:**
[3–5 specific, observable success criteria]

⛔ **Do NOT:**
[3 specific negative instructions for this task]

❓ **Questions:**
[When and how to ask — e.g., "Message me on Slack before 3pm if blocked"]

---

**QUALITY STANDARD**
- Every brief must have a specific deliverable and observable done criteria
- Negative instructions prevent the 3 most common errors for this type of task
- Question protocol reduces unnecessary interruptions

---

**NEGATIVE INSTRUCTIONS**
- Do NOT write a brief without a clear deliverable and done criteria
- Do NOT assume the VA knows the background — always provide context
- Do NOT give open-ended deadlines like "ASAP" — use a specific date and time`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // SOCIAL MEDIA CONTENT
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "LinkedIn Thought Leadership Post Generator",
    description: "Create a high-engagement LinkedIn post that positions a business professional as a credible authority — with a scroll-stopping hook and genuine insight.",
    categorySlug: "social-media-content",
    tags: ["social-media","template","communication","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a LinkedIn post that stops the scroll, delivers genuine professional insight, and builds authority — without feeling like an advertisement.

---

**ROLE**
Act as a LinkedIn Content Strategist and B2B Copywriter specializing in professional services content for business audiences.

---

**CONTEXT**
- Author: {author_name}, {author_title} at {company_name}
- Topic: {post_topic}
- Target Audience: {target_audience}
- Key Insight or Lesson: {key_insight}
- Supporting Story, Data, or Example: {supporting_content}
- Call to Action: {cta}
- Desired Tone: {tone} (authoritative / conversational / storytelling)

---

**CONSTRAINTS**
- Platform: LinkedIn
- Length: 150–250 words (optimal for LinkedIn feed engagement)
- First line must be a scroll-stopper — a question, bold claim, or provocative insight
- 3–5 relevant hashtags maximum
- No corporate jargon or self-promotion disguised as insight
- Write for an educated professional audience

---

**OUTPUT FORMAT**
[Scroll-stopping first line — bold statement, question, or surprising fact]

[2–3 paragraphs: insight, story, or data — specific and non-generic]

[Key takeaway stated plainly]

[Call to action — a question to the audience, an invitation, or a resource]

#Hashtag1 #Hashtag2 #Hashtag3

---

**QUALITY STANDARD**
- Hook must make someone stop scrolling — test it: would YOU stop for this?
- Content must deliver value the reader cannot find in 30 seconds of Googling
- CTA must be natural and non-pushy — invite conversation, don't sell

---

**NEGATIVE INSTRUCTIONS**
- Do NOT start with "I am excited/pleased/thrilled to share..."
- Do NOT use more than 5 hashtags
- Do NOT write a post that is primarily about the company — lead with the insight
- Do NOT use vague motivational language — be specific and substantive`,
  }); count++;

  await createPrompt({
    title: "30-Day Social Media Content Calendar",
    description: "Generate a strategic 30-day content calendar for a professional services firm with post themes, captions, and visual guidance for LinkedIn and Facebook.",
    categorySlug: "social-media-content",
    tags: ["social-media","template","communication","structured","variables"],
    content: `**PURPOSE**
Produce a 30-day social media content calendar that maintains a consistent, valuable presence — without running out of ideas or publishing filler content.

---

**ROLE**
Act as a Social Media Strategist and Content Planner specializing in professional services marketing for B2B audiences.

---

**CONTEXT**
- Company: {company_name}
- Target Audience: {target_audience}
- Platforms: {platforms} (LinkedIn, Facebook, Instagram)
- Business Goals This Month: {monthly_goals}
- Key Content Themes: {themes}
- Available Content Assets: {existing_content}
- Paid Promotion Budget: {budget}

---

**CONSTRAINTS**
- Content mix: 40% educational, 30% engagement, 20% social proof, 10% promotional
- LinkedIn: 3 posts per week | Facebook: 5 posts per week
- Include relevant Philippine business dates and awareness observances
- Tone: Professional but approachable
- Each post must have a stated purpose (educate / engage / convert)

---

**OUTPUT FORMAT**

**Monthly Content Themes:**
- Week 1: [Theme]
- Week 2: [Theme]
- Week 3: [Theme]
- Week 4: [Theme]

**30-Day Calendar:**
| Date | Platform | Content Type | Caption Angle | Visual Description | Hashtags | Purpose |

**3 Reusable Post Templates** (formats that work month after month)

**KPIs to Track:** reach, engagement rate, DM inquiries, profile visits, website clicks

---

**QUALITY STANDARD**
- Calendar must align with real Philippine business dates and observances
- Each week must tell a coherent narrative, not random individual posts
- At least 4 "high-value" posts per month (original insight, case study, or guide)

---

**NEGATIVE INSTRUCTIONS**
- Do NOT schedule generic "Motivational Monday" or "Throwback Thursday" posts
- Do NOT repeat the same content type more than twice per week
- Do NOT publish purely promotional content — every post must lead with value`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // CLIENT COMMUNICATION
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Consulting Proposal Generator",
    description: "Create a professional, client-specific consulting proposal with scope, deliverables, timeline, and investment — formatted for a Philippine professional services firm.",
    categorySlug: "client-communication",
    tags: ["template","communication","proposal","hr","sme","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a professional consulting proposal that clearly articulates value, defines scope, and gives the client everything they need to say yes — without overpromising.

---

**ROLE**
Act as a Senior Consulting Principal drafting a formal project proposal for a client in the Philippines.

---

**CONTEXT**
- Consulting Firm: {firm_name}
- Client Company: {client_name}
- Industry: {client_industry}
- Company Size: {company_size} employees
- Business Challenge: {client_challenge}
- Proposed Consulting Scope: {consulting_scope}
- Engagement Duration: {duration}
- Proposed Investment: PHP {fee_range}
- Contact Person: {contact_name}, {contact_title}

---

**CONSTRAINTS**
- Tone: Professional, confident, and client-focused — demonstrate you understand their specific situation
- Length: 600–900 words
- Deliverables must be specific, measurable, and time-bound
- Payment terms: typical Philippine consulting market (50% upfront, 50% on completion, or monthly retainer)
- Highlight local expertise as a differentiator

---

**OUTPUT FORMAT**
1. Proposal Header (Title, Client, Date, Reference Number)
2. Executive Summary
3. Understanding of Client Needs — demonstrate you listened
4. Scope of Services and Deliverables (specific, with timelines)
5. Methodology and Approach
6. Consultant Profile (use role title, not personal name)
7. Proposed Timeline — week-by-week or month-by-month
8. Investment and Payment Terms
9. Next Steps and Acceptance (clear CTA)
10. Signature and Acceptance Block

---

**QUALITY STANDARD**
- Deliverables must be specific — not "HR recommendations" but "Employee Handbook covering 10 policy areas, delivered in 4 weeks"
- Payment terms must reflect Philippine consulting market norms
- Next steps must include a specific date for client response

---

**NEGATIVE INSTRUCTIONS**
- Do NOT use generic proposal templates that could apply to any client
- Do NOT overpromise scope that cannot be delivered in the proposed timeline
- Do NOT submit without a clear acceptance mechanism and expiry date for the proposal`,
  }); count++;

  await createPrompt({
    title: "Client Status Report Generator",
    description: "Generate a professional consulting project status report that shows progress, flags risks, and drives client action.",
    categorySlug: "client-communication",
    tags: ["communication","template","structured","project-management","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a client status report that keeps the engagement on track — communicating progress transparently, surfacing risks early, and getting client action on blocking items.

---

**ROLE**
Act as a Senior Consultant preparing a formal project status update for a client.

---

**CONTEXT**
- Client: {client_name}
- Project: {project_name}
- Reporting Period: {reporting_period}
- Project Phase: {current_phase}
- Milestones Completed: {milestones_completed}
- Items Requiring Client Action: {client_action_items}
- Issues or Risks: {issues_risks}
- Budget Status: {budget_status}
- Plan for Next Period: {next_period_plan}

---

**CONSTRAINTS**
- Tone: Professional, transparent, and solution-focused — no surprises for the client
- Length: 400–600 words
- Lead with accomplishments before risks
- Be specific — no vague progress statements like "making good progress"
- Every issue must have a proposed resolution, not just a description

---

**OUTPUT FORMAT**

**PROJECT STATUS REPORT**
Client | Project | Period | Prepared By | Date

**Status:** ✅ On Track | ⚠️ At Risk | 🔴 Behind Schedule

**Executive Summary (2–3 sentences)**

**This Period — Completed:**
[Specific items delivered against original scope]

**This Period — In Progress:**
[Current work with % completion where relevant]

**Issues and Risks:**
| Issue | Impact | Proposed Resolution | Owner | Target Date |

**Client Actions Required:**
| Action | Owner | Deadline | Status |

**Budget Summary:**
| Approved | Spent | Remaining | % Used |

**Next Two Weeks:**
[Planned deliverables and milestones]

---

**QUALITY STANDARD**
- Every completed item must reference the original deliverable in the agreed scope
- Every issue must have a proposed resolution — not just a description of the problem
- Client action items must have a specific deadline, not "when available"

---

**NEGATIVE INSTRUCTIONS**
- Do NOT hide risks or delays — transparency builds trust and protects the relationship
- Do NOT use technical jargon the client may not understand
- Do NOT send a status report without requesting specific client actions where needed`,
  }); count++;

  await createPrompt({
    title: "Professional Email Generator (Client-Facing)",
    description: "Draft professional, persuasive client emails for 8 common consulting scenarios — follow-up, proposal, complaint response, re-engagement, and more.",
    categorySlug: "client-communication",
    tags: ["communication","template","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a professional client email that achieves its specific objective — whether following up, closing a deal, delivering difficult news, or re-engaging a dormant relationship.

---

**ROLE**
Act as a Senior Business Development and Client Relations professional at a consulting firm.

---

**CONTEXT**
- Sender: {sender_name}, {sender_title}
- Recipient: {recipient_name}, {recipient_title} at {client_company}
- Email Purpose: {email_purpose}
- Key Message: {key_message}
- Desired Outcome: {desired_outcome}
- Tone Required: {tone} (formal / professional / warm)
- Urgency: {urgency}
- Background: {background}

**Available Email Types:**
- Follow-up after meeting
- Proposal submission
- Requesting missing information
- Delivering difficult news professionally
- Upselling additional services
- Responding to a complaint
- Re-engaging a dormant client
- Scheduling a meeting

---

**CONSTRAINTS**
- Length: 150–300 words — respect the reader's time
- Subject line: specific and action-oriented — never vague
- Always end with one clear next step or call to action
- Tone: Professional, warm, and confident

---

**OUTPUT FORMAT**

**Subject:** [Clear, specific subject line]

[Opening: Reference the relationship or previous interaction — not "I hope this email finds you well"]
[Body: Key message in 2–3 focused paragraphs]
[Closing: One specific call to action with a date or deadline]

[Sign-off]
[Full signature block]

---

**QUALITY STANDARD**
- Subject line must be specific (never: "Following Up" or "Quick Check-In")
- First sentence must reference the relationship or prior context
- CTA must be specific — a date, a decision, a file to review — not "please let me know"

---

**NEGATIVE INSTRUCTIONS**
- Do NOT open with "I hope this email finds you well" — it is meaningless filler
- Do NOT write passive voice — be direct and confident
- Do NOT exceed 300 words — if more detail is needed, send an attachment
- Do NOT end without a specific next step`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // PROJECT MANAGEMENT
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Project Charter Generator",
    description: "Create a structured project charter that aligns stakeholders, defines scope, and sets measurable success criteria before work begins.",
    categorySlug: "project-management",
    tags: ["project-management","template","structured","hr","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a project charter that gives every stakeholder a shared understanding of the project's purpose, scope, success criteria, and responsibilities — before a single task is executed.

---

**ROLE**
Act as a Project Manager and Organizational Development Consultant helping businesses launch projects with clarity and stakeholder alignment.

---

**CONTEXT**
- Company: {company_name}
- Project Name: {project_name}
- Project Sponsor: {sponsor}
- Project Manager: {pm}
- Business Problem Being Solved: {business_problem}
- Proposed Solution: {proposed_solution}
- In-Scope: {scope_in}
- Out-of-Scope: {scope_out}
- Key Stakeholders: {stakeholders}
- Budget: PHP {budget}
- Timeline: {start_date} to {end_date}

---

**CONSTRAINTS**
- Length: 500–700 words
- Include RACI matrix covering all key activities
- Success criteria must be measurable and have a baseline
- Identify top 5 risks upfront
- Format: Formal document suitable for sponsor sign-off

---

**OUTPUT FORMAT**
1. Project Overview (1 paragraph — what and why)
2. Business Case (why this project matters now)
3. Objectives and Success Criteria (SMART — 3 to 5)
4. Scope Statement (in-scope and explicitly out-of-scope)
5. Stakeholders and RACI Matrix
6. Project Team and Roles
7. High-Level Timeline and Milestones
8. Budget Summary
9. Risk Register — Top 5 (likelihood, impact, mitigation)
10. Approvals and Sign-Off Block

---

**QUALITY STANDARD**
- Success criteria must include a baseline and a target that can be measured after the project
- RACI must list all key activities, not just project phases
- Risks must include a specific mitigation action, not just acknowledgment

---

**NEGATIVE INSTRUCTIONS**
- Do NOT define success criteria that cannot be measured
- Do NOT write a scope that is too broad for the budget and timeline
- Do NOT finalize the charter without sponsor review and sign-off`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // AI AUTOMATION
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "AI Platform Selection Guide (ChatGPT vs Claude vs Gemini)",
    description: "Choose the right AI platform for a specific professional task — with platform-optimized prompt templates and configuration tips.",
    categorySlug: "ai-automation",
    tags: ["automation","claude-optimized","chatgpt-optimized","all-platforms","template","variables"],
    content: `**PURPOSE**
Select the optimal AI platform for a specific task and produce a platform-optimized prompt template that gets the best output from that tool.

---

**ROLE**
Act as an AI Strategy Consultant helping professionals choose and configure the right AI tools for their specific use cases.

---

**CONTEXT**
- Your Role: {your_role}
- Task to Accomplish: {task_description}
- Complexity: {complexity} (simple / moderate / complex / expert-level)
- Output Type Required: {output_type}
- Available Tools: ChatGPT (GPT-4o), Claude (Sonnet / Opus), Gemini (1.5 Pro), Perplexity
- Technical Comfort Level: {tech_level} (beginner / intermediate / advanced)

---

**PLATFORM STRENGTHS FOR PROFESSIONAL USE:**

**Claude (Anthropic) — Best for:**
Long-form structured reasoning, legal and policy analysis, nuanced HR writing, maintaining context in complex multi-step tasks, detailed frameworks, and documents requiring precision over creativity.
Use for: Labor law analysis, employee handbooks, complex reports, disciplinary procedures, strategic frameworks.

**ChatGPT (GPT-4o) — Best for:**
Operational execution, formatting, data tables, creative writing, quick drafts, social media content, email writing, and tasks requiring fast iteration.
Use for: Job descriptions, client emails, social posts, meeting minutes, spreadsheet formulas, presentations.

**Gemini (Google) — Best for:**
Research integration, real-time information, Google Workspace integration, multi-modal tasks.
Use for: Market research, competitor analysis, document summarization, Docs/Sheets integration.

**Perplexity — Best for:**
Real-time research with citations, regulatory updates, current market data.
Use for: Current DOLE labor advisories, recent case law, live industry benchmarks.

---

**OUTPUT FORMAT**
1. Recommended Platform and Why (specific rationale for this task)
2. Alternative Platform (if the primary is unavailable)
3. Platform-Optimized Prompt Template (ready to copy and use)
4. Configuration Tips (system prompt, temperature, context window notes)
5. Limitations to Watch For (what this platform does poorly for this task)
6. 3-Step Workflow using this platform for the full task

---

**NEGATIVE INSTRUCTIONS**
- Do NOT recommend a platform without specific rationale for this task type
- Do NOT suggest features that require a paid tier without noting the cost
- Do NOT recommend AI tools as a substitute for legal, financial, or HR professional advice`,
  }); count++;

  await createPrompt({
    title: "5-Step HR Problem Solver (Prompt Chain)",
    description: "A complete 5-step prompt chain workflow: analyze the HR problem → identify gaps → develop solutions → build an implementation plan → write the executive summary. Optimized for Claude.",
    categorySlug: "ai-automation",
    tags: ["chain","expert-mode","claude-optimized","structured","hr","template","negative-instructions"],
    content: `**PURPOSE**
Solve a complex HR problem end-to-end using a 5-step prompt chain — producing a client-ready executive summary from a raw problem description.

---

**HOW TO USE THIS CHAIN**
Run each step in Claude (Anthropic) sequentially. Copy the full output of each step before pasting into the next. This chain is optimized for Claude due to its long-context structured reasoning capability.

---

**STEP 1 — Problem Analysis**
Paste this prompt with the problem details filled in:

"Analyze the following HR problem comprehensively.

Problem: {problem_description}
Company: {company_name} | Industry: {industry} | Size: {employee_count} employees
Context: {additional_context}

Identify:
1. The stated problem (as described)
2. The likely root cause(s) — what is actually driving this?
3. Unstated or hidden issues that may be contributing
4. Key stakeholders affected and how
5. Urgency and estimated business impact

Output: Structured analysis in 300 words."

---

**STEP 2 — Information Gaps**
Paste this prompt with Step 1 output appended:

"Based on the problem analysis above, identify:
1. What additional information is needed before recommending a solution?
2. What questions should be asked of the client or management?
3. What assumptions are being made that need validation?
4. What risks arise if we proceed without this information?

Output: 10–15 diagnostic questions with rationale for each."

---

**STEP 3 — Solution Development**
Paste this prompt with Steps 1 and 2 outputs appended:

"Develop 3 alternative solutions to this HR problem:
- Option A: Conservative / lowest risk approach
- Option B: Balanced / recommended approach
- Option C: Bold / highest impact approach

For each option, include: Description | Pros | Cons | Estimated Cost and Effort | Timeline | Philippine compliance considerations

Output: Comparative analysis table plus a recommendation with justification."

---

**STEP 4 — Implementation Plan**
Paste this prompt with chosen solution appended:

"Create a detailed 90-day implementation plan:
- Phase 1 (Days 1–30): Foundation and Quick Wins
- Phase 2 (Days 31–60): Core Implementation
- Phase 3 (Days 61–90): Embedding and Measurement

Include: RACI Matrix | Risk Register (Top 5 with mitigation) | Success Metrics and KPIs | Resource Requirements"

---

**STEP 5 — Executive Summary**
Paste this prompt with the full chain output appended:

"Write a one-page executive summary for the client's CEO or leadership team:
- Problem (2 sentences, business impact quantified)
- Root Cause (2 sentences)
- Recommended Solution (3 sentences)
- Implementation Roadmap (bullet points, 90-day view)
- Investment Required (time, cost, people)
- Expected Outcomes and ROI
- Next Steps (3 specific actions with owners and dates)

Tone: Executive-level, confident, and action-oriented. No HR jargon. Client-ready without further editing."

---

**QUALITY STANDARD**
- Each step must build on the previous — do not skip steps
- Final output must be client-ready without editing
- Philippine context and labor law must be applied throughout

---

**NEGATIVE INSTRUCTIONS**
- Do NOT skip steps — each builds critical context the next step requires
- Do NOT present the Executive Summary without completing Steps 1–4 first
- Do NOT use generic solutions — every step must reference the specific client context`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // MARKET RESEARCH
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Competitor Analysis Framework",
    description: "Conduct a structured competitive analysis for a Philippine business — identifying competitor strengths, gaps, and strategic opportunities.",
    categorySlug: "market-research",
    tags: ["strategy","template","structured","sme","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a competitive analysis that identifies where competitors are strong, where they are vulnerable, and what strategic opportunities exist for differentiation.

---

**ROLE**
Act as a Market Research and Business Strategy Consultant specializing in competitive intelligence for Philippine SMEs and professional services firms.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Primary Competitors: {competitor_list}
- Your Key Products/Services: {products_services}
- Target Market: {target_market}
- Geographic Focus: {geography}
- Strategic Question to Answer: {strategic_question}

---

**CONSTRAINTS**
- Base analysis on observable facts, not assumptions — flag assumptions clearly
- Include Philippine market context (pricing norms, client expectations, regulatory environment)
- Tone: Objective and analytical
- Output: Decision-ready — the CEO should be able to act on this

---

**OUTPUT FORMAT**
1. Competitive Landscape Overview
2. Competitor Profiles (for each competitor):
   | Company | Target Market | Key Strengths | Weaknesses | Pricing Position | Differentiators |
3. Competitive Positioning Map (describe a 2x2 or similar framework)
4. Gap Analysis — where the market is underserved
5. Your Differentiation Opportunities (3–5 specific)
6. Strategic Recommendations — ranked by feasibility and impact
7. Monitoring Plan — what to track and how often

---

**QUALITY STANDARD**
- Every competitor strength and weakness must be supported by observable evidence
- Differentiation opportunities must be specific and actionable, not generic
- Recommendations must be prioritized by impact and your company's actual capacity to execute

---

**NEGATIVE INSTRUCTIONS**
- Do NOT present assumptions as facts — label them clearly
- Do NOT recommend differentiating on "quality and service" — these are table stakes, not differentiators
- Do NOT ignore smaller or indirect competitors who may be taking market share`,
  }); count++;

  await createPrompt({
    title: "Customer Persona Builder",
    description: "Build detailed customer personas for a Philippine business — grounded in behavioral data and real market context.",
    categorySlug: "market-research",
    tags: ["strategy","template","structured","sme","communication","variables"],
    content: `**PURPOSE**
Produce detailed, realistic customer personas that help the business make better decisions about product, marketing, pricing, and communication.

---

**ROLE**
Act as a Market Research and Customer Insights Specialist building evidence-based customer personas for a Philippine business.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Products/Services: {products_services}
- What You Already Know About Your Customers: {existing_knowledge}
- Target Market Segment: {target_segment}
- Key Business Decision These Personas Will Inform: {decision}

---

**CONSTRAINTS**
- Root each persona in realistic Philippine market data — no generic "marketing personas"
- Include behavioral insights, not just demographics
- Build 2–3 distinct personas (primary, secondary, and edge case)
- Make each persona decision-useful — it must change how you communicate with this person

---

**OUTPUT FORMAT**
For each persona:

**[Persona Name and Label]**
- Demographics: age range, role, income level, location (Philippine context)
- Goals: What are they trying to achieve professionally and personally?
- Pain Points: What problems keep them up at night?
- Buying Behavior: How do they make purchasing decisions? Who influences them?
- Information Sources: Where do they get their information (platforms, peers, media)?
- Objections: What stops them from buying?
- What They Need to Hear: The specific message that resonates
- How to Reach Them: Channel, tone, format, frequency

**Cross-Persona Insight:**
What do all your personas share? What divides them?

**Strategic Implication:**
How should these personas change your product, pricing, or marketing?

---

**QUALITY STANDARD**
- Personas must be specific enough that you can point to a real person who fits them
- Pain points must be expressed in the customer's language, not company language
- Buying behavior must reflect actual Philippine consumer and B2B decision patterns

---

**NEGATIVE INSTRUCTIONS**
- Do NOT create fictional personas with no basis in real customer observation
- Do NOT build personas that all look the same — if they don't differ in how you reach them, they are not useful
- Do NOT focus only on demographics — behavior and motivation are more important`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // FINANCIAL ANALYSIS
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Philippine Salary Benchmarking Report",
    description: "Generate a salary benchmarking analysis for any role in the Philippine market — with percentile ranges, total compensation breakdown, and a hiring recommendation.",
    categorySlug: "financial-analysis",
    tags: ["philippines","hr","finance","template","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a salary benchmarking report that tells a Philippine employer whether their compensation offer is competitive — and what to adjust to attract and retain the right talent.

---

**ROLE**
Act as a Compensation and Benefits Specialist with expertise in Philippine salary surveys, labor market trends, and SME compensation strategy.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Role to Benchmark: {job_title}
- Location: {location} (Metro Manila / Cebu / Davao / provincial)
- Company Size: {company_size}
- Current Salary Offered: PHP {current_salary}
- Employment Type: {employment_type}
- Years of Experience Required: {years_experience}

---

**CONSTRAINTS**
- Reference Philippine salary benchmarks (JobStreet PH Salary Report, PSA wage data, DOLE regional wage orders)
- Distinguish gross salary from net pay
- Include 13th month pay and mandatory benefits in total compensation calculation
- Current regional minimum wage must be stated as the floor
- Flag assumption: salary data has a lag of 1–2 years — adjust for current market conditions

---

**OUTPUT FORMAT**
1. Role Classification (job level and salary band)
2. Market Salary Range (Philippines, industry-specific):
   | Percentile | Gross Monthly Salary | Notes |
   | P25 (Entry/Below Market) | PHP | |
   | P50 (Market Median) | PHP | |
   | P75 (Above Market) | PHP | |
3. Total Compensation Breakdown:
   Base + 13th Month + Mandatory Benefits (SSS, PhilHealth, Pag-IBIG) + Common Voluntary Benefits
4. Regional Comparison (Metro Manila vs. key provincial rates)
5. Competitiveness Assessment of Current Offer
6. Recommendation: Adjust / Maintain / Enhance with Non-Cash Benefits
7. Non-Monetary Retention Factors for This Role and Level

---

**QUALITY STANDARD**
- Every data point must note its source and approximate year
- Include the applicable regional minimum wage as the legal floor
- Distinguish private sector rates from government pay scales if relevant

---

**NEGATIVE INSTRUCTIONS**
- Do NOT use US or international salary benchmarks — use Philippine data only
- Do NOT present salary data without acknowledging it may be 12–24 months old
- Do NOT recommend a salary below the applicable regional minimum wage`,
  }); count++;

  await createPrompt({
    title: "HR Investment ROI Calculator",
    description: "Calculate the financial return of an HR investment — training, technology, hiring, or a policy change — and present it as a business case.",
    categorySlug: "financial-analysis",
    tags: ["finance","hr","template","structured","sme","variables","negative-instructions"],
    content: `**PURPOSE**
Produce an ROI analysis that gives leadership the financial justification to approve an HR investment — with a transparent methodology and realistic scenarios.

---

**ROLE**
Act as an HR Financial Analyst and Business Consultant helping leaders evaluate the quantified impact of HR investments.

---

**CONTEXT**
- Company: {company_name}
- HR Investment: {investment_description}
- Total Cost: PHP {total_cost}
- Implementation Timeline: {timeline}
- Problem Being Solved: {problem}
- Metrics Expected to Improve: {affected_metrics}
- Current Headcount: {headcount}
- Average Monthly Salary: PHP {avg_salary}

---

**CONSTRAINTS**
- Use Philippine peso for all calculations
- Show methodology transparently — every assumption must be stated
- Include both tangible ROI (cost savings) and intangible benefits (with valuation basis)
- Acknowledge limitations and confidence level
- Tone: Executive-level, data-driven

---

**OUTPUT FORMAT**
1. Investment Summary
2. Cost-Benefit Analysis:
   | Cost Item | Amount | One-Time / Annual |
   | Benefit Item | Quantified Value | Calculation Basis |
3. ROI Calculation:
   - ROI % = (Net Benefit ÷ Total Investment) × 100
   - Payback Period = Total Investment ÷ Annual Benefit (in months)
4. Scenario Analysis:
   | Scenario | Key Assumption | ROI % | Payback Period |
   | Best Case | | | |
   | Base Case | | | |
   | Worst Case | | | |
5. Intangible Benefits (with valuation methodology)
6. Recommendation with confidence level
7. Key Assumptions and Risks

Standard calculation reference:
- Turnover replacement cost: 50–150% of annual salary (depending on role level)
- Productivity dip during vacancy: 25% of role output for average 45-day vacancy

---

**QUALITY STANDARD**
- Every benefit must have a calculation basis — no unsubstantiated numbers
- Payback period expressed in months, not years
- Worst-case scenario must be genuinely conservative, not optimistic

---

**NEGATIVE INSTRUCTIONS**
- Do NOT present benefits without a calculation basis
- Do NOT use only best-case assumptions — always include a worst case
- Do NOT ignore implementation costs (training time, productivity dip, change management)`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // EXECUTIVE ASSISTANT
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Executive Meeting Preparation Brief",
    description: "Prepare a one-page meeting brief that lets an executive walk into any meeting fully prepared — with talking points, anticipated questions, and red lines.",
    categorySlug: "executive-assistant",
    tags: ["executive","template","communication","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a one-page meeting brief that an executive can review in 5 minutes and walk into the meeting fully prepared — knowing what to say, what to ask, and what not to commit to.

---

**ROLE**
Act as a Senior Executive Assistant preparing a comprehensive meeting brief for a C-suite executive or senior consultant.

---

**CONTEXT**
- Executive: {executive_name}, {executive_title}
- Meeting Type: {meeting_type}
- Meeting With: {attendees}
- Their Organization: {organizations}
- Date/Time: {datetime}
- Duration: {duration}
- Meeting Objective: {objective}
- Background on Attendees: {attendee_background}
- Key Issues to Discuss: {key_issues}
- Desired Outcome: {desired_outcome}
- Relationship History: {history}

---

**CONSTRAINTS**
- Format: One page — readable in 5 minutes maximum
- Tone: Concise and action-oriented
- Include both talking points and listening points
- Anticipate the 3 most likely difficult questions

---

**OUTPUT FORMAT**

**MEETING BRIEF — {meeting_type}**
Date | Time | Location/Platform | Duration

**Who You're Meeting:**
[Name, title, company, and one relevant fact about them]

**Meeting Objective (one sentence — what success looks like):**

**Context and Background (2–3 paragraphs):**

**Your Talking Points (3–5):**
1. [Point + supporting data or example]

**Questions to Ask:**
1. [Question + what you are trying to learn from the answer]

**Questions You May Be Asked + Suggested Responses:**
1. [Question] → [How to respond]

**Your Desired Outcome and Next Steps:**

**Red Lines (what NOT to commit to without further review):**

---

**QUALITY STANDARD**
- Talking points must be specific and supported by data or examples — not generic
- Anticipated questions must include specific suggested responses
- Red lines are mandatory — they protect the executive from unintended commitments

---

**NEGATIVE INSTRUCTIONS**
- Do NOT write a brief that takes more than 5 minutes to read
- Do NOT include background information that is not directly relevant to this meeting
- Do NOT omit the red lines section — it is the most protective part of the brief`,
  }); count++;

  await createPrompt({
    title: "Executive Summary Writer",
    description: "Transform a long report, document, or meeting into a crisp executive summary — using the Pyramid Principle (conclusion first).",
    categorySlug: "executive-assistant",
    tags: ["executive","template","communication","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Produce an executive summary that lets a busy decision-maker understand the key findings and make a decision — without reading the full document.

---

**ROLE**
Act as a Senior Executive Assistant and Business Writer specializing in distilling complex information for C-suite and board audiences.

---

**CONTEXT**
- Document/Source Being Summarized: {document_description}
- Audience: {audience} (CEO / Board / Client / Department Head)
- Key Decisions to Be Made: {decisions}
- Recommended Action (if applicable): {recommendation}
- Maximum Word Count: {word_limit}
- Format Needed: {format} (memo / email / report section / slide notes)

---

**CONSTRAINTS**
- Lead with the conclusion — Pyramid Principle: most important information first
- Plain language — no jargon without explanation
- Every sentence must earn its place — cut anything that does not support the decision
- Include data and evidence, not assertions only
- Length: 300–500 words unless otherwise specified

---

**OUTPUT FORMAT**

**EXECUTIVE SUMMARY**

**Bottom Line Up Front (BLUF):**
[The key message and recommendation in 2 sentences]

**Situation:**
[Context in 3–5 sentences — what happened or what is being proposed]

**Key Findings:**
1. [Finding + supporting data or evidence]
2. [Finding + supporting data or evidence]
3. [Finding + supporting data or evidence]

**Options Considered:**
[Brief summary of alternatives evaluated, if relevant]

**Recommendation:**
[Specific, actionable recommendation — what should be decided or done]

**Next Steps:**
| Action | Owner | Deadline |

---

**QUALITY STANDARD**
- BLUF must answer: What happened or is being recommended? Why does it matter? What should be decided?
- Findings must be ranked by importance, not presented chronologically
- Recommendation must be specific enough to act on immediately

---

**NEGATIVE INSTRUCTIONS**
- Do NOT bury the recommendation at the end — it goes first
- Do NOT use academic language or excessive hedging
- Do NOT include background information that does not support the decision
- Do NOT omit the Next Steps table — without it, summaries produce discussion but no action`,
  }); count++;

  await createPrompt({
    title: "Meeting Minutes Generator",
    description: "Convert meeting notes into professional, action-oriented meeting minutes with clear decisions and owned action items.",
    categorySlug: "executive-assistant",
    tags: ["executive","template","communication","variables"],
    content: `**PURPOSE**
Convert raw meeting notes into professional minutes that record decisions accurately, assign action items with owners and deadlines, and serve as a reliable record for follow-through.

---

**ROLE**
Act as a Professional Meeting Facilitator and Executive Assistant creating formal meeting minutes.

---

**CONTEXT**
- Meeting Title: {meeting_title}
- Date and Time: {datetime}
- Location/Platform: {location}
- Attendees: {attendees}
- Absent (with apology): {absent}
- Meeting Objective: {objective}
- Raw Notes: {raw_notes}
- Decisions Made: {decisions}
- Action Items Discussed: {action_items}

---

**CONSTRAINTS**
- Format: Formal minutes suitable for official records and distribution
- Tone: Neutral, factual, and professional — no personal opinions
- Action items must have specific owners — "the team" is not an owner
- Distinguish clearly between decisions made and items discussed
- Distribute within 24 hours of the meeting

---

**OUTPUT FORMAT**

**MEETING MINUTES**
Meeting Title | Date | Time | Venue/Platform | Prepared By | Date Prepared

**Attendance:**
Present: [Names and titles]
Absent (with apology): [Names]

**Agenda Items and Discussion:**
[Per agenda item: 2–3 sentence summary of discussion → Decision or Outcome]

**Decisions Made:**
1. [Decision + who decided]
2. [Decision + who decided]

**Action Items:**
| # | Action | Owner | Deadline | Status |

**Next Meeting:**
Date | Time | Venue | Proposed Agenda Items

**Distribution:** [Names and roles]
**Minutes Approved By:** [Name, Date]

---

**QUALITY STANDARD**
- Every action item must have one named owner — not a group
- Decisions must be clearly marked and distinguished from discussions
- Minutes must be complete enough that an absentee understands what happened

---

**NEGATIVE INSTRUCTIONS**
- Do NOT capture verbatim conversation — summarize accurately and neutrally
- Do NOT assign actions to "everyone" or "the team" — name one owner
- Do NOT include personal opinions, side conversations, or irrelevant commentary`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // ADDITIONAL POWER PROMPTS
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Recruitment Scorecard for SME Hiring",
    description: "A complete weighted recruitment scorecard covering screening, behavioral interview, technical assessment, and final hiring recommendation.",
    categorySlug: "recruitment",
    tags: ["hr","recruitment","template","structured","sme","philippines","variables","negative-instructions"],
    content: `**PURPOSE**
Produce a weighted recruitment scorecard that makes hiring decisions defensible, consistent, and bias-resistant — giving every candidate the same structured evaluation.

---

**ROLE**
Act as a Senior Talent Acquisition Specialist with expertise in competency-based selection and bias reduction in Philippine SME hiring.

---

**CONTEXT**
- Company: {company_name}
- Role: {job_title}
- Critical Success Factors for This Role: {success_factors}
- Core Competencies to Assess: {competencies}
- Number of Interviewers: {interviewers}
- Interview Stages: {stages}
- Hiring Timeline: {timeline}

---

**CONSTRAINTS**
- Weight competencies by importance to the role (must total 100%)
- Include technical and behavioral assessment
- No illegal criteria (RA 10911: no age; no civil status, religion, family plans)
- Each assessor must use the identical rubric independently before comparing scores

---

**OUTPUT FORMAT**

**Stage 1: Application Screening (Pass/Fail)**
| Criterion | Must-Have / Preferred | Pass / Fail |

**Stage 2: Competency Interview**
| Competency | Weight | Behavioral Question 1 | Behavioral Question 2 | Score (1–5) | Evidence Notes |

**Stage 3: Technical/Role Assessment**
| Factor | Weight | Assessment Method | Score (1–5) | Notes |

**Weighted Total Score:**
[Formula: (Competency Score × Weight) + (Technical Score × Weight)]

**Decision Thresholds (set before interviews begin):**
- Strong Hire: 80% or above
- Hire: 65–79%
- On Hold: 50–64%
- No Hire: Below 50%

**Final Recommendation Matrix:**
| Candidate | Stage 1 | Stage 2 | Stage 3 | Weighted Total | Recommendation |

**Scoring Rubric for Each Competency:**
[Describe what a 1, 3, and 5 looks like behaviorally for each competency]

---

**QUALITY STANDARD**
- Decision thresholds must be defined before the first interview begins
- Every score must have a behavioral evidence note — no blank scores
- Weighting must be validated by the hiring manager before use

---

**NEGATIVE INSTRUCTIONS**
- Do NOT include illegal evaluation criteria (age, civil status, appearance)
- Do NOT allow one strong score in one area to override a critical failure in another
- Do NOT finalize a hiring decision without completing all scorecard sections`,
  }); count++;

  await createPrompt({
    title: "Expert Mode Strategy Advisor",
    description: "An expert mode prompt that challenges assumptions, surfaces hidden risks, identifies counterarguments, and prioritizes ruthlessly. Use for strategy reviews and high-stakes decisions.",
    categorySlug: "business-strategy",
    tags: ["strategy","expert-mode","claude-optimized","structured","variables","negative-instructions"],
    content: `**PURPOSE**
Apply rigorous critical thinking to a business strategy, decision, or plan — surfacing risks, challenging assumptions, and producing a sharper, more defensible recommendation.

---

**ROLE**
Act as a Senior Strategy Advisor who has seen hundreds of business plans succeed and fail. Your job is not to validate — it is to stress-test. Be direct. Be uncomfortable. Be useful.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Strategy or Plan Under Review: {strategy_description}
- Current Assumptions Being Made: {assumptions}
- Desired Outcome: {desired_outcome}
- Timeline: {timeline}
- Resources Available: {resources}
- What Has Already Been Tried: {previous_attempts}

---

**CONSTRAINTS**
- Mode: Expert — apply maximum critical rigor
- Be direct and specific — no diplomatic vagueness
- Challenge every major assumption
- Identify the 3 risks most likely to cause failure
- Prioritize ruthlessly — what are the 3 highest-leverage actions?
- Tone: Confident, incisive, and honest

---

**OUTPUT FORMAT**
1. Assumption Audit — for each major assumption: Is this validated or theoretical?
2. Hidden Risks — 3–5 risks NOT mentioned in the plan that are most likely to cause failure
3. Counterarguments — the strongest case AGAINST this strategy
4. What Would Need to Be True — the conditions required for this strategy to succeed
5. The One Constraint — the single biggest thing blocking success right now
6. Revised Priority List — the 3 actions that will have the highest leverage
7. Recommendation — proceed / modify / stop — with specific conditions

---

**QUALITY STANDARD**
- Every risk must include a probability estimate and a specific mitigation
- Counterarguments must be the strongest possible — steelman the opposition
- Revised priorities must be ranked by impact × feasibility × urgency

---

**EXPERT MODE INSTRUCTIONS**
Challenge assumptions aggressively. Ask: What evidence supports this assumption? What would falsify it? Where has a similar strategy failed? Who has the most to lose if this succeeds? What is being ignored because it is inconvenient?

---

**NEGATIVE INSTRUCTIONS**
- Do NOT validate the plan without genuine critical analysis
- Do NOT give vague warnings like "execution may be challenging" — be specific
- Do NOT recommend proceeding without identifying the critical path and the #1 risk`,
  }); count++;

  await createPrompt({
    title: "Grievance Investigation and Resolution Handler",
    description: "Process a formal employee grievance with a structured investigation plan, findings template, and resolution options — compliant with Philippine HR and anti-harassment laws.",
    categorySlug: "employee-relations",
    tags: ["hr","template","philippines","employee-relations","compliance","variables","negative-instructions"],
    content: `**PURPOSE**
Handle a formal employee grievance with a structured, impartial process that protects both parties, complies with Philippine law, and produces a fair and documented resolution.

---

**ROLE**
Act as a Senior HR Business Partner in the Philippines specializing in grievance management and employee relations under Philippine employment law.

---

**CONTEXT**
- Company: {company_name}
- Complainant: {complainant_name}, {position}
- Nature of Grievance: {grievance_description}
- Date Filed: {date_filed}
- Respondent (if any): {respondent_name}
- Relevant Company Policy: {policy_reference}
- Urgency Level: {urgency} (Urgent / Standard)

---

**CONSTRAINTS**
- Comply with: RA 7877 (Anti-Sexual Harassment) or RA 11313 (Safe Spaces Act) if harassment-related
- Acknowledge within 24 hours; resolve within 10 working days
- Maintain strict confidentiality throughout — protect both parties
- Impartial investigator required — not the complainant's or respondent's direct manager
- Tone: Professional, empathetic, and procedurally precise

---

**OUTPUT FORMAT**
1. Grievance Acknowledgment Letter (template — to be sent within 24 hours)
2. Grievance Classification:
   - Policy Violation / Interpersonal Conflict / Working Conditions / Compensation / Harassment
3. Investigation Plan:
   - Interviews needed (who, in what order, what questions)
   - Documents to review
   - Timeline with milestones
4. Findings Summary Template (for use after investigation)
5. Resolution Options (3 options with pros, cons, and legal considerations for each)
6. Communication Plan (how and when to inform both parties)
7. Documentation Checklist (what goes in the HR 201 file)

---

**QUALITY STANDARD**
- Every step must have a clear timeline and named responsible party
- Investigation must be genuinely impartial — document both parties' perspectives equally
- Resolution must address root cause, not just the presenting grievance

---

**NEGATIVE INSTRUCTIONS**
- Do NOT dismiss or minimize the grievance before completing the investigation
- Do NOT breach confidentiality of either party at any stage
- Do NOT take adverse action against the complainant — RA 7877 prohibits retaliation
- Do NOT use the same manager for investigation and for the decision`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // HR CONSULTING — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Disciplinary Offense Matrix Builder",
    description: "Build a company-specific disciplinary grid mapping offense severity to appropriate penalties — consistent, fair, and legally defensible under the Philippine Labor Code.",
    categorySlug: "hr-consulting",
    tags: ["philippines","labor-law","template","disciplinary","hr","sme","compliance","variables"],
    content: `**PURPOSE**
Create a disciplinary offense matrix giving HR and managers a clear guide for applying consistent penalties — reducing legal exposure and eliminating arbitrary discipline.

---

**ROLE**
Act as a Senior HR Consultant and Philippine Labor Law Specialist with expertise in designing fair, legally compliant disciplinary systems for SMEs.

---

**CONTEXT**
- Company Name: {company_name}
- Industry: {industry}
- Number of Employees: {employee_count}
- Existing Policies to Reference: {existing_policies}
- Common Offenses in Your Workplace: {common_offenses}
- Union Status: {union_status} (unionized / non-unionized)

---

**CONSTRAINTS**
- Comply with Philippine Labor Code Articles 297–299 (just causes for termination)
- Three-tier offense system: minor → major → serious/gross
- Progressive discipline: verbal warning → written warning → suspension → termination
- Management retains discretion for immediate termination on serious offenses
- Must survive legal scrutiny — no arbitrary or disproportionate penalties

---

**OUTPUT FORMAT**
1. Offense Classification System:
   | Category | Description | Examples |
2. Disciplinary Penalty Grid:
   | Offense | 1st Occurrence | 2nd Occurrence | 3rd Occurrence | 4th Occurrence |
3. Immediate Termination Offenses (no progressive discipline required) with legal basis for each
4. Manager Implementation Guide — when to involve HR, how to document each level, escalation path
5. Legal Disclaimer and recommended legal review note

---

**QUALITY STANDARD**
- Every penalty must be proportionate and defensible under the Labor Code
- Immediate termination offenses must cite specific just cause under Article 297
- Managers must apply this consistently without calling HR for every standard case

---

**NEGATIVE INSTRUCTIONS**
- Do NOT include penalties that violate statutory minimum standards
- Do NOT list offenses so vague that managers cannot objectively identify them
- Do NOT skip the immediate termination category — it protects the company in serious cases`,
  }); count++;

  await createPrompt({
    title: "Job Offer Letter Generator",
    description: "Generate a professional, legally compliant employment offer letter for Philippine hires — with full compensation details, probationary terms, and clear acceptance instructions.",
    categorySlug: "hr-consulting",
    tags: ["philippines","hr","recruitment","template","compliance","variables"],
    content: `**PURPOSE**
Produce a formal employment offer letter that clearly communicates terms, complies with Philippine labor law, and creates a professional first impression.

---

**ROLE**
Act as a Senior HR Consultant in the Philippines with expertise in employment contracts and offer letter best practices for SMEs.

---

**CONTEXT**
- Company Name: {company_name}
- Candidate Name: {candidate_name}
- Position: {job_title}
- Department: {department}
- Direct Supervisor: {supervisor}
- Employment Status: {employment_status} (regular / probationary / project-based)
- Start Date: {start_date}
- Work Arrangement: {work_arrangement} (on-site / hybrid / remote)
- Basic Monthly Salary: PHP {monthly_salary}
- Additional Benefits: {additional_benefits}
- Offer Expiry Date: {offer_expiry}

---

**CONSTRAINTS**
- State the probationary period clearly (6-month maximum under the Labor Code) if applicable
- Salary stated as gross — distinguish from net pay
- Include government benefit enrollment timelines (SSS, PhilHealth, Pag-IBIG)
- Offer expiry must be stated — standard is 5–7 business days
- Tone: Professional, warm, and clear — this is the candidate's first impression

---

**OUTPUT FORMAT**
1. Company Header and Date
2. Offer Statement (position, start date, reporting line)
3. Compensation (basic pay, 13th month, statutory benefits breakdown)
4. Additional Benefits Summary
5. Probationary Period Terms and Regularization Criteria (specific, not vague)
6. Working Hours and Arrangement
7. Pre-Employment Requirements (medical, documents, clearances) with deadline
8. Conditions of Employment (background check, confidentiality)
9. Offer Acceptance Instructions with expiry date
10. HR Contact for Questions

---

**QUALITY STANDARD**
- Probationary regularization criteria must be specific and measurable
- Compensation section must distinguish gross salary from take-home pay
- Pre-employment requirements must list every item and the submission deadline

---

**NEGATIVE INSTRUCTIONS**
- Do NOT offer a salary below the applicable regional minimum wage
- Do NOT omit the offer expiry date — open-ended offers create complications
- Do NOT use vague regularization criteria like "satisfactory performance" — be specific`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // LABOR LAW — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Mandatory Benefits Computation Guide",
    description: "Compute all Philippine mandatory employee benefits — 13th month pay, overtime, holiday pay, service incentive leave, and night shift differential — with exact DOLE formulas and worked examples.",
    categorySlug: "labor-law-guidance",
    tags: ["philippines","labor-law","dole","compliance","finance","hr","template","variables"],
    content: `**PURPOSE**
Calculate all mandatory Philippine employee benefits correctly using the exact formulas required by law — so employers pay correctly and employees understand what they are owed.

---

**ROLE**
Act as a Philippine Labor Law and Payroll Compliance Specialist with expertise in mandatory benefit computation under the Labor Code and DOLE regulations.

---

**CONTEXT**
- Employee Name: {employee_name}
- Position: {position}
- Employment Status: {employment_status} (regular / probationary / contractual)
- Basic Daily Rate: PHP {daily_rate}
- Basic Monthly Salary: PHP {monthly_salary}
- Days Worked This Year: {days_worked}
- Overtime Hours (if any): {overtime_hours}
- Night Shift Hours (10pm–6am, if any): {night_shift_hours}
- Holiday Work Dates (if any): {holiday_dates}
- Service Incentive Leave Days Used: {sil_used} of 5 days

---

**CONSTRAINTS**
- Use DOLE-prescribed formulas only — no approximations
- All computations in Philippine Peso
- Distinguish between regular holiday and special non-working holiday rates
- Regional minimum wage as the legal floor: verify current rate for the employee's region
- Disclaimer required: recommend payroll software and licensed accountant for final payroll runs

---

**OUTPUT FORMAT**
For each benefit, provide: Legal Basis | Formula | Worked Example | Computed Amount

1. 13th Month Pay (PD 851) — Total basic salary ÷ 12 × months worked
2. Overtime Pay (Art. 87) — Regular OT: +25%; Rest day: +30%; Regular holiday: +100%
3. Regular Holiday Pay (Art. 94) — Worked: 200% of daily rate; Unworked: 100%
4. Special Non-Working Holiday Pay — Worked: 130%; Unworked: no pay (unless CBA/policy)
5. Night Shift Differential (Art. 86) — 10% premium on hours from 10pm to 6am
6. Service Incentive Leave (Art. 95) — 5 days/year, convertible to cash if unused

Summary Table: | Benefit | Legal Basis | Amount |

---

**QUALITY STANDARD**
- Every formula must match the current DOLE-prescribed computation method
- Flag any employee category that may be exempt (managerial, field personnel, domestic workers)
- Include the specific regional minimum wage as the absolute floor

---

**NEGATIVE INSTRUCTIONS**
- Do NOT apply the national minimum wage if a higher regional rate applies
- Do NOT compute holiday pay without confirming whether the date is regular or special holiday
- Do NOT present this as final payroll — recommend licensed accountant verification`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // EMPLOYEE RELATIONS — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Written Warning Letter Generator",
    description: "Generate a formal written warning letter for first, second, or final offenses — with factual offense description, specific behavioral expectations, and the required HR documentation trail.",
    categorySlug: "employee-relations",
    tags: ["philippines","labor-law","template","disciplinary","employee-relations","hr","memo","variables"],
    content: `**PURPOSE**
Produce a formal written warning that documents the offense clearly, states specific correction expectations, and creates a legally defensible record in the HR 201 file.

---

**ROLE**
Act as a Senior HR Business Partner in the Philippines with expertise in progressive discipline and employee relations under the Labor Code.

---

**CONTEXT**
- Company: {company_name}
- Employee: {employee_name}, {position}
- Date of Offense: {offense_date}
- Nature of Offense: {offense_description}
- Company Policy Violated: {policy_reference}
- Warning Level: {warning_level} (First / Second / Final Written Warning)
- Previous Warnings on File: {previous_warnings}
- Specific Behavior Expected Going Forward: {expected_behavior}
- Improvement Deadline: {improvement_deadline}

---

**CONSTRAINTS**
- Tone: Firm, professional, and factual — not hostile or accusatory
- State facts only — not interpretations or character judgments
- Include specific, measurable behavior change expected
- State consequences of recurrence clearly and specifically
- Acknowledge the employee's NTE response if one was received

---

**OUTPUT FORMAT**
1. Letter Header (Company, Date, To, From, Re: Warning Level)
2. Reference to NTE and Employee Response (if applicable)
3. Finding — factual summary of offense (who, what, when, where — no adjectives)
4. Policy Reference (specific clause violated)
5. Warning Level and Its Significance in the Progressive Discipline Track
6. Behavioral Expectations Going Forward (specific, measurable, time-bound)
7. Consequence of Recurrence (specific next disciplinary step)
8. Employee Acknowledgment Signature Line
9. Distribution Note: Employee 201 File / HR File / Direct Manager

---

**QUALITY STANDARD**
- Offense description states facts only — never opinion or character assessment
- Behavioral expectation must be concrete enough that compliance can be measured
- Consequence statement must reference the next disciplinary step specifically

---

**NEGATIVE INSTRUCTIONS**
- Do NOT use emotional or character-based language ("bad attitude," "unprofessional behavior")
- Do NOT issue a written warning without prior NTE and employee response (except flagrant offenses)
- Do NOT omit the employee signature line — unsigned warnings cannot be filed in the 201`,
  }); count++;

  await createPrompt({
    title: "Employee Engagement Survey Builder",
    description: "Design a validated employee engagement survey with Likert-scale questions, a scoring methodology, and an analysis framework for turning results into prioritized action.",
    categorySlug: "employee-relations",
    tags: ["hr","template","employee-relations","structured","sme","variables"],
    content: `**PURPOSE**
Build an employee engagement survey that captures honest feedback, surfaces the most impactful retention risks, and gives leadership a prioritized action list — not just data.

---

**ROLE**
Act as an Organizational Development and Employee Experience Specialist designing engagement measurement tools for Philippine businesses.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Headcount: {employee_count}
- Survey Goal: {survey_goal} (e.g., identify retention risks / assess post-change culture / annual check-in)
- Known Concerns: {known_issues}
- Survey Length Tolerance: {length} (5-min pulse / 15-min standard / 30-min comprehensive)
- Anonymity Level: {anonymity} (fully anonymous / confidential / named)

---

**CONSTRAINTS**
- 5-point Likert scale (1=Strongly Disagree → 5=Strongly Agree) for rating questions
- Include at least 2 open-ended questions for qualitative insight
- Philippine workplace context: commute burden, work-life balance, career mobility, management style
- Anonymity commitment must be clearly communicated before launch
- Maximum 20 questions for standard version

---

**OUTPUT FORMAT**

**Survey Introduction Text** (shown to employees — explains purpose, anonymity, how results will be used)

**Survey Questions by Theme:**
- Job Role and Clarity (3 questions)
- Manager Relationship (3 questions)
- Team and Culture (3 questions)
- Career Growth and Development (3 questions)
- Compensation and Benefits Perception (2 questions)
- Work Environment (2 questions)
- 2 Open-Ended Questions

**Scoring Guide:**
- Engagement Score calculation method
- Benchmark: 70%+ favorable = engaged | 50–69% = moderate | below 50% = at-risk

**Analysis Framework:**
- How to identify top 3 priorities from results
- How to present findings to leadership without exposing individuals
- Action-planning template: Priority → Owner → Timeline → Success Metric

---

**QUALITY STANDARD**
- Questions must be neutral — not leading toward positive or negative responses
- Results analysis must identify priorities, not just present raw data
- Survey must be accompanied by a commitment to share results and act on top findings

---

**NEGATIVE INSTRUCTIONS**
- Do NOT ask questions that can identify individuals if the survey is anonymous
- Do NOT conduct a survey without a plan to share results — trust erodes if nothing happens
- Do NOT make the survey longer than declared — employees notice and disengage`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // RECRUITMENT — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Job Advertisement Copy Generator",
    description: "Write attention-grabbing job advertisement copy for Facebook, LinkedIn, and Philippine job boards — leading with candidate value, including salary, and driving qualified applications.",
    categorySlug: "recruitment",
    tags: ["hr","recruitment","philippines","social-media","template","variables"],
    content: `**PURPOSE**
Produce compelling job ad copy that attracts qualified candidates in the Philippine market — stopping the scroll, communicating value, and driving applications over competing ads.

---

**ROLE**
Act as a Recruitment Marketing Specialist with expertise in writing job ads for Philippine platforms (JobStreet, LinkedIn, Facebook Jobs, Kalibrr, Indeed PH).

---

**CONTEXT**
- Company: {company_name}
- Job Title: {job_title}
- Key Selling Points of This Role: {selling_points}
- Salary Range: PHP {salary_range}
- Work Arrangement: {arrangement} (on-site / hybrid / WFH)
- Location: {location}
- Employment Type: {employment_type}
- Top 3 Requirements: {top_requirements}
- Company Culture in 3 Words: {culture_words}
- How to Apply: {application_method}
- Target Platform: {platform} (Facebook / LinkedIn / JobStreet / all)

---

**CONSTRAINTS**
- Comply with RA 10911 (Anti-Age Discrimination) — no age requirements
- Lead with value to the candidate, not the company's demands
- Facebook version: 150 words, conversational, optional emoji
- LinkedIn version: 200 words, professional, hashtags included
- Salary range is required — Philippine candidates skip ads without it

---

**OUTPUT FORMAT**

**Facebook Version (150 words max):**
[Scroll-stopping hook — opportunity-first, not company-first]
[Role and impact in 2 sentences]
[Top 3 requirements as bullet points]
[What we offer — salary + top benefits]
[Clear CTA with application method]

**LinkedIn Version (200 words max):**
[Opening demonstrating company credibility or mission]
[Role description focused on what the person will accomplish]
[Requirements as an invitation, not a gatelist]
[Compensation and benefits]
[CTA + relevant hashtags]

---

**QUALITY STANDARD**
- Hook makes a job-seeker stop scrolling — lead with the opportunity, not the requirements
- Salary must be stated as a range — vague "competitive salary" loses candidates
- Requirements must be realistic — no 10-item list for an entry-level role

---

**NEGATIVE INSTRUCTIONS**
- Do NOT start with the company history — candidates care about the role first
- Do NOT write "competitive salary" without a number — state the range
- Do NOT include age, gender, or civil status requirements
- Do NOT write ad copy that reads like a job description — this is marketing, not HR documentation`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // PERFORMANCE MANAGEMENT — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "360-Degree Feedback Questionnaire Builder",
    description: "Design a complete multi-rater 360 feedback system with self, peer, manager, and subordinate questionnaires — plus a scoring guide and development-focused feedback report template.",
    categorySlug: "performance-management",
    tags: ["hr","performance","template","structured","variables"],
    content: `**PURPOSE**
Build a 360-degree feedback system that gives employees meaningful, multi-perspective development input — not just a rating exercise that people dread.

---

**ROLE**
Act as an Organizational Development Specialist with expertise in 360-degree feedback design and leadership development for Philippine businesses.

---

**CONTEXT**
- Company: {company_name}
- Target Role or Level: {role_level} (individual contributor / team lead / manager / director)
- Core Competencies to Assess: {competencies}
- Development Objective: {development_goal}
- Number of Raters per Person: {rater_count} (recommended: 1 manager + 3–5 peers + 2–3 direct reports + self)
- Is This for Development Only or Linked to Performance Review: {purpose}

---

**CONSTRAINTS**
- Frame all questions around observable behaviors, not personality traits
- Minimum raters for anonymity: 3 peers, 2 direct reports — never share individual responses below this threshold
- If linked to performance decisions, disclose this clearly before gathering feedback
- Keep each questionnaire under 20 questions to maintain completion rates

---

**OUTPUT FORMAT**

**Self-Assessment (15 questions + 2 open-ended)**
**Manager Assessment (15 questions, third-person phrasing)**
**Peer Assessment (12 questions, anonymized, collaboration-weighted)**
**Direct Report Assessment (12 questions, fully anonymous, leadership-weighted)**

Open-Ended for All Versions:
- "What are [name's] greatest strengths in this role?"
- "What one behavior change would most increase [name's] effectiveness?"

**Scoring Guide:**
| Competency | Score Range | Interpretation | Suggested Action |

**Feedback Report Template:**
1. Score Summary by Competency — self vs. others gap analysis
2. Strengths (2–3 highest-rated with behavioral evidence)
3. Development Priorities (2–3 lowest-rated with specific examples)
4. Key Theme from Open-Ended Responses
5. Recommended Development Actions (specific, time-bound)

---

**QUALITY STANDARD**
- Questions must describe specific observable behaviors, not traits ("asks clarifying questions before responding" not "is a good listener")
- Gap analysis must identify where self-perception diverges most from others
- Development actions must be specific and include a 90-day milestone

---

**NEGATIVE INSTRUCTIONS**
- Do NOT use personality-based questions ("Is this person a team player?")
- Do NOT share individual rater responses if fewer than the minimum threshold
- Do NOT link 360 results to compensation or promotion without prior explicit communication`,
  }); count++;

  await createPrompt({
    title: "Succession Planning Framework",
    description: "Identify and develop successors for critical roles using a 9-box talent grid, readiness assessment, and individual development plans — protecting business continuity and reducing key-person risk.",
    categorySlug: "performance-management",
    tags: ["hr","performance","strategy","template","structured","sme","variables"],
    content: `**PURPOSE**
Build a succession planning process that identifies high-potential employees, assesses their readiness, and creates development plans that protect the business from key-person dependency.

---

**ROLE**
Act as an HR and Organizational Development Consultant specializing in succession planning and talent development for Philippine SMEs and growing businesses.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Critical Roles to Plan Succession For: {critical_roles}
- Current Incumbents: {incumbents}
- Internal Talent Pool Available: {talent_pool}
- Planning Horizon: {timeline} (immediate 0–6 months / medium 1–2 years / long-term 3+ years)
- Known Departure or Retirement Risks: {departure_risks}

---

**CONSTRAINTS**
- Focus only on critical roles where vacancy would significantly disrupt operations
- Assessment must be objective — use behavioral evidence, not seniority or relationships
- Development plans must be realistic within the candidate's current role and time constraints
- Succession identification is not a promotion guarantee — communicate this explicitly

---

**OUTPUT FORMAT**

**Step 1: Critical Role Inventory**
| Role | Incumbent | Business Impact if Vacant | Vacancy Risk (H/M/L) |

**Step 2: 9-Box Talent Grid (Performance × Potential)**
| | Low Perf | Moderate Perf | High Perf |
| High Potential | | | |
| Moderate Potential | | | |
| Low Potential | | | |

**Step 3: Successor Identification**
| Critical Role | Successor | Readiness | Development Gap |
[Readiness: Ready Now / 1–2 Years / 3+ Years / No Internal Successor]

**Step 4: Individual Development Plan (one per successor)**
- Competency gaps to close
- Development activities: stretch assignments, training, mentoring, exposure
- Timeline with quarterly milestones
- Progress review schedule

**Step 5: Business Continuity Risk Dashboard**
| Role | Succession Coverage | Risk Level | Mitigation |

---

**QUALITY STANDARD**
- Every readiness assessment must cite specific behavioral evidence
- Development plans must be co-created with the successor, not assigned
- Review cycle must be scheduled (minimum annually)

---

**NEGATIVE INSTRUCTIONS**
- Do NOT identify successors based on seniority or personal relationships
- Do NOT create a succession list without accompanying development plans — a list alone is useless
- Do NOT share successor designations broadly — it creates unfulfilled expectations`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // SME OPERATIONS — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Business Process Mapping Guide",
    description: "Document a key business process as a structured text-based flow with swim lanes, decision points, handoff analysis, and improvement opportunities — ready to standardize or automate.",
    categorySlug: "sme-operations",
    tags: ["operations","sop","sme","template","structured","variables"],
    content: `**PURPOSE**
Map a business process in enough detail that inefficiencies become visible, responsibilities are clear, and the process can be standardized, improved, or prepared for automation.

---

**ROLE**
Act as a Business Process Analyst helping a Philippine SME document, analyze, and improve a core operational process.

---

**CONTEXT**
- Company: {company_name}
- Process Name: {process_name}
- Process Start Trigger: {trigger}
- Process End Outcome: {outcome}
- Departments or Roles Involved: {departments}
- Current Pain Points: {pain_points}
- Volume: {volume} (how often this process runs — daily / weekly / per transaction)
- Systems and Tools Used: {systems}

---

**CONSTRAINTS**
- Document what actually happens, not the ideal — then identify improvements
- Use text-based swim lane notation: one lane per role/department
- Mark decision points clearly (YES/NO branches)
- Flag handoff points between roles — this is where most errors occur
- Quantify waiting time and cycle time where known

---

**OUTPUT FORMAT**

**Process Overview:**
- Trigger: | End Outcome: | Stakeholders: | Average Cycle Time:

**Process Map (Text-Based Swim Lanes):**
[ROLE A]
  1. [Action step] → [output/document produced]
     Decision: Is [condition] met?
       YES → Step 2 | NO → Step 1B

[ROLE B]
  2. [Action step] → [tool used, document produced]

**Handoff Analysis:**
| From | To | Document/Output Passed | Most Common Error Here |

**Process Metrics to Track:**
- Average cycle time per step
- Error or rework rate
- Bottleneck location

**Improvement Opportunities (ranked by impact):**
1. [Specific improvement + estimated time saved]
2. [Automation candidate + recommended tool]

---

**QUALITY STANDARD**
- Every step must have a named responsible role, not just a department
- Every decision point must have both YES and NO paths documented
- Improvement list must be ranked by impact, not ease

---

**NEGATIVE INSTRUCTIONS**
- Do NOT document the ideal process — document reality, then improve from there
- Do NOT assign a step to multiple roles without naming one primary owner
- Do NOT skip the handoff analysis — most errors happen at role transitions`,
  }); count++;

  await createPrompt({
    title: "Operations Bottleneck Identifier",
    description: "Diagnose operational bottlenecks slowing your business with structured root cause analysis — and a prioritized action plan to eliminate the top constraints holding back throughput.",
    categorySlug: "sme-operations",
    tags: ["operations","sme","template","expert-mode","structured","variables"],
    content: `**PURPOSE**
Identify, validate, and resolve the operational bottlenecks most limiting throughput, quality, or customer satisfaction — applying constraint analysis to real Philippine SME problems.

---

**ROLE**
Act as an Operations Consultant applying Theory of Constraints thinking and root cause analysis to a Philippine SME operation.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Core Operations Output: {output} (product delivered / client served / order fulfilled)
- Current Throughput Rate: {throughput}
- Target Throughput: {target}
- Observed Symptoms: {symptoms} (delays, errors, customer complaints, team overtime)
- Suspected Problem Areas: {suspected_areas}
- Key Processes Involved: {processes}

---

**CONSTRAINTS**
- Find the system constraint before proposing solutions — symptoms are not constraints
- Apply 5 Whys for each identified bottleneck
- Quantify impact: time lost, cost, customer impact
- Prioritize by: impact on throughput × feasibility to fix
- All solutions must be implementable by an SME without significant capital investment

---

**OUTPUT FORMAT**

**Bottleneck Identification:**
| Area | Symptom | Throughput Impact | 5 Whys Root Cause | Type |
[Types: People / Process / Technology / Material / External]

**Constraint Priority Matrix:**
| Bottleneck | Impact (H/M/L) | Ease of Fix (H/M/L) | Priority | Recommended Action |

**Resolution Plan for Top 3 Constraints:**
| Constraint | Root Cause | Solution | Owner | Timeline | Expected Impact |

**Leading Indicators to Track:**
[What to measure to confirm the constraint has been resolved]

**Prevention Measures:**
[Systemic changes to prevent bottlenecks from returning]

---

**QUALITY STANDARD**
- Root cause must answer WHY, not just WHAT — complete all 5 Whys before concluding
- Every proposed solution must be tested against SME budget and team capacity
- Prioritization must account for interdependencies between constraints

---

**NEGATIVE INSTRUCTIONS**
- Do NOT propose technology before optimizing the process — automate efficiency, not waste
- Do NOT address symptoms — trace to root cause first
- Do NOT rank easy fixes above high-impact ones — low-hanging fruit must still move the needle`,
  }); count++;

  await createPrompt({
    title: "Vendor Evaluation Framework",
    description: "Score and select vendors or suppliers using a weighted criteria matrix — making procurement objective, documented, and defensible for any Philippine SME.",
    categorySlug: "sme-operations",
    tags: ["operations","sme","template","structured","finance","variables"],
    content: `**PURPOSE**
Build a vendor evaluation system that makes supplier selection objective and documented — preventing costly mistakes from gut-feel or relationship-based procurement.

---

**ROLE**
Act as a Procurement and Operations Specialist professionalizing vendor selection for a Philippine SME.

---

**CONTEXT**
- Company: {company_name}
- Product or Service Being Procured: {procurement}
- Estimated Annual Contract Value: PHP {contract_value}
- Vendors to Compare: {vendor_count}
- Vendor Names (if known): {vendor_names}
- Key Business Requirements: {requirements}
- Deal-Breaker Criteria: {deal_breakers}

---

**CONSTRAINTS**
- Weighted scoring criteria must total 100%
- Include quantitative (price, delivery time) and qualitative (reputation, support) criteria
- Philippine compliance check: BIR receipts, DTI registration, business permits
- Reference checks required for contracts above PHP {reference_threshold}
- Process must be repeatable for future procurement decisions

---

**OUTPUT FORMAT**

**Evaluation Criteria Table:**
| Criterion | Weight | Scoring Guide (1=Poor to 5=Excellent) |
- Price Competitiveness | %
- Product/Service Quality | %
- Delivery Reliability | %
- Financial Stability | %
- After-Sales Support | %
- Compliance and Documentation | %
- References and Track Record | %

**Vendor Scorecard:**
| Criterion | Weight | Vendor A | Vendor B | Vendor C |
| TOTAL WEIGHTED SCORE | 100% | /100 | /100 | /100 |

**Deal-Breaker Check:**
| Criterion | Vendor A | Vendor B | Vendor C |
[PASS / FAIL — any FAIL = automatic disqualification]

**Reference Check Questions (5 questions)**

**Recommendation:** [Selected vendor + justification + top negotiation priorities]

---

**QUALITY STANDARD**
- Criteria weights must reflect actual business priorities — not default to price
- Reference check must be completed for all finalists before final decision
- Final selection must be documented as the audit trail for this procurement

---

**NEGATIVE INSTRUCTIONS**
- Do NOT select a vendor without completing the deal-breaker check first
- Do NOT skip reference checks for high-value contracts
- Do NOT base the decision on price alone — total cost of ownership matters`,
  }); count++;

  await createPrompt({
    title: "Weekly Operations Review Template",
    description: "Run a structured weekly operations review that surfaces problems early, aligns the team on priorities, and produces clear action items — in under 45 minutes.",
    categorySlug: "sme-operations",
    tags: ["operations","sme","template","structured","project-management","variables"],
    content: `**PURPOSE**
Produce a weekly operations review structure that keeps leadership aligned, surfaces problems before they escalate, and converts discussion into owned action items.

---

**ROLE**
Act as an Operations Manager and Business Consultant designing a structured weekly review cadence for a Philippine SME leadership team.

---

**CONTEXT**
- Company: {company_name}
- Attendees: {attendees} (roles, not names)
- Meeting Duration Target: {duration} (recommended: 30–45 minutes)
- Key Departments Reviewed: {departments}
- KPIs Being Tracked This Quarter: {kpis}
- Current Quarter Goals: {quarter_goals}
- Known Issues This Week: {known_issues}

---

**CONSTRAINTS**
- Keep to 45 minutes maximum — longer reviews lose focus
- Lead with numbers, not narratives — data first, discussion second
- Every issue raised must have a proposed owner before moving on
- Action items from previous week reviewed first — accountability built in
- Tone: Direct and solution-focused — not a status report reading session

---

**OUTPUT FORMAT**

**WEEKLY OPERATIONS REVIEW**
Week of: | Attendees: | Facilitator:

**Segment 1 — Previous Week Action Item Review (5 min)**
| Action | Owner | Due | Status (Done / In Progress / Blocked) |

**Segment 2 — KPI Scorecard (10 min)**
| KPI | Target | Actual | vs. Last Week | Status | Owner |

**Segment 3 — Department Highlights and Issues (15 min)**
Each department lead: 2 minutes max — what happened, what's stuck, what's needed

**Segment 4 — Priority Alignment (10 min)**
- Top 3 priorities for the coming week (company-level)
- Resource conflicts to resolve

**Segment 5 — Action Items (5 min)**
| Action | Owner | Deadline | Priority |

**Post-Meeting: Review notes distributed within 2 hours**

---

**QUALITY STANDARD**
- KPI scorecard must be populated before the meeting, not during
- Every issue raised must leave with one named owner
- Action items must have specific deadlines — not "this week"

---

**NEGATIVE INSTRUCTIONS**
- Do NOT allow the meeting to become a reporting session — decisions and actions only
- Do NOT skip the previous week review — accountability requires follow-through
- Do NOT let action items accumulate without a resolution pathway`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // BUSINESS STRATEGY — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Business Model Canvas Generator",
    description: "Complete all 9 blocks of the Business Model Canvas for a Philippine business — with strategic analysis of each block and specific recommendations for strengthening the model.",
    categorySlug: "business-strategy",
    tags: ["strategy","sme","template","structured","variables","expert-mode"],
    content: `**PURPOSE**
Complete a Business Model Canvas that maps how the business creates, delivers, and captures value — identifying the strongest and weakest elements of the current model.

---

**ROLE**
Act as a Strategic Business Consultant and Business Model Design expert helping a Philippine business articulate and strengthen its business model.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- Primary Products or Services: {products_services}
- Target Customer Segments: {customer_segments}
- Revenue Model: {revenue_model}
- Key Challenges with Current Business Model: {challenges}
- Stage of Business: {stage} (startup / growing / mature / pivoting)

---

**CONSTRAINTS**
- Complete all 9 BMC blocks — no block left blank or vague
- Philippine market context throughout (payment norms, distribution channels, customer behavior)
- Include a critical assessment of each block — not just description
- Flag the 2–3 weakest blocks as priority improvement areas
- Tone: Strategic and analytical

---

**OUTPUT FORMAT**

**The 9 Business Model Canvas Blocks:**

1. **Customer Segments** — Who are you serving? (be specific — not "SMEs" but "retail SMEs in Cebu with 10–50 employees")
2. **Value Propositions** — What unique value do you deliver and why does each segment choose you?
3. **Channels** — How do you reach and deliver to customers? (awareness, evaluation, purchase, delivery, after-sales)
4. **Customer Relationships** — How do you acquire, retain, and grow customers?
5. **Revenue Streams** — How does each segment pay? Pricing model? One-time vs. recurring?
6. **Key Resources** — What assets are essential to deliver your value proposition?
7. **Key Activities** — What must you do exceptionally well to deliver value?
8. **Key Partnerships** — Who do you rely on and what is the risk if they fail?
9. **Cost Structure** — What are your fixed and variable costs? What drives them?

**Canvas Assessment:**
| Block | Strength (H/M/L) | Key Gap | Priority Action |

**Top 3 Business Model Risks:**

**Recommended Model Improvements (ranked):**

---

**QUALITY STANDARD**
- Each block must be specific to this company — not generic statements
- Assessment must identify real vulnerabilities, not just theoretical weaknesses
- Recommendations must be actionable within 90 days

---

**NEGATIVE INSTRUCTIONS**
- Do NOT leave any block vague or empty — force specificity in every answer
- Do NOT describe the model without assessing its strengths and vulnerabilities
- Do NOT recommend pivots without first strengthening the core model`,
  }); count++;

  await createPrompt({
    title: "OKR Framework Generator",
    description: "Create a practical Objectives and Key Results (OKR) framework for a Philippine SME or team — with 3–5 objectives, measurable key results, and a tracking cadence.",
    categorySlug: "business-strategy",
    tags: ["strategy","sme","template","kpi","structured","variables"],
    content: `**PURPOSE**
Build an OKR framework that aligns the team on ambitious but achievable goals — with measurable key results that create focus and accountability without bureaucracy.

---

**ROLE**
Act as a Strategy and Organizational Performance Consultant helping a Philippine business implement OKRs that actually drive results.

---

**CONTEXT**
- Company: {company_name}
- Industry: {industry}
- OKR Level: {level} (company-wide / department / individual)
- Time Period: {period} (quarterly / annual)
- Key Business Priorities This Period: {priorities}
- Current Performance Challenges: {challenges}
- Team Size: {team_size}
- Previous Goal-Setting Experience: {experience} (none / KPIs only / previous OKRs)

---

**CONSTRAINTS**
- Maximum 5 Objectives per level
- Maximum 3–4 Key Results per Objective
- Key Results must be measurable with a specific number or milestone
- Objectives must be inspiring and directional — Key Results must be quantified
- No KPIs disguised as Key Results — KRs measure outcomes, not activities
- Philippine business context: quarterly cadence works better than annual for SMEs

---

**OUTPUT FORMAT**

**OKR Framework:**

For each Objective:
**Objective [#]: [Inspiring, qualitative direction — past tense as if already achieved]**
- KR 1: [Measurable outcome — specific number, by when]
- KR 2: [Measurable outcome — specific number, by when]
- KR 3: [Measurable outcome — specific number, by when]

**OKR Scoring Guide:**
- 0.7–1.0 = Delivered (green)
- 0.4–0.6 = Progress made (yellow)
- 0.0–0.3 = Missed (red)
Note: Average 0.7 is the OKR target — consistent 1.0 means objectives are too easy

**Tracking Cadence:**
- Weekly: 10-minute OKR check-in (what moved, what's blocked)
- Monthly: Progress review and adjustment if context changed
- End of period: Score + retrospective + learnings into next period

**Alignment Check:**
| Objective | Connects to Company Priority | Owner | Dependencies |

---

**QUALITY STANDARD**
- Key Results must be verifiable — anyone should be able to confirm 0 or 1 at period end
- At least one KR per Objective should be a stretch (70% confident of achieving)
- All OKRs should be visible to the whole team — transparency drives focus

---

**NEGATIVE INSTRUCTIONS**
- Do NOT turn OKRs into a task list — Key Results measure outcomes, not activities
- Do NOT create more than 5 Objectives — focus is the point of OKRs
- Do NOT set KRs where the target is already 90% achieved — ambition is required`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // VA OPERATIONS — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "VA Performance Scorecard Builder",
    description: "Create an objective performance scorecard for a virtual assistant — with weighted competency ratings, output quality metrics, and a structured review process.",
    categorySlug: "va-operations",
    tags: ["va","hr","template","performance","structured","variables"],
    content: `**PURPOSE**
Build a VA performance scorecard that makes reviews objective, consistent, and constructive — giving both the VA and the client a clear picture of performance and development priorities.

---

**ROLE**
Act as an Operations and Virtual Team Management Specialist designing performance systems for remote workers.

---

**CONTEXT**
- VA Name: {va_name}
- VA Role/Function: {va_role}
- Key Responsibilities: {responsibilities}
- Review Period: {review_period}
- Client/Manager: {manager}
- Communication Tools Used: {tools}
- Current Performance Concerns (if any): {concerns}

---

**CONSTRAINTS**
- Weighted criteria must total 100%
- Rating scale: 1 (Below Standard) → 5 (Exceeds Standard)
- Base ratings on observable outputs, not perception
- Include both output quality and work behavior metrics
- Review must result in specific, actionable development priorities

---

**OUTPUT FORMAT**

**Performance Scorecard:**
| Competency Area | Weight | Criteria | Score (1–5) | Evidence/Notes |

Core Areas:
- Output Quality and Accuracy | %
- Task Completion Rate and Timeliness | %
- Communication Responsiveness | %
- Initiative and Problem Solving | %
- Process Adherence and Reliability | %
- Tool Proficiency | %

**Scoring Rubric (for each area):**
| Score | Behavioral Description |

**Overall Weighted Score:** [Formula and result]

**Performance Summary:**
- Top 2 Strengths (with specific examples)
- Top 2 Development Areas (with specific examples)
- Agreed Next Steps (with owner and timeline)

**Review Signature Block:** VA | Client | Date

---

**QUALITY STANDARD**
- Every score must have a specific behavioral example or output reference — no unsupported ratings
- Development areas must have specific, actionable next steps
- VA must have the opportunity to respond to the scorecard before it is finalized

---

**NEGATIVE INSTRUCTIONS**
- Do NOT rate based on personality — rate on observable behavior and output quality
- Do NOT skip the evidence column — scoring without evidence is not defensible
- Do NOT conduct the review without giving the VA the scorecard criteria in advance`,
  }); count++;

  await createPrompt({
    title: "VA Daily Report Template",
    description: "Create a standardized daily or weekly VA report template that gives clients full visibility into work completed, time spent, issues flagged, and next-day priorities.",
    categorySlug: "va-operations",
    tags: ["va","template","operations","communication","variables"],
    content: `**PURPOSE**
Design a VA reporting template that gives clients the right visibility without micromanaging — building trust through consistent, structured communication.

---

**ROLE**
Act as an Operations and Remote Team Consultant designing reporting systems for Philippine virtual assistants and their international or local clients.

---

**CONTEXT**
- VA Role: {va_role}
- Client/Manager: {client_name}
- Reporting Frequency: {frequency} (daily / weekly)
- Key Deliverables Being Tracked: {deliverables}
- Tools Used: {tools}
- Time Zone of Client: {client_timezone}
- Preferred Submission Method: {method} (Slack message / email / Google Doc / project management tool)

---

**CONSTRAINTS**
- Report must be completable in under 10 minutes
- Prioritize accomplishments over effort — show output, not hours
- Flag blockers immediately — clients cannot help what they cannot see
- Keep format consistent so clients can scan quickly
- Written in clear, professional English

---

**OUTPUT FORMAT**

**[DAILY / WEEKLY] VA REPORT**
Date/Week: | VA: | Client: | Submitted at:

**✅ Completed Today/This Week:**
[List specific tasks completed — with deliverable names, not vague descriptions]

**⏳ In Progress:**
[Tasks started but not yet complete — % done and expected completion]

**🚧 Blocked or Needs Input:**
[Specific blocker → what the VA tried → what is needed from client → urgency]

**📅 Tomorrow's/Next Week's Priorities:**
[Top 3 planned tasks — aligned with what client cares about most]

**📊 Time Log Summary:**
| Task | Time Spent | Category (admin/research/content/etc.) |

**Notes:**
[Anything the client should know that doesn't fit above]

---

**QUALITY STANDARD**
- Completed tasks must name specific deliverables ("Drafted 3 LinkedIn posts for review" not "content work")
- Blockers must include what the VA already tried before escalating
- Next-day priorities must reflect client's current goals, not just leftover tasks

---

**NEGATIVE INSTRUCTIONS**
- Do NOT list hours worked without showing output — effort without output is not reportable
- Do NOT describe blockers without also suggesting what the client can do to help
- Do NOT submit the report after the agreed submission time — consistency builds trust`,
  }); count++;

  await createPrompt({
    title: "Delegation Matrix Builder",
    description: "Determine what to delegate, to whom, and at what authority level — using an Eisenhower-informed delegation framework that frees up executive time for high-value work.",
    categorySlug: "va-operations",
    tags: ["va","operations","template","sme","executive","structured","variables"],
    content: `**PURPOSE**
Build a delegation matrix that identifies which tasks to delegate, to which team member, and with what authority level — freeing executive time for the work only they can do.

---

**ROLE**
Act as an Executive Productivity and Operations Consultant helping a business owner or executive delegate effectively without losing control.

---

**CONTEXT**
- Executive Name/Role: {executive_role}
- Current Task Load (list): {task_list}
- Team Members Available to Delegate To: {team_members} (names and roles)
- Their Skill Levels: {skill_levels}
- Current Bottleneck: {bottleneck}
- Hours Per Week Spent on Delegatable Work: {hours}

---

**CONSTRAINTS**
- Apply the Delegation Decision Filter: only the executive = high complexity + high stakes only
- Authority levels: Full Autonomy / Check In Before Completing / Recommend and Await Approval / Observe Only
- Delegation must match skill level — do not over-delegate to under-qualified staff
- Include a transition plan — delegation is not dropping tasks without support

---

**OUTPUT FORMAT**

**Task Inventory and Delegation Analysis:**
| Task | Current Owner | Frequency | Delegatable? | To Whom | Authority Level | Transition Needed |

**Executive Keep/Delegate Summary:**
- Tasks to Keep (only executive can do these): [List]
- Tasks to Delegate Immediately: [List + assignees]
- Tasks to Delegate After Training: [List + timeline]
- Tasks to Eliminate: [List + reason]

**Delegation Transition Plan:**
| Task | Assignee | Training Needed | Handover Date | Check-in Schedule |

**Authority Level Guide:**
| Level | Description | When to Use |

**Time Recovery Estimate:**
Expected hours freed per week: [X hours] | Redirected to: [high-value activities]

---

**QUALITY STANDARD**
- Every delegatable task must have a named assignee — "the team" is not an assignee
- Authority level must match the assignee's actual experience
- Transition plan must include a check-in schedule during the handover period

---

**NEGATIVE INSTRUCTIONS**
- Do NOT delegate without a clear handover — dropping tasks is not delegating
- Do NOT delegate to the most available person — match task to competence
- Do NOT skip the "tasks to eliminate" category — some tasks are not worth doing at all`,
  }); count++;

  await createPrompt({
    title: "VA Communication Protocol Guide",
    description: "Establish clear communication standards between a client and their VA — covering response times, preferred channels, escalation paths, and professional conduct expectations.",
    categorySlug: "va-operations",
    tags: ["va","operations","template","communication","sme","variables"],
    content: `**PURPOSE**
Create a communication protocol that sets clear expectations for how the client and VA interact — eliminating miscommunication, reducing anxiety on both sides, and building a productive working relationship.

---

**ROLE**
Act as a Remote Team Operations Specialist designing communication frameworks for Philippine VAs and their clients.

---

**CONTEXT**
- Client Name and Role: {client_name}
- VA Name and Role: {va_name}
- Work Hours (VA): {va_hours} (timezone: {va_timezone})
- Client Hours: {client_hours} (timezone: {client_timezone})
- Primary Communication Tools: {tools}
- Nature of Work: {work_nature}
- Current Communication Pain Points: {pain_points}

---

**CONSTRAINTS**
- Philippine VA context: internet reliability, power interruptions, banking/payment schedules
- Realistic response time expectations based on role and urgency level
- Escalation path must be clear — VA must know when to interrupt vs. wait
- Meeting cadence must be defined and kept — consistency reduces anxiety
- Both parties must agree to and sign the protocol

---

**OUTPUT FORMAT**

**VA Communication Protocol**
Effective Date: | Client: | VA:

**1. Working Hours and Availability**
VA available hours: | Client available hours: | Overlap window:

**2. Communication Channels and Their Purpose**
| Channel | Used For | Expected Response Time |

**3. Urgency Classification**
| Level | Definition | Response Time | How to Mark Messages |
| Urgent | Needed within 2 hours | Within 1 hour | [URGENT] in subject |
| High | Needed same day | Within 4 hours | |
| Normal | Needed within 48 hours | Within 24 hours | |
| FYI | No response needed | No response required | |

**4. Meeting Cadence**
- Weekly sync: [Day, Time, Platform, Agenda structure]
- Monthly review: [Date, Duration, Format]

**5. Escalation Path**
When to interrupt immediately vs. when to wait

**6. Absence and Emergency Protocol**
- VA planned absence: [X days advance notice, backup plan]
- Technical emergency (no power/internet): [How to notify, expected resolution time]

**7. File Naming and Version Control Standards**

**8. Confidentiality and Data Handling**

**Acknowledgment:** VA Signature | Client Signature | Date

---

**QUALITY STANDARD**
- Response time commitments must be realistic — not aspirational
- Urgency classification must include examples of what qualifies as each level
- Both parties must read and sign — verbal agreements create conflict later

---

**NEGATIVE INSTRUCTIONS**
- Do NOT set "always-on" expectations — VA burnout reduces quality
- Do NOT leave escalation undefined — ambiguity causes either over-escalation or silence
- Do NOT skip the technical emergency protocol — Philippine internet reliability is a real factor`,
  }); count++;

  // ═══════════════════════════════════════════════════════════════════════════════
  // SOCIAL MEDIA CONTENT — Additional Prompts
  // ═══════════════════════════════════════════════════════════════════════════════

  await createPrompt({
    title: "Facebook Business Post Generator",
    description: "Write engaging Facebook posts for Philippine business audiences — educational, conversational, and optimized for organic reach without sounding like an advertisement.",
    categorySlug: "social-media-content",
    tags: ["social-media","template","communication","philippines","variables"],
    content: `**PURPOSE**
Produce Facebook post copy that reaches and engages a Philippine business audience — educating, building credibility, and inviting interaction without feeling like a sales pitch.

---

**ROLE**
Act as a Social Media Content Strategist specializing in Facebook content for Philippine B2B and professional services audiences.

---

**CONTEXT**
- Business: {company_name}
- Industry: {industry}
- Post Topic: {post_topic}
- Target Audience: {target_audience}
- Goal of This Post: {post_goal} (educate / build credibility / generate inquiries / increase engagement)
- Key Message or Insight: {key_message}
- Any Relevant Data or Story: {supporting_content}
- Tone: {tone} (professional / conversational / inspiring / practical)

---

**CONSTRAINTS**
- Platform: Facebook
- Length: 100–200 words optimal for organic reach
- Lead with value — educational content outperforms promotional in Philippine Facebook
- Use line breaks liberally — dense paragraphs stop the scroll
- End with a question or invitation to comment — it drives algorithm reach
- Avoid link in the post text — put URL in the first comment instead

---

**OUTPUT FORMAT**

[Opening line — a relatable problem, a surprising fact, or a strong statement]

[Value content — practical tip, insight, or short story: 3–5 short paragraphs]

[Key takeaway stated plainly]

[Engagement CTA — a question for the audience to answer in comments]

[Optional: Relevant emoji to break up the text visually]

**Note:** Post the link to your website or resource in the FIRST COMMENT — not in the post text. Facebook's algorithm reduces reach for posts with external links.

---

**QUALITY STANDARD**
- Opening line must make the reader nod or want to know more within 2 seconds
- Content must deliver value the reader can apply today — not general inspiration
- CTA question must be easy to answer in one sentence — high barrier = no replies

---

**NEGATIVE INSTRUCTIONS**
- Do NOT open with "Good morning!" or generic greetings — lead with the value
- Do NOT include the external link in the post text — it kills organic reach
- Do NOT end without a question or engagement hook`,
  }); count++;

  await createPrompt({
    title: "Client Testimonial Post Formatter",
    description: "Transform raw client feedback into compelling social media posts for LinkedIn and Facebook — preserving authenticity while making the results impossible to ignore.",
    categorySlug: "social-media-content",
    tags: ["social-media","template","communication","proposal","variables"],
    content: `**PURPOSE**
Turn raw client feedback or testimonial text into polished, credible social media posts that showcase results without sounding promotional — for LinkedIn and Facebook.

---

**ROLE**
Act as a Content Strategist and Copywriter specializing in social proof content for Philippine professional services firms.

---

**CONTEXT**
- Your Company: {company_name}
- Client Industry: {client_industry}
- Raw Testimonial or Feedback: {raw_testimonial}
- Results Achieved (quantified where possible): {results}
- Type of Service Provided: {service}
- Client Permission to Use: {permission_status} (named / anonymous / fictional alias)
- Target Platform: {platform} (LinkedIn / Facebook / both)

---

**CONSTRAINTS**
- Preserve the client's authentic voice — do not over-polish into corporate language
- Lead with the result, not the service
- If client is anonymous, describe them by role and industry without identifying details
- Add credibility markers: before state, intervention, after state
- Length: LinkedIn 200 words / Facebook 150 words

---

**OUTPUT FORMAT**

**LinkedIn Version:**
[Result-first headline — specific number or outcome]
[Client's situation before engaging you — 2 sentences, relatable pain]
[What changed — your service in 1–2 sentences, not a sales pitch]
[Quote from client — verbatim or lightly cleaned]
[Lesson or takeaway for the reader]
[CTA — invite similar situations to DM or comment]

**Facebook Version:**
[Opening — relatable problem or surprising result]
[Short story format — before/during/after]
[Client quote if using real name; paraphrased if anonymous]
[What this means for readers in the same situation]
[Question to drive engagement]

**Instagram Caption Version (100 words):**
[Micro story + quote + hashtags]

---

**QUALITY STANDARD**
- The result must be specific — "saved 6 hours per week" beats "improved efficiency"
- Client voice must feel authentic — not rewritten into corporate speak
- The post must make a reader think "I have that problem too"

---

**NEGATIVE INSTRUCTIONS**
- Do NOT fabricate or exaggerate results — credibility is the entire value of testimonials
- Do NOT use testimonials without confirmed client permission
- Do NOT make the post about your services — make it about the client's success`,
  }); count++;

  await createPrompt({
    title: "Content Repurposing Framework",
    description: "Repurpose one piece of long-form content into multiple platform-native formats — maximizing reach from a single idea across LinkedIn, Facebook, email, and short-form video.",
    categorySlug: "social-media-content",
    tags: ["social-media","template","communication","automation","variables"],
    content: `**PURPOSE**
Extract maximum value from one piece of content by repurposing it into 6–8 platform-native formats — without making every version feel like a copy of the original.

---

**ROLE**
Act as a Content Strategy and Repurposing Specialist helping professional services businesses multiply their content output without multiplying their effort.

---

**CONTEXT**
- Original Content: {original_content} (paste article, report, talk transcript, or describe it)
- Original Format: {original_format} (blog / report / webinar / podcast / training)
- Target Platforms: {platforms} (LinkedIn / Facebook / email / Instagram / TikTok / YouTube)
- Audience: {audience}
- Business Goal of Repurposed Content: {goal}

---

**CONSTRAINTS**
- Each repurposed piece must be native to its platform — not just cropped from the original
- LinkedIn: thought leadership angle
- Facebook: educational + conversational
- Email: personal and direct
- Short-form video script: 60–90 seconds, hook in first 3 seconds
- Minimum 6 repurposed assets from one source

---

**OUTPUT FORMAT**

**Content Audit:**
- Core message of original content: [1 sentence]
- Top 5 insights or quotable moments: [bulleted list]
- Best story or example inside: [1 paragraph]

**Repurposed Assets:**

1. **LinkedIn Post (200 words)** — thought leadership angle
2. **Facebook Post (150 words)** — educational, conversational
3. **Email Newsletter Snippet (150 words)** — personal, first-person
4. **Short-Form Video Script (90 seconds)** — hook + 3 points + CTA
5. **Instagram Caption (80 words + hashtags)**
6. **Quote Card Text** — one powerful sentence for visual design
7. **Twitter/X Thread** — 5–7 tweets breaking down the core insight
8. **FAQ Post** — answer the 3 most common questions this content raises

**Repurposing Calendar:**
| Day | Asset | Platform | Goal |

---

**QUALITY STANDARD**
- Each repurposed piece must deliver standalone value — readers should not need the original
- Platform tone must be distinctly different between LinkedIn and Facebook
- Video script must have a hook in the first 3 seconds — not an intro

---

**NEGATIVE INSTRUCTIONS**
- Do NOT copy-paste from the original — adapt for the platform's native format
- Do NOT repurpose content without extracting the key insight first
- Do NOT create more assets than can be published consistently — quality over quantity`,
  }); count++;

  // ── BATCH 3 — Client Communication, Project Management, SOP Creation ────────

  await createPrompt({
    title: "Scope of Work Agreement Template",
    description: "Draft a precise scope of work document that sets clear deliverable boundaries and prevents scope creep from the first engagement.",
    content: `**PURPOSE:** Generate a professional Scope of Work agreement that clearly defines project boundaries, deliverables, and responsibilities.

**ROLE:** You are a senior business consultant who has drafted hundreds of client agreements and understands how to prevent scope creep through precise language.

**CONTEXT:** Scope of Work documents protect both the service provider and client by defining exactly what is and is not included. Vague language leads to disputes, unpaid work, and damaged relationships. This document must be firm but professional.

**INPUTS NEEDED:**
- Project name: {project_name}
- Client company: {client_company}
- Service provider: {provider_name}
- Services included: {services_included}
- Explicit exclusions: {services_excluded}
- Deliverables list: {deliverables}
- Timeline: {start_date} to {end_date}
- Revision rounds: {revision_count}

**CONSTRAINTS:**
- Maximum 800 words
- Use numbered sections and bullet points for clarity
- Include a clear "Not Included" section
- Use plain business English — no legal jargon that obscures meaning
- Include a revision policy clause

**OUTPUT FORMAT:**
Structured document with: Project Overview → Scope of Services → Deliverables → Timeline → What Is Not Included → Revision Policy → Acceptance Statement

**QUALITY STANDARD:** A client and provider should be able to read this document and independently agree on exactly what work will be done, by when, and what falls outside the engagement.

**NEGATIVE INSTRUCTIONS:**
- Do NOT use vague phrases like "as needed" or "support as required"
- Do NOT omit the exclusions section
- Do NOT write in passive voice
- Do NOT make the document unnecessarily long — brevity protects both parties`,
    categorySlug: "client-communication",
    tags: ["client-management", "sop", "strategy"],
  }); count++;

  await createPrompt({
    title: "Payment Follow-Up Email Generator",
    description: "Write firm yet professional payment follow-up emails that preserve the client relationship while recovering overdue amounts.",
    content: `**PURPOSE:** Generate a three-stage payment follow-up email sequence that escalates appropriately while maintaining professionalism and preserving the client relationship.

**ROLE:** You are an experienced accounts manager who has successfully recovered thousands of overdue payments without losing client relationships by using the right tone at the right stage.

**CONTEXT:** Payment follow-up requires a delicate balance. Too soft and the invoice gets ignored. Too aggressive and you damage a relationship worth more than the invoice. The sequence must escalate in firmness while remaining professional throughout.

**INPUTS NEEDED:**
- Client name: {client_name}
- Invoice number: {invoice_number}
- Amount due: {amount_due}
- Original due date: {due_date}
- Days overdue: {days_overdue}
- Previous contact attempts: {prior_contacts}
- Your name: {your_name}
- Company name: {company_name}

**CONSTRAINTS:**
- Generate three emails: gentle reminder (Day 1), firm follow-up (Day 14), final notice (Day 30)
- Each email under 150 words
- Maintain professional tone throughout all three
- Include specific invoice details in each
- Final notice should mention next steps clearly without being threatening

**OUTPUT FORMAT:**
Three labeled emails with subject lines:
Email 1 — [Friendly Reminder]
Email 2 — [Firm Follow-Up]
Email 3 — [Final Notice]

**QUALITY STANDARD:** Each email should feel appropriately calibrated to the situation — someone reading Email 3 should clearly understand the urgency without feeling attacked or disrespected.

**NEGATIVE INSTRUCTIONS:**
- Do NOT use passive-aggressive language
- Do NOT threaten legal action in Emails 1 or 2
- Do NOT grovel or apologize for asking for payment you are owed
- Do NOT ignore the relationship history in the tone`,
    categorySlug: "client-communication",
    tags: ["client-management", "finance", "operations"],
  }); count++;

  await createPrompt({
    title: "Risk Register Builder",
    description: "Build a structured project risk register that identifies, scores, and maps mitigation strategies before problems escalate into crises.",
    content: `**PURPOSE:** Create a comprehensive risk register that identifies, evaluates, and mitigates potential project threats before they materialise.

**ROLE:** You are a certified project management professional (PMP) with experience managing complex multi-stakeholder projects and a track record of early risk identification.

**CONTEXT:** Most projects fail because risks were either not identified, not monitored, or discovered too late. A risk register transforms vague worries into actionable monitoring points. It is a living document that the project team reviews regularly.

**INPUTS NEEDED:**
- Project name: {project_name}
- Project type: {project_type}
- Duration: {project_duration}
- Key stakeholders: {stakeholders}
- Known constraints: {known_constraints}
- Budget: {budget_range}
- Team size: {team_size}

**CONSTRAINTS:**
- Identify minimum 10 risks across categories: schedule, budget, resources, technical, stakeholder, external
- Score each risk: Likelihood (1–5) x Impact (1–5) = Risk Score
- Prioritise risks scoring 12 or above as HIGH
- Each risk must have a mitigation strategy and risk owner
- Format as a structured table

**OUTPUT FORMAT:**
Risk Register Table with columns: Risk ID | Category | Risk Description | Likelihood | Impact | Risk Score | Priority | Mitigation Strategy | Risk Owner | Status

**QUALITY STANDARD:** A project manager reviewing this register should be able to brief any stakeholder on the top 5 risks within 2 minutes without reading the full document.

**NEGATIVE INSTRUCTIONS:**
- Do NOT list obvious filler risks with no mitigation
- Do NOT assign all risks to the same owner
- Do NOT create risks so vague they cannot be monitored
- Do NOT skip the scoring — gut feel without numbers leads to poor prioritisation`,
    categorySlug: "project-management",
    tags: ["project-management", "operations", "strategy"],
  }); count++;

  await createPrompt({
    title: "Project Kickoff Meeting Agenda",
    description: "Design a structured kickoff meeting agenda that aligns all stakeholders on scope, responsibilities, and success criteria from Day 1.",
    content: `**PURPOSE:** Create a structured project kickoff meeting agenda that establishes alignment, accountability, and shared expectations among all stakeholders.

**ROLE:** You are a senior project manager who consistently launches projects on time because you know that what is established in the kickoff meeting determines everything that follows.

**CONTEXT:** Kickoff meetings fail when they are unstructured social events or one-sided presentations. A great kickoff is a working session where stakeholders leave knowing exactly what is expected of them, what success looks like, and how they will communicate.

**INPUTS NEEDED:**
- Project name: {project_name}
- Meeting duration: {meeting_duration}
- Attendees: {attendees_list}
- Project objectives: {project_objectives}
- Key milestones: {key_milestones}
- Communication channels: {comm_channels}
- Project manager: {pm_name}

**CONSTRAINTS:**
- Total agenda items must fit within the meeting duration with a 10-minute buffer
- Every agenda item must have a time allocation
- Include a Q&A block
- Designate a note-taker in the agenda
- End with a summary of next actions with owners and deadlines

**OUTPUT FORMAT:**
Meeting agenda with: Header (Date, Location, Attendees) → Time-blocked agenda items → Pre-read materials list → Action items template at bottom

**QUALITY STANDARD:** Any attendee who receives this agenda 24 hours before the meeting should arrive prepared to contribute, not just to listen.

**NEGATIVE INSTRUCTIONS:**
- Do NOT include agenda items with no clear decision or output
- Do NOT schedule the kickoff without pre-reads distributed first
- Do NOT allocate most time to presentations — allocate more to discussion
- Do NOT skip the "risks and concerns" agenda item even if it feels premature`,
    categorySlug: "project-management",
    tags: ["project-management", "operations"],
  }); count++;

  await createPrompt({
    title: "Process Flow Documentation Template",
    description: "Document any business process clearly enough that a new hire can execute it correctly on the first attempt, without supervision.",
    content: `**PURPOSE:** Create a clear, step-by-step process flow document that enables any qualified person to execute a business process accurately and independently.

**ROLE:** You are a process improvement specialist who has documented hundreds of business workflows and understands that the measure of a good SOP is whether a new employee can follow it without asking questions.

**CONTEXT:** Poor process documentation is one of the biggest causes of inconsistency, errors, and owner-dependency in small businesses. A well-documented process reduces training time, improves quality, and enables delegation. The document must be practical, not theoretical.

**INPUTS NEEDED:**
- Process name: {process_name}
- Department: {department}
- Process owner: {process_owner}
- Frequency: {process_frequency}
- Step-by-step description: {process_steps}
- Tools used: {tools_used}
- Common errors to avoid: {common_errors}
- Decision points: {decision_points}

**CONSTRAINTS:**
- Maximum 1,200 words
- Steps must be numbered and written in imperative form ("Click," "Enter," "Verify")
- Include a decision tree if the process has conditional branches
- Flag steps that require special permissions or access
- Include estimated time per step

**OUTPUT FORMAT:**
SOP document with: Header (Process Name, Owner, Version, Date) → Purpose → Scope → Prerequisites → Step-by-Step Instructions → Decision Points → Common Errors and How to Avoid Them → Related Documents

**QUALITY STANDARD:** Hand this document to a new hire on Day 1 and they should be able to execute the process correctly without calling the process owner for help.

**NEGATIVE INSTRUCTIONS:**
- Do NOT write steps in passive voice — active verbs only
- Do NOT combine multiple actions in a single step
- Do NOT omit decision points — they are the most critical parts
- Do NOT write from the perspective of someone who already knows the process`,
    categorySlug: "sop-creation",
    tags: ["sop", "operations", "systems"],
  }); count++;

  await createPrompt({
    title: "Quick Reference Card Builder",
    description: "Compress any complex process into a single-page quick reference card that busy employees can use without reading the full SOP.",
    content: `**PURPOSE:** Convert a detailed process document or workflow into a concise one-page quick reference card (QRC) that serves as a fast on-the-job aid.

**ROLE:** You are an instructional designer who specialises in reducing cognitive load for frontline workers — extracting the most critical information and presenting it in the most scannable format possible.

**CONTEXT:** Full SOPs are necessary but rarely consulted once learned. A Quick Reference Card fills the gap — it is what people actually use when they are doing the work. The QRC must contain every critical step, warning, and decision point without any padding.

**INPUTS NEEDED:**
- Source process name: {process_name}
- Target audience: {target_audience}
- Full SOP or process description: {full_process}
- Critical steps (cannot be skipped): {critical_steps}
- Common mistakes to flag: {common_mistakes}
- Key terms: {key_terms}

**CONSTRAINTS:**
- Fit entire content on one page (approximately 400 words maximum)
- Use short phrases, not full sentences
- Highlight critical warnings in bold or with a warning symbol
- Use numbered steps for sequential tasks, checkboxes for checklists
- Include the process owner contact for escalation

**OUTPUT FORMAT:**
Quick Reference Card layout: Title bar → Steps in 2 columns (numbered or checkbox) → Warning panel → Escalation contact → Version and date footer

**QUALITY STANDARD:** Someone could pick up this card mid-task and immediately understand where they are in the process and what to do next, without reading from the beginning.

**NEGATIVE INSTRUCTIONS:**
- Do NOT include background information or "why" explanations — only "what" and "how"
- Do NOT write full sentences — brevity is the entire point
- Do NOT replicate the full SOP — extract, compress, and prioritise
- Do NOT omit warnings — they are more important than any step`,
    categorySlug: "sop-creation",
    tags: ["sop", "operations", "systems"],
  }); count++;

  // ── BATCH 4 — AI Automation, Market Research, Financial Analysis, Executive Assistant ─

  await createPrompt({
    title: "AI Implementation Roadmap for SMEs",
    description: "Build a phased AI adoption roadmap that prioritises high-ROI use cases and avoids the expensive mistakes most small businesses make.",
    content: `**PURPOSE:** Create a practical, phased AI implementation roadmap tailored to a small or medium-sized business that maximises return and minimises disruption.

**ROLE:** You are an AI implementation strategist who has helped dozens of SMEs adopt AI tools successfully — you know which implementations deliver fast ROI and which become expensive distractions.

**CONTEXT:** Most SMEs approach AI wrong — they either buy expensive enterprise tools without a plan or experiment randomly. A roadmap forces strategic thinking: which processes to automate first, what skills the team needs, and how to measure success. Start with high-impact, low-complexity wins.

**INPUTS NEEDED:**
- Business type: {business_type}
- Team size: {team_size}
- Current tech stack: {current_tools}
- Top operational pain points: {pain_points}
- Monthly budget for AI tools: {ai_budget}
- Technical skill level of team: {tech_level}
- Primary business goal: {primary_goal}

**CONSTRAINTS:**
- Roadmap must be phased: Phase 1 (0–3 months), Phase 2 (3–6 months), Phase 3 (6–12 months)
- Phase 1 must contain only no-code or low-code tools
- Each phase must include: tools, use cases, expected outcomes, and cost estimate
- Total Phase 1 budget must stay within {ai_budget}
- Include a "What to Avoid" section

**OUTPUT FORMAT:**
Phased roadmap table → Tool recommendations per phase → ROI indicators per use case → Risk warnings → 30-day quick start checklist

**QUALITY STANDARD:** A business owner with no technical background should be able to read this roadmap and take action on Week 1 without hiring a consultant.

**NEGATIVE INSTRUCTIONS:**
- Do NOT recommend enterprise tools for SME budgets
- Do NOT start with AI tools that require API development — Phase 1 must be self-service
- Do NOT ignore change management — adoption failure is a people problem, not a technology problem
- Do NOT recommend tools without specifying exactly what task they replace`,
    categorySlug: "ai-automation",
    tags: ["ai-tools", "automation", "strategy", "sme-growth"],
  }); count++;

  await createPrompt({
    title: "Business Process AI Audit",
    description: "Audit your current business processes to identify which tasks are best candidates for AI automation and which are not.",
    content: `**PURPOSE:** Conduct a systematic audit of business processes to identify AI automation opportunities ranked by impact, feasibility, and ROI potential.

**ROLE:** You are a business process automation consultant who evaluates workflows with a practical lens — you know that not every task should be automated, and you help businesses prioritise the ones that should.

**CONTEXT:** AI automation hype leads many businesses to automate the wrong things first. The highest-value automation targets share common traits: high volume, repetitive, rule-based, time-sensitive, or error-prone. This audit creates a prioritised hit list.

**INPUTS NEEDED:**
- List of current business processes: {process_list}
- Volume per process (daily/weekly): {process_volume}
- Time spent per process: {time_per_process}
- Error rate or rework frequency: {error_rate}
- Current owner (human or system): {process_owner}
- Customer-facing or internal: {process_type}

**CONSTRAINTS:**
- Evaluate each process against 5 criteria: Volume, Repetitiveness, Rule-based (Y/N), Error Cost, Automation Feasibility
- Score each criterion 1–5 and produce a total automation score
- Rank all processes by automation score
- Flag processes that should NOT be automated (relationship-dependent, judgment-heavy)
- Include a "Start Here" recommendation with clear rationale

**OUTPUT FORMAT:**
Audit table (Process | Criteria Scores | Total Score | Priority | Recommended Tool | Notes) → Top 3 Quick Wins → Processes to Keep Human → Implementation sequence

**QUALITY STANDARD:** The business owner should be able to walk away with a ranked list of automation projects and a clear starting point, not a generic list of AI tools.

**NEGATIVE INSTRUCTIONS:**
- Do NOT recommend automation for processes that require emotional intelligence or relationship management
- Do NOT score processes without rationale — explain each score
- Do NOT ignore integration complexity — a high-impact automation that breaks existing systems is a net negative
- Do NOT recommend automation that would eliminate a compliance checkpoint`,
    categorySlug: "ai-automation",
    tags: ["ai-tools", "automation", "operations", "systems"],
  }); count++;

  await createPrompt({
    title: "Market Survey Design Framework",
    description: "Design a targeted market survey that extracts actionable customer insights rather than generic responses that confirm your existing assumptions.",
    content: `**PURPOSE:** Design a market survey instrument that generates actionable, unbiased customer insights to inform product, pricing, or positioning decisions.

**ROLE:** You are a market research consultant with expertise in survey design — you know how leading questions, poor answer options, and survey fatigue destroy data quality and how to prevent each.

**CONTEXT:** Most small business surveys collect vanity data — satisfaction scores and demographic info that does not inform decisions. A well-designed survey asks the right questions in the right sequence and produces insights you can act on within 48 hours of collecting responses.

**INPUTS NEEDED:**
- Research objective: {research_objective}
- Target respondent profile: {respondent_profile}
- Key decisions this survey will inform: {decisions_to_inform}
- Survey platform: {survey_platform}
- Target response time: {target_minutes} minutes
- Known hypotheses to test: {hypotheses}

**CONSTRAINTS:**
- Maximum 10 questions for a {target_minutes}-minute survey
- Mix of question types: multiple choice, Likert scale, ranking, and one open-ended
- Zero leading questions — every question must be neutral
- Each question must map to one of the key decisions
- Include a skip logic note where applicable

**OUTPUT FORMAT:**
Survey instrument with: Intro text → Questions numbered with type label (MC/Likert/Open) → Answer options → Skip logic notes → Analysis guide (what to do with each result)

**QUALITY STANDARD:** A researcher reviewing this survey should find zero leading questions, zero ambiguous answer options, and a clear line from each question to a business decision.

**NEGATIVE INSTRUCTIONS:**
- Do NOT include questions that cannot influence a decision
- Do NOT use double-barreled questions ("How satisfied are you with our price and quality?")
- Do NOT ask for demographic data unless it is essential for segmentation
- Do NOT end with a satisfaction score — end with an action or preference question`,
    categorySlug: "market-research",
    tags: ["market-research", "customer-insights", "strategy"],
  }); count++;

  await createPrompt({
    title: "Break-Even Analysis Generator",
    description: "Run a complete break-even analysis for any product or service and translate the numbers into a clear go/no-go recommendation.",
    content: `**PURPOSE:** Perform a thorough break-even analysis and translate the financial results into a clear business decision with scenario modeling.

**ROLE:** You are a financial analyst with a track record of turning raw cost and revenue data into clear, decisive recommendations for business owners who are not accountants.

**CONTEXT:** Break-even analysis tells you the minimum performance required to avoid a loss. But the number alone is meaningless without context — is it realistic given the market? How does it change if costs rise? What is the payback period? This analysis answers all of these.

**INPUTS NEEDED:**
- Product or service name: {product_name}
- Selling price per unit: {price_per_unit}
- Variable cost per unit: {variable_cost}
- Monthly fixed costs: {fixed_costs}
- Expected monthly sales volume: {expected_volume}
- Currency: {currency}

**CONSTRAINTS:**
- Show full formula and calculation — do not just give the result
- Include three scenarios: base case, pessimistic (–20% volume), optimistic (+20% volume)
- Calculate: Break-even units, Break-even revenue, Payback period, Contribution margin ratio
- Translate numbers into plain English interpretation after each calculation
- Provide a go/no-go recommendation with conditions

**OUTPUT FORMAT:**
Assumptions table → Break-even calculation (with formula shown) → Three-scenario comparison table → Contribution margin analysis → Plain English interpretation → Go/No-Go recommendation with stated conditions

**QUALITY STANDARD:** A business owner with no accounting background should be able to understand every number on this page and explain the break-even point to a partner or investor.

**NEGATIVE INSTRUCTIONS:**
- Do NOT present only the break-even number without interpretation
- Do NOT omit the scenario analysis — single-point estimates are misleading
- Do NOT use accounting jargon without immediately defining it
- Do NOT give a recommendation without stating the assumptions it depends on`,
    categorySlug: "financial-analysis",
    tags: ["finance", "strategy", "operations"],
  }); count++;

  await createPrompt({
    title: "Service Pricing Calculator Framework",
    description: "Calculate the correct price for any professional service using a cost-plus, value-based, and market-rate triangulation approach.",
    content: `**PURPOSE:** Develop a defensible pricing structure for a professional service by triangulating cost-based, value-based, and competitive pricing methods.

**ROLE:** You are a pricing strategist who has helped service businesses increase revenue by 20–40% by pricing based on value delivered rather than hours worked — while maintaining competitive positioning.

**CONTEXT:** Most service businesses underprice because they price based on time and costs rather than value delivered to the client. A proper pricing framework considers all three dimensions: what it costs to deliver, what value the client receives, and what the market benchmarks suggest. The intersection produces a defensible price.

**INPUTS NEEDED:**
- Service description: {service_description}
- Direct cost per delivery: {direct_cost}
- Overhead allocation: {overhead}
- Desired profit margin: {target_margin}%
- Time to deliver: {delivery_time}
- Tangible value delivered to client: {client_value}
- Competitor price range: {competitor_range}
- Target client profile: {target_client}

**CONSTRAINTS:**
- Calculate all three pricing methods: cost-plus, value-based, competitive
- Show the calculation for each method
- Recommend a final price with rationale explaining which method to weight most
- Include a tiered pricing option (Basic, Standard, Premium)
- Flag if cost-plus price is higher than market rate — this signals a cost problem, not a pricing problem

**OUTPUT FORMAT:**
Method 1: Cost-Plus Calculation → Method 2: Value-Based Calculation → Method 3: Competitive Benchmark → Price Triangulation Summary → Recommended Price with Rationale → Tiered Pricing Table

**QUALITY STANDARD:** The business owner should be able to quote a price to a client with full confidence, knowing exactly why the number is what it is and being prepared to defend it.

**NEGATIVE INSTRUCTIONS:**
- Do NOT recommend a price based on a single method alone
- Do NOT ignore the client's ability to pay when recommending a final price
- Do NOT build in so little margin that one difficult client project makes the engagement unprofitable
- Do NOT confuse hourly rate with project value — price the outcome, not the time`,
    categorySlug: "financial-analysis",
    tags: ["finance", "strategy", "sme-growth"],
  }); count++;

  await createPrompt({
    title: "Executive Decision Brief",
    description: "Prepare a concise executive decision brief that presents a business problem, analyzes options, and delivers a clear recommendation for leadership review.",
    content: `**PURPOSE:** Produce a structured executive decision brief that presents a business problem clearly, evaluates options objectively, and delivers a defensible recommendation for senior leadership action.

**ROLE:** You are a chief of staff who prepares decision briefs for C-suite executives — your job is to distill complex situations into the essential information needed to make a high-quality decision in under 10 minutes of reading.

**CONTEXT:** Executives are time-constrained. They need enough context to make a sound decision but not so much that they lose the signal in the noise. A good decision brief is ruthlessly edited — every sentence earns its place by advancing the decision.

**INPUTS NEEDED:**
- Decision required: {decision_required}
- Background context: {context}
- Options under consideration: {options}
- Criteria for evaluation: {evaluation_criteria}
- Constraints (budget, time, resources): {constraints}
- Stakeholders affected: {stakeholders}
- Deadline for decision: {decision_deadline}

**CONSTRAINTS:**
- Maximum 600 words for the full brief
- One recommendation only — do not present equal options without a preference
- Lead with the recommendation, not the background
- Include a risk summary for the recommended option
- Use headers and bullets — no dense paragraphs

**OUTPUT FORMAT:**
Decision Brief with: Recommendation (1 sentence) → Decision Required By → Background (3 sentences max) → Options Evaluated (table) → Recommendation Rationale → Key Risks → Next Steps if Approved

**QUALITY STANDARD:** An executive who has never seen this issue before should be able to read this brief, ask two clarifying questions, and make a well-informed decision in one meeting.

**NEGATIVE INSTRUCTIONS:**
- Do NOT bury the recommendation at the end — lead with it
- Do NOT present options without a clear preference
- Do NOT include information that does not change the decision
- Do NOT use passive voice — state who does what and by when`,
    categorySlug: "executive-assistant",
    tags: ["strategy", "operations", "leadership"],
  }); count++;

  await createPrompt({
    title: "Annual Budget Planning Template",
    description: "Build a structured annual budget that aligns spending with strategic priorities and builds in the controls needed to stay on track all year.",
    content: `**PURPOSE:** Create a comprehensive annual budget framework that aligns financial resources with strategic business objectives and builds in monitoring controls.

**ROLE:** You are a CFO-as-a-service consultant who builds annual budgets for growing SMEs — you know that a budget is only useful if it drives decisions, and you design yours to do exactly that.

**CONTEXT:** Most SME budgets are either too detailed (unusable) or too vague (meaningless). A practical budget maps spending to goals, highlights the largest cost drivers, and includes a review cadence. It is a planning tool, not an accounting exercise.

**INPUTS NEEDED:**
- Business name: {business_name}
- Fiscal year: {fiscal_year}
- Revenue target: {revenue_target}
- Current revenue run rate: {current_revenue}
- Key expense categories: {expense_categories}
- Growth initiatives planned: {growth_initiatives}
- Headcount plan: {headcount_plan}
- Currency: {currency}

**CONSTRAINTS:**
- Structure the budget by quarter, not just annual totals
- Separate fixed costs from variable costs in each category
- Include a contingency reserve of 5–10% of total operating expenses
- Flag categories where spending is above industry benchmarks
- Include a one-page budget summary suitable for presenting to stakeholders

**OUTPUT FORMAT:**
Annual Budget Framework: Revenue Plan (quarterly) → Fixed Cost Budget → Variable Cost Budget → Growth Initiative Budget → Headcount Cost Plan → Contingency Reserve → Budget Summary Dashboard → Monthly Review Checklist

**QUALITY STANDARD:** A business owner should be able to look at this budget in February and know exactly whether they are ahead of or behind plan, and what to do about it.

**NEGATIVE INSTRUCTIONS:**
- Do NOT build a budget based on last year's spending without questioning each line
- Do NOT omit the contingency reserve — unexpected costs are not unexpected, they are guaranteed
- Do NOT present only annual totals — quarterly breakdowns reveal seasonality and planning gaps
- Do NOT set a revenue target without a corresponding plan for how to achieve it`,
    categorySlug: "financial-analysis",
    tags: ["finance", "operations", "strategy"],
  }); count++;

  await createPrompt({
    title: "Board Presentation Deck Outline",
    description: "Structure a board presentation that delivers the right information, in the right sequence, to enable confident board-level decisions.",
    content: `**PURPOSE:** Create a structured outline for a board presentation that provides directors with exactly the information they need to govern effectively and make informed decisions.

**ROLE:** You are an experienced CEO who has presented to boards for 15 years and knows exactly what directors want to see: performance against targets, strategic risks, decisions required, and nothing else that wastes their time.

**CONTEXT:** Board presentations fail in two ways: too much operational detail (boards are not managers) or too little strategic context (boards cannot govern blind). The right presentation gives directors a clear view of business health, strategic progress, and the decisions that require their input.

**INPUTS NEEDED:**
- Company name: {company_name}
- Meeting type: {meeting_type} (regular/AGM/special)
- Period covered: {period}
- Key metrics to report: {key_metrics}
- Strategic priorities: {strategic_priorities}
- Decisions requiring board approval: {decisions_required}
- Issues to escalate: {issues_to_escalate}

**CONSTRAINTS:**
- Maximum 15 slides for a 60-minute board meeting
- Each slide must have a single key message stated as a headline
- Financial slides must compare actuals to budget and prior period
- Risk slide must distinguish between new risks and previously flagged risks
- Separate operational information from strategic information

**OUTPUT FORMAT:**
Slide-by-slide outline: Slide number | Title | Key Message | Content description | Presenter notes | Time allocation

**QUALITY STANDARD:** A board member reviewing this presentation should be able to form an informed view on business health and fulfill their governance obligations without needing a separate briefing.

**NEGATIVE INSTRUCTIONS:**
- Do NOT include operational detail that belongs in management reports
- Do NOT present all information equally — lead with what has changed and why
- Do NOT end without a clear list of decisions and approvals being sought
- Do NOT use slides with more than 5 bullet points — boards read, they do not skim`,
    categorySlug: "executive-assistant",
    tags: ["strategy", "leadership", "operations"],
  }); count++;

  // ── BATCH 5 — Sales & Persuasion ─────────────────────────────────────────────

  await createPrompt({
    title: "Discovery Call Script Builder",
    description: "Build a structured discovery call script that uncovers real client pain points and moves qualified prospects toward the next step.",
    content: `**PURPOSE:** Create a consultative discovery call script that uncovers genuine client needs, qualifies the prospect, and advances the sales process without feeling scripted.

**ROLE:** You are a senior sales consultant who has closed hundreds of B2B engagements using a consultative approach — you ask more than you tell, and you help clients articulate the real cost of their current situation.

**CONTEXT:** Discovery calls fail when salespeople pitch too early. The goal is to understand before being understood. A well-structured discovery call leaves the prospect feeling heard and the salesperson with enough information to propose a relevant solution or disqualify the lead.

**INPUTS NEEDED:**
- Your service or product: {service_product}
- Target client profile: {ideal_client}
- Common problems you solve: {problems_solved}
- Competitor alternatives clients use: {alternatives}
- Call duration: {call_duration}
- Next step after call: {next_step}

**CONSTRAINTS:**
- Script must be 70% questions, 30% statements
- Include an open with rapport before any business questions
- Include BANT qualification: Budget, Authority, Need, Timeline
- Include a "consequences" question that surfaces the cost of doing nothing
- End with a clear next step — never leave a call open-ended

**OUTPUT FORMAT:**
Discovery Call Script with: Opening (2 min) → Context questions (5 min) → Pain identification questions (10 min) → Consequence and urgency questions (5 min) → BANT qualification (5 min) → Summary and next step (3 min)

**QUALITY STANDARD:** After the call, the salesperson should be able to complete a one-page opportunity summary covering: pain, urgency, budget, authority, and proposed next step — all from information the client volunteered.

**NEGATIVE INSTRUCTIONS:**
- Do NOT start pitching before the pain is clearly articulated
- Do NOT ask yes/no questions where open questions would get more information
- Do NOT skip the consequences question — it creates urgency without pressure
- Do NOT leave the next step vague — commit to a specific follow-up`,
    categorySlug: "sales-persuasion",
    tags: ["client-management", "strategy", "operations"],
  }); count++;

  await createPrompt({
    title: "Objection Handling Response Bank",
    description: "Build a comprehensive objection handling guide for your most common sales objections, with responses that advance rather than defend.",
    content: `**PURPOSE:** Develop a practical objection handling bank that equips your sales team with confident, non-defensive responses to the most common buyer objections.

**ROLE:** You are a sales trainer who specialises in consultative selling — you teach salespeople to treat objections as requests for more information, not attacks to defend against.

**CONTEXT:** Every objection is a buying signal in disguise. "It's too expensive" means "I don't yet see the value." "I need to think about it" means "I'm not convinced yet." Handling objections well is the difference between a lost deal and a closed one.

**INPUTS NEEDED:**
- Product or service: {service_product}
- Price range: {price_range}
- Common objections heard: {common_objections}
- Top differentiators vs. competitors: {differentiators}
- Proof points (case studies, results): {proof_points}
- Target buyer type: {buyer_type}

**CONSTRAINTS:**
- Address minimum 8 objections
- Each objection response must follow: Acknowledge → Clarify → Respond → Advance
- No defensive or dismissive language in any response
- Include at least one proof point or social proof in responses to price objections
- Each response must end with a question that re-engages the buyer

**OUTPUT FORMAT:**
Objection handling table: Objection | What it really means | Response | Closing question
Followed by a coaching note on body language and tone for each high-stakes objection.

**QUALITY STANDARD:** A new sales hire with no product experience should be able to handle any of these objections confidently after one read-through.

**NEGATIVE INSTRUCTIONS:**
- Do NOT write responses that dismiss the objection ("That's not really an issue")
- Do NOT include generic platitudes ("Great question!")
- Do NOT end a response without re-engaging the buyer
- Do NOT treat all objections the same — price, timing, and authority objections require different approaches`,
    categorySlug: "sales-persuasion",
    tags: ["client-management", "strategy"],
  }); count++;

  await createPrompt({
    title: "Service Proposal Writer",
    description: "Write a professional service proposal that demonstrates understanding of the client's problem and makes a compelling case for your solution.",
    content: `**PURPOSE:** Generate a professional, client-centric service proposal that clearly demonstrates understanding of the client's problem, presents a relevant solution, and makes a persuasive case for engagement.

**ROLE:** You are a business development director who has won multi-year consulting engagements by writing proposals that focus on the client's world, not on the service provider's credentials.

**CONTEXT:** Most proposals lose because they are provider-centric — pages of credentials before addressing the client's problem. Winning proposals lead with the client's situation, demonstrate deep understanding, then introduce the solution as the logical response to what was uncovered in discovery.

**INPUTS NEEDED:**
- Client company: {client_company}
- Client's stated problem: {client_problem}
- Your proposed solution: {proposed_solution}
- Deliverables: {deliverables}
- Timeline: {timeline}
- Investment (price): {price}
- Your company name: {your_company}
- Relevant credentials/case studies: {credentials}

**CONSTRAINTS:**
- Maximum 1,200 words excluding pricing table
- Lead with the client's situation, not your company overview
- Include a clear deliverables table with timelines
- Present pricing as an investment with expected return where possible
- Include one relevant case study or proof point
- End with a clear call to action and decision deadline

**OUTPUT FORMAT:**
Executive Summary → Client Situation and Objective → Our Proposed Approach → Scope of Work and Deliverables → Investment Summary → Why {your_company} → Next Steps

**QUALITY STANDARD:** The client should feel that this proposal was written specifically for them, not adapted from a template — every section should reference their specific situation.

**NEGATIVE INSTRUCTIONS:**
- Do NOT open with a company history paragraph
- Do NOT use vague deliverables ("support and guidance")
- Do NOT present a price without context for the value it delivers
- Do NOT write more than two paragraphs of continuous text — use structure throughout`,
    categorySlug: "sales-persuasion",
    tags: ["client-management", "strategy", "sop"],
  }); count++;

  // ── BATCH 6 — Training & Development ─────────────────────────────────────────

  await createPrompt({
    title: "Employee Training Module Designer",
    description: "Design a complete training module for any business skill, structured for adult learners who need to apply knowledge immediately.",
    content: `**PURPOSE:** Design a structured employee training module that builds a specific skill, uses adult learning principles, and produces measurable behavior change.

**ROLE:** You are an instructional designer who specialises in workplace learning — you know that adults learn by doing, not by watching, and you design training that produces behavior change rather than knowledge accumulation.

**CONTEXT:** Most corporate training fails because it focuses on information transfer rather than skill transfer. Adults are self-directed learners who need to understand the "why" before engaging with the "how." Effective training is scenario-based, immediately applicable, and includes practice opportunities.

**INPUTS NEEDED:**
- Skill to be trained: {skill_name}
- Target learners: {target_audience}
- Current skill level: {current_level}
- Target skill level: {target_level}
- Training format: {format} (in-person/online/blended)
- Available time: {training_duration}
- Tools or systems to use: {tools}

**CONSTRAINTS:**
- Module must include: learning objectives, content, activities, and assessment
- Learning objectives must use action verbs (Bloom's Taxonomy)
- Include at least one scenario-based practice exercise
- Include a knowledge check with minimum passing score
- Total seat time must match {training_duration}

**OUTPUT FORMAT:**
Training Module Structure: Learning Objectives → Pre-work → Content Outline with timing → Practice Activity → Knowledge Check (5 questions) → Application Exercise → Assessment Criteria

**QUALITY STANDARD:** A facilitator with subject matter knowledge but no instructional design background should be able to deliver this module effectively using only these materials.

**NEGATIVE INSTRUCTIONS:**
- Do NOT create a lecture-heavy module — maximum 40% instruction, minimum 60% practice
- Do NOT write objectives that cannot be measured ("understand" and "appreciate" are not measurable)
- Do NOT design assessment questions that test recall only — test application
- Do NOT include content that does not directly support a learning objective`,
    categorySlug: "training-development",
    tags: ["hr-consulting", "performance-management", "systems"],
  }); count++;

  await createPrompt({
    title: "New Employee Onboarding Program",
    description: "Design a 90-day onboarding program that integrates new hires into the team, culture, and role faster than the standard sink-or-swim approach.",
    content: `**PURPOSE:** Create a structured 90-day onboarding program that accelerates time-to-productivity, reduces early turnover, and integrates new employees into the team effectively.

**ROLE:** You are an HR director who has reduced 90-day turnover by 40% by replacing ad-hoc onboarding with a structured, intentional program that makes new hires feel welcomed, informed, and capable.

**CONTEXT:** Most new hire failures are onboarding failures. Employees who receive structured onboarding are 58% more likely to stay for three years. The first 90 days set the foundation for everything — culture, relationships, confidence, and performance expectations.

**INPUTS NEEDED:**
- Job role: {job_role}
- Department: {department}
- Team size: {team_size}
- Key responsibilities in first 90 days: {key_responsibilities}
- Tools and systems to learn: {tools_systems}
- Reporting manager: {manager_name}
- Company culture priorities: {culture_priorities}

**CONSTRAINTS:**
- Structure across three phases: Days 1–30 (Orient), Days 31–60 (Integrate), Days 61–90 (Contribute)
- Each phase must have specific milestones and checkpoints
- Include at least 3 structured check-ins with the manager
- Include a buddy system component
- Include a 30/60/90-day self-assessment for the new hire

**OUTPUT FORMAT:**
90-Day Onboarding Plan: Phase overview → Week-by-week schedule → Manager check-in agenda → Buddy guide → Resources list → 30/60/90-day milestone checklist → Self-assessment template

**QUALITY STANDARD:** A new hire following this plan should reach full productivity 30–40% faster than without it, and feel genuinely welcomed and supported throughout the process.

**NEGATIVE INSTRUCTIONS:**
- Do NOT make Day 1 an administrative marathon — prioritize human connection first
- Do NOT skip the 30-day and 60-day check-ins — problems identified early are fixable
- Do NOT give the new hire information faster than they can absorb it
- Do NOT assume cultural integration happens automatically — it must be designed`,
    categorySlug: "training-development",
    tags: ["hr-consulting", "recruitment", "systems"],
  }); count++;

  // ── BATCH 7 — Leadership & Coaching ──────────────────────────────────────────

  await createPrompt({
    title: "1-on-1 Meeting Framework Builder",
    description: "Design a structured 1-on-1 meeting framework that makes every manager-employee check-in productive, consistent, and relationship-building.",
    content: `**PURPOSE:** Create a structured 1-on-1 meeting framework that makes regular manager-employee conversations genuinely productive and builds the trust needed for performance conversations.

**ROLE:** You are an executive coach who has trained hundreds of managers — you know that most 1-on-1s fail because they become status update meetings instead of the coaching conversations they are designed to be.

**CONTEXT:** 1-on-1 meetings are the highest-leverage management activity. Done well, they surface problems early, accelerate development, build psychological safety, and reduce turnover. Done poorly, they waste time and damage morale. The difference is structure and intent.

**INPUTS NEEDED:**
- Manager name: {manager_name}
- Team member name: {employee_name}
- Role: {employee_role}
- Meeting frequency: {frequency}
- Meeting duration: {duration}
- Current development goals: {dev_goals}
- Current performance level: {performance_level}

**CONSTRAINTS:**
- The meeting must be employee-led (their agenda, their talking points)
- Include a standing agenda structure that takes no more than 5 minutes to prep
- Include coaching questions that the manager can use to go deeper
- Include a section for celebrating wins — not just problems
- Include a notes template that carries over action items to the next meeting

**OUTPUT FORMAT:**
1-on-1 Framework: Purpose statement → Standing agenda (4 sections) → Manager coaching question bank → Employee prep template → Notes and action item template → Red flag signals for managers to watch for

**QUALITY STANDARD:** After implementing this framework for 8 weeks, the employee should report feeling more supported and the manager should be able to identify each direct report's top development priority from memory.

**NEGATIVE INSTRUCTIONS:**
- Do NOT let the manager dominate — this meeting belongs to the employee
- Do NOT use 1-on-1 time for project status updates — that belongs in team meetings
- Do NOT skip the "wins" section — recognition is a fundamental human need
- Do NOT carry over more than 3 action items between meetings — this signals they are not being actioned`,
    categorySlug: "leadership-coaching",
    tags: ["hr-consulting", "performance-management", "leadership"],
  }); count++;

  await createPrompt({
    title: "Difficult Conversation Preparation Guide",
    description: "Prepare for any difficult workplace conversation — performance, conflict, or termination — using a structured approach that produces resolution, not escalation.",
    content: `**PURPOSE:** Prepare a leader or manager to conduct a specific difficult workplace conversation with confidence, clarity, and professionalism — producing resolution rather than conflict escalation.

**ROLE:** You are an executive coach and HR consultant who specialises in helping leaders navigate high-stakes conversations — you know that preparation is what separates conversations that heal from conversations that break.

**CONTEXT:** Difficult conversations are avoided because leaders fear conflict, not because the conversations are actually dangerous. Avoidance always makes the situation worse. The goal is not to be nice or harsh — it is to be clear, honest, and fair. Preparation is the key to achieving all three simultaneously.

**INPUTS NEEDED:**
- Type of conversation: {conversation_type} (performance/conflict/termination/feedback)
- Specific issue to address: {specific_issue}
- Employee name and role: {employee_name_role}
- Previous conversations on this issue: {prior_conversations}
- Desired outcome: {desired_outcome}
- Non-negotiable boundaries: {non_negotiables}
- Your relationship with this person: {relationship_context}

**CONSTRAINTS:**
- Preparation must address: facts, feelings, impact, and desired outcome
- Opening statement must be 2–3 sentences maximum — clear and direct
- Include 3 possible employee responses and how to handle each
- Include language to use if the employee becomes defensive or emotional
- Include a closing that confirms next steps regardless of how the conversation goes

**OUTPUT FORMAT:**
Conversation Prep Sheet: Purpose and desired outcome → Opening statement (written out) → Key facts to state → Impact statement → Listening checkpoint questions → Response scenarios with handling guidance → Closing statement options → Follow-up documentation notes

**QUALITY STANDARD:** A manager using this prep sheet should be able to walk into the conversation composed, stay on topic when it gets difficult, and leave with a clear mutual understanding of next steps.

**NEGATIVE INSTRUCTIONS:**
- Do NOT soften the message so much that the employee misses the point
- Do NOT prepare for only one version of the conversation — prepare for pushback
- Do NOT skip the impact statement — "what" without "why it matters" rarely changes behavior
- Do NOT deliver a difficult message via email — this framework is for in-person or video conversations`,
    categorySlug: "leadership-coaching",
    tags: ["hr-consulting", "employee-relations", "leadership"],
  }); count++;

  // ── BATCH 8 — Email & Business Writing ───────────────────────────────────────

  await createPrompt({
    title: "Professional Email Rewriter",
    description: "Rewrite any email to be clearer, more professional, and more likely to get the response you need — without losing your original intent.",
    content: `**PURPOSE:** Rewrite a draft email so it is clearer, more professional, appropriately toned, and more likely to produce the desired response from the recipient.

**ROLE:** You are an executive communications editor who has polished thousands of professional emails — you know that great business emails are short, specific, and written for the reader, not the writer.

**CONTEXT:** Most business emails fail because they are written from the sender's perspective — they bury the ask, use passive voice, include unnecessary context, or strike the wrong tone. A well-written email respects the reader's time and makes it easy to respond.

**INPUTS NEEDED:**
- Original email draft: {original_email}
- Relationship with recipient: {relationship}
- Desired tone: {tone} (formal/conversational/direct/diplomatic)
- Desired action from recipient: {desired_action}
- Deadline if any: {deadline}

**CONSTRAINTS:**
- Rewritten email must be no longer than the original unless content was missing
- Put the ask or key point in the first two sentences — never at the end
- Remove all filler phrases ("I hope this finds you well," "Please do not hesitate to")
- Use active voice throughout
- Subject line must be specific and action-oriented

**OUTPUT FORMAT:**
Subject line → Rewritten email → Brief explanation of key changes made (3–5 bullet points) → Alternative subject line options

**QUALITY STANDARD:** The rewritten email should be something the sender is proud to send and the recipient can respond to in under 30 seconds of reading.

**NEGATIVE INSTRUCTIONS:**
- Do NOT change the meaning or intent of the original — only the execution
- Do NOT add filler pleasantries that were correctly omitted
- Do NOT make the email longer unless critical information was missing
- Do NOT remove directness in the name of being polite — clarity is professional`,
    categorySlug: "email-writing",
    tags: ["client-management", "operations"],
  }); count++;

  await createPrompt({
    title: "Executive Summary Writer",
    description: "Condense any lengthy document, report, or proposal into a crisp executive summary that gives decision-makers everything they need in one page.",
    content: `**PURPOSE:** Transform any lengthy document, report, or proposal into a concise executive summary that enables decision-makers to understand the key findings and take action without reading the full document.

**ROLE:** You are a chief of staff and communications expert who writes executive summaries for C-suite audiences — you know that every word must earn its place and that the summary exists to serve the reader, not to showcase the author.

**CONTEXT:** Executive summaries are the most-read, least-written part of any business document. Most are too long, too vague, or just a repeat of the introduction. A great executive summary stands completely alone — the reader should be able to make an informed decision without reading anything else.

**INPUTS NEEDED:**
- Source document title: {document_title}
- Source document content or key points: {document_content}
- Target audience: {audience}
- Primary decision or action required: {action_required}
- Key findings or recommendations: {key_findings}
- Context for the document: {context}

**CONSTRAINTS:**
- Maximum 400 words for the executive summary
- Must include: context (2 sentences), key findings (3–5 bullets), recommendation (1 sentence), next steps (2–3 bullets)
- Written at the level of someone who has NOT read the source document
- Lead with the conclusion, not the methodology
- Use plain language — no jargon without definition

**OUTPUT FORMAT:**
Executive Summary: [Document Title] — [Date] → Context → Key Findings → Recommendation → Next Steps → Prepared for: [Audience]

**QUALITY STANDARD:** An executive who reads only this summary should be able to brief another person accurately on the document's contents, conclusions, and recommended actions.

**NEGATIVE INSTRUCTIONS:**
- Do NOT mirror the structure of the source document — structure around insights, not sections
- Do NOT include methodology or process details unless they affect the recommendation
- Do NOT write "this document explores" — state what was found
- Do NOT pad the summary to fill a page — if it takes 200 words, stop at 200 words`,
    categorySlug: "email-writing",
    tags: ["operations", "strategy", "leadership"],
  }); count++;

  await createPrompt({
    title: "Business Report Structure Builder",
    description: "Build a professionally structured business report on any topic — with the right sections, the right depth, and the right tone for your audience.",
    content: `**PURPOSE:** Generate a complete structural framework for a professional business report that organises information logically, serves the intended audience, and supports the required decision or action.

**ROLE:** You are a senior business analyst who writes reports for executive, board, and operational audiences — you know that structure determines whether a report gets read and acted on, and you design structure around the reader's needs, not the writer's convenience.

**CONTEXT:** Most business reports fail because they are organised by the author's thought process rather than the reader's information needs. A report that buries the recommendation on page 12 has failed. The structure must guide the reader from problem to conclusion with maximum efficiency.

**INPUTS NEEDED:**
- Report title: {report_title}
- Report purpose: {report_purpose}
- Target audience: {target_audience}
- Key findings to include: {key_findings}
- Recommendation to be made: {recommendation}
- Data available: {data_available}
- Report length target: {length_target}

**CONSTRAINTS:**
- Lead with the executive summary and recommendation — not the introduction
- Every section must earn its place — include a sentence explaining what decisions each section enables
- Use numbered headings for navigation
- Include a data visualisation note for each quantitative section
- End with explicit next steps and owner assignments

**OUTPUT FORMAT:**
Report skeleton with: Cover page elements → Executive Summary structure → Table of Contents → Section-by-section outline with purpose statements → Data visualisation recommendations → Appendix guidelines → Distribution list guidance

**QUALITY STANDARD:** A junior analyst given this structure should be able to produce a report that reads as if it was written by a senior analyst — the structure does the strategic thinking, leaving the analyst to fill in the evidence.

**NEGATIVE INSTRUCTIONS:**
- Do NOT put the background before the findings — executives need conclusions first
- Do NOT create sections that do not serve a specific audience need
- Do NOT use report writing as an opportunity to demonstrate research volume — edit ruthlessly
- Do NOT end a section without a clear takeaway or link to the recommendation`,
    categorySlug: "email-writing",
    tags: ["operations", "strategy", "sop"],
  }); count++;

  console.log(`✓ Created ${count} structured prompts`);
  console.log("\n🎉 Excelsior Prompt Library v2 seeded successfully!");
  console.log("─────────────────────────────────────────────────");
  console.log(`   Admin:      excelsiorconsultancys@gmail.com`);
  console.log(`   Password:   [set via ADMIN_SEED_PASSWORD env var]`);
  console.log(`   Categories: ${categoryData.length}`);
  console.log(`   Prompts:    ${count}`);
  console.log(`   Framework:  8-part structure (Purpose → Role → Context → Inputs → Constraints → Output Format → Quality Standard → Negative Instructions)`);
  console.log(`   Variables:  All prompts use {variable_name} syntax — fill in and deploy`);
  console.log(`   Chains:     5-Step HR Problem Solver chain included`);
  console.log(`   Expert Mode: Flagged prompts use advanced critical reasoning`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
