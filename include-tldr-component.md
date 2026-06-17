# Plan: TL;DR highlight component

## Goal

Introduce a reusable `Tldr` component that can be placed at the top of blog posts to surface
the key takeaway immediately. Inspired by the principle that online content should lead with
what the reader actually needs. The component is optional — authors import and use it only
when a post benefits from an upfront summary.

The first post to adopt it:
`content/blog/miscellaneous/20260617-running-playwright-in-dev-container.mdx`

---

## Step 1 — Create `src/components/Tldr.astro`

**Props**

| Prop    | Type     | Default   | Description                        |
|---------|----------|-----------|------------------------------------|
| `title` | `string` | `"TL;DR"` | Label shown in the component header |

**Markup structure**

```
<aside role="note" aria-label={title}>
  <div>  ← header (icon + title label)
    <Lightbulb />
    <span>{title}</span>
  </div>
  <div>  ← body
    <slot />
  </div>
</aside>
```

**Styling** — follows existing design tokens and the `CodeBlock.astro` header pattern:

- Wrapper: `not-prose my-6 rounded-lg border border-accent/20 bg-accent/5 overflow-hidden`
  - `not-prose` prevents Tailwind Typography from overriding inner styles
- Header: `flex items-center gap-2 border-b border-accent/20 bg-accent/10 px-4 py-2.5`
  - Icon: `Lightbulb` from `@lucide/astro`, `h-4 w-4 text-accent aria-hidden="true"`
  - Label: `text-sm font-semibold text-accent`
- Body: `px-4 py-4 text-sm leading-relaxed text-foreground/90`

---

## Step 2 — Update the blog post

File: `content/blog/miscellaneous/20260617-running-playwright-in-dev-container.mdx`

1. Add import at the top of the MDX file (below the existing `CodeBlock` import):
   ```mdx
   import Tldr from '@/components/Tldr.astro';
   ```

2. Replace the existing blockquote:
   ```mdx
   > TLDR: Playwright wasn't working on my Macbook M4 pro inside a dev container. The solution
   > was to migrate from `npm` to `pnpm` as the package manager and use
   > `pnpm exec playwright install chromium --with-deps` instead of
   > `npx playwright install chromium --with-deps`.
   ```
   with:
   ```mdx
   <Tldr>
     Playwright wasn't working on my Macbook M4 pro inside a dev container. The solution was to
     migrate from `npm` to `pnpm` as the package manager and use
     `pnpm exec playwright install chromium --with-deps` instead of
     `npx playwright install chromium --with-deps`.
   </Tldr>
   ```

---

## Step 3 — Add e2e test in `e2e/blog/[slug].spec.ts`

The file already contains a `test.describe` block for the Android post. Add a second block
below it for the Playwright post.

**New describe block**

```typescript
test.describe("Blog post with TL;DR component", () => {
    test.beforeEach(async ({ page }: { page: Page }) => {
        await page.goto("/miscellaneous/running-playwright-in-dev-container");
    });

    test("displays the TL;DR component", async ({ page }: { page: Page }) => {
        // Arrange
        const tldr = page.getByRole("note");

        // Act & Assert
        await expect(tldr).toBeVisible();
    });

    test("displays the TL;DR heading label", async ({ page }: { page: Page }) => {
        // Arrange
        const tldr = page.getByRole("note");

        // Act & Assert
        await expect(tldr).toContainText("TL;DR");
    });

    test("displays the TL;DR summary content", async ({ page }: { page: Page }) => {
        // Arrange
        const tldr = page.getByRole("note");

        // Act & Assert
        await expect(tldr).toContainText("pnpm exec playwright install chromium --with-deps");
    });
});
```

**Why these three tests:**
- First ensures the component is present in the DOM and visible
- Second ensures the label is rendered correctly (catches title prop regressions)
- Third ensures the slot content is passed through and rendered (catches slot regressions)

---

## Step 4 — Verify

Run the blog e2e tests to confirm all cases pass:

```bash
pnpm exec playwright test e2e/blog
```

Both the existing Android-post describe block and the new Playwright-post describe block
must pass.

---

## File checklist

| File | Action |
|------|--------|
| `src/components/Tldr.astro` | Create |
| `content/blog/miscellaneous/20260617-running-playwright-in-dev-container.mdx` | Update |
| `e2e/blog/[slug].spec.ts` | Extend |
