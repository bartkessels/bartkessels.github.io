import { readFileSync, readdirSync } from 'fs';
import { basename, join } from 'path';

/**
 * Resolves a content file's site URL from its path relative to the content dir.
 * Mirrors the routing defined in src/pages/.
 */
function resolveContentUrl(relPath, slug, fm) {
  // blog → /{subject}/{slug}
  if (relPath.startsWith('blog/')) {
    const subject = fm.match(/^subject:\s*(.+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
    return subject ? `/${subject}/${slug}` : `/blog/${slug}`;
  }
  // backpacking sections → /backpacking/{trail}/{slug}
  if (relPath.startsWith('backpacking/sections/')) {
    const trail = relPath.split('/')[2];
    return `/backpacking/${trail}/${slug}`;
  }
  // backpacking posts → /backpacking/posts/{slug}
  if (relPath.startsWith('backpacking/posts/')) return `/backpacking/posts/${slug}`;
  // backpacking trails → /backpacking/{slug}
  if (relPath.startsWith('backpacking/trails/')) return `/backpacking/${slug}`;
  // gardening journal → /gardening/journal/{slug}
  if (relPath.startsWith('gardening/journal/')) return `/gardening/journal/${slug}`;
  // gardening plants → /gardening/plants/{slug}
  if (relPath.startsWith('gardening/plants/')) return `/gardening/plants/${slug}`;
  // stories → /stories/{slug}
  if (relPath.startsWith('stories/')) return `/stories/${slug}`;
  // software → /software/{slug}
  if (relPath.startsWith('software/')) return `/software/${slug}`;
  // fallback: /{top-level-dir}/{slug}
  return `/${relPath.split('/')[0]}/${slug}`;
}

/**
 * Scans all content files and builds a map of filename → site URL.
 * Call this once at config load time and pass the result to remarkResolveFileLinks.
 */
export function buildFileMap(contentDir) {
  const map = {};

  function scan(dir) {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        scan(fullPath);
      } else if (/\.mdx?$/.test(entry.name)) {
        try {
          const content = readFileSync(fullPath, 'utf-8');
          const fmMatch = content.match(/^---[\r\n]+([\s\S]*?)[\r\n]+---/);
          if (!fmMatch) continue;
          const fm = fmMatch[1];

          const slugMatch = fm.match(/^slug:\s*(.+)$/m);
          const slug = slugMatch
            ? slugMatch[1].trim().replace(/^['"]|['"]$/g, '')
            : basename(entry.name, entry.name.endsWith('.mdx') ? '.mdx' : '.md');

          const relPath = fullPath.slice(contentDir.length + 1).replace(/\\/g, '/');
          map[entry.name] = resolveContentUrl(relPath, slug, fm);
        } catch {
          // unreadable file — skip
        }
      }
    }
  }

  scan(contentDir);
  return map;
}

function visitLinks(tree, visitor) {
  if (tree.type === 'link') visitor(tree);
  if (tree.children) {
    for (const child of tree.children) {
      visitLinks(child, visitor);
    }
  }
}

/**
 * fileMap: Record<string, string> — maps a content filename (e.g. "20230328-sanitizer.mdx")
 * to its resolved site URL (e.g. "/advent-of-code/2022/day-one/sanitizer").
 * Build this map in astro.config.mjs and pass it as the plugin option.
 */
export function remarkResolveFileLinks(fileMap) {
  return (tree) => {
    visitLinks(tree, (node) => {
      const url = node.url;
      if (!url || !/\.mdx?$/.test(url)) return;
      if (/^https?:\/\//.test(url) || url.startsWith('/')) return;

      // Match by filename only so "./subdir/file.mdx" and "./file.mdx" both resolve
      const filename = url.split('/').pop();
      const resolved = fileMap?.[filename];
      if (resolved) {
        node.url = resolved;
      }
    });
  };
}
