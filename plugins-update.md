## Astro markdown plugin deprecation

I found the deprecated Astro configuration in `/tmp/workspace/bartkessels/bartkessels.github.io/astro.config.mjs` under the `markdown` section.

### What is triggering the warning

- `markdown.remarkPlugins` is set to your custom `remarkResolveFileLinks` plugin.
- `markdown.rehypePlugins` is set to `rehypeMermaid` and `rehypeExternalLinks`.
- Astro 6 warns because these top-level markdown plugin options are deprecated.

### Recommended way to fix it

Move the Markdown pipeline options into `markdown.processor` by using `unified({...})` from `@astrojs/markdown-remark`.

For this repository, that means:

1. Keep the existing `markdown.syntaxHighlight` settings as they are.
2. Keep the existing `markdown.shikiConfig` settings as they are.
3. Add `unified` from `@astrojs/markdown-remark` to the Astro config imports.
4. Replace the current top-level `markdown.remarkPlugins` entry by passing the same `remarkResolveFileLinks` configuration into `unified({...})`.
5. Replace the current top-level `markdown.rehypePlugins` entry by passing the same `rehypeMermaid` and `rehypeExternalLinks` configuration into `unified({...})`.
6. Set the result of that `unified({...})` call as `markdown.processor`.
7. Remove the deprecated top-level `markdown.remarkPlugins` and `markdown.rehypePlugins` fields after the processor is in place.

### Repo-specific notes

- I did not find any use of `markdown.remarkRehype` in this repository, so there is nothing to migrate for that specific option right now.
- This repo uses `@astrojs/mdx` in `astro.config.mjs`.
- Astro's current migration path is compatible with that setup: when `markdown.processor` uses `unified({...})`, MDX inherits those markdown plugin settings by default.
- Because of that, this looks like a single-file config migration centered on `astro.config.mjs`.

### Expected result

After the migration, the warning should go away while preserving:

- custom internal markdown link resolution
- Mermaid rendering
- external link attributes
- existing syntax highlighting and Shiki settings

### Suggested validation after you apply it

- run the Astro dev server and confirm the warning no longer appears
- verify markdown links rewritten by `remarkResolveFileLinks` still resolve correctly
- verify Mermaid blocks still render
- verify external links still open with the intended `target` and `rel` attributes
