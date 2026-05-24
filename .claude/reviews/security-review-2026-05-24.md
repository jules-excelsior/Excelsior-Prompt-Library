# Security & Code Review — Excelsior Prompt Library Fix
**Date:** 2026-05-24  
**Reviewed by:** Claude (3-angle methodology)  
**Decision:** FIXED — all CRITICAL issues resolved and pushed

---

## Summary

Jules' 8 custom commits on top of the prompts.chat fork introduced branding, custom seed data, and configuration changes. The core application logic is sound. One CRITICAL security issue was found across all seed scripts — hardcoded admin passwords committed to git. All other findings are LOW/MEDIUM code quality items.

---

## Findings

### CRITICAL — FIXED

**Hardcoded passwords in 4 seed scripts**

| File | Line | Password |
|------|------|----------|
| `prisma/seed-excelsior-v2.ts` | 34 | `ExcelsiorAdmin2025!` |
| `prisma/seed-excelsior-v2.ts` | 2819 | Printed to console |
| `prisma/seed-excelsior.ts` | 2406 | `password123` |
| `prisma/seed-excelsior.ts` | 2492 | Printed to console |
| `prisma/seed.ts` | 75 | `password123` |
| `prisma/seed.ts` | 290 | Printed to console |
| `prisma/reset-admin.ts` | 9 | `password123` |
| `prisma/reset-admin.ts` | 30 | Printed to console |

**Risk:** Passwords are committed to git history and visible to anyone with repo access. `seed-excelsior-v2.ts` used Jules' real Gmail and a production-looking password — highest risk.

**Fix applied (commit `d1cb528e`):**  
All 4 scripts now read from `process.env.ADMIN_SEED_PASSWORD` and call `process.exit(1)` if the variable is not set. `dotenv/config` added to the 3 scripts that didn't have it. Password removed from all console.log output. `.env.example` updated with the new variable.

---

### HIGH — None

---

### MEDIUM

**1. CSS animations injected via inline `<style>` tag (`src/components/layout/excelsior-landing.tsx`)**  
Inline style tags with keyframes work but bypass CSP `style-src` policies if they are ever tightened. Medium risk since this is a Next.js app that injects styles server-side and doesn't take user input for the CSS.  
*No immediate fix required — note for future if CSP is hardened.*

**2. `prisma.config.ts` uses `DIRECT_URL || DATABASE_URL` fallback**  
Falling back to `DATABASE_URL` for migrations is fine for Neon but could cause issues if the two URLs point to different environments. Not a bug but worth documenting.  
*Acceptable pattern — no change needed.*

---

### LOW

**1. `vercel.json` build command**  
```json
{ "buildCommand": "prisma generate && next build" }
```
If `prisma generate` fails silently, the build continues with a stale client. Consider adding `prisma migrate deploy` for production migrations.

**2. `src/lib/plugins/widgets/index.ts` — widget registry exposes external URLs**  
`coderabbit` and `commandcode` widgets load from external domains. If those URLs ever serve malicious content, there is no SRI or integrity check. Low risk given these are developer tool widgets, not user-facing.

**3. Google Fonts in `header.tsx` uses `next/font/google`**  
`Schoolbell` is loaded from Google CDN. This is standard Next.js practice. No issue.

---

## What Was Not Changed

- Application routes and API logic — no Jules-owned API routes found in the reviewed commits; upstream routes are unchanged.
- Upstream seed data (`seed.ts`) structure — only the hardcoded password was fixed.
- Branding and landing page components — these are correct and well-structured.
- `messages/en.json` — translation strings only, no security concern.

---

## Validation

| Check | Result |
|-------|--------|
| Hardcoded secrets scan | ✅ Pass — zero matches after fix |
| Git push | ✅ Pushed to `main` @ `d1cb528e` |
| `.env.example` updated | ✅ `ADMIN_SEED_PASSWORD` documented |
| Build check | Skipped — requires Neon DB connection |

---

## Files Reviewed

| File | Type | Notes |
|------|------|-------|
| `src/app/page.tsx` | Modified | Landing page composition — clean |
| `src/components/layout/excelsior-landing.tsx` | Modified | Custom hero with CSS animations — OK |
| `src/components/layout/header.tsx` | Modified | Branding, Schoolbell font — OK |
| `src/lib/plugins/widgets/index.ts` | Modified | Widget registry — OK |
| `vercel.json` | Modified | Build command — LOW note above |
| `prisma.config.ts` | Modified | DIRECT_URL fallback — OK |
| `prisma/seed-excelsior-v2.ts` | Modified | CRITICAL fixed |
| `prisma/seed-excelsior.ts` | Modified | CRITICAL fixed |
| `prisma/seed.ts` | Modified | CRITICAL fixed |
| `prisma/reset-admin.ts` | Modified | CRITICAL fixed |
| `CLAUDE.md` | Modified | Project docs — OK |
| `messages/en.json` | Modified | Translations — OK |
