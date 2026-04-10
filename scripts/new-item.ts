import { basename, join } from 'path';
import { mkdirSync, readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type Context = Record<string, string>;

interface ContentTypeConfig {
    template: string;
    args: string[];
    outputDir: (ctx: Context) => string;
    filename?: (ctx: Context) => string;
}

// ---------------------------------------------------------------------------
// Content type configuration
//
// Required fields:
//   - templates:  template filenames (relative to templates/)
//   - args:       ordered CLI argument names; all become {{token}} replacements
//                 plus {{date}} and {{timestamp}} are always available
//   - outputDir:  function returning the content-relative output directory
//
// Optional fields:
//   - filename:   function returning the base filename (without extension)
//                 defaults to the template name when omitted
// ---------------------------------------------------------------------------

const contentTypes: Record<string, ContentTypeConfig> = {
    'backpacking-post': {
        template: 'backpacking_post.template',
        args: ['slug'],
        outputDir: () => 'backpacking/posts',
        filename: ({ timestamp, slug }) => `${timestamp}-${slug}.mdx`,
    },
    'backpacking-trail': {
        template: 'backpacking_trail.template',
        args: ['slug'],
        outputDir: () => 'backpacking/trails',
        filename: ({ timestamp, slug }) => `${timestamp}-${slug}.mdx`,
    },
    'backpacking-section': {
        template: 'backpacking_section.template',
        args: [ 'trail', 'slug'],
        outputDir: ({ trail }) => `backpacking/sections/${trail}`,
        filename: ({ timestamp, slug }) => `${timestamp}-${slug}.mdx`,
    },
    'blog-post': {
        template: 'blog_post.template',
        args: ['subject', 'slug'],
        outputDir: ({ subject }) => `blog/${subject}`,
        filename: ({ timestamp, slug }) => `${timestamp}-${slug}.mdx`,
    },
    'blog-subject': {
        template: 'blog_subject.template',
        args: ['slug', 'name'],
        outputDir: () => `subjects/blog`,
        filename: ({ slug }) => `${slug}.md`
    },
    'certificate': {
        template: 'certificate.template',
        args: ['slug', 'name'],
        outputDir: () => `certificates`,
        filename: ({ timestamp, slug }) => `${timestamp}-${slug}.yml`
    },
    'gardening-journal': {
        template: 'gardening_journal.template',
        args: ['year', 'slug'],
        outputDir: ({ year }) => `gardening/journal/${year}`,
        filename: ({ timestamp, slug }) => `${timestamp}-${slug}.mdx`,
    },
    'gardening-plant': {
        template: 'gardening_plant.template',
        args: ['slug'],
        outputDir: () => 'gardening/plants',
        filename: ({ slug }) => `${slug}.mdx`,
    },
    'software-project': {
        template: 'software_project.template',
        args: ['slug'],
        outputDir: () => 'software',
        filename: ({ slug }) => `${slug}.mdx`  
    },
    'gardening-subject': {
        template: 'gardening_subject.template',
        args: ['year'],
        outputDir: () => 'subjects/gardening',
        filename: ({ year }) => `${year}.md`
    },
    'story': {
        template: 'story.template',
        args: ['subject', 'slug'],
        outputDir: () => 'stories',
        filename: ({ timestamp, slug }) => `${timestamp}-${slug}.mdx`
    }
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

function main(): void {
    const root = join(fileURLToPath(new URL('.', import.meta.url)), '..');
    const [type, ...extraArgs] = process.argv.slice(2);

    const config = getConfig(type, extraArgs);
    const context = getContext(config, extraArgs);

    const targetDir = join(root, 'content', config.outputDir(context));
    mkdirSync(targetDir, { recursive: true });

    const content = readFileContents(root, config.template, context);

    const baseName = config.filename ? config.filename(context) : basename(config.template, '.template');
    const outputPath = join(targetDir, baseName);

    writeFileSync(outputPath, content, 'utf-8');
    console.log(`Created: ${outputPath}`);
}

function getConfig(type: string, extraArgs: string[]): ContentTypeConfig {
    if (!type || !contentTypes[type]) {
        const types = Object.keys(contentTypes).join(', ');
        console.error('Usage: pnpm new:<type> [args...]');
        console.error(`Available types: ${types}`);
        process.exit(1);
    }

    const config = contentTypes[type];
    const missingArgs = config.args.slice(extraArgs.length);

    if (missingArgs.length > 0) {
        console.error(`Missing arguments for type "${type}": ${missingArgs.join(', ')}`);
        console.error(`Usage: pnpm new:${type} <${config.args.join('> <')}>`);
        process.exit(1);
    }

    return config;
}

function getContext(config: ContentTypeConfig, extraArgs: string[]): Context {
    const now = new Date();
    
    return {
        ...Object.fromEntries(config.args.map((name, i) => [name, extraArgs[i]])),
        date: now.toISOString().slice(0, 10),
        timestamp: now.toISOString().slice(0, 10).replace(/-/g, ''),
    } as Context;
}

function readFileContents(root: string, template: string, context: Context): string {
    const templateFile = join(root, 'templates', template);
    let content = readFileSync(templateFile, 'utf-8');

    for (const [token, value] of Object.entries(context)) {
        content = content.replaceAll(`{{${token}}}`, value);
    }

    return content;
}

main();
