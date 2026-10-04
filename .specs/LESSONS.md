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

## Quarantined (failed when applied - ignore)

A confirmed lesson that recurred alongside failure. Kept for the maintainer to review.

_none_
