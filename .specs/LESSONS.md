# LESSONS - auto-maintained by scripts/lessons.py

> Machine-owned. Do NOT hand-edit. Changes are overwritten on the next `lessons.py` write.
> Canonical state lives in `.specs/lessons.json`. Edit lessons only via the script.
> promote_threshold=2 distinct features · window_days=45 · quarantine_threshold=2

## Confirmed (load these at Specify/Design)

Corroborated across multiple features. Safe to apply as guidance.

_none_

## Candidates (under observation - do NOT load as guidance yet)

Seen once or not yet corroborated. Tracked, not trusted.

### L-001 - Cover build-time config validation with a test that fails when the validation call is removed from the build entry point
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `build-config` · harmful: 0
- features: site-institucional
- evidence: M22 astro.config.mjs:9 (build-config)
- last seen: 2026-10-04T13:16:45Z

### L-002 - Export production limits and timeouts as named constants and assert their spec values because handler tests that inject their own values cannot catch wiring changes
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `endpoint-wiring` · harmful: 0
- features: site-institucional
- evidence: M18 src/pages/api/contato.ts:10; M19 src/pages/api/contato.ts:22 (endpoint-wiring)
- last seen: 2026-10-04T13:16:45Z

### L-003 - Assert self-hosted font files and font-display swap in the build-artifact tests instead of leaving font requirements untested
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `build-output` · harmful: 0
- features: site-institucional
- evidence: SEO-06 no test; tests/build/secrets.test.ts (build-output)
- last seen: 2026-10-04T13:16:45Z

### L-004 - State negative requirements such as no persistence as an observable check or mark them explicitly as static-review items
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: site-institucional
- evidence: FORM-13 (spec)
- last seen: 2026-10-04T13:16:45Z

### L-005 - Specify whether field validation errors must sit in an aria-live region or are announced through focus and aria-describedby
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `forms-a11y` · harmful: 0
- features: site-institucional
- evidence: A11Y-03 src/scripts/contact-form.ts:43 (forms-a11y)
- last seen: 2026-10-04T13:16:46Z

### L-006 - Assert URL-derived metadata such as canonical and og:url on at least one non-root page so a value hard-wired to the root is caught
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `seo-metadata` · harmful: 0
- features: site-institucional
- evidence: N5 src/layouts/BaseLayout.astro:22 (round 2) (seo-metadata)
- last seen: 2026-10-04T13:30:19Z

### L-007 - Exercise the real endpoint with external services mocked because pinning shared constants does not prove the endpoint uses them
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `endpoint-wiring` · harmful: 0
- features: site-institucional
- evidence: W1 src/pages/api/contato.ts:11; W2 src/pages/api/contato.ts:23 (round 2) (endpoint-wiring)
- last seen: 2026-10-04T13:30:19Z

### L-008 - Assert the data attributes a page hands to its client script because script tests that inject their own deps cannot catch a wrong or missing config value in the hand-off
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `component-wiring` · harmful: 0
- features: site-institucional
- evidence: C1 src/components/Contact.astro:57; C2 src/components/Contact.astro:55 (round 3) (component-wiring)
- last seen: 2026-10-04T13:41:12Z

### L-009 - Use test fixture values that differ from the production config so a hard-coded production value cannot pass the test
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `test-fixtures` · harmful: 0
- features: site-institucional
- evidence: P1 src/scripts/contact-form.ts:100; src/scripts/contact-form.test.ts:63 (round 3) (test-fixtures)
- last seen: 2026-10-04T13:41:13Z

### L-010 - Test a time window at the real entry point by advancing a fake clock to just before and exactly at the boundary
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `endpoint-wiring` · harmful: 0
- features: site-institucional
- evidence: W3 src/pages/api/contato.ts:11 (round 3) (endpoint-wiring)
- last seen: 2026-10-04T13:41:13Z

### L-011 - Move inline client bootstrap code that maps page data into script deps into a tested module because component tests do not run it and script tests inject their own deps
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `component-wiring` · harmful: 0
- features: site-institucional
- evidence: validation.md round 4: S1, S2 at src/components/Contact.astro:150-151 (component-wiring)
- last seen: 2026-10-04T14:09:41Z

### L-012 - Assert placement requirements such as next to a button by checking the shared container or sibling, not just presence somewhere in the form
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `component-markup` · harmful: 0
- features: site-institucional
- evidence: validation.md round 4: L2b at src/components/Contact.astro:132-134 (LEGAL-02) (component-markup)
- last seen: 2026-10-04T14:09:41Z

### L-013 - Assert page-level SEO values (title, description) on the rendered page itself, not only on the layout default the page inherits
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `pages, seo` · harmful: 0
- features: seo-ranqueamento
- evidence: validation.md M13 (src/pages/index.astro:20; HOME-01, HOME-02) (pages, seo)
- last seen: 2026-10-04T22:11:20Z

### L-014 - Keep all dist output assertions in the single build test file so test:build runs only one astro build
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `tests/build` · harmful: 0
- features: seo-ranqueamento
- evidence: tasks.md T18 SPEC_DEVIATION (tests/build/secrets.test.ts:171) (tests/build)
- last seen: 2026-10-04T22:11:20Z

### L-015 - Assert every generated list entry as the full exact line, not a prefix, so an emptied description is caught
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `generated-text` · harmful: 0
- features: auditoria-geo-seguranca
- evidence: M18 src/lib/seo/llms.test.ts:29 (generated-text)
- last seen: 2026-10-05T01:05:31Z

### L-016 - When a new requirement restricts something an earlier requirement allowed, state in the spec whether the earlier allowance still holds
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: auditoria-geo-seguranca
- evidence: PERF-09 tests/animations-css.test.ts:97 (spec)
- last seen: 2026-10-05T01:05:31Z

### L-017 - Verify a strict CSP by loading the built pages in a real browser and failing on any console violation, because library runtime probes such as eval detection only show up there
- signal: `gate_fail` · recurrence: 1 feature(s) · scope: `security-headers` · harmful: 0
- features: auditoria-geo-seguranca
- evidence: M16 src/lib/contact/validation.ts:4 tests/browser/csp.test.ts:115 (security-headers)
- last seen: 2026-10-05T01:05:31Z

### L-018 - Reproduce layout shift with a fallback font whose metrics match what real devices render, because a wider local system fallback hides wrapping caused by the font swap
- signal: `gate_fail` · recurrence: 1 feature(s) · scope: `performance` · harmful: 0
- features: auditoria-geo-seguranca
- evidence: PERF-05 commits bdde9b7 fd4fbd5 tasks.md T23 (performance)
- last seen: 2026-10-05T01:05:31Z

### L-019 - Specify displayed dates with an exact example string such as 3 de novembro de 2026 instead of a dd/mm pattern
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `content-pages` · harmful: 0
- features: guias-conteudo
- evidence: PAGE-03 src/pages/guias/_slug.test.ts:108 (content-pages)
- last seen: 2026-10-17T05:40:41Z

### L-020 - When a build error comes from Astro content-collection validation, say so in the AC and assert only the field-level rejection in tests
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `content-collections` · harmful: 0
- features: guias-conteudo
- evidence: COL-03 src/lib/guias/schema.test.ts:56 (content-collections)
- last seen: 2026-10-17T05:40:41Z

### L-021 - Mark qualitative clauses of a content AC (phrasing, context) as human review so count-based tests are not read as covering them
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `content` · harmful: 0
- features: guias-conteudo
- evidence: CONT-04 tests/content/guias.test.ts:72 (content)
- last seen: 2026-10-17T05:40:41Z

### L-022 - Assert draft exclusion in the built output of every surface the spec lists, not only through the shared loader
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `build-tests` · harmful: 0
- features: guias-conteudo
- evidence: COL-08 tests/build/guias.test.ts:52 (build-tests)
- last seen: 2026-10-17T05:40:41Z

### L-023 - Check every new page title and description in a spec against the site-wide 60-character title rule before confirming the spec
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `seo` · harmful: 0
- features: guias-conteudo
- evidence: c43b170 HUB-01 vs SEO-08 (seo)
- last seen: 2026-10-17T05:40:41Z

### L-024 - Decide dev-only behavior from import.meta.env.MODE, never import.meta.env.DEV, which inherited environment variables can set
- signal: `spec_deviation` · recurrence: 1 feature(s) · scope: `astro-env` · harmful: 0
- features: guias-conteudo
- evidence: 5535607 src/lib/guias/collection.ts:7 (astro-env)
- last seen: 2026-10-17T05:40:41Z

### L-025 - When the spec names an exact required link per content file, assert that specific link in the content test instead of only any link of the same kind
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `content-tests` · harmful: 0
- features: guias-nichos
- evidence: validation.md M1b (tests/content/guias.test.ts:165-170) (content-tests)
- last seen: 2026-10-17T14:33:37Z

### L-026 - When a test fakes an external command, make the fake depend on the flags under test instead of returning a fixed exit code
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `ci` · harmful: 0
- features: guias-problemas-reais
- evidence: M07 .github/workflows/publicar-guias.yml:26 (ci)
- last seen: 2026-11-06T02:30:28Z

### L-027 - Normalize links before checking them in content tests, covering anchors, absolute URLs and missing trailing slashes
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `content-tests` · harmful: 0
- features: guias-problemas-reais
- evidence: SCHED-09 tests/content/guias.test.ts:362 (F17-F19) (content-tests)
- last seen: 2026-11-06T02:30:28Z

### L-028 - Extract rules checked against live content into pure functions with a passing and a failing fixture
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `content-tests` · harmful: 0
- features: guias-problemas-reais
- evidence: M13 M14 tests/content/guias.test.ts:306,368 (content-tests)
- last seen: 2026-11-06T02:30:28Z

### L-029 - State in the spec whether a rule on scheduled content also applies to drafts
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: guias-problemas-reais
- evidence: SCHED-04 src/lib/guias/guias.ts:46 (spec)
- last seen: 2026-11-06T02:30:28Z

### L-030 - Check each guide sentence against what the source literally says and drop inferred results or frequencies
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `content` · harmful: 0
- features: guias-problemas-reais
- evidence: PRB-09 PRB-10 pix-sem-txid-erp-nao-da-baixa.md:24,67 erp-preenche-ibs-cbs-nfe.md:24,47 (content)
- last seen: 2026-11-06T02:30:28Z

### L-031 - Reject or resolve relative internal links in content tests so link rules cannot be bypassed
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `content-tests` · harmful: 0
- features: guias-problemas-reais
- evidence: F22 tests/content/guide-rules.ts:6 (content-tests)
- last seen: 2026-11-06T02:47:51Z

### L-032 - Test a third-party outage by failing its request and asserting the page still works and raises no page error, not only that the request was blocked
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `third-party-scripts` · harmful: 0
- features: clarity-analytics
- evidence: M20b tests/browser/csp.test.ts:225 (third-party-scripts)
- last seen: 2026-11-06T02:04:50Z

### L-033 - When a guard preserves existing state, also assert that the rest of the flow still runs on that path
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `third-party-scripts` · harmful: 0
- features: clarity-analytics
- evidence: M21 src/scripts/clarity.test.ts:49 (third-party-scripts)
- last seen: 2026-11-06T02:04:50Z

### L-034 - Give every edge case a requirement ID and a traceability row so it cannot escape test coverage
- signal: `ac_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: clarity-analytics
- evidence: Edge case outage spec.md:80 (spec)
- last seen: 2026-11-06T02:04:50Z

### L-035 - Name the exact items a disclosure requirement must list, checked against the vendor documentation
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: clarity-analytics
- evidence: CLAR-09 spec.md:70 (spec)
- last seen: 2026-11-06T02:04:50Z

### L-036 - State whether the rest of the flow continues when a requirement keeps existing state
- signal: `spec_precision_gap` · recurrence: 1 feature(s) · scope: `spec` · harmful: 0
- features: clarity-analytics
- evidence: CLAR-12 spec.md:81 (spec)
- last seen: 2026-11-06T02:04:50Z

### L-037 - Assert text a requirement places in a section by reading that section's own content, not the whole page
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `content-tests` · harmful: 0
- features: clarity-analytics
- evidence: X12 src/pages/_privacidade.test.ts:47 (content-tests)
- last seen: 2026-11-06T03:28:46Z

### L-038 - Test an exact-host guard with a sibling subdomain and a lookalike that has the host as a prefix, not only unrelated hosts
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `third-party-scripts` · harmful: 0
- features: clarity-analytics
- evidence: X4 X5 src/scripts/clarity.test.ts:55 (third-party-scripts)
- last seen: 2026-11-06T03:28:46Z

### L-039 - When a requirement covers every page, exercise layout-level script wiring on a non-root page too
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `third-party-scripts` · harmful: 0
- features: clarity-analytics
- evidence: X11 tests/browser/csp.test.ts:216 (third-party-scripts)
- last seen: 2026-11-06T03:28:46Z

### L-040 - Test an exact-host guard with a host that has it as a suffix as well as a prefix
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `third-party-scripts` · harmful: 0
- features: clarity-analytics
- evidence: N1 src/scripts/clarity.test.ts:56 (third-party-scripts)
- last seen: 2026-11-06T03:55:34Z

### L-041 - Test that the middleware applies a response helper, not only the helper on its own
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `security-headers` · harmful: 0
- features: clarity-analytics
- evidence: N2 src/middleware.ts:5 (security-headers)
- last seen: 2026-11-06T03:55:34Z

### L-042 - When a requirement covers every page, check every built page or record sampling as an accepted limit
- signal: `surviving_mutant` · recurrence: 1 feature(s) · scope: `third-party-scripts` · harmful: 0
- features: clarity-analytics
- evidence: N3 tests/browser/csp.test.ts:230 (third-party-scripts)
- last seen: 2026-11-06T03:55:34Z

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
