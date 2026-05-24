# Test Coverage Improvement Plan

Current state (May 25, 2026):
- **Unit tests**: 194 passing across 17 spec files — 99.7% statements, 93.93% branches, 100% functions
- **E2E tests**: 135 passing across 21 spec files

---

## Unit Test Gaps

### 1. Missing spec file: `src/managers/stories.manager.ts`

No spec file exists. The manager contains meaningful business logic and error-throwing paths that should be covered.

**Test cases to add** (`src/managers/stories.manager.spec.ts`):

| Method | Scenario |
|---|---|
| `getStories` | Filters out draft stories |
| `getStories` | Sorts stories by date descending |
| `getFeaturedStories` | Returns only featured stories |
| `getFeaturedStories` | Respects the `maxStories` limit |
| `getFeaturedStories` | Returns all featured stories when no limit provided |
| `getStoryForPost` | Returns `null` when no story references the post |
| `getStoryForPost` | Returns the matching story |
| `getStoryForPost` | Throws an error when multiple stories reference the same post |
| `getPostsForStory` | Returns posts belonging to the story in declared order |
| `getPostsForStory` | Skips post IDs that the blog repository cannot find |

---

### 2. Missing spec file: `src/managers/subject.manager.ts`

No spec file exists. The manager contains error-throwing branches for missing lookups that are not tested at all.

**Test cases to add** (`src/managers/subject.manager.spec.ts`):

| Method | Scenario |
|---|---|
| `getGardeningYears` | Returns all gardening year subjects from the repository |
| `getYearForGardeningJournalEntry` | Returns the correct year for a given journal entry |
| `getYearForGardeningJournalEntry` | Throws when no year matches the entry's subject |
| `getBlogCategories` | Returns all blog subject categories from the repository |
| `getCategoryForBlogPost` | Returns the correct category for a given blog post |
| `getCategoryForBlogPost` | Throws when no category matches the post's subject |

---

### 3. Missing spec file: `src/utils/gpx.ts`

No spec file exists. All four exports are pure functions with deterministic output, making them ideal candidates for unit tests.

**Test cases to add** (`src/utils/gpx.spec.ts`):

| Function | Scenario |
|---|---|
| `buildElevationPath` | Returns an empty string when fewer than 2 elevation points are provided |
| `buildElevationPath` | Returns a valid SVG path string for a flat series (all elevations equal) |
| `buildElevationPath` | Returns a valid SVG path string for an ascending series |
| `buildElevationPath` | The path starts with `M 0,{height}` and ends with `Z` |
| `buildGridLines` | Returns an empty array when `min === max` (zero range) |
| `buildGridLines` | Returns evenly-spaced grid line values within the range |
| `buildGridLines` | Respects the `targetCount` parameter |
| `buildSvgMetadata` | Returns empty strings when `min === max` |
| `buildSvgMetadata` | Returns non-empty `lines` and `labels` strings for a valid range |
| `buildSvgMetadata` | Each label contains a value in metres (` m` suffix) |
| `toYFraction` | Maps `min` to the bottom of the draw area (close to `1 - padding`) |
| `toYFraction` | Maps `max` to the top of the draw area (close to `padding`) |
| `toYFraction` | Returns a valid fraction when `min === max` (zero-range guard) |

---

### 4. Dead code in `src/managers/backpacking.manager.ts` — `getNextSection` (line 49)

**Coverage gap**: Branch statement `if (index >= sections.length) { return null; }` is never reached.

`Array.prototype.indexOf()` returns either `-1` (not found) or an index in `[0, n-1]`. Neither value can satisfy `>= n`, making this guard unreachable. The "last section returns null" test case exercises `sections.at(index + 1) ?? null` (where `at()` returns `undefined`), not the early guard.

**Resolution options** (pick one):

- **Remove the dead guard** — rely solely on `sections.at(index + 1) ?? null` and mirror the symmetrical `getPreviousSection` structure.
- **Replace the guard with a correct boundary check** — e.g. `if (index < 0 || index >= sections.length - 1)` to explicitly handle both the not-found case and the last-element case, then add a corresponding test.

Either choice removes the unreachable branch and brings branch coverage to 100%.

---

### 5. Missing branch coverage in `src/managers/certificate.manager.ts` (lines 16, 20 — 75% branch coverage)

Two branches in the `getCertificates` sort comparator are not exercised:

| Line | Uncovered branch | Reason |
|---|---|---|
| 16 | `expiryDate !== undefined && expiryDate < now` evaluates to `false` because `expiryDate >= now` | No test provides a certificate with a **future** expiry date |
| 20 | `aExpired ? 1 : -1` takes the `-1` path (i.e. `aExpired = false, bExpired = true`) | The sort comparator is not called with an active certificate as `a` when the other is expired |

**Test case to add** to `src/managers/certificate.manager.spec.ts`:

```
it('should treat a certificate with a future expiry date as active', async () => {
    const tomorrow = new Date(Date.now() + 86_400_000);
    const activeCertWithExpiry = makeCertificate('cert-future', new Date(), 'AZ-204', tomorrow);
    const expiredCert = makeCertificate('cert-expired', new Date(), 'MTA', new Date(0));

    mockGetCertificates.mockResolvedValue([expiredCert, activeCertWithExpiry]);

    const result = await manager.getCertificates();

    expect(result[0]).toBe(activeCertWithExpiry); // active (future expiry) first
    expect(result[1]).toBe(expiredCert);           // expired last
});
```

This single test triggers both uncovered branches: the `expiryDate !== undefined && expiryDate < now = false` case on line 16, and the `-1` return path on line 20.

---

## E2E Test Gaps

### 6. About page — Certifications section (`e2e/about.spec.ts`)

`e2e/about.spec.ts` has no tests for the Certifications section, even though `src/pages/about.astro` renders a full section with `CertificateCard` components.

**Test cases to add** to `e2e/about.spec.ts`:

| Scenario |
|---|
| Displays the "Certifications" heading |
| Displays at least one certificate card |
| Each certificate card shows the certificate name |
| Each certificate card shows the issuer name |
| Each certificate card shows the issue date |
| Expired certificates display an expiry indicator |

---

### 7. Blog overview — pagination (`e2e/blog/index.spec.ts`)

`e2e/blog/index.spec.ts` only navigates to `/blog` (page 1). If the content generates a second page, the pagination component and its navigation links are not tested.

**Test cases to add** (either inline or in a new `e2e/blog/pagination.spec.ts`):

| Scenario |
|---|
| Pagination is visible when there are multiple pages |
| "Next page" link navigates to page 2 |
| Page 2 displays the correct URL (`/blog/2`) |
| "Previous page" link on page 2 navigates back to page 1 |

> **Note**: If the current content never fills a second page, seed at least one extra post in the test fixture or lower the `postsPerPage` value in the test environment to trigger pagination.

---

### 8. Subject overview — pagination (`e2e/blog/[subject].spec.ts`)

`e2e/blog/[subject].spec.ts` only tests page 1 of a subject (e.g. `/android`). The `src/pages/[subject]/[...page].astro` pagination component and multi-page navigation are untested.

**Test cases to add** (either inline or in a new `e2e/blog/[subject]-pagination.spec.ts`):

| Scenario |
|---|
| Pagination is visible when the subject has multiple pages |
| "Next page" link navigates to page 2 of the subject |
| Page 2 displays the correct URL (e.g. `/android/2`) |
| "Previous page" link on page 2 navigates back to page 1 |

> **Note**: Pick the subject with the most posts (or lower `postsPerPage` in the test environment) to ensure page 2 is generated.

---

## Priority

| Priority | Item | Effort |
|---|---|---|
| High | Add `stories.manager.spec.ts` | Medium — requires mocking two repositories |
| High | Add `subject.manager.spec.ts` | Low — straightforward mock setup |
| High | Add `gpx.spec.ts` | Low — pure functions, no mocks needed |
| Medium | Fix certificate branch coverage (item 5) | Very low — one test case |
| Medium | Add about-page certificate e2e tests (item 6) | Low |
| Low | Fix / remove dead code in `getNextSection` (item 4) | Very low |
| Low | Add pagination e2e tests (items 7 & 8) | Medium — may need fixture/config changes |
