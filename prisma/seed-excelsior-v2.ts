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
