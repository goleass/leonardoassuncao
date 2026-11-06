# Clarity Analytics Validation

**Date**: 2026-11-06
**Spec**: `.specs/features/clarity-analytics/spec.md`
**Diff range**: `6de0635..4996519` (fix→re-verify iteration 3 of 3). All `file:line` citations refer to `4996519`.
**Verifier**: independent sub-agent (author ≠ verifier)

**Verdict: FAIL ❌**

The required list is fully killed, 36/36, including all four iteration 2 survivors (X4, X5, X11, X12). The FAIL comes only from 3 mutants added in this iteration. Each survived and each maps to an AC: N1 to CLAR-03, N2 to CLAR-05 and CLAR-06, N3 to CLAR-01.

All three are test gaps. No shipped fault was found: the code handles each case correctly where it could be checked directly (see One-off checks). This was the last iteration, so the decision goes to the owner; see "Decision for the owner".

---

## Task Completion

The feature has no `tasks.md`; commits stand in for tasks.

| Commit | Scope | Status |
| ------ | ----- | ------ |
| `c60b28a` | CSP and COEP in `netlify.toml` and `headers.ts` | ✅ Done |
| `21a3967` | `clarity.ts`, `BaseLayout`, form mask | ✅ Done |
| `3cf5081` | `/privacidade` | ✅ Done |
| `242eabb` | CLAR-13 browser test, tag assertion for CLAR-12 | ✅ Done |
| `ac589f8` | Cookie text and CLAR-14 | ✅ Done |
| `4996519` | Tests only: X4, X5, X11, X12 | ✅ Done, confirmed test-only (`git diff --stat 5b8d21c..4996519` lists 3 test files) |

---

## Spec-Anchored Acceptance Criteria

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| CLAR-01 | `<script async>` for `https://www.clarity.ms/tag/z96a82cx1w` when a page opens on the official host | `src/scripts/clarity.test.ts:26` `toEqual([TAG])`, with `TAG` at `:8`; `:27` `.async` `toBe(true)`. Wiring: `tests/browser/csp.test.ts:224` on `/`; `:232` `arrayContaining([TAG, LOADER])` on a guide (path at `:230`) | ⚠️ Partial: 2 of 24 pages are exercised, survivor N3 (G3) |
| CLAR-02 | Queue exists before the tag; calls kept in `clarity.q` | `clarity.test.ts:33` `typeof win.clarity` is `"function"` inside the `append` mock; `:36` `toHaveBeenCalledOnce()`; `:39` `q` `toEqual` both calls | ✅ |
| CLAR-03 | Any other host: no `window.clarity`, no request | `clarity.test.ts:68` `toBeUndefined()`; `:69` `scripts()` `toEqual([])`, over the 7 hosts at `:56-62`. Browser: `tests/browser/csp.test.ts:67` + `:115`, no other-origin request on `127.0.0.1` | ⚠️ Partial: no host with the official host as a suffix, survivor N1 (G1) |
| CLAR-04 | External module; no executable inline `<script>` on any page | `tests/build/inline-scripts.test.ts:64` `inlineScriptPages(built)` `toEqual([])`; `src/layouts/BaseLayout.test.ts:210` | ✅ |
| CLAR-05 | The three directives exactly; no `'unsafe-inline'` or `'unsafe-eval'` in script-src; every response | Value: `tests/netlify-config.test.ts:64` exact `toBe`; `:91` exact list; `:92-93` `not.toContain`. Static responses: `:37` `for = "/*"` first; `:41` no override. Function responses: `src/lib/security/headers.test.ts:7` toml equals `SECURITY_HEADERS`; `:16` tests the helper only | ⚠️ Partial: nothing asserts that `src/middleware.ts:5` applies the helper, survivor N2 (G2) |
| CLAR-06 | `Cross-Origin-Embedder-Policy: credentialless` on every response | `tests/netlify-config.test.ts:50,53` `toBe("credentialless")`; `headers.test.ts:7,16` | ⚠️ Partial: same as CLAR-05, survivor N2 (G2) |
| CLAR-07 | Tag, `clarity.js`, `c.gif` and the send load with no CSP violation or COEP block, without CORP | CSP: `tests/browser/csp.test.ts:223` `violations` `toEqual([])`; `:224` all 4 URLs finished; `:225` `__clarityRan` `toBe(true)`; control `:238-239`. COEP: `:284` published value loads a CORP-less script; control `:288` | ✅ With a scope limit, see A1 |
| CLAR-08 | Contact form has `data-clarity-mask="true"` | `src/components/Contact.test.ts:18` `toBe("true")`; `:142` | ✅ |
| CLAR-09 | A section "Análise de navegação" that names Clarity, the data, `_clck` and `_clsk` as examples, how to block them, and the purpose | `src/pages/_privacidade.test.ts:57` heading `toBe`; `:59-63` `toContain` for each item, read from `analysisSection()` (`:46-54`), which stops at the next `<h2>` | ✅ |
| CLAR-10 | Form field content is masked in recordings | `_privacidade.test.ts:72` exact sentence, in the section | ✅ |
| CLAR-11 | Intro no longer limited to the form; cites the analysis | `_privacidade.test.ts:76` `.legal__lead` `toContain("dados da análise de navegação")` | ✅ |
| CLAR-12 | Existing function kept, and the tag still loads | `clarity.test.ts:49` `toBe(existing)`; `:50` `toEqual([TAG])` | ✅ |
| CLAR-13 | Tag fails: content and entry animations remain, no `pageerror` | `tests/browser/csp.test.ts:245` tag did not finish; `:246` one `main h1`; `:247` `.reveal` count above 0; `:248` `hiddenReveals` `toEqual([])`; `:249` `pageErrors` `toEqual([])`. Failure is injected at `:199-200` | ✅ |
| CLAR-14 | Depending on the browser, Microsoft may also use its own cookies, including for advertising | `_privacidade.test.ts:68` exact sentence, in the section | ✅ |

**Status**: ❌ Gaps present. 10/14 ACs fully match the spec outcome, 4 are partial (CLAR-01, 03, 05, 06), and there are 0 spec-precision gaps. CLAR-09 moved from gap to ✅. CLAR-01 and CLAR-03 stay partial, for new reasons.

**Correction to iteration 2.** That report marked CLAR-05 and CLAR-06 ✅ and cited `headers.test.ts:16` as "applied to function responses". That line calls `withSecurityHeaders` directly, so it proves the helper works, not that responses go through it.

---

## Edge Cases

- [x] **CLAR-13, tag fails.** Discriminating test; M20, M20b and X14 are killed.
- [x] **CLAR-12, `window.clarity` already exists.** Covered, including the tag; M3 and M21 are killed.

**One-off checks at `4996519` (not tests):**

| Check | Result |
| ----- | ------ |
| Clean build: pages whose external scripts reach the Clarity tag URL, following imports | 24/24 |
| Clean build: pages with a `<form>` / pages with `data-clarity-mask="true"` | 21 / 21. `Contact.astro` is the only `.astro` file with a form |
| Local two-server probe, `credentialless`: CORP-less image / cross-origin `fetch` | loaded / succeeded |
| Local two-server probe, `require-corp` control: CORP-less image / cross-origin `fetch` | blocked / succeeded |
| Reading `src/scripts/clarity.ts:9` | Strict `!==`, so N1's fault is absent |
| Reading `src/middleware.ts:5` | Wraps every response in `withSecurityHeaders`, so N2's fault is absent. The running function's responses were not observed |
| Reading `src/layouts/BaseLayout.astro:89` | Unconditional call, so N3's fault is absent |

---

## Discrimination Sensor

Scratch: a temporary detached `git worktree` at `4996519` under the session scratchpad (`iter3/wt`), with `node_modules` symlinked and the tree reset between mutants. The script is the iteration 2 sensor, unchanged except for the added N mutants. `npm test` ran for every mutant. Layout, header and failure mutants also ran `npm run build && npm run test:browser`; X10 and N2 also ran `npm run build && npm run test:build`.

**`npm test` only, to keep the browser suite from contacting clarity.ms:** M1, M2, X3, X4, X5 and N1. They change the host check or the tag URL. Every browser mutant keeps both, so the tag, loader, pixel and send are routed to local stand-ins (`tests/browser/csp.test.ts:198-215`). This is by reasoning from the routes; network traffic was not captured. `real-clarity.cjs` and `prod-clarity.cjs` were not run, and no request was made on purpose to clarity.ms or to the production site.

### Required list (iteration 2 list)

| # | File | Mutation | Killed? (failing test) |
| - | ---- | -------- | ---------------------- |
| M1 | `src/scripts/clarity.ts:9` | Host check removed | ✅ `clarity.test.ts:68`, 7 hosts |
| M2 | `clarity.ts:3` | Wrong project id | ✅ `clarity.test.ts:26`, `:50` |
| M3 | `clarity.ts:13` | Replaces an existing `window.clarity` | ✅ `clarity.test.ts:49` |
| M4 | `clarity.ts:15` | `async` dropped | ✅ `clarity.test.ts:27` |
| M5 | `src/components/Contact.astro:55` | `data-clarity-mask` removed | ✅ `Contact.test.ts:18`, `:142` |
| M6 | `src/layouts/BaseLayout.astro:89` | `initClarity` call removed | ✅ Browser only: `csp.test.ts:224`, `:232`, `:239` |
| M7a | `netlify.toml:28` | img-src without `*.clarity.ms` | ✅ `netlify-config.test.ts:64`, `headers.test.ts:7`, `csp.test.ts:223`, `:231` |
| M7b | `netlify.toml:28` | img-src without `c.bing.com` | ✅ `netlify-config.test.ts:64`, `headers.test.ts:7`. Browser passes |
| M7c | `netlify.toml:28` | connect-src without `*.clarity.ms` | ✅ `netlify-config.test.ts:64`, `headers.test.ts:7`, `csp.test.ts:223`, `:231` |
| M7d | `netlify.toml:28` | connect-src without `c.bing.com` | ✅ `netlify-config.test.ts:64`, `headers.test.ts:7`. Browser passes |
| M8a–d | `src/lib/security/headers.ts:13` | The same four removals | ✅ All 4 by `headers.test.ts:7`. Browser passes, since it reads the toml |
| M9a | `netlify.toml:26` | COEP `require-corp` | ✅ `netlify-config.test.ts:53`, `headers.test.ts:7`, `csp.test.ts:284` |
| M9b | `headers.ts:10` | COEP `require-corp` | ✅ `headers.test.ts:7`. Browser passes |
| M10 | `src/pages/privacidade.astro:44-56` | Section removed | ✅ `_privacidade.test.ts:57`, `:68`, `:72` |
| M11 | `privacidade.astro:50` | Masking sentence removed | ✅ `_privacidade.test.ts:72` |
| M12 | `privacidade.astro:51-52` | CLAR-14 sentence removed | ✅ `_privacidade.test.ts:68` |
| M20 | `clarity.ts:17` | `onerror` throws | ✅ `csp.test.ts:249`. `npm test` also exits 1 on an unhandled error, with 702/702 assertions passing |
| M20b | `clarity.ts:17` | `onerror` empties `document.body` | ✅ Browser only: `csp.test.ts:246` |
| M21 | `clarity.ts:13` | No tag when `window.clarity` exists | ✅ `clarity.test.ts:50` |
| X1 | `clarity.ts:13,17` | Tag appended before the queue | ✅ `clarity.test.ts:33` |
| X2 | `clarity.ts:11` | Queue drops the calls | ✅ `clarity.test.ts:39` |
| X3 | `clarity.ts:9` | Host check `endsWith` the apex | ✅ `clarity.test.ts:68`, 2 hosts |
| X4 | `clarity.ts:9` | Host check `endsWith(".leonardoassuncao.com.br")` (iteration 2 survivor) | ✅ `clarity.test.ts:68`, 1 host |
| X5 | `clarity.ts:9` | Host check `startsWith(HOST)` (iteration 2 survivor) | ✅ `clarity.test.ts:68`, 1 host |
| X6 | `privacidade.astro:19-20` | Intro limited to the form | ✅ `_privacidade.test.ts:76` |
| X7 | `netlify.toml:28` | script-src gains `'unsafe-inline'` | ✅ `netlify-config.test.ts:64`, `:91`, `headers.test.ts:7`. Browser passes |
| X8 | `netlify.toml:28` | script-src without `scripts.clarity.ms` | ✅ `netlify-config.test.ts:64`, `:91`, `headers.test.ts:7`, `csp.test.ts:223`, `:231` |
| X9 | `netlify.toml:28` | script-src without `www.clarity.ms` | ✅ `netlify-config.test.ts:64`, `:91`, `headers.test.ts:7`, `csp.test.ts:223`, `:231` |
| X10 | `BaseLayout.astro:83` | Inline `<script>` added | ✅ `BaseLayout.test.ts:210`, `guias/_index.test.ts:132`, `guias/_slug.test.ts:163`, `inline-scripts.test.ts:64` |
| X11 | `BaseLayout.astro:89` | `initClarity` only when `location.pathname === "/"` (iteration 2 survivor) | ✅ Browser only: `csp.test.ts:232` |
| X12 | `privacidade.astro:44` | Section heading moved below both paragraphs (iteration 2 survivor) | ✅ `_privacidade.test.ts:59`, `:68`, `:72` |
| X13 | `privacidade.astro:52-53` | Blocking instruction removed | ✅ `_privacidade.test.ts:62` |
| X14 | `clarity.ts:17` | `onerror` sets `hidden` on `main` | ✅ Browser only: `csp.test.ts:248` |

### Added in iteration 3

| # | File | Mutation | Maps to | Killed? (failing test) |
| - | ---- | -------- | ------- | ---------------------- |
| N1 | `clarity.ts:9` | Host check `endsWith(HOST)`, so `foo.www.leonardoassuncao.com.br` passes | CLAR-03 | ❌ Survived, `npm test` 702/702 → G1 |
| N2 | `src/middleware.ts:5` | Middleware returns `await next()`, without the security headers | CLAR-05, CLAR-06 ("toda resposta") | ❌ Survived: `npm test` 702/702, `test:build` 120/120, `test:browser` 15/15 → G2 |
| N3 | `BaseLayout.astro:89` | No `initClarity` on `/privacidade/` | CLAR-01 | ❌ Survived: `npm test` 702/702, `test:browser` 15/15 → G3 |
| N4 | `BaseLayout.astro:89` | No `initClarity` on `/guias/*` | CLAR-01 | ✅ Browser only: `csp.test.ts:232` |
| N5 | `privacidade.astro:51` | `_clsk` dropped | CLAR-09 | ✅ `_privacidade.test.ts:61` |
| N6 | `privacidade.astro:46` | Purpose dropped | CLAR-09 | ✅ `_privacidade.test.ts:63` |
| N7 | `privacidade.astro:49` | `<h2>` inserted inside the section, moving the second paragraph out | CLAR-09, 10, 14 | ✅ `_privacidade.test.ts:61`, `:68`, `:72` |

**Sensor depth**: expanded beyond lightweight (43 mutations), all faults injected by hand.
**Result**: required list 36/36 killed; added list 4/7 killed; total 40/43 killed, 3 survived. FAIL ❌

**Isolation.** The sensor ran only in the scratch worktree, which was removed and pruned afterward. Before the report and lessons were written, the real tree's `git status --porcelain` and `git diff` were byte-identical to the baseline taken before the sensor. `git stash` was not used, and the other worktree (`leonardoassuncao-guias`) was not touched. The symlink means build tools could write ignored caches into the real `node_modules`; that was not inspected.

---

## Code Quality

| Check | Status |
| ----- | ------ |
| Minimum code: `clarity.ts` is 18 lines, no new dependency | ✅ |
| Surgical changes: `4996519` touches only the 3 test files needed | ✅ |
| Matches patterns: external module, parity test between toml and `headers.ts`, AD-005 respected | ✅ |
| Spec-anchored outcomes: exact CSP string, project id and policy sentences | ✅ |
| Per-layer coverage | ⚠️ G1, G2, G3 |
| Every test maps to a requirement | ⚠️ `_privacidade.test.ts:64` (Microsoft link sentence) has no AC, which is harmless |
| Test integrity: no test removed; the policy assertions got stricter; the host list grew | ✅ |
| Guidelines: `.specs` spec, AD-005, AD-006 | ✅ |

The doc comment at `tests/browser/csp.test.ts:175` still says `openOfficial` opens the home page, but it now takes a path. This is cosmetic.

Consent is a recorded decision (AD-006) and is not treated as a gap.

---

## Interactive UAT

Not performed. The owner's check in the Clarity panel is in A5.

---

## Gate Check

- **Command**: `npm run check && npm test && npm run build && npm run test:build`, then `npm run build && npm run test:browser`. With no `tasks.md`, this follows earlier iterations and the header of `tests/browser/csp.test.ts`. Run in the scratch worktree at `4996519`, all exit 0.
- `astro check`: exit 0
- `npm test`: 702 passed, 0 failed, 0 skipped (iteration 2: 700)
- `npm run test:build`: 120 passed (unchanged)
- `npm run test:browser`: 15 passed (iteration 2: 14)

---

## Gaps

**G1 (CLAR-03; survivor N1).** The host list at `clarity.test.ts:56-62` now covers a sibling subdomain and a prefix lookalike, but no host that ends with the official host. A check using `endsWith(HOST)` would run the Clarity tag on `foo.www.leonardoassuncao.com.br`. Risk is low, because only the owner can create such a host, but the spec says "qualquer outro host". `clarity.ts:9` uses strict `!==`, which is correct.

**G2 (CLAR-05, CLAR-06; survivor N2).** No test connects the middleware to the helper. If `src/middleware.ts:5` stopped applying the headers, the 404 and `/api/contato` responses from the function would lose the CSP and COEP, and every suite would stay green. The browser suite serves `dist/` with a local server (`tests/browser/csp.test.ts:34-43`), so it never runs the middleware. This code predates the feature and is outside the diff, but the ACs say "toda resposta".

**G3 (CLAR-01; survivor N3).** The browser suite loads the tag on `/` and on one guide (`csp.test.ts:216`, `:230`), so a page-specific exclusion elsewhere goes unnoticed. The one-off build scan shows 24/24 pages today. Only checking every page closes this, since any sample leaves other pages open to the same fault.

## Fix Plans

### Fix 1: Add a suffix host (Minor)

- **Task**: add `foo.www.leonardoassuncao.com.br` to the `it.each` at `clarity.test.ts:55`.
- **Done when**: N1 fails. One line.

### Fix 2: Test the middleware (Minor)

- **Task**: add a test that calls `onRequest` from `src/middleware.ts` with a `next` that returns a plain response, then asserts the CSP and COEP values on the result. `astro:middleware` may need a mock; this was not tried.
- **Done when**: N2 fails.

### Fix 3: Check every page (Minor)

- **Task**: in `tests/browser/csp.test.ts`, run the tag assertion over all built pages, reusing the list of 24 from `tests/build/inline-scripts.test.ts`. This adds a page load per page to the browser suite.
- **Done when**: N3 fails.
- **Alternative**: the owner accepts sampling here, given `BaseLayout.astro:89` is unconditional and shared by every page, and records that choice.

---

## Decision for the owner

The fix→re-verify limit is reached. The three iterations have followed a pattern: each round closes the listed survivors, and a fresh verifier's added mutants then find new near-misses. This round's survivors are narrower than the earlier ones, and none reflects a known fault. The options are:

1. **Fix G1 and G2, accept G3.** This closes the two cheap gaps and leaves page-level sampling as a recorded limit. It is the Verifier's recommendation; G2 is the most useful of the three because it protects existing security headers.
2. **Fix all three**, then re-verify against this list.
3. **Accept all three as they are**, with the choice recorded. Since `ac589f8` is already in `origin/main`, the feature code is there either way. `4996519` is test-only and is not in `main` or `origin/main`.

---

## Advisories (non-blocking)

- **A1 (CLAR-07, automated scope).** The repo's COEP test uses a stand-in script on local servers (`csp.test.ts:256-280`), and `route.fulfill` bypasses COEP (comment at `:254`). `c.gif` and the send under COEP therefore have no test in the repo. The local probe above covers a CORP-less image and a `fetch` under both COEP values. A real run against production (Chromium, `/` and one guide: tag and `clarity.js` 200, collect 204, no CSP violations) is **author-reported**. The Verifier did not observe it or rerun it. Spec Success Criterion 1 rests on that same run.
- **A2 (browser-only kills, no CI).** Only `test:browser` kills M6, M20b, X11, X14 and N4, and the repo has no `.github/` folder, so nothing runs that suite automatically.
- **A3 (policy wording, no AC).** The "Finalidade" section says the data is not "compartilhados para marketing nem usados para outros fins" (`privacidade.astro:33-34`). In context it refers to form data, but its heading is generic, and the page also mentions Microsoft cookies "inclusive para publicidade" (`:51-52`). "Seus direitos" (`:60`) covers only data in the mailbox. These are the owner's call to review.
- **A4 (traceability).** `spec.md:91-104` still says "Implementing". The Verifier does not edit spec files.
- **A5 (post-deploy).** Spec Success Criterion 2, visits showing in the Clarity panel, needs the owner's confirmation after deploy. Whether Netlify has deployed was not checked.
- **A6 (branch state).** From local refs, without fetching: `main` is `5b8d21c`, `origin/main` is `ac181c1` and contains `ac589f8`. Only `test/clarity-validation-iter3` has `4996519`.

---

## Requirement Traceability Update

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| CLAR-02, 04, 07, 08, 09, 10, 11, 12, 13, 14 | Implementing | ✅ Verified (CLAR-07 with A1) |
| CLAR-01, 03, 05, 06 | Implementing | ❌ Needs test fix or owner acceptance |

---

## Summary

**Overall**: ❌ Not Ready by the validation rules. No shipped fault was found; the open items are 3 test gaps and an owner decision.
**Spec-anchored check**: 10/14 ACs matched the spec outcome, 4 partial, 0 spec-precision gaps
**Sensor**: 40/43 killed (required 36/36; added 4/7); survivors N1, N2, N3
**Gate**: 702 + 120 + 15 passed, `astro check` clean
**Next steps**: escalate to the owner with the options above. The owner may also want to review A3.
