# Plan: Unit tests for all `src/components/*.astro` components

## Goal

Add Vitest unit tests for all 24 components in `src/components/`, living under
`tests/unit/components/`, mirroring the component filenames
(`src/components/BlogCard.astro` → `tests/unit/components/BlogCard.spec.ts`).

This plan has been de-risked: every technique below (Container API rendering,
happy-dom DOM querying, mocking `@/factories/manager-factory`, mocking
`astro:content`) was spiked against this exact repo and confirmed working
before writing this plan.

## Why this approach

- `.astro` files are not plain TypeScript/JS — they compile through Astro's Vite
  plugin. Vitest's default config can't parse them at all (confirmed: fails with
  `Failed to parse source for import analysis`).
- Astro ships a first-class solution for this: the **Container API**
  (`astro/container`, exported as `experimental_AstroContainer`), which
  server-renders a single `.astro` component to an HTML string outside of a full
  page/build. Paired with `getViteConfig` from `astro/config` in
  `vitest.config.ts` (which pulls in the real Astro Vite plugin so `.astro`
  imports resolve), this lets Vitest import and render components directly.
- The existing convention (`src/**/*.spec.ts` colocated with source, see
  `src/managers/*.spec.ts`, `src/utils/*.spec.ts`) does NOT apply here — the
  user wants component tests under `tests/unit/components/` instead, per the
  existing `documentation/04-reference/01-adr/01-move-e2e-tests-into-tests-folder/`
  ADR which already anticipated `tests/unit/`. Keep using `.spec.ts` as the
  suffix (matching the rest of the repo) and Vitest (not Playwright) as the
  runner — these are unit tests, not browser e2e tests.

---

## Phase 0 — Test infrastructure (do this first, once)

### 0.1 Update `vitest.config.ts` to be Astro-aware

Replace the file contents:

```ts
import { fileURLToPath } from 'url';
import { getViteConfig } from 'astro/config';
import { resolve } from 'path';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default getViteConfig({
    test: {
        environment: 'node',
        include: ['src/**/*.spec.ts', 'tests/unit/**/*.spec.ts'],
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, './src'),
        },
    },
});
```

Only two changes from today's file: `defineConfig` from `'vitest/config'` →
`getViteConfig` from `'astro/config'`, and the `include` array gains
`'tests/unit/**/*.spec.ts'`. `getViteConfig` loads `astro.config.mjs`'s
integrations (`mdx`, `sitemap`, tailwind vite plugin) — this is expected and
harmless for tests; verified all 210 pre-existing tests in `src/**/*.spec.ts`
still pass unchanged after this switch.

### 0.2 Update `tsconfig.json`

Add `tests/unit` to `include` (it currently only lists `tests/e2e/**/*`) so
`astro check` / editor type-checking covers the new tests:

```jsonc
"include": [
    ".astro/**/*",
    "src/**/*",
    "tests/e2e/**/*",
    "tests/unit/**/*",
    "eslint.config.mjs",
    "astro.config.mjs"
]
```

Leave the `@/*` path mapping as-is (`["./src/*", "./tests/e2e/*"]`) — the new
tests only need `@/` to resolve into `src/`, which already works.

### 0.3 (Optional but recommended) Extend the lint glob

`package.json`'s `"lint"` script is `eslint 'src/**/*.ts'`, which won't cover
`tests/unit/**/*.ts`. Consider changing it to:

```json
"lint": "eslint 'src/**/*.ts' 'tests/unit/**/*.ts'"
```

so the new test files are held to the same lint rules (4-space indent,
explicit return types, `sort-imports`, etc. — see `eslint.config.mjs`).

### 0.4 Create the shared render helper

Create `tests/unit/components/support/render.ts`:

```ts
import { experimental_AstroContainer as AstroContainer } from 'astro/container';
import type { AstroComponentFactory } from 'astro/runtime/server/index.js';
import type { ContainerRenderOptions } from 'astro/container';
import { Window } from 'happy-dom';

export interface RenderedComponent {
    html: string;
    document: Document;
}

export async function renderComponent(
    component: AstroComponentFactory,
    options: ContainerRenderOptions = {}
): Promise<RenderedComponent> {
    const container = await AstroContainer.create();
    const html = await container.renderToString(component, options);
    const window = new Window();
    window.document.body.innerHTML = html;

    return { html, document: window.document as unknown as Document };
}
```

This is the single entry point every component spec uses. It returns both the
raw `html` string (for simple `toContain` checks) and a parsed happy-dom
`document` (for robust structural assertions via `querySelector` /
`querySelectorAll` — e.g. counting `<a>` tags, checking `aria-current`,
reading a `style` attribute). `happy-dom` is already a devDependency
(currently unused elsewhere), no new dependency needed.

### 0.5 Create the `astro:content` stub fixture

Only one component (`SectionHeader.astro`) calls `render()` from
`astro:content`. Create `tests/unit/components/support/fixtures/RenderedContentStub.astro`:

```astro
---
---
<p>Stub rendered content</p>
```

Used only by `SectionHeader.spec.ts` (see below) via `vi.mock('astro:content', ...)`.

### 0.6 Sanity check

After 0.1–0.5, run `pnpm test` — the 210 existing specs must still pass
unchanged (this was verified during planning). This confirms the infra step
didn't regress anything before component work starts.

---

## Phase 1 — Conventions for every component spec file

Apply these consistently across all 24 files so the suite reads as one system:

- **Location/naming**: `tests/unit/components/<ComponentName>.spec.ts`.
- **Style**: match `eslint.config.mjs` — 4-space indent, explicit return types
  (`: void`, `: Promise<void>`) on every function/callback, alphabetically
  sorted imports (`sort-imports` is enforced).
- **Structure**: one top-level `describe('<ComponentName>', (): void => { ... })`,
  with nested `describe` blocks per prop/behavior when useful (mirrors
  `src/managers/certificate.manager.spec.ts`).
- **Rendering**: always via `renderComponent` from
  `../support/render` (relative import; do not re-implement container setup
  per file).
- **Assertions**: prefer `document.querySelector(...)` structural checks over
  raw substring matching on `html` wherever the test cares about structure,
  attributes, or counts (not just presence of text). Use `html` +
  `toContain`/`not.toContain` only for simple text-presence checks.
- **Mocking `@/factories/manager-factory`**: for the 3 components that call
  `getGpxManager()` (`ElevationProfile`, `TrailMap`, `TripConditions`), mock it
  inline at the top of that spec file, per-file (do NOT build a shared mock
  factory module — this matches the existing repo convention of inline
  `vi.fn()`-based mocks seen in `src/managers/*.spec.ts`, and avoids
  `vi.mock` hoisting/closure gotchas). Example shape:

  ```ts
  vi.mock('@/factories/manager-factory', () => ({
      getGpxManager: () => ({
          getStatistics: async (): Promise<ElevationStats> => ({ /* fixture */ }),
          getTotalDistance: async (): Promise<Distance> => ({ inKilometers: 12.3, inMiles: 7.6 }),
          getRawGpx: async (): Promise<string> => '<gpx>...</gpx>',
      }),
  }));
  ```

  Only implement the methods that specific component actually calls.
- **No snapshot tests.** Assert on specific, meaningful output (text content,
  attribute values, element counts, conditional presence/absence) — not full
  HTML snapshots, which rot silently.
- **Cover, per component**: every prop's default value, every conditional
  branch (`{x && ...}`, ternaries), every list-rendering path (empty array and
  non-empty array), and accessibility-relevant output (`aria-*`, `alt`, `role`)
  since this codebase clearly cares about it (visible throughout every
  component read during planning).

---

## Phase 2 — Component-by-component test cases

For each component below: props/behavior to cover, and any special handling.
Components are grouped by complexity, simplest first — a good execution order.

### Trivial (icons/pure presentational, ~1-2 tests each)

1. **`GitHubIcon.astro`** / **`LinkedInIcon.astro`** (`class` prop)
   - Renders an `<svg>` with `role="img"`.
   - Applies the `class` prop when provided; renders without it when omitted.

2. **`SubjectBadge.astro`** (`subject`, `size?`, `color?`)
   - Renders `subject` text.
   - Default `size` ('sm') vs `'md'` yields different text-size classes.
   - Default `color` class applied when omitted; custom `color` applied when given.

3. **`TagsList.astro`** (`tags`, `size?`)
   - Renders nothing (no wrapping `<span>`) when `tags` is empty — assert
     absence via `document.querySelector`.
   - Renders each tag with `|` separators between (not before the first or
     after the last).
   - `size` default vs `'md'` affects text-size classes.

4. **`CodeBlock.astro`** (`filename?`)
   - Renders the default `<slot />` content.
   - Filename badge (with icon) shown only when `filename` is provided.

5. **`SectionHeader.astro`** (`page`)
   - Mock `astro:content`'s `render` (see 0.5) to return the stub `Content`.
   - Renders `page.data.title`.
   - Renders the mocked `Content` output.
   - Build the `page` prop as a plain object cast, e.g.
     `{ data: { title: 'About', description: '...' } } as CollectionEntry<'pages'>`
     (matches the pattern already used in `src/managers/certificate.manager.spec.ts`'s
     `makeCertificate` helper).

### Simple (prop-driven, a handful of conditionals)

6. **`ImageFloat.astro`** (`image`, `imageSide`, `caption`, `height?`, `title?`)
   - `imageSide: 'start'` vs `'end'` produce different float classes.
   - `title` renders two `<h3>` elements (mobile + desktop variants) when
     provided; renders none when omitted.
   - Default `height` (200) reflected in the inline `style`.
   - Slot content (`<slot />`) renders after the figure.

7. **`ContentListItem.astro`** (`href`, `index?`, `title`, `description?`, `image?`)
   - `index !== undefined` shows the index badge — including the edge case
     `index === 0` (must still render, since the check is `!== undefined`, not
     truthy).
   - `image` optional thumbnail shown/hidden.
   - `description` optional paragraph shown/hidden.

8. **`RelatedPosts.astro`** (`relatedPosts: CollectionEntry<'blog'>[]`)
   - Renders nothing when `relatedPosts` is empty.
   - Renders one `ContentListItem` per post when non-empty; verify the count
     and that `href` is built as `/${post.data.subject}/${post.id}`.
   - Build fixture entries as plain objects cast `as CollectionEntry<'blog'>[]`.

9. **`StoryNavigation.astro`** (`previousPost`, `nextPost`: both `CollectionEntry<'blog'> | null`)
   - Renders nothing when both are `null`.
   - `previousPost` present / `nextPost` null → only previous link rendered
     (note: the `else` branch renders an empty `<div />` placeholder — assert
     the previous-link `<a>` is absent, not that the grid cell is fully gone).
   - `nextPost` present / `previousPost` null → only next link rendered.
   - Both present → both rendered with correct `href`s
     (`/${post.data.subject}/${post.id}`).

10. **`SubjectsBar.astro`** (`subjects: SimplifiedSubject[]`)
    - Renders one link per subject.
    - `aria-current="page"` set on the link whose `href` is a substring of the
      current URL path — render with a `request` option
      (`renderComponent(Component, { request: new Request('http://localhost/gardening') })`)
      to control `Astro.url.pathname`, and confirm exactly one active link.
      **Verify this specific `request` option works with `AstroContainer` before
      relying on it** (it's part of `ContainerRenderOptions` but wasn't
      exercised during spiking) — if it doesn't affect `Astro.url`, fall back
      to asserting the `isActive` logic indirectly isn't testable in isolation
      and just cover the non-active-path rendering + link count/`href`s.

11. **`Pagination.astro`** (`currentPage`, `totalPages`, `baseUrl`)
    - Renders nothing when `totalPages <= 1`.
    - `getPageUrl` special-case: page 1 → `baseUrl` (no `/1` suffix); other
      pages → `${baseUrl}/${page}`.
    - First/prev/next/last button visibility at the boundaries: `currentPage
      === 1` (no prev, no "first"), `currentPage === totalPages` (no next, no
      "last"), and a middle page (all four visible).
    - Ellipsis appears when there's a gap between page 1 and `currentPage - 1`,
      or between `currentPage + 1` and `totalPages` — test with e.g.
      `totalPages: 10, currentPage: 5` and assert exactly two `...` spans and
      the exact page-number sequence.
    - `aria-current="page"` on the current page link only.

### Content cards (similar shape, several components — same test skeleton)

For **`BlogCard.astro`**, **`GardeningJournalCard.astro`**, **`StoryCard.astro`**,
**`SoftwareCard.astro`**, **`TrailCard.astro`**, **`CertificateCard.astro`** —
each is a card with a title link, optional fields, and formatted date/values.
Use the same skeleton per component, adjusted to its own props:

12. **`BlogCard.astro`** (`title`, `description`, `date`, `author`, `subjectId?`,
    `subject?`, `subjectColor?`, `image`, `slug`, `href?`, `readingTime?`)
    - Title, description, author, formatted date (`date.toLocaleDateString('en-US', {...})`
      — assert the exact expected string for a fixed `Date`) all render.
    - Link `href` defaults to `/${subjectId}/${slug}` when `href` omitted;
      uses `href` directly when provided.
    - `subject` badge only rendered when `subject` provided (renders
      `SubjectBadge` — assert via a child element, not by re-testing
      `SubjectBadge` internals).
    - `readingTime` text only rendered when provided (and note `0` is falsy —
      if that matters, note it as a possible existing-bug observation rather
      than "fixing" it in the test).

13. **`GardeningJournalCard.astro`** (`title`, `description?`, `date`, `author`,
    `image`, `slug`, `readingTime?`)
    - Same pattern as BlogCard minus subject badge; `href` is always
      `/gardening/journal/${slug}`.
    - `description` optional.

14. **`StoryCard.astro`** (`title`, `description`, `date`, `image`, `slug`, `postCount`)
    - `postCount === 1` renders singular "post"; any other value (including
      `0`) renders plural "posts" — test both `1` and `2` (and optionally `0`).
    - Uses `formatDate` from `@/utils/content` (real util, no need to mock —
      it's pure).

15. **`SoftwareCard.astro`** (`slug`, `name`, `description`, `logo`, `repository`, `website?`)
    - `website` link only rendered when provided.
    - Repository link always rendered with correct `href`.

16. **`TrailCard.astro`** (`title`, `description`, `date`, `country`, `location`,
    `distanceKm`, `image`, `slug`, `sectionLabel?`)
    - `distanceMi` computed via real `kmToMiles` (pure util, don't mock).
    - `sectionLabel` badge only rendered when provided.

17. **`CertificateCard.astro`** (`name`, `issuer`, `issuerLogo?`, `issueDate`,
    `isExpired`, `expiryDate?`, `credentialId?`, `credentialUrl?`)
    - `isExpired: true` vs `false` toggles: status badge text ("Expired" vs
      "Active"), accent stripe class, and the "Expired"/"Expires" label prefix
      next to `expiryDate`.
    - `issuerLogo` provided → `<img>`; omitted → fallback icon.
    - Footer row (credential id / verify link) only rendered when at least one
      of `credentialId` / `credentialUrl` is present; each rendered
      independently of the other.

### Layout / navigation (client-script-bearing — test SSR output only)

18. **`Footer.astro`** (no props)
    - Renders the three social links (GitHub, LinkedIn, RSS) with correct
      `href`s.
    - Copyright year — this reads `new Date().getFullYear()` at render time;
      either assert against `new Date().getFullYear()` computed in the test
      (not a hardcoded year), or use `vi.setSystemTime` to pin the clock for a
      deterministic assertion.

19. **`Header.astro`** (`activePageId`, `showSubjectsBar?`)
    - Correct set of nav links rendered (`pageLinks` + `personalLinks`).
    - `isActive` marks the right link `aria-current="page"` for a given
      `activePageId` (e.g. `activePageId: 'blog'` → the `/blog` link is
      active) — check both desktop and mobile nav copies.
    - `showSubjectsBar` (default `false`): when `true`, the named slot
      `subjects-bar` content is rendered; when `false`/omitted, it is not.
      Pass slot content via `renderComponent(Header, { props: {...}, slots: { 'subjects-bar': '<div data-test="bar" />' } })`.
    - Ignore the `<script>` block's runtime behavior (menu toggle) — that's
      DOM/event behavior, out of scope for SSR component tests; an e2e test
      is the right place for that if it doesn't already exist (check
      `tests/e2e/components/` — it doesn't currently cover Header, out of
      scope for this plan but worth flagging back to the user).

### Data-visualization / manager-dependent components (require mocking)

20. **`ElevationProfile.astro`** (`gpxUrl`, `width?`, `height?`, `padding?`)
    - Mock `@/factories/manager-factory`'s `getGpxManager()` with fixed
      `getStatistics`/`getTotalDistance` fixture data (see Phase 1 pattern —
      already spiked successfully with this exact component).
    - Assert the four stat values render (`Max`, `Min`, `+Ascent`, `−Descent`
      — note the actual glyphs `▲ Max`, `▼ Min`, `↑`, `↓` with `+`/`−` sign
      prefixes) match the fixture numbers exactly.
    - Assert `viewBox` reflects `width`/`height` (including custom values, not
      just defaults).
    - Component throws when `getStatistics` or `getTotalDistance` resolves
      `null`/errors — mock one returning `null` and assert
      `renderComponent(...)` rejects (Container API propagates the thrown
      error as a rejected promise — verify this specific behavior when
      writing the test, don't assume).

21. **`TripConditions.astro`** (`weather`, `temperatureC`, `difficulty`, `gpxUrl`)
    - Mock `getGpxManager().getTotalDistance` only (the only manager call this
      component makes).
    - `celsiusToFahrenheit` is a real pure util — don't mock, assert the
      actual converted value for a chosen `temperatureC`.
    - Parametrize over all four `difficulty` values (`'easy' | 'moderate' |
      'hard' | 'very-hard'`) asserting both the label text and the color
      class map entry for each.

22. **`TrailMap.astro`** (`gpxUrl`, `height?`, `label?`)
    - Mock `getGpxManager().getRawGpx()` to return a small, valid, hand-written
      GPX/GML string with 2-3 `<trkpt>` points (real `@tmcw/togeojson` +
      `@xmldom/xmldom` parse it for real — don't mock those, they're pure and
      already proven to work in this render path during spiking).
    - Assert the rendered `<div data-trail-map>` has `role="img"` and
      `aria-label` equal to `label` (including the default value when
      omitted).
    - Assert `data-geojson`, `data-bounds`, `data-start`, `data-end`
      attributes are valid JSON and structurally correct for the fixture GPX
      (e.g. `data-start` matches the first track point's coordinates).
    - Edge case: a GPX with zero track points → `data-bounds`/`data-start`/
      `data-end` should serialize `null`.
    - Ignore the `<script>` block (MapLibre initialization) — not exercised
      by SSR container rendering; this is already implicitly out of scope
      since `container.renderToString` never executes client `<script>` tags.

### Grid/schedule components (moderate logic, month-grid rendering)

23. **`PlantSchedule.astro`** (`sowIndoors?`, `moveOutdoors?`, `harvest?` — all `number[]`, default `[]`)
    - All three empty (defaults) → every month cell gets the empty-color style
      and a plain `aria-label` (just the month name, no event suffix).
    - A month present in exactly one array → single-color style + `aria-label`
      suffix with that one event.
    - A month present in two arrays → the two-color gradient style + both
      event names joined with `, `.
    - A month present in all three → the three-color gradient style + all
      three event names.
    - Render 12 month cells always (`document.querySelectorAll(...)` count).
    - Ignore the `<script>` current-month highlighting — DOM/runtime behavior,
      not present in SSR output (class added client-side only).

24. **`PlantScheduleList.astro`** (`plants: PlantScheduleEntry[]`)
    - Empty `plants` array → header row still renders, zero plant rows.
    - Each plant with `slug` → name rendered as a link
      (`/gardening/plants/${slug}`); without `slug` → plain `span`, no link.
    - Reuses the identical color/aria-label/tooltip logic as
      `PlantSchedule.astro` — cover the same 0/1/2/3-event-overlap cases,
      but scoped per-row this time (one row's grid cells), plus the `title`
      attribute (tooltip) which `PlantSchedule.astro` doesn't have — assert it
      is `undefined`/absent when no events, and set to the comma-joined
      capitalized event list otherwise (`getTooltip` differs slightly from
      `getAriaLabel`: check the "Sow indoors"/"Move outdoors"/"Harvest"
      capitalization used in `getTooltip` vs lowercase in `getAriaLabel` —
      these were written as separate near-duplicate functions in the source,
      so test them as they actually behave, don't assume they match).
    - Legend renders the three swatch labels unconditionally.

---

## Phase 3 — Verification checklist for the executing agent

After writing all 24 spec files:

1. `pnpm test` — every new and existing spec passes.
2. `pnpm lint` (after the optional 0.3 glob change, or manually lint
   `tests/unit/` if not) — no lint errors in the new files.
3. `pnpm build` (`astro check && astro build`) — confirms the tsconfig
   `include` change didn't break type-checking and that no test file leaked
   type errors.
4. Spot check: no test asserts on a full-HTML snapshot; every test file has at
   least one assertion tied to a specific prop value (not just "it renders
   without throwing").
5. Report back any component where real behavior diverged from what's
   described in this plan (e.g. the `SubjectsBar` `request`/`Astro.url` case
   flagged in step 10, or the `Header` client-script menu behavior) rather
   than silently working around it.
