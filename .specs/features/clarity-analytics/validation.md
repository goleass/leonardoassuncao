# Clarity Analytics Validation

**Date**: 2026-11-06
**Spec**: `.specs/features/clarity-analytics/spec.md`
**Diff range**: `4996519..0c4716a`, checked at `ab1a25f`. All `file:line` citations refer to `ab1a25f`.
**Verifier**: independent sub-agent (author ≠ verifier)

**Verdict: PASS ✅**

**This is a focused closure check, not a fourth full round.** Iteration 3 ended with survivors N1, N2 and N3. The owner chose to fix G1 and G2, accept G3, and re-check only what changed. The gate is green and all 6 listed mutants were killed. No exploratory mutants were added, so this verdict does not repeat iteration 3's wider sensor.

**Accepted residual.** G3 (survivor N3, CLAR-01) stays open by the owner's decision, recorded at `spec.md:34`. See "Owner-accepted residual".

**The repository moved during this check.** While the check ran, `main` received this branch's work and was pushed, so the feature was merged before this verdict existed. The verified code matches what is on `main`. See "Isolation".

---

## Task Completion

The feature has no `tasks.md`; commits stand in for tasks.

| Commit | Scope | Status |
| ------ | ----- | ------ |
| `f04dd9d` | G1: suffix host in `clarity.test.ts`. G2: new `src/middleware.test.ts`. G3 recorded in the spec | ✅ Done, test and spec files only |
| `0c4716a` | CLAR-15 and CLAR-16: spec, `privacidade.astro`, `_privacidade.test.ts` | ✅ Done |

---

## Spec-Anchored Acceptance Criteria

### Checked in this round

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| CLAR-03 | Any other host: no `window.clarity`, no request to Clarity | `src/scripts/clarity.test.ts:69` `expect(win.clarity).toBeUndefined()`; `:70` `expect(scripts()).toEqual([])`, over the 8 hosts at `:56-63`, now including `foo.www.leonardoassuncao.com.br` at `:62`. Browser, unchanged: `tests/browser/csp.test.ts:67`, `:115` | ✅ G1 closed |
| CLAR-05 | The three directives exactly; no `'unsafe-inline'` or `'unsafe-eval'` in script-src; every response | Function responses: `src/middleware.test.ts:11` `toContain("script-src 'self' https://www.clarity.ms https://scripts.clarity.ms;")`, `:12` `toContain("img-src 'self' data: https://*.clarity.ms https://c.bing.com;")`, `:13` `toContain("connect-src 'self' https://*.clarity.ms https://c.bing.com;")`. All three match `spec.md:54`. Status and body kept: `:7-8`. Exact value and absences: `tests/netlify-config.test.ts:64`, `:91-93`; parity with the helper: `src/lib/security/headers.test.ts:7` | ✅ G2 closed, see A7 |
| CLAR-06 | `Cross-Origin-Embedder-Policy: credentialless` on every response | `src/middleware.test.ts:9` `toBe("credentialless")`, matching `spec.md:55`. Static responses: `tests/netlify-config.test.ts:50`, `:53` | ✅ G2 closed, see A7 |
| CLAR-15 | The promise not to share data is restricted to a section titled "Finalidade dos dados do formulário" | `src/pages/_privacidade.test.ts:77` `toBe("Finalidade dos dados do formulário")`, the exact title from `spec.md:76`; `:78` `heading.nextElementSibling` `toContain("não são vendidos, compartilhados para marketing")`. Page: `src/pages/privacidade.astro:31-35` | ✅ See A8 |
| CLAR-16 | "Seus direitos" says browsing-analysis data stays with Microsoft, and points to the site's e-mail and Microsoft's policy | `_privacidade.test.ts:83` `toBe` on the full sentence; `:86` the second previous sibling is `toBe("Seus direitos")`. Page: `privacidade.astro:58-66` | ✅ See A9 |
| CLAR-04 | External module; no executable inline `<script>` on any page | Rechecked because the merge changed its test file. `tests/build/inline-scripts.test.ts:51` `inlineScriptPages(built)` `toEqual([])` still scans every built `.html`; control at `:60`. The merge only replaced the hand-written guide list behind `:47` with `PUBLISHED_GUIDES`, which is not a weaker check. `src/layouts/BaseLayout.test.ts:210` is unchanged | ✅ |

### Carried over from iteration 3

`git diff 4996519 HEAD --stat` shows no change to `clarity.ts`, `middleware.ts`, `headers.ts`, `netlify.toml`, `BaseLayout.astro`, `Contact.astro`, `Contact.test.ts`, `netlify-config.test.ts` or `tests/browser/`. The sentences behind CLAR-09, 10, 11 and 14 are also unchanged. These ACs' tests ran green in this gate, but they were not re-examined and their mutants were not re-run.

| AC | Spec-defined outcome | `file:line` + assertion | Result |
| -- | -------------------- | ----------------------- | ------ |
| CLAR-01 | `<script async>` for the tag on the official host | `src/scripts/clarity.test.ts:26` `toEqual([TAG])`; `:27` `.async` `toBe(true)`; `tests/browser/csp.test.ts:224`, `:232` | ✅ Carried over, with the owner-accepted sampling limit (G3) |
| CLAR-02 | Queue exists before the tag; calls kept in `clarity.q` | `clarity.test.ts:33`, `:36`, `:39` | ✅ Carried over |
| CLAR-07 | Tag, `clarity.js`, `c.gif` and the send load with no CSP violation or COEP block | `tests/browser/csp.test.ts:223-225`, controls `:238-239`; COEP `:284`, control `:288` | ✅ Carried over, scope limit in A1 |
| CLAR-08 | Contact form has `data-clarity-mask="true"` | `src/components/Contact.test.ts:18`, `:142` | ✅ Carried over |
| CLAR-09 | Section "Análise de navegação" with all required items | `_privacidade.test.ts:57`, `:59-63`, helper `:46-54` | ✅ Carried over |
| CLAR-10 | Form fields masked in recordings | `_privacidade.test.ts:72` | ✅ Carried over |
| CLAR-11 | Intro also cites the analysis | `_privacidade.test.ts:90` (was `:76`; only the line moved) | ✅ Carried over |
| CLAR-12 | Existing function kept, and the tag still loads | `clarity.test.ts:49`, `:50` | ✅ Carried over |
| CLAR-13 | Tag fails: content and animations remain, no `pageerror` | `tests/browser/csp.test.ts:245-249` | ✅ Carried over |
| CLAR-14 | Microsoft may use its own cookies, including for advertising | `_privacidade.test.ts:68` | ✅ Carried over |

**Status**: ✅ All ACs covered, 16/16 traced. Six were checked in this round and ten carried over. CLAR-01 holds with the accepted limit, and CLAR-07 with the scope limit in A1. There are no spec-precision gaps.

---

## Discrimination Sensor

Scratch: a temporary detached `git worktree` at `ab1a25f` under the session scratchpad (`iter4`), with `node_modules` symlinked and the tree reset and confirmed clean between mutants. `npm test` ran for all six, as instructed.

| # | File:line | Description | Killed? (failing test) |
| - | --------- | ----------- | ---------------------- |
| N1 | `src/scripts/clarity.ts:9` | Guard is `!hostname.endsWith(HOST)` | ✅ `clarity.test.ts:69`, host `foo.www.leonardoassuncao.com.br`; 815/816 |
| N2 | `src/middleware.ts:5` | Returns `await next()`, without `withSecurityHeaders` | ✅ `middleware.test.ts:9`, `null` instead of `credentialless`; 815/816 |
| P1 | `src/pages/privacidade.astro:31` | Heading restored to the old `<h2 class="legal__heading">Finalidade</h2>` | ✅ `_privacidade.test.ts:77`; 815/816 |
| P2 | `privacidade.astro:32-35` | "não são vendidos" paragraph moved under "Análise de navegação" | ✅ `_privacidade.test.ts:78`; 815/816 |
| P3 | `privacidade.astro:63-66` | `#direitos-navegacao` paragraph removed | ✅ `_privacidade.test.ts:83`, a `TypeError` on the null element rather than a value mismatch; 815/816 |
| P4 | `privacidade.astro:63-66` | Same paragraph moved to the end of "Análise de navegação" | ✅ `_privacidade.test.ts:86`; 815/816 |

P1's literal restoration also removes the heading's `id`, so `:77` failed on `undefined`. That line is an exact `toBe`, so a title change that kept the `id` would fail there too. This was read from the assertion, not run.

After the worktree was restored, an unmutated `npm test` passed 816/816.

**Sensor depth**: focused, 6 hand-injected mutants as the owner's list set out. N3 was not re-run; `tests/browser/csp.test.ts` has not changed, so that survivor stands.
**Result**: 6/6 killed - PASS ✅

### Isolation

No mutation reached the real tree, but the baseline comparison did not match, for a reason outside the sensor. All of the following comes from `git reflog` and local refs.

- **Baseline, before the sensor**: branch `test/clarity-validation-iter3`, `ab1a25f`, with `?? .claude/` and `?? .specs/features/clarity-analytics/validation.md`.
- **After removing the worktree**: branch `main`, `3a84d5d`, with an empty `git status --porcelain`.
- **What happened in between**, none of it run by this Verifier:
  - 01:10:33: commits `f37910a` (versions `.claude/`) and `0e5d555` (commits the iteration 3 report) on the test branch.
  - 01:11:43: checkout of `main`, fast-forward to `origin/main`, then merge `3a84d5d`.
  - 01:11:46: `origin/main` updated by push to `3a84d5d`.
- **Why the sensor result still stands**:
  - `git diff ab1a25f 3a84d5d --name-only` lists only `.claude/` files and this report, so all code and tests are identical.
  - The worktree was detached and its mutations were never committed.
  - The real tree showed no change before this report was written, and the iteration 3 report's hash was unchanged.
- **What the reference's rule says**: `validate.md` says to stop and restore when the status differs. The tree was not restored, because the difference is someone else's commits and has no sensor residue. The owner should confirm this reading.

The gate and sensor were not re-run on `3a84d5d`. They apply to it only because the content is identical. `git stash` was not used, the other worktree was not touched, and no request was made on purpose to clarity.ms or to the production site. The browser suite routes those hosts to local stand-ins (`tests/browser/csp.test.ts:187-215`); this was read from the routes, and network traffic was not captured. The scratch worktree was removed and pruned. The symlink means build tools could write ignored caches into the real `node_modules`; that was not inspected.

---

## Interactive UAT Results

Not performed. The owner's check in the Clarity panel is in A5.

---

## Code Quality

| Principle | Status |
| --------- | ------ |
| Minimum code: 4 lines of page text, 1 attribute and title change, 1 host, 1 new 15-line test file | ✅ |
| Surgical changes: the feature range touches only the spec, the page and 3 test files | ✅ |
| No scope creep: CLAR-15 and CLAR-16 were added to the spec in the same commit as the page change | ✅ |
| Matches patterns: colocated tests, `_` prefix on the page test | ✅ |
| Spec-anchored outcome check (asserted values match spec) | ✅ |
| Per-layer coverage | ✅ For the changed code. G3 stays as the accepted limit |
| Every test in scope maps to a spec requirement | ✅ All new tests name their AC |
| Test integrity: no test removed in the feature range; the merge changed only how the page list is built | ✅ |
| Documented guidelines followed: `.specs` spec, AD-005, AD-006 | ✅ |

---

## Edge Cases

Carried over from iteration 3; `clarity.ts` and `tests/browser/` are unchanged.

- [x] **CLAR-13, tag fails.** Discriminating test at `tests/browser/csp.test.ts:245-249`.
- [x] **CLAR-12, `window.clarity` already exists.** Covered at `clarity.test.ts:49-50`.

---

## Gate Check

- **Gate command**: `npm run check`, `npm test`, `npm run build`, `npm run test:build`, then `npm run build` again and `npm run test:browser`. All ran in the scratch worktree at `ab1a25f`, and all exited 0. The second build follows the header of `tests/browser/csp.test.ts`.
- **`astro check`**: 0 errors, 0 warnings, 1 hint, in `src/lib/contact/handler.ts:34`, outside this feature.
- **`npm test`**: 816 passed, 0 failed, 0 skipped.
- **`npm run test:build`**: 134 passed, 0 failed, 0 skipped.
- **`npm run test:browser`**: 15 passed, 0 failed, 0 skipped.
- **Test count at iteration 3**: 702 + 120 + 15.
- **Delta**: +114 and +14. The feature range accounts for 4 of the `npm test` cases, read from the diff (1 host, 1 middleware, 2 policy). The rest come from the merged guide work and were not attributed individually.
- **Failures**: none.

---

## Owner-accepted residual

**G3 (CLAR-01; survivor N3).** The browser suite loads the tag on `/` and on one guide (`tests/browser/csp.test.ts:216`, `:230`), so excluding some other page would not be detected. Today's build has 27 HTML pages, up from 24 in iteration 3, because the merge published more guides. The iteration 3 scan showing every page reaching the tag ran at `4996519` with 24 pages and was not repeated. `src/layouts/BaseLayout.astro:89` is unchanged and unconditional.

The owner's decision is recorded at `spec.md:34` with `Confirmed? y`. This is a known limit, not a fix.

## Gaps

None that block this verdict. G1 and G2 are closed; see the sensor table for N1 and N2. A7, A8 and A9 record what these tests do not prove. Per the owner's instruction, none of those three was tested with a mutant.

## Fix Plans

None.

---

## Advisories (non-blocking)

- **A1 (CLAR-07, automated scope; carried over).** The repo's COEP test uses a stand-in script on local servers, and `route.fulfill` bypasses COEP (`tests/browser/csp.test.ts:254`), so `c.gif` and the send under COEP have no test in the repo. A real run against production (Chromium, `/` and one guide: tag and `clarity.js` 200, collect 204, no CSP violations) is **author-reported**. The Verifier did not observe or rerun it. Spec Success Criterion 1 rests on that same run.
- **A2 (browser-only kills, no CI; updated).** Iteration 3 said the repo has no `.github/` folder. It now has `.github/workflows/publicar-guias.yml`, but that only triggers a Netlify build hook and runs no tests. Nothing runs `test:browser` automatically, and it alone kills M6, M20b, X11, X14 and N4.
- **A3 (policy wording): closed.** CLAR-15 and CLAR-16 address it.
- **A4 (traceability).** `spec.md:94-109` still says "Implementing". The Verifier does not edit spec files; see the table below.
- **A5 (post-deploy).** Spec Success Criterion 2, visits in the Clarity panel, needs the owner's confirmation. Whether Netlify has deployed `3a84d5d` was not checked.
- **A6 (branch state; updated).** From local refs, without fetching: `main` and `origin/main` are both `3a84d5d` and contain `f04dd9d` and `0c4716a`. The policy text was therefore pushed before this verdict.
- **A7 (CLAR-05, CLAR-06, wiring).** `src/middleware.test.ts:6` calls `onRequest` directly. It proves the export applies the headers, not that the deployed function runs it; Astro loads `src/middleware.ts` by convention. The running function's 404 and `/api/contato` responses were not observed.
- **A8 (CLAR-15, "restringir").** `_privacidade.test.ts:78` proves the promise sits under the right heading, but nothing asserts it appears nowhere else. A copy added under another section would go unnoticed. By reading, `privacidade.astro:33` is the only occurrence today.
- **A9 (CLAR-16, how the e-mail is indicated).** The paragraph says "o mesmo e-mail" and has no address or link of its own (`privacidade.astro:63-66`). The address is in the paragraph above it (`:61`), and `_privacidade.test.ts:86` keeps exactly one element between the heading and this paragraph. Nothing asserts that this element is the one holding the `mailto:` link. Microsoft's policy is named here but linked only in the analysis section (`:53`). The spec says "indicar", so this meets it; the wording is the owner's call.

---

## Requirement Traceability Update

The Verifier does not edit `spec.md`; these are the statuses to record.

| Requirement | Previous Status | New Status |
| ----------- | --------------- | ---------- |
| CLAR-03, 04, 05, 06, 15, 16 | Implementing | ✅ Verified in this check |
| CLAR-02, 08, 09, 10, 11, 12, 13, 14 | Implementing | ✅ Verified, carried over from iteration 3 |
| CLAR-07 | Implementing | ✅ Verified, carried over, with A1 |
| CLAR-01 | Implementing | ✅ Verified, carried over, with the owner-accepted limit (G3) |

---

## Summary

**Overall**: ✅ Ready, as a focused closure check.

**Spec-anchored check**: 16/16 ACs traced, 6 checked here and 10 carried over from iteration 3; 0 spec-precision gaps.
**Sensor**: 6/6 listed mutations killed. N3 is the owner-accepted residual and was not re-run.
**Gate**: 816 + 134 + 15 passed, `astro check` 0 errors.

**What works**: G1 and G2 are closed by tests that kill N1 and N2. CLAR-15 and CLAR-16 match the spec, and their four mutants were killed.

**Issues found**: no blocking issues. The baseline status differed because of commits, a merge and a push made during the check; see "Isolation".

**Next steps**: the owner confirms the isolation reading, updates the traceability table, reviews A8 and A9 if wanted, and checks the Clarity panel after deploy (A5). Spec Success Criterion 1 still rests on the author-reported production run.
