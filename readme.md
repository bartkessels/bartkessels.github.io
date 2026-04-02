# Bart Kessels Blog

A modern blog website built with [Astro](https://astro.build/) featuring content about software development, gardening, and travel stories.


## Content

All content is stored in the `/content` folder. This folder is divided into a couple of categories. For each category there is a helper command available to create the desired markdown file.

Each file name is created with the current date timestamp and then the slug, for example `20241231-my-post.md`.

### Backpacking

- `pnpm new:backpacking/post <slug>`: This will be stored in `content/backpacking/posts`.
- `pnpm new:backpacking/section <trail> <slug>`: This will be stored in `content/backpacking/sections/<trail>`.
- `pnpm new:backpacking/trail <slug>`: This will be stored in `content/backpacking/trails`.

### Blog

- `pnpm new:blog/subject <slug> <name>`: This will be stored in `content/subjects/blog`.
- `pnpm new:blog <subject> <slug>`: This will be stored in `content/blog/<subject>`.

### Certificate

- `pnpm new:certificate <slug>`: This will be stored in `content/certificates`.

### Gardening

- `pnpm new:gardening/year <year>`: This will be stored in `content/subjects/gardening`.
- `pnpm new:gardening/journal <year> <slug>`: This will be stored in `content/gardening/journal/<year>`.
- `pnpm new:gardening/plant <slug>`: This will be stored in `content/gardening/plants`.

### Software

- `pnpm new:software/project <slug>`: This will be stored in `content/software`.

### Story

- `pnpm new:story <subject> <slug>`: This will be stored in `content/stories`.